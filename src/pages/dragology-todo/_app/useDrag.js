import { useEffect, useRef } from 'react';
import { edgeSpeed } from './list.js';
import { trace } from './debug.js';

const SLOP = 10;
const HOLD = 300;

// Which way a second finger scrolls, while iOS jitters: `?finger=screen` (default) | `client` | `native`.
const MODE = (typeof location !== 'undefined' && new URLSearchParams(location.search).get('finger')) || 'screen';
const fingerY = e => (MODE === 'client' ? e.clientY : e.screenY);

/**
 * What a Dragology list in a scrolling page needs from the page. Dragology reads the pointer
 * only on `pointermove`, takes moves and ups from any pointer, and makes its svg
 * `touch-action: none`. So this:
 *  - holds a touch on a row before handing it to Dragology, so a swipe still scrolls the page
 *    (the svg must be `touch-action: pan-y` for that);
 *  - lets a touch on a `[data-lift-now]` element through at once;
 *  - scrolls the page while the pointer is near its top or bottom edge;
 *  - scrolls the page with any other finger, which Dragology never sees;
 * re-sending the dragging pointer after each scroll, so Dragology sees where it now is.
 *
 * Spread `bind` on an element around the renderer and pass `onDragStatus` to it.
 */
export function useDrag() {
  const s = useRef({ dragging: false, pointer: null, hold: null, block: false, passing: false, others: new Map() }).current;

  useEffect(() => {
    const resend = (type = 'pointermove') => {
      const p = s.pointer;
      if (p) document.dispatchEvent(new PointerEvent(type, { pointerId: p.id, pointerType: p.type, clientX: p.x, clientY: p.y, bubbles: true }));
    };
    const cancelHold = () => { clearTimeout(s.hold?.timer); s.hold = null; };
    const isOther = e => s.pointer && e.pointerId !== s.pointer.id;

    const onDown = e => {
      if (!s.pointer) s.pointer = { id: e.pointerId, type: e.pointerType, x: e.clientX, y: e.clientY };
      else if (isOther(e) && s.dragging) {
        e.stopImmediatePropagation();
        if (MODE !== 'native') e.preventDefault();
        s.others.set(e.pointerId, { y0: fingerY(e), y: fingerY(e), scroll0: window.scrollY });
      }
    };
    const onMove = e => {
      if (isOther(e)) {
        if (!s.others.has(e.pointerId)) return;
        e.stopImmediatePropagation();
        s.others.get(e.pointerId).y = fingerY(e);
        trace({ mv: '', sY: e.screenY, cY: e.clientY, sc: window.scrollY, vvT: window.visualViewport?.offsetTop, vvH: window.visualViewport?.height, iH: window.innerHeight });
        return;
      }
      if (!s.pointer) return;
      s.pointer.x = e.clientX;
      s.pointer.y = e.clientY;
      if (s.hold && Math.hypot(e.clientX - s.hold.x, e.clientY - s.hold.y) > SLOP) cancelHold();
    };
    const onEnd = e => {
      if (isOther(e)) {
        if (s.others.delete(e.pointerId)) e.stopImmediatePropagation();
        return;
      }
      if (!s.pointer) return;
      cancelHold();
      // Dragology ends a drag only on pointerup; a cancelled touch must end it too.
      if (e.type === 'pointercancel' && s.dragging) resend('pointerup');
      s.pointer = null;
      s.block = false;
      s.others.clear();
    };
    const native = e => MODE === 'native' && e.touches?.length > 1;
    const onTouchMove = e => { if ((s.dragging || s.block) && !native(e)) e.preventDefault(); };
    // iOS takes a second finger as a pan or pinch of the viewport, fighting the scroll above.
    const onTouchStart = e => { if (s.dragging && e.touches.length > 1 && MODE !== 'native') e.preventDefault(); };
    const onGesture = e => { if (s.dragging && MODE !== 'native') e.preventDefault(); };
    const onScroll = () => { if (s.dragging && MODE === 'native') resend(); };

    window.addEventListener('pointerdown', onDown, true);
    window.addEventListener('pointermove', onMove, true);
    window.addEventListener('pointerup', onEnd, true);
    window.addEventListener('pointercancel', onEnd, true);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('gesturestart', onGesture);
    document.addEventListener('gesturechange', onGesture);
    window.addEventListener('scroll', onScroll, { passive: true });
    s.resend = resend;
    return () => {
      window.removeEventListener('pointerdown', onDown, true);
      window.removeEventListener('pointermove', onMove, true);
      window.removeEventListener('pointerup', onEnd, true);
      window.removeEventListener('pointercancel', onEnd, true);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('gesturestart', onGesture);
      document.removeEventListener('gesturechange', onGesture);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.style.touchAction = '';
      cancelHold();
      cancelAnimationFrame(s.frame);
    };
  }, []);

  /**
   * Once a frame: a second finger sets the scroll outright, to where it was when the finger
   * landed plus how far the finger has moved since (in screenY, which scrolling can't change).
   * Stepping by each move instead drifts against iOS's lagging scroll position, and jitters.
   * Only with no second finger down does the edge scroll.
   */
  const tick = () => {
    if (!s.dragging) return;
    const finger = [...s.others.values()].at(-1);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = finger && MODE === 'native'
      ? window.scrollY
      : finger
      ? Math.round(Math.min(max, Math.max(0, finger.scroll0 + finger.y0 - finger.y)))
      : window.scrollY + (s.pointer ? edgeSpeed(s.pointer.y, { top: 0, bottom: window.innerHeight }) : 0);
    if (Math.abs(target - window.scrollY) >= 1) {
      const before = window.scrollY;
      window.scrollTo(0, target);
      if (finger) trace({ set: '', to: target, sc: window.scrollY });
      if (window.scrollY !== before) s.resend();
    }
    s.frame = requestAnimationFrame(tick);
  };

  const onDragStatus = status => {
    const dragging = status.type === 'dragging';
    if (dragging && !s.dragging) s.frame = requestAnimationFrame(tick);
    // A finger that lands mid-drag takes its touch-action from where it lands.
    if (dragging !== s.dragging && MODE !== 'native') document.documentElement.style.touchAction = dragging ? 'none' : '';
    s.dragging = dragging;
  };

  const bind = {
    onPointerDownCapture: e => {
      if (s.passing || e.pointerType !== 'touch' || e.target.closest('input, textarea')) return;
      if (e.target.closest('[data-lift-now]')) { s.block = true; return; }
      e.stopPropagation();
      const target = e.target;
      s.hold = {
        x: e.clientX, y: e.clientY,
        timer: setTimeout(() => {
          s.hold = null;
          if (!s.pointer) return;
          s.block = true;
          navigator.vibrate?.(10);
          s.passing = true;
          target.dispatchEvent(new PointerEvent('pointerdown', {
            pointerId: s.pointer.id, pointerType: 'touch', isPrimary: true, button: 0, buttons: 1,
            clientX: s.pointer.x, clientY: s.pointer.y, bubbles: true, cancelable: true, composed: true,
          }));
          s.passing = false;
        }, HOLD),
      };
    },
    onContextMenu: e => { if (s.hold || s.block) e.preventDefault(); },
  };

  return { bind, onDragStatus };
}
