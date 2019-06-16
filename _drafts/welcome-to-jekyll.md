---
layout: post
title:  "Clojure interactive blog"
date:   2019-06-16 22:00:48 +0100
categories: jekyll update
---
Let's do some tests with the `klipse` plugin.

Do variables persist between instances?
<pre>
  <code class="language-klipse">
(def data (range 10))
  </code>
</pre>

<pre>
  <code class="language-klipse">
(map inc data)
  </code>
</pre>

Awesome, It looks like it does!

How does editing elements in the page work?
I'll add a `<pre>` block and we can see if we can edit

<pre>
  <code class="language-klipse">
(let [pre (js/document.getElementById "to-edit")]
  (set! (.-innerHTML pre) "some text"))
  </code>
</pre>

<pre id="to-edit"></pre>

Ooh, exciting!

It looks like drawing to a canvas or something could be fun as well: [https://blog.jrheard.com/procedural-dungeon-generation-drunkards-walk-in-clojurescript](https://blog.jrheard.com/procedural-dungeon-generation-drunkards-walk-in-clojurescript)

In that blog he also uses a "hidden" element to define some util functions at the start of the page.

<!-- Klipse live code snippet plugin  -->
<link rel="stylesheet" type="text/css" href="http://app.klipse.tech/css/codemirror.css">

<script>
 window.klipse_settings = {
     selector: '.language-klipse'
 };
</script>

<script src="http://app.klipse.tech/plugin/js/klipse_plugin.js"></script>
