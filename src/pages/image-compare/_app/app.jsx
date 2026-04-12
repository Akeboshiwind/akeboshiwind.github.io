import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

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
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const processFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const dataUrl = await compressImage(file);
    onImage(dataUrl);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  if (value) {
    return (
      <div>
        <label className="block text-sm font-medium mb-2">{label}</label>
        <div
          className={`relative border-2 rounded-lg overflow-hidden aspect-video bg-white dark:bg-gray-800 group ${
            dragOver
              ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
        >
          <img src={value} alt={label} className="w-full h-full object-contain" />
          {dragOver && (
            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
              <span className="text-white text-sm font-medium bg-blue-600 px-3 py-1 rounded">
                Drop to replace
              </span>
            </div>
          )}
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 text-xs px-2 py-1 rounded bg-black/50 text-white sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
          >
            Tap to replace
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => processFile(e.target.files?.[0])}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg overflow-hidden aspect-video flex items-center justify-center bg-white dark:bg-gray-800 transition-colors cursor-pointer ${
          dragOver
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
      >
        <span className="text-gray-400 text-sm text-center px-4">
          Drop an image here or click to upload
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => processFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}

function UploadScreen({ image1, image2, onImage, onSwap, onCompare }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <a
          href="../"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ← Home
        </a>

        <h1 className="text-2xl font-bold mt-4 mb-6">Image Compare</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 items-end">
          <ImageSlot label="Image 1" value={image1} onImage={(v) => onImage('image1', v)} />

          {image1 && image2 && (
            <div className="flex justify-center sm:col-span-2 sm:order-3 -my-2 sm:my-0">
              <button
                onClick={onSwap}
                className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                title="Swap images"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 5h10M10 2l3 3-3 3" />
                  <path d="M13 11H3M6 8l-3 3 3 3" />
                </svg>
                Swap
              </button>
            </div>
          )}

          <ImageSlot label="Image 2" value={image2} onImage={(v) => onImage('image2', v)} />
        </div>

        <button
          disabled={!image1 || !image2}
          onClick={onCompare}
          className="w-full py-3 px-6 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Compare
        </button>
      </div>
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
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          ← Back
        </button>
        {mode === 'locked' && (
          <button
            onClick={() => setMode('adjusting')}
            className="text-sm px-3 py-1.5 rounded border border-gray-600 text-gray-400 hover:text-gray-200 hover:border-gray-500 transition-colors"
          >
            Adjust
          </button>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div
          ref={containerRef}
          className={`relative select-none touch-none overflow-hidden ${
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
            <div className="w-0.5 h-full bg-white" style={{ boxShadow: '0 0 4px rgba(0,0,0,0.5)' }} />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center"
              style={{ boxShadow: '0 0 6px rgba(0,0,0,0.4)' }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M5 3L2 8L5 13" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11 3L14 8L11 13" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Adjusting mode indicator */}
          {mode === 'adjusting' && (
            <div className="absolute top-2 left-2 z-20 text-xs px-2 py-1 rounded bg-blue-600/80 text-white">
              Adjusting Image {activeNum}
            </div>
          )}
        </div>
      </div>

      {/* Adjust toolbar */}
      {mode === 'adjusting' && (
        <div className="px-4 py-3 border-t border-gray-700 space-y-3">
          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400 shrink-0 w-12">Rotate</label>
            <input
              type="range"
              min="-180"
              max="180"
              value={activeTransform.rotation}
              onChange={(e) => handleRotation(Number(e.target.value))}
              className="flex-1 accent-blue-500"
            />
            <span className="text-xs text-gray-400 w-10 text-right tabular-nums">{activeTransform.rotation}°</span>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs text-gray-400 shrink-0 w-12">Zoom</label>
            <input
              type="range"
              min="25"
              max="400"
              value={Math.round(activeTransform.scale * 100)}
              onChange={(e) => handleScale(Number(e.target.value))}
              className="flex-1 accent-blue-500"
            />
            <span className="text-xs text-gray-400 w-10 text-right tabular-nums">{Math.round(activeTransform.scale * 100)}%</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => onTransformChange(activeImage, { ...DEFAULT_TRANSFORM })}
              className="text-xs px-3 py-1.5 rounded border border-gray-600 text-gray-400 hover:text-gray-200 hover:border-gray-500 transition-colors"
            >
              Reset
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveImage(otherImage)}
                className="text-xs px-3 py-1.5 rounded border border-gray-600 text-gray-400 hover:text-gray-200 hover:border-gray-500 transition-colors"
              >
                Switch to Image {otherNum}
              </button>
              <button
                onClick={() => setMode('locked')}
                className="text-xs px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Lock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
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

createRoot(document.getElementById('app')).render(<App />);
