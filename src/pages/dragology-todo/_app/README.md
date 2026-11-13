# Dragology Todo

A Things-style to-do list built to try [Dragology](https://declarative-dragging.github.io/), a library for **declarative dragging**. Drag a to-do to move it, or drag the **+** to where a new one goes. While dragging, the page scrolls when you hold near the top or bottom edge, or when you move a second finger.

| File | What it holds |
| --- | --- |
| `app.jsx` | The list, drawn as an SVG from `{ items }`, with each element's drag declared on it |
| `list.js` | Pure functions: the states a drag can land in, and the edge-scroll speed |
| `useDrag.js` | What Dragology needs from a scrolling page (see below) |

## How it compares with dragging by hand

An earlier version of this tool did the dragging by hand. It measured row midpoints, worked out a drop slot, and drew a gap and a floating copy of the row itself.

**Dragology made the logic of a drag much simpler.** A drag is a list of the states it can land in, so the geometry disappears:

```jsx
d.closest(reorders(items, id)).withFloating()                // a row
d.switchToStateAndFollow(withNew, newRowId, d.closest(all))  // the +
```

`reorders` and `insertions` are pure and trivial to test. The + needs no special case, since a new to-do follows the same idea as a moved one. The animation comes for free: rows slide aside and the drop settles. Richer interactions, such as several lists, snapping or nesting, would just be more states.

**The seams with the page got harder, and every bug was at a seam.** Version 0.2.0 of Dragology:

- re-reads the pointer only when the pointer moves, so `useDrag` re-sends the position after each scroll;
- accepts moves and releases from any pointer, so `useDrag` keeps a second finger away from it and scrolls with that finger instead;
- turns off touch scrolling on its SVG, so `useDrag` switches vertical scrolling back on and lifts a row only after a 300ms hold;
- redraws whatever is pressed, which makes the browser drop the click, so a press reaches it only once it becomes a drag;
- blends every prop between states and throws on strings such as `aria-checked`, so the checkbox is a React component, which Dragology leaves alone;
- draws only SVG, so rows have a fixed height, the width is measured, and the text sits in a `<foreignObject>`.

Two iPhone Safari problems came on top of those:

- Safari draws HTML in a `<foreignObject>` at the SVG's top-left once it has its own compositing layer, so done to-dos fade by colour, not `opacity`.
- iOS adds the page scroll to `screenY`, so the second finger is measured in `clientY`.

`useDrag.js` ended up about as long as the hand-written pointer code it replaced, and more subtle, because it re-sends fake pointer events and intercepts events before Dragology sees them.

**Testing got worse.** The hand-written drags had unit tests with faked row positions. Dragology doesn't drag in happy-dom, so the tests cover clicks and editing, and drags are checked in a real browser with `npm run shot -- /dragology-todo/ --steps …`.

**Verdict:** keeping *which states a drag can reach* separate from *how the pointer moves* is a real improvement, and worth it for anything richer than a list. For this list the overall effort was about even, just spent at the seams. To be fair, the hand-written version was never tried on an iPhone, so the comparison isn't quite even. Most of `useDrag` could become options in Dragology itself: track only the drag's own pointer, re-read the pointer on scroll, allow touch scrolling, and keep clicks working.
