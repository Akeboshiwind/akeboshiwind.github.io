---
title: "Just build it yourself"
date: 2026-01-04
draft: true
---

I have a dirty secret to share: I love maintaining my dotfiles.

It's fun to tinker in a low stakes environment which is actually useful to me.
Sure it doesn't develop my career, or even really improve my productivity, but I like it.

Over the years I've used various tools: my own bash scripts, GNU stow, nix.
They all have their strengths and limitations, and it's fun to learn what those are.

Some limitations have become part of how I think (I *have* to organise my dotfiles by application folder now because of stow).
But others end up just being annoying, looking at you, nix version pinning.

I've considered building my own dotfile manager for a while, but have never bothered due to the cost: limiting breaking changes, documenting it, handling all edge cases, supporting users.

Recently two things dawned on me: this tool can be *just* for me; Claude Code (and other tools) make building tools **way** easier.

In this case I already had a couple of design decisions in mind:

- Write it in Clojure, my favourite language
- Have a folder per application with a `base.edn` file in it
- `base.edn` is configured with "actions" like `:pkg/brew` or `:fs/symlink`

With that, *in a weekend* I had completely abandoned my previous dotfile manager and built my own.

The real beauty is:

- It's not perfect, I can fix things as I go
- No need to document it as I can just ask Claude Code how it works
- Adding new features is a breeze - I wanted dependencies between packages, so I added `:dep/provides` and `:dep/requires`

It still requires thought, design and taste to know what's good and what's not.
But luckily those are the fun bits!

Because this was so easy, I got inspired to think about what other tools I could build.
Is there a repeated or slightly complicated task I could automate?
Is there a concept I could understand better with a visualisation, or better yet an [interactive visualisation](/tools/bitemporal)?

<!--
## Notes for later (delete before publishing)

### New direction

The post should be about: vibe coding clicked for me when I learned to trust my taste.

**The arc:**
- Spent months vibe coding things I wasn't proud of — code worked but I didn't understand it, turned into spaghetti
- Recently something clicked
- Now I focus on design and complexity, using taste as a guide

### What "using taste" looks like in practice

**Prompting differently:**
- "I want to build this feature, give me some options including simple code examples"
- "I don't like that because of x, what are some other ways?"
- Adding "using this method" to requests

**Different levels of scrutiny:**
- Throwaway: skim, let eyes catch likely bugs, untangle the larger design
- Production: run code in small chunks, read every line, maybe refactor/rewrite to make sure it's gone through my brain
- Both: test edge cases, common cases — the stuff experience tells you will break

**The middle state (key insight):**
Most vibe coding advice assumes you either understand the code or you don't. There's a middle state: trusting your discomfort even when you can't fully articulate why.

- Sometimes it's visual — a sense of clutter, complexity
- Sometimes an idea that something could be simplified — try it, revert if it doesn't add value
- Some part is thinking about design, how things link together — too few/many functions, odd structure, could be placed differently

Still learning what this looks like. But trusting the feeling is the right first step.

### Relevant quote

> "All of us who do creative work, we get into it because we have good taste. ... But your taste, the thing that got you into the game, is still killer."
>
> — Ira Glass (https://www.goodreads.com/quotes/309485)

### Style notes

- Aiming for "messy/journal" style rather than bold-claim-then-defend
- Goal is to build confidence posting things, not to have a perfect essay
- Compared to Simon Willison (conversational, his own words) and Sean Goedecke (clarity of thought, explains points well)
-->
