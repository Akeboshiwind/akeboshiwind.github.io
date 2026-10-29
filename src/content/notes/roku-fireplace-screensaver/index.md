---
title: "Roku Fireplace Screensaver"
stage: tale
published: 2026-10-29
updated: 2026-10-29
tags: ["tool", "closed source"]
---

Like everyone else we have a Roku stick for our TV and our usual screensaver is fish bumping around a tank. That felt inappropriate for a UK winter, so I wanted a fireplace instead. All the channels I found were videos and I wanted something rendered and dynamic like the fish tank, so I asked Claude to build me one and after lots of prodding I got:

![Roku Fireplace Screensaver](./fireplace.gif)

Unfortunately it uses a closed source model for the grate and I can't be bothered to find another one so it will have to stay closed source. I can at least share the builds so:

Here's a [demo](./fireplace-demo.zip) you can load at https://lvcabral.com/brs/.

And [here's](./fireplace.zip) one you can load on your TV with these very Clauded (and untested) instructions:

<details>
<summary>Installing it on your Roku</summary>

Roku only lets you install your own channels in developer mode. That's free and takes a couple of minutes, but only one such channel can be installed at a time; adding another replaces it.

1. **Turn on developer mode** (once per TV). On the Roku remote, press **Home** three times, then **Up, Up, Right, Left, Right, Left, Right**. Accept the licence, **choose a password**, and note the **IP address** shown on screen (it's also under *Settings → Network → About*). The Roku restarts.
2. **Upload the screensaver.** On a computer on the same network, open `http://<your Roku's IP address>` in a browser. Log in with the username `rokudev` and the password you just chose. Under *Upload*, pick [`fireplace.zip`](./fireplace.zip), then press **Install**.
3. **Make it your screensaver.** On the Roku, go to *Settings → Theme → Screensavers*, choose **Fireplace**, and press **Preview** to try it. *Change wait time* sets how long the TV waits before starting it.

To remove it, turn developer mode off by entering the same remote sequence again and choosing *Disable installer and restart*. That also removes the screensaver.

</details>
