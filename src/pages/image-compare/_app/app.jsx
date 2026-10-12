import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import imageIcon from 'pixelarticons/svg/image.svg?raw';
import swapIcon from 'pixelarticons/svg/arrows-horizontal.svg?raw';
import backIcon from 'pixelarticons/svg/arrow-left.svg?raw';
import adjustIcon from 'pixelarticons/svg/sliders.svg?raw';
import handleIcon from 'pixelarticons/svg/chevrons-horizontal.svg?raw';
import { FileDrop } from '../../../components/pixel/FileDrop.jsx';
import { Icon } from '../../../components/pixel/Icon.jsx';

const MAX_DIM = 2000;
const QUALITY = 0.85;
const STORAGE_KEY = 'image-compare';
const DEFAULT_TRANSFORM = { scale: 1, rotation: 0, x: 0, y: 0 };

function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', QUALITY));
    };
    img.src = URL.createObjectURL(file);
  });
}

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        image1: data.image1 || null,
        image2: data.image2 || null,
        transform1: data.transform1 || { ...DEFAULT_TRANSFORM },
        transform2: data.transform2 || { ...DEFAULT_TRANSFORM },
      };
    }
  } catch {}
  return { image1: null, image2: null, transform1: { ...DEFAULT_TRANSFORM }, transform2: { ...DEFAULT_TRANSFORM } };
}

function saveStored(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

function ImageSlot({ label, value, onImage }) {
  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const dataUrl = await compressImage(file);
    onImage(dataUrl);
  };

  return (
    <div className="min-w-0">
      <div className="label mb-2">{label}</div>
      <FileDrop
        accept="image/*"
        onFiles={(files) => processFile(files[0])}
        className="group aspect-video overflow-hidden"
      >
        {value ? (
          <>
            <img src={value} alt={label} className="absolute inset-0 w-full h-full object-contain" />
            <span className="absolute inset-0 hidden group-data-dragover:flex items-center justify-center bg-bg/80 text-accent">
              Drop to replace
            </span>
            <span className="absolute bottom-0 right-0 px-2 py-1 bg-bg border-t-2 border-l-2 border-border sm:opacity-0 sm:group-hover:opacity-100">
              Tap to replace
            </span>
          </>
        ) : (
          <>
            <Icon svg={imageIcon} className="w-8 h-8" />
            <span>Drop an image here or click to upload</span>
          </>
        )}
      </FileDrop>
    </div>
  );
}

function UploadScreen({ image1, image2, onImage, onSwap, onCompare }) {
  return (
    <div className="text-text">
      <h1 className="page-title mt-4 mb-2">Image Compare</h1>
      <p className="page-sub mt-0 mb-8">Lay two images over each other and drag a divider across to compare them. Everything stays in your browser.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 items-end">
        <ImageSlot label="Image 1" value={image1} onImage={(v) => onImage('image1', v)} />

        {image1 && image2 && (
          <div className="flex justify-center sm:col-span-2 sm:order-3 -my-2 sm:my-0">
            <button onClick={onSwap} className="pixel-button flex items-center gap-2" title="Swap images">
              <Icon svg={swapIcon} className="w-4 h-4" />
              Swap
            </button>
          </div>
        )}

        <ImageSlot label="Image 2" value={image2} onImage={(v) => onImage('image2', v)} />
      </div>

      <button
        disabled={!image1 || !image2}
        onClick={onCompare}
        className="pixel-button w-full py-2"
        data-variant="primary"
      >
        Compare
      </button>
    </div>
  );
}

function CompareScreen({ image1, image2, transform1, transform2, onTransformChange, onBack }) {
  const containerRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [mode, setMode] = useState('locked');
  const [activeImage, setActiveImage] = useState('image1');
  const dragging = useRef(false);
  const gestureRef = useRef(null);

  const activeTransform = activeImage === 'image1' ? transform1 : transform2;

  const updateSlider = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    setSliderPos(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  }, []);

  // Swiper events (locked mode)
  useEffect(() => {
    if (mode !== 'locked') return;

    const onMove = (e) => {
      if (!dragging.current) return;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateSlider(clientX);
    };
    const onUp = () => { dragging.current = false; };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [mode, updateSlider]);

  // Use refs for transforms so gesture handlers always read fresh values
  const t1Ref = useRef(transform1);
  const t2Ref = useRef(transform2);
  const activeImageRef = useRef(activeImage);
  const onTransformChangeRef = useRef(onTransformChange);
  t1Ref.current = transform1;
  t2Ref.current = transform2;
  activeImageRef.current = activeImage;
  onTransformChangeRef.current = onTransformChange;

  // Rescale pixel-based transforms when container resizes (mode switch, orientation change, etc.)
  const lastSizeRef = useRef(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) return;
      const last = lastSizeRef.current;
      if (last && (last.width !== width || last.height !== height)) {
        const rx = width / last.width;
        const ry = height / last.height;
        const t1 = t1Ref.current;
        const t2 = t2Ref.current;
        const needsT1 = t1.x !== 0 || t1.y !== 0;
        const needsT2 = t2.x !== 0 || t2.y !== 0;
        if (needsT1) onTransformChangeRef.current('image1', { ...t1, x: t1.x * rx, y: t1.y * ry });
        if (needsT2) onTransformChangeRef.current('image2', { ...t2, x: t2.x * rx, y: t2.y * ry });
      }
      lastSizeRef.current = { width, height };
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Pan/pinch events (adjusting mode)
  useEffect(() => {
    if (mode !== 'adjusting') return;

    const getActive = () => activeImageRef.current === 'image1' ? t1Ref.current : t2Ref.current;

    const onMove = (e) => {
      const g = gestureRef.current;
      if (!g) return;

      if (e.touches && e.touches.length === 2) {
        e.preventDefault();
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const scale = Math.max(0.25, Math.min(4, g.startScale * (dist / g.startDist)));
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const dx = midX - g.startMidX;
        const dy = midY - g.startMidY;
        onTransformChangeRef.current(activeImageRef.current, {
          ...getActive(),
          scale,
          x: g.startX + dx,
          y: g.startY + dy,
        });
      } else if (g.type === 'pan') {
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        onTransformChangeRef.current(activeImageRef.current, {
          ...getActive(),
          x: g.startX + (clientX - g.startClientX),
          y: g.startY + (clientY - g.startClientY),
        });
      }
    };

    const onUp = (e) => {
      if (e.touches && e.touches.length > 0) return;
      gestureRef.current = null;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [mode]);

  const onPointerDown = (e) => {
    if (mode === 'locked') {
      dragging.current = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateSlider(clientX);
    } else {
      const current = activeImage === 'image1' ? transform1 : transform2;
      if (e.touches && e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        gestureRef.current = {
          type: 'pinch',
          startDist: dist,
          startScale: current.scale,
          startMidX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          startMidY: (e.touches[0].clientY + e.touches[1].clientY) / 2,
          startX: current.x,
          startY: current.y,
        };
      } else {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        gestureRef.current = {
          type: 'pan',
          startClientX: clientX,
          startClientY: clientY,
          startX: current.x,
          startY: current.y,
        };
      }
    }
  };

  // Handle second finger arriving after first
  const onTouchStartCapture = (e) => {
    if (mode !== 'adjusting') return;
    if (e.touches.length === 2 && gestureRef.current?.type === 'pan') {
      const current = activeImage === 'image1' ? transform1 : transform2;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      gestureRef.current = {
        type: 'pinch',
        startDist: dist,
        startScale: current.scale,
        startMidX: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        startMidY: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        startX: current.x,
        startY: current.y,
      };
    }
  };

  // Mouse wheel zoom (adjusting mode)
  const onWheelRef = useRef(null);
  onWheelRef.current = (e) => {
    if (mode !== 'adjusting') return;
    e.preventDefault();
    const current = activeImageRef.current === 'image1' ? t1Ref.current : t2Ref.current;
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.25, Math.min(4, current.scale * delta));
    onTransformChangeRef.current(activeImageRef.current, { ...current, scale: newScale });
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e) => onWheelRef.current?.(e);
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const makeCSS = (t) => `translate(${t.x}px, ${t.y}px) rotate(${t.rotation}deg) scale(${t.scale})`;

  const otherImage = activeImage === 'image1' ? 'image2' : 'image1';
  const activeNum = activeImage === 'image1' ? '1' : '2';
  const otherNum = activeImage === 'image1' ? '2' : '1';

  const handleRotation = (value) => {
    onTransformChange(activeImage, { ...activeTransform, rotation: value });
  };

  const handleScale = (value) => {
    onTransformChange(activeImage, { ...activeTransform, scale: value / 100 });
  };

  return (
    <div className="flex-1 flex flex-col gap-4 text-text">
      <div className="flex items-center justify-between gap-2">
        <button onClick={onBack} className="pixel-button flex items-center gap-2">
          <Icon svg={backIcon} className="w-4 h-4" />
          Back
        </button>
        {mode === 'locked' && (
          <button onClick={() => setMode('adjusting')} className="pixel-button flex items-center gap-2">
            <Icon svg={adjustIcon} className="w-4 h-4" />
            Adjust
          </button>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0">
        <div
          ref={containerRef}
          className={`relative select-none touch-none overflow-hidden border-2 border-border ${
            mode === 'locked' ? 'cursor-ew-resize' : 'cursor-grab active:cursor-grabbing'
          }`}
          style={{ maxWidth: '100%', maxHeight: mode === 'adjusting' ? '65vh' : '80vh' }}
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
          onTouchStartCapture={onTouchStartCapture}
        >
          {/* Image 2 - base layer, sets container size */}
          <div style={{ transform: makeCSS(transform2), transformOrigin: 'center center' }}>
            <img
              src={image2}
              alt="Image 2"
              className={`block max-w-full ${mode === 'adjusting' ? 'max-h-[65vh]' : 'max-h-[80vh]'}`}
              draggable={false}
            />
          </div>

          {/* Image 1 - clipped overlay */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          >
            <div
              className="w-full h-full"
              style={{ transform: makeCSS(transform1), transformOrigin: 'center center' }}
            >
              <img
                src={image1}
                alt="Image 1"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>

          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 z-10 pointer-events-none"
            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-0.5 h-full bg-accent" />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-bg border-2 border-accent text-accent flex items-center justify-center">
              <Icon svg={handleIcon} className="w-5 h-5" />
            </div>
          </div>

          {mode === 'adjusting' && (
            <div className="label absolute top-0 left-0 z-20 px-2 py-1 bg-accent text-bg">
              Adjusting Image {activeNum}
            </div>
          )}
        </div>
      </div>

      {mode === 'adjusting' && (
        <div className="pixel-panel p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="rotate" className="label shrink-0 w-14">Rotate</label>
            <input
              id="rotate"
              type="range"
              min="-180"
              max="180"
              value={activeTransform.rotation}
              onChange={(e) => handleRotation(Number(e.target.value))}
              className="pixel-range flex-1 min-w-0"
            />
            <span className="font-pixel text-pixel tabular-nums w-12 text-right">{activeTransform.rotation}°</span>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="zoom" className="label shrink-0 w-14">Zoom</label>
            <input
              id="zoom"
              type="range"
              min="25"
              max="400"
              value={Math.round(activeTransform.scale * 100)}
              onChange={(e) => handleScale(Number(e.target.value))}
              className="pixel-range flex-1 min-w-0"
            />
            <span className="font-pixel text-pixel tabular-nums w-12 text-right">{Math.round(activeTransform.scale * 100)}%</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => onTransformChange(activeImage, { ...DEFAULT_TRANSFORM })}
              className="pixel-button"
            >
              Reset
            </button>
            <div className="flex gap-2">
              <button onClick={() => setActiveImage(otherImage)} className="pixel-button">
                Switch to Image {otherNum}
              </button>
              <button onClick={() => setMode('locked')} className="pixel-button" data-variant="primary">
                Lock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function App() {
  const [view, setView] = useState('upload');
  const [data, setData] = useState(loadStored);

  const handleImage = (key, dataUrl) => {
    setData((prev) => {
      const transformKey = key === 'image1' ? 'transform1' : 'transform2';
      const next = { ...prev, [key]: dataUrl, [transformKey]: { ...DEFAULT_TRANSFORM } };
      saveStored(next);
      return next;
    });
  };

  const handleSwap = () => {
    setData((prev) => {
      const next = {
        image1: prev.image2,
        image2: prev.image1,
        transform1: { ...(prev.transform2 || DEFAULT_TRANSFORM) },
        transform2: { ...(prev.transform1 || DEFAULT_TRANSFORM) },
      };
      saveStored(next);
      return next;
    });
  };

  const handleTransformChange = (which, transform) => {
    setData((prev) => {
      const key = which === 'image1' ? 'transform1' : 'transform2';
      const next = { ...prev, [key]: transform };
      saveStored(next);
      return next;
    });
  };

  if (view === 'compare' && data.image1 && data.image2) {
    return (
      <CompareScreen
        image1={data.image1}
        image2={data.image2}
        transform1={data.transform1 || { ...DEFAULT_TRANSFORM }}
        transform2={data.transform2 || { ...DEFAULT_TRANSFORM }}
        onTransformChange={handleTransformChange}
        onBack={() => setView('upload')}
      />
    );
  }

  return (
    <UploadScreen
      image1={data.image1}
      image2={data.image2}
      onImage={handleImage}
      onSwap={handleSwap}
      onCompare={() => setView('compare')}
    />
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
