import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';

const MAX_DIM = 2000;
const QUALITY = 0.85;
const STORAGE_KEY = 'image-compare';

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
    if (raw) return JSON.parse(raw);
  } catch {}
  return { image1: null, image2: null };
}

function saveStored(images) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
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
          ← Tools
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

function CompareScreen({ image1, image2, onBack }) {
  const containerRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      e.preventDefault();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updatePosition(clientX);
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
  }, [updatePosition]);

  const onPointerDown = (e) => {
    dragging.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updatePosition(clientX);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="px-4 py-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300 transition-colors"
        >
          ← Back
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div
          ref={containerRef}
          className="relative select-none touch-none cursor-ew-resize"
          style={{ maxWidth: '100%', maxHeight: '80vh' }}
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
        >
          <img
            src={image2}
            alt="Image 2"
            className="block max-w-full max-h-[80vh]"
            draggable={false}
          />
          <img
            src={image1}
            alt="Image 1"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            draggable={false}
          />
          <div
            className="absolute top-0 bottom-0 z-10 pointer-events-none"
            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-0.5 h-full bg-white" style={{ boxShadow: '0 0 4px rgba(0,0,0,0.5)' }} />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white flex items-center justify-center" style={{ boxShadow: '0 0 6px rgba(0,0,0,0.4)' }}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M5 3L2 8L5 13" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11 3L14 8L11 13" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [view, setView] = useState('upload');
  const [images, setImages] = useState(loadStored);

  const handleImage = (key, dataUrl) => {
    setImages((prev) => {
      const next = { ...prev, [key]: dataUrl };
      saveStored(next);
      return next;
    });
  };

  const handleSwap = () => {
    setImages((prev) => {
      const next = { image1: prev.image2, image2: prev.image1 };
      saveStored(next);
      return next;
    });
  };

  if (view === 'compare' && images.image1 && images.image2) {
    return (
      <CompareScreen
        image1={images.image1}
        image2={images.image2}
        onBack={() => setView('upload')}
      />
    );
  }

  return (
    <UploadScreen
      image1={images.image1}
      image2={images.image2}
      onImage={handleImage}
      onSwap={handleSwap}
      onCompare={() => setView('compare')}
    />
  );
}

createRoot(document.getElementById('app')).render(<App />);
