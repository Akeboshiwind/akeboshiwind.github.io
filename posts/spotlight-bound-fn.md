Title: Clojure Function Spotlight: bound-fn
Date: 2023-11-23
Tags: clojure
Discuss: https://github.com/Akeboshiwind/akeboshiwind.github.io/discussions/4

While reading some internal code at [JUXT](https://juxt.pro) I came across a function I'd not seen before: `bound-fn`

After researching a little it turns out to be quite interesting!

<!-- end-of-preview -->

## Starting with a definition

> `(bound-fn & fntail)`
>
> Returns a function defined by the given fntail, which will install the
> same bindings in effect as in the thread at the time bound-fn was called.
> This may be used to define a helper function which runs on a different
> thread, but needs the same bindings in place.
>- [Clojure Source](https://github.com/clojure/clojure/blob/ce55092f2b2f5481d25cff6205470c1335760ef6/src/clj/clojure/core.clj#L2023)

I don't know about you but mostly that goes in one ear and out the other.

My current understanding of `bound-fn` is like this: it's like a normal [closure](https://clojure.org/guides/learn/functions#_closures), but with more *reach*.


## Examples

An example is worth a thousand words of documentation:

(Thank you [ClojureDocs](https://clojuredocs.org), I don't know what I would do without you!).

```clojure
(def ^:dynamic *a* 1)

(binding [*a* 2]
  (let [b 3]
    (def f1 (fn [] {:a *a* :b b}))))

(f1)
; => {:a 1, :b 3}

(binding [*a* 2]
  (let [b 3]
    (def f2 (bound-fn [] {:a *a* :b b}))))

(f2)
; => {:a 2, :b 3}
```

A little contrived, but we can see here that while `fn` didn't take the `*a*` binding with it, the `bound-fn` did.

One more example to show how this is used in a threading context:

```clojure
(def ^:dynamic *a* 1)

(defn f [] (println *a*))

(f)
; => 1

(binding [*a* 2]
  (f))
; => 2

(binding [*a* 2]
  (.start (Thread. f)))
; => 1
; If you didn't see this in your repl, maybe try this: https://stackoverflow.com/a/26744120

(binding [*a* 2]
  (.start (Thread. (bound-fn* f))))
; => 2
; As this has captured the parent bindings, *out* should also be captured so this should print in your repl even if the above did not.
```

This seems kinda handy!

For example, say you've got some dynamic variable and you're using some lazy functions.
If you realise the value in the incorrect scope:

```clojure
(def ^:dynamic *a* nil)

(binding [*a* 1]
  (->> (range 10)
       (map #(+ *a* %))))
; (err) Error printing return value (NullPointerException) at clojure.lang.Numbers/ops (Numbers.java:1095).
; (err) Cannot invoke "Object.getClass()" because "x" is null
```

(Side note, that error isn't very helpful 🤔)

Oh no!
But `bound-fn*` comes to the rescue:

```clojure
(binding [*a* 1]
  (->> (range 10)
       (map (bound-fn* #(+ *a* %)))))
; => (1 2 3 4 5 6 7 8 9 10)
```

And now our (imaginary) problem is solved!

## Conclusion

Obviously this isn't a function you or I are going to use every day.
But when you need it, it's a handy tool to have in your belt!

I find that clojure core has lots of interesting treasures, many libraries do!
It's exciting when you find a new function, testing what it can do and thinking about how it could help you is fun.

Make sure to let me know if you find anything interesting, or find an interesting use for `bound-fn` in your code.
