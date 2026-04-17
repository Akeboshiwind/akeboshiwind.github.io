import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

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

function App({ historyUrl }) {
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

  const handleDrop = (e) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files?.[0]);
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <nav className="flex items-center gap-3 text-sm text-gray-400">
          <a
            href="../"
            className="inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ← Home
          </a>
          {historyUrl && (
            <a
              href={historyUrl}
              target="_blank"
              rel="noopener"
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              history
            </a>
          )}
        </nav>

        <h1 className="text-2xl font-bold mt-4 mb-6">Image Compress</h1>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById('file-input').click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden aspect-video flex items-center justify-center bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer mb-6"
        >
          {preview ? (
            <img src={preview} alt="Original" className="w-full h-full object-contain" />
          ) : (
            <span className="text-gray-400 text-sm text-center px-4">
              Drop an image here or click to upload
            </span>
          )}
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">
              Max dimension: {maxDim}px
            </label>
            <input
              type="range"
              min="500"
              max="4000"
              step="100"
              value={maxDim}
              onChange={(e) => setMaxDim(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              JPEG quality: {quality}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <button
          disabled={!file || compressing}
          onClick={handleCompress}
          className="w-full py-3 px-6 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors mb-6"
        >
          {compressing ? 'Compressing...' : 'Compress'}
        </button>

        {/* Result */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Original</div>
                <div>{result.originalWidth} × {result.originalHeight}</div>
                <div className="font-medium">{formatSize(result.originalSize)}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Compressed</div>
                <div>{result.width} × {result.height}</div>
                <div className="font-medium">{formatSize(result.size)}</div>
              </div>
            </div>

            <div className="text-sm">
              <span className="text-green-500 font-medium">
                {((1 - result.size / result.originalSize) * 100).toFixed(1)}% smaller
              </span>
            </div>

            {/* Preview */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <img src={result.url} alt="Compressed" className="w-full" />
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3 px-6 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const mount = document.getElementById('app');
createRoot(mount).render(<App historyUrl={mount.dataset.historyUrl} />);
