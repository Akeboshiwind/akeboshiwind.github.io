---
title: "Intro to Quickblog"
date: 2023-10-10
draft: true
---

After reading [@borkdude's](https://github.com/borkdude) [series](https://blog.michielborkent.nl/migrating-octopress-to-babashka.html) [of](https://blog.michielborkent.nl/writing-clojure-highlighter.html) [posts](https://blog.michielborkent.nl/better-clojure-highlighting.html) about his blog, and reading the transcript of Julia Evans' talk [Making Hard Things Easy](https://jvns.ca/blog/2023/10/06/new-talk--making-hard-things-easy/) I got interested in hacking on a blog.

[Quickblog](https://github.com/borkdude/quickblog) is a babashka (and clojure)
project to get you up and running quickly with a blog.


<!-- 
TODO: Put my thoughts of quickblog
      - Quick to get started
      - Small (a good thing)
      - Inflexible on it's own
      - Easy enough to do small tweaks
        - Autoload highlighter
        - Tweak existing pages
      - How is it to make larger tweaks?
        - Add a new page
        - Add new processing steps to the render

TODO: Solve some problems
      - Deploy using github actions
      - Comments
        - Simple with discussions or https://blog.cofx.nl/tiny-utterances.html
      - Style
-->


## Getting started

Right, let's get started then. In the beginning there was nothing:

```bash
$ mkdir blog
$ cd blog
$ tree
.

0 directories, 0 files
```

Then there was babashka:

{{< codeblock filename="bb.edn" lang="clojure" >}}
{:deps {io.github.borkdude/quickblog
        #_"v2.3.0"
        {:git/sha "6a865f135fdcf73f9ae33e5a562a387a9aeb86a6"}}
 :tasks
 {:requires ([quickblog.cli :as cli])
  :init (def opts { #_"We'll do this bit later" })
  quickblog {:doc "Start blogging quickly! Run `bb quickblog help` for details."
             :task (cli/dispatch opts)}}}
{{< /codeblock >}}

So that `quickblog` can run let's add a dummy post:

```bash
$ mkdir posts
$ bb quickblog new --file dummy.md --title "Dummy Post"
$ tree
.
├── bb.edn
└── posts
    └── dummy.md

2 directories, 2 files
```

And finally let's render the blog:

```bash
$ bb quickblog render
Reading metadata for post: dummy.md
Writing default resource: templates/style.css
Writing public/style.css
...
```


## Exploring

Alright, let's slow it down and figure out what we've actually just done.

Quickblog is a static site generator meaning that it's all pre-rendered

```bash
$ tree
.
├── bb.edn
├── posts
│   └── dummy.md
├── public
│   ├── archive.html
│   ├── atom.xml
│   ├── index.html
│   ├── dummy.html
│   ├── planetclojure.xml
│   ├── style.css
│   └── tags
│       ├── clojure.html
│       └── index.html
└── templates
    ├── base.html
    ├── index.html
    ├── post-links.html
    ├── post.html
    ├── style.css
    └── tags.html

5 directories, 16 files
```

Clearly `public/` is the rendered website, but we've also gotten `templates/` for free. What's in there?

{{< codeblock filename="templates/tags.html" lang="html" >}}
<div style="width: 600px">
    <h1>{{title}}</h1>
    <ul class="index">
        {% for tag in tags %}
            <li><span><a href="{{tag.url}}">{{tag.tag}}</a> - {{tag.count}} post{{tag.count|pluralize}}</span></li>
        {% endfor %}
    </ul>
</div>
{{< /codeblock >}}

As the name would suggest, they're templates. This one in particular is for rendering `public/tags.html`.

Looking in `public/` we can see the structure of the site:
- An index & css
- A couple of rss feeds
- The posts (named by their markdown file name)
- An archive page
- A tag page (with a page for each tag)

Nice and simple.

The templates themselves align *fairly* nicely with the output pages:
- `index.html` -> `index.html`
- `style.css` -> `style.css`
- `post.html` -> `<post name>.html`
- `tags.html` -> `tags/index.html` **and** `tags/<tag>.html`
- `post-links.html` -> `tags/index.html` **and** `tags/<tag>.html`
