import { useEffect, useRef } from 'react';
import { edgeSpeed } from './list.js';

const MOVE = 4;
const SLOP = 10;
const HOLD = 300;

/**
 * What a Dragology list in a scrolling page needs from the page. Dragology reads the pointer
 * only on `pointermove`, takes moves and ups from any pointer, and makes its svg
 * `touch-action: none`. So this:
 *  - hands a press to Dragology only once it is a drag. A press Dragology sees redraws what was
 *    pressed, and the browser then drops its click, so a tap must never reach it;
 *  - takes a touch on a row as a drag once held, so a swipe still scrolls the page
 *    (the svg must be `touch-action: pan-y` for that), and a mouse, or a touch on a
 *    `[data-lift-now]` element, once it moves;
 *  - scrolls the page while the pointer is near its top or bottom edge;
 *  - scrolls the page with any other finger, which Dragology never sees;
 * re-sending the dragging pointer after each scroll, so Dragology sees where it now is.
 *
 * Spread `bind` on an element around the renderer and pass `onDragStatus` to it.
 */
export function useDrag() {
  const s = useRef({ dragging: false, pointer: null, press: null, block: false, passing: false, others: new Map() }).current;

  const cancelPress = () => { clearTimeout(s.press?.timer); s.press = null; };
  /** Gives Dragology the press it was kept from, where it began. */
  const handOff = () => {
    const p = s.press;
    cancelPress();
    if (!s.pointer) return;
    if (p.type === 'touch') s.block = true;
    s.passing = true;
    p.target.dispatchEvent(new PointerEvent('pointerdown', {
      pointerId: s.pointer.id, pointerType: p.type, isPrimary: true, button: 0, buttons: 1,
      clientX: p.x, clientY: p.y, bubbles: true, cancelable: true, composed: true,
    }));
    s.passing = false;
  };

  useEffect(() => {
    const resend = (type = 'pointermove') => {
      const p = s.pointer;
      if (p) document.dispatchEvent(new PointerEvent(type, { pointerId: p.id, pointerType: p.type, clientX: p.x, clientY: p.y, bubbles: true }));
    };
    const isOther = e => s.pointer && e.pointerId !== s.pointer.id;

    const onDown = e => {
      if (!s.pointer) s.pointer = { id: e.pointerId, type: e.pointerType, x: e.clientX, y: e.clientY };
      else if (isOther(e) && s.dragging) {
        e.stopImmediatePropagation();
        e.preventDefault();
        s.others.set(e.pointerId, { y0: e.clientY, y: e.clientY, scroll0: window.scrollY });
      }
    };
    const onMove = e => {
      if (isOther(e)) {
        if (!s.others.has(e.pointerId)) return;
        e.stopImmediatePropagation();
        s.others.get(e.pointerId).y = e.clientY;
        return;
      }
      if (!s.pointer) return;
      s.pointer.x = e.clientX;
      s.pointer.y = e.clientY;
      const p = s.press;
      if (!p) return;
      const moved = Math.hypot(e.clientX - p.x, e.clientY - p.y);
      if (p.timer) { if (moved > SLOP) cancelPress(); }
      else if (moved > MOVE) handOff();
    };
    const onEnd = e => {
      if (isOther(e)) {
        if (s.others.delete(e.pointerId)) e.stopImmediatePropagation();
        return;
      }
      if (!s.pointer) return;
      cancelPress();
      // Dragology ends a drag only on pointerup; a cancelled touch must end it too.
      if (e.type === 'pointercancel' && s.dragging) resend('pointerup');
      s.pointer = null;
      s.block = false;
      s.others.clear();
    };
    const onTouchMove = e => { if (s.dragging || s.block) e.preventDefault(); };
    // iOS takes a second finger as a pan or pinch of the viewport, fighting the scroll above.
    const onTouchStart = e => { if (s.dragging && e.touches.length > 1) e.preventDefault(); };
    const onGesture = e => { if (s.dragging) e.preventDefault(); };

    window.addEventListener('pointerdown', onDown, true);
    window.addEventListener('pointermove', onMove, true);
    window.addEventListener('pointerup', onEnd, true);
    window.addEventListener('pointercancel', onEnd, true);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('gesturestart', onGesture);
    document.addEventListener('gesturechange', onGesture);
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
      document.documentElement.style.touchAction = '';
      cancelPress();
      cancelAnimationFrame(s.frame);
    };
  }, []);

  /**
   * Once a frame: a second finger sets the scroll outright, to where it was when the finger
   * landed plus how far the finger has moved since. In clientY: iOS adds the scroll to screenY.
   * Stepping by each move instead drifts against iOS's lagging scroll position, and jitters.
   * Only with no second finger down does the edge scroll.
   */
  const tick = () => {
    if (!s.dragging) return;
    const finger = [...s.others.values()].at(-1);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = finger
      ? Math.round(Math.min(max, Math.max(0, finger.scroll0 + finger.y0 - finger.y)))
      : window.scrollY + (s.pointer ? edgeSpeed(s.pointer.y, { top: 0, bottom: window.innerHeight }) : 0);
    if (Math.abs(target - window.scrollY) >= 1) {
      const before = window.scrollY;
      window.scrollTo(0, target);
      if (window.scrollY !== before) s.resend();
    }
    s.frame = requestAnimationFrame(tick);
  };

  const onDragStatus = status => {
    const dragging = status.type === 'dragging';
    if (dragging && !s.dragging) s.frame = requestAnimationFrame(tick);
    // A finger that lands mid-drag takes its touch-action from where it lands.
    if (dragging !== s.dragging) document.documentElement.style.touchAction = dragging ? 'none' : '';
    s.dragging = dragging;
  };

  const bind = {
    onPointerDownCapture: e => {
      if (s.passing || e.button !== 0 || e.target.closest('input, textarea')) return;
      e.stopPropagation();
      const touch = e.pointerType === 'touch';
      const hold = touch && !e.target.closest('[data-lift-now]');
      if (touch && !hold) s.block = true;
      s.press = {
        target: e.target, type: e.pointerType, x: e.clientX, y: e.clientY,
        timer: hold ? setTimeout(() => { navigator.vibrate?.(10); handOff(); }, HOLD) : null,
      };
    },
    onContextMenu: e => { if (s.press || s.block) e.preventDefault(); },
  };

  return { bind, onDragStatus };
}
