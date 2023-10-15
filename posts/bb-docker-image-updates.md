Title: Solving Container Update Woes with Clojure and Babashka
Date: 2023-10-15
Tags: clojure, docker, babashka
Discuss: https://github.com/Akeboshiwind/akeboshiwind.github.io/discussions/1

At home I run a small server for running home assistant and other small projects, but I've been running into a problem recently: updates.

All the containers I have running in my system run with specific version tags.
I do this because I prefer to manually update each container as a new version comes out.
That way I'm up to date on new features (and can stay mostly on top of breaking changes 😅).

The problem with this setup is that solutions like [watchtower](https://containrrr.dev/watchtower/) & [duin](https://github.com/crazy-max/diun) (which are otherwise excellent) will **not** check for new tags.
These solutions also seemed way more complicated than they needed to be for my purposes.

All I want to do is:
- Look for updates
- Notify me via telegram (so easy to integrate)
- And possibly have some way of ignoring containers.


# The solution

Write my own of course, that never goes wrong 😅.

I started by looking for some tools to actually query the data that I wanted:
- The list of labels for upstream docker containers
- The list of locally running containers & their tags

For the later just using the `docker` cli seemed like the simplest choice.
The former took a bit more searching.
At first I tried to look for a REST API and found that both dockerhub and github had one, but as they're different so I'd have to write (and maintain) two interfaces.
Instead I looked at other tools and came across [regclient](https://github.com/regclient/regclient) which provides `regctl tags ls` which was *exactly* what I was looking for (as you'll soon see).


# Regctl

Let's first look at the output:

<details><summary>Note:</summary>

I actually ran it via docker rather than install it: `docker container run -i --rm ghcr.io/regclient/regctl:latest tag ls ubuntu`

</details>

```bash
$ regctl tags ls ubuntu
10.04
12.04
12.04.5
12.10
13.04
13.10
14.04
14.04.1
...
```

A newline separated list, what could be easier?
Let's parse it:

```clojure name:src/regctl.clj
(ns regctl
  (:require
    [babashka.process :refer [sh]]
    [clojure.string :as str]))

(defn regctl [& args]
  (-> (apply sh "regctl" args)
      :out))

(defn tags [repo]
  (->> (regctl "tag" "ls" repo)
       str/split-lines
       (remove empty?)))

(comment
  (count (tags "debian")) ; => 1893
  (count (tags "ghcr.io/akeboshiwind/rss-filter")) ; => 6
  (count (tags "does-not-exist")) ; => 0
  ,)
```

Of course there's no error handling here, but I said I wanted this to be simple right?


# Parsing versions

So, given that I want to check for updates I'll need to know which tag is the latest version.
But how do I tell which tag **is** the latest version? They're just strings after all.

Different docker repos use all sorts of different systems, but most of them provide a plain [semver](https://semver.org/) version tag.
For those that don't I'll figure out something in the future I guess 😅.

Writing some code to parse versions wasn't too hard, but it was fiddly getting the comparison right:

```clojure name:src/semver.clj
(ns semver)

(defn semver? [tag]
  (boolean (re-matches #"^v?\d+(\.\d+(\.\d+)?)?$" tag)))

(defn semver [tag]
  (when-let [match (re-find #"^v?(\d+)(\.(\d+)(\.(\d+))?)?$"
                             tag)]
    (let [[_ major _ minor _ patch] match]
      {:major (Integer/parseInt major)
       :minor (if minor (Integer/parseInt minor) 0)
       :patch (if patch (Integer/parseInt patch) 0)})))

(defn compare-semver [a b]
  (let [major (compare (:major a) (:major b))]
    (if (not= major 0)
      major
      (let [minor (compare (:minor a) (:minor b))]
        (if (not= minor 0)
          minor
          (compare (:patch a) (:patch b)))))))

(defn >semver [a b]
  (> (compare-semver a b) 0))
```

I'm not happy with that regex, maybe using a parser (for this and for docker later) would have been clearer?
Or maybe just using a library someone else wrote?
But I really wanted to get away with not using any libraries so this is fine 😁.

Now I can filter, sort & so on to my hearts content:

```clojure
(let [tags ["1" "1.2" "1.2.3"
            "v1" "v1.2" "v1.2.3"
            "12" "12.23" "12.23.34"
            "test" "1.2.3-SNAPSHOT" "1.2.3.4"]]
  (println "count:" (count tags))
  (println "filtered:" (->> tags (filter semver?) count))
  (println "latest:" (->> tags
                          (filter semver?)
                          (map semver)
                          (sort compare-semver)
                          last))
  (println "(> \"1.2.3\" \"1.0\"):" (>semver (semver "1.2.3")
                                             (semver "1.0"))))

; (out) count: 12
; (out) filtered: 9
; (out) latest: {:major 12, :minor 23, :patch 34}
; (out) (> "1.2.3" "1.0"): true
```

# Docker

Next we're on to docker itself.
It posed a bit of difficulty first because I didn't really want to parse this:

```bash
$ docker ps
CONTAINER ID   IMAGE                              COMMAND                  CREATED             STATUS             PORTS                    NAMES
739ac2d78713   ubuntu:20.04                       "/bin/bash"              About an hour ago   Up About an hour                            quirky_fermat
80f067bc14e8   ghcr.io/esphome/esphome:2023.9.3   "/entrypoint.sh dash…"   3 hours ago         Up 3 hours         6052/tcp                 interesting_galileo
8fef78050a03   postgres                           "docker-entrypoint.s…"   3 hours ago         Up 3 hours         0.0.0.0:5432->5432/tcp   silly_carson
```

It turns out there's a lovely `--format` option that let's to format the output exactly how you'd want to:

```bash
$ docker ps --format '{{.Image}}'
ubuntu:20.04
ghcr.io/esphome/esphome:2023.9.3
postgres
```

Time to parse that using clojure:

```clojure name:src/docker.clj
(ns docker
  (:require
    [babashka.process :refer [sh]]
    [clojure.string :as str]))

(defn docker [& args]
  (-> (apply sh "docker" args)
      :out))

(defn parse-ps [line]
  (let [[image labels] (str/split line #"\s+")
        labels (when-not (empty? labels)
                 (->> (str/split labels #",")
                      (map #(str/split % #"="))
                      ;; Set a default value for labels without a value
                      (map (fn [[k v]] [k (or v "")]))
                      (into {})))]
    {:image image
     :labels labels}))

(defn ps []
  (->> (docker "ps" "--format" "{{.Image}} {{.Labels}}")
       str/split-lines
       (map parse-ps)))
```

I ended up adding `{{.Labels}}` too because I want to use them to ignore containers.


# Putting it all together

I have all the pieces, let's put them together.
First we want to get the latest tag for a given image:

```clojure name:src/core.cljs
(ns core
  (:require
    [docker :as d]
    [regctl :as r]
    [semver :refer [semver? semver compare-semver >semver]]
    [clojure.string :as str]))

(defn latest-tag [repo]
  (->> (r/tags repo)
       (filter semver?)
       (sort-by semver compare-semver)
       last))
```

Next, `docker ps` gives us both an image and a tag (but only sometimes) so let's parse those:

```clojure name:src/core.cljs
(defn name&tag [full-name]
  (let [[name tag] (str/split full-name #":")]
    {:name name :tag tag}))
```

I'm not super happy with that function name, but something like `image-name` seemed like it should really split out the `:registry` and `:repo` too which I don't want to do here.

Now that we *actually* have all the pieces, let's get our list of images.
Note that I've ignored images that don't have tags. That's fine for my purposes.

```clojure
(let [images (->> (d/ps)
                  (remove #(-> % :labels (get "version-checker.ignore")))
                  (map (comp name&tag :image))
                  (remove (complement :tag)))]
  ...)
```

Finally for each image let's get the `latest-tag` then see if that's newer than our current tag:

```clojure
(let [images (->> (d/ps)
                  (remove #(-> % :labels (get "version-checker.ignore")))
                  (map (comp name&tag :image))
                  (remove (complement :tag)))]
  (doseq [{:keys [name tag]} images]
    (println "Checking: " name ":" tag)
    (let [latest-tag (latest-tag name)]
      (when (>semver (semver latest-tag) (semver tag))
        (println "Later tag found:" latest-tag)))))
```

And that's it!

Other than deployment and notifications. Maybe another time...

The complete code can be found [here](https://github.com/Akeboshiwind/whale-watcher).
