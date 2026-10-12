/** Below this the control line is too faint to divide by, and the ratio reads 0. */
export const MIN_CONTROL_INTENSITY = 5;

/** The narrowest crop, in percent of the photo's width, either handle can leave. */
export const MIN_CROP_GAP = 10;

const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

/**
 * The horizontal run to sample inside the crop, trimmed by 10% of the cropped width at each side.
 *
 * @returns {{ startX: number, sampleWidth: number } | null} null when the crop is too narrow to sample
 */
export function sampleSpan(width, cropLeftPercent, cropRightPercent) {
  const cropLeftPx = Math.round(width * (cropLeftPercent / 100));
  const cropRightPx = Math.round(width * (cropRightPercent / 100));
  const croppedWidth = width - cropLeftPx - cropRightPx;
  if (croppedWidth < 10) return null;

  const startX = cropLeftPx + Math.round(croppedWidth * 0.1);
  const endX = width - cropRightPx - Math.round(croppedWidth * 0.1);
  const sampleWidth = Math.max(1, endX - startX);
  if (startX < 0 || startX >= width) return null;
  return { startX, sampleWidth };
}

export const sampleRows = (y, height) => [-1, 0, 1].map((dy) => clamp(y + dy, 0, height - 1));

export function averageColour(runs) {
  let r = 0, g = 0, b = 0, count = 0;
  for (const data of runs) {
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
  }
  return { r: r / count, g: g / count, b: b / count };
}

/** How much darker than the background a line is, in mean-channel units; never negative. */
export function intensity(colour, base) {
  const lightness = (c) => (c.r + c.g + c.b) / 3;
  return Math.max(0, lightness(base) - lightness(colour));
}

export function lineRatio(control, test, base) {
  const controlIntensity = intensity(control, base);
  const testIntensity = intensity(test, base);
  const ratio = controlIntensity > MIN_CONTROL_INTENSITY ? testIntensity / controlIntensity : 0;
  return { controlIntensity, testIntensity, ratio };
}

export function readLine(ctx, span, y, height) {
  return averageColour(sampleRows(y, height).map((sy) => ctx.getImageData(span.startX, sy, span.sampleWidth, 1).data));
}

export function dragCrop(side, percent, { left, right }) {
  const p = clamp(percent, 0, 100);
  return side === 'left'
    ? { left: Math.min(p, 100 - right - MIN_CROP_GAP), right }
    : { left, right: Math.min(100 - p, 100 - left - MIN_CROP_GAP) };
}

export const dragMarker = (percent) => clamp(percent, 5, 95);
