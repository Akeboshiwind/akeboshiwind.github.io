import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';

function UploadScreen({ onCompare }) {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const handleFile = (setter) => (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setter(URL.createObjectURL(file));
    }
  };

  const handleDrop = (setter) => (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setter(URL.createObjectURL(file));
    }
  };

  const preventDefault = (e) => e.preventDefault();

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {[
            { label: 'Image 1', value: image1, setter: setImage1 },
            { label: 'Image 2', value: image2, setter: setImage2 },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="block text-sm font-medium mb-2">{label}</label>
              <div
                onDrop={handleDrop(setter)}
                onDragOver={preventDefault}
                className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden aspect-video flex items-center justify-center bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
                onClick={() => document.getElementById(`file-${label}`).click()}
              >
                {value ? (
                  <img src={value} alt={label} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-gray-400 text-sm text-center px-4">
                    Drop an image here or click to upload
                  </span>
                )}
                <input
                  id={`file-${label}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile(setter)}
                />
              </div>
            </div>
          ))}
        </div>

        <button
          disabled={!image1 || !image2}
          onClick={() => onCompare(image1, image2)}
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
          {/* Image 2 (base layer, always fully visible) — sets container size */}
          <img
            src={image2}
            alt="Image 2"
            className="block max-w-full max-h-[80vh]"
            draggable={false}
          />

          {/* Image 1 (overlay) — clipped by clip-path, not resized */}
          <img
            src={image1}
            alt="Image 1"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            draggable={false}
          />

          {/* Slider handle */}
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
  const [images, setImages] = useState({ image1: null, image2: null });

  const handleCompare = (image1, image2) => {
    setImages({ image1, image2 });
    setView('compare');
  };

  if (view === 'compare') {
    return (
      <CompareScreen
        image1={images.image1}
        image2={images.image2}
        onBack={() => setView('upload')}
      />
    );
  }

  return <UploadScreen onCompare={handleCompare} />;
}

createRoot(document.getElementById('app')).render(<App />);
