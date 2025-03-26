Title: Zippers in Lua
Date: 2023-11-18
Tags: lua, programming

<!--
# Alternate titles:
-->

<!-- TODO: Link -->
For a side project of mine I've been trying to work out how to deal with a [tree](https://en.wikipedia.org/wiki/Tree_(data_structure)).
My goals are:
- I want to have a particular node in "focus"
- I want to be able to simply "append" to that node and then focus on the new node
- I want to be able to change my focus to an arbitrary parent

Usually if I'm programming, I'm working with clojure.
And in clojure land I'd heard of [zippers](https://clojuredocs.org/clojure.zip) which seemed like a (maybe overkill) solution to this very problem.

The problem is that this project requires that I work in Lua.
A quick google search found nothing, but a [skim of github](https://github.com/Odie/gitabra/blob/c8edfbe27325ab32150b0d0a4efde5e3b2993fe5/lua/gitabra/zipper.lua#L2) found two interesting leads:
- [A stub](https://github.com/the80srobot/luafn/blob/88652e7edb6639299d836f9e67e4048f1d954a24/zipper.lua) (so not useful right now)
- [A seemingly complete zipper implementation](https://github.com/Odie/gitabra/blob/c8edfbe27325ab32150b0d0a4efde5e3b2993fe5/lua/gitabra/zipper.lua)

<!-- end-of-preview -->
