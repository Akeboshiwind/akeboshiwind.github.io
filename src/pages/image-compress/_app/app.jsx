import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import imageIcon from 'pixelarticons/svg/image.svg?raw';
import downloadIcon from 'pixelarticons/svg/download.svg?raw';
import { FileDrop } from '../../../components/pixel/FileDrop.jsx';
import { Icon } from '../../../components/pixel/Icon.jsx';

const MAX_DIM_DEFAULT = 2000;
const QUALITY_DEFAULT = 85;

function compressImage(file, maxDim, quality) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => {
          resolve({
            blob,
            url: URL.createObjectURL(blob),
            width: w,
            height: h,
            size: blob.size,
            originalWidth: img.width,
            originalHeight: img.height,
            originalSize: file.size,
          });
        },
        'image/jpeg',
        quality / 100,
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

const Stat = ({ label, width, height, size }) => (
  <div>
    <div className="label opacity-60 mb-1">{label}</div>
    <div className="pixel-num">{width} × {height}</div>
    <div className="pixel-num text-heading">{formatSize(size)}</div>
  </div>
);

export function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [maxDim, setMaxDim] = useState(MAX_DIM_DEFAULT);
  const [quality, setQuality] = useState(QUALITY_DEFAULT);
  const [compressing, setCompressing] = useState(false);

  const handleFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const handleCompress = useCallback(async () => {
    if (!file) return;
    setCompressing(true);
    const res = await compressImage(file, maxDim, quality);
    setResult(res);
    setCompressing(false);
  }, [file, maxDim, quality]);

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    const baseName = file.name.replace(/\.[^.]+$/, '');
    a.download = `${baseName}-compressed.jpg`;
    a.click();
  };

  return (
    <div className="text-text">
      <h1 className="page-title mt-4 mb-2">Image Compress</h1>
      <p className="page-sub mt-0 mb-8">Compress and resize images in the browser. No upload — everything stays local.</p>

      <FileDrop accept="image/*" onFiles={(files) => handleFile(files[0])} className="aspect-video overflow-hidden mb-6">
        {preview ? (
          <img src={preview} alt="Original" className="w-full h-full min-h-0 object-contain" />
        ) : (
          <>
            <Icon svg={imageIcon} className="w-8 h-8" />
            <span>Drop an image here or click to upload</span>
          </>
        )}
      </FileDrop>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <label htmlFor="max-dim" className="label block mb-2">Max dimension: {maxDim}px</label>
          <input
            id="max-dim"
            type="range"
            min="500"
            max="4000"
            step="100"
            value={maxDim}
            onChange={(e) => setMaxDim(Number(e.target.value))}
            className="pixel-range"
          />
        </div>
        <div>
          <label htmlFor="quality" className="label block mb-2">JPEG quality: {quality}%</label>
          <input
            id="quality"
            type="range"
            min="10"
            max="100"
            step="5"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="pixel-range"
          />
        </div>
      </div>

      <button
        disabled={!file || compressing}
        onClick={handleCompress}
        className="pixel-button w-full py-2 mb-8"
        data-variant="primary"
      >
        {compressing ? 'Compressing...' : 'Compress'}
      </button>

      {result && (
        <div className="pixel-panel p-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Original" width={result.originalWidth} height={result.originalHeight} size={result.originalSize} />
            <Stat label="Compressed" width={result.width} height={result.height} size={result.size} />
          </div>

          <p className="pixel-num">
            {result.size < result.originalSize ? (
              <span className="pixel-alert-text" data-variant="ok">{((1 - result.size / result.originalSize) * 100).toFixed(1)}% smaller</span>
            ) : (
              <span className="pixel-alert-text" data-variant="warn">{((result.size / result.originalSize - 1) * 100).toFixed(1)}% larger — try a lower quality or a smaller max size</span>
            )}
          </p>

          <img src={result.url} alt="Compressed" className="pixel-panel w-full" />

          <button onClick={handleDownload} className="pixel-button w-full py-2 flex items-center justify-center gap-2" data-variant="primary">
            <Icon svg={downloadIcon} className="w-4 h-4" />
            Download
          </button>
        </div>
      )}
    </div>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
