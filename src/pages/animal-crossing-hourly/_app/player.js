// Thin wrapper around the YouTube IFrame API. The API is a global singleton
// with a single ready callback, so the script tag is only ever injected once
// and every caller waits on the same promise.
let apiPromise = null;

export const loadYouTubeApi = () => {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT);
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error('Could not load the YouTube player.'));
    };
    document.head.appendChild(script);
  });

  return apiPromise;
};

// Player states we can seek from. A player that has never played sits at
// UNSTARTED (-1) and silently ignores seekTo, so those need loadVideoById.
const SEEKABLE = new Set([0, 1, 2, 3]);
export const canSeek = (state) => SEEKABLE.has(state);

export const errorMessage = (code) => {
  switch (Number(code)) {
    case 2:
      return 'YouTube rejected the video id.';
    case 5:
      return 'The YouTube player ran into a problem with this video.';
    case 100:
      return 'That video is gone — it was removed or made private.';
    case 101:
    case 150:
      return 'The uploader disabled embedding for this video. Open it on YouTube instead.';
    case 153:
      return 'YouTube rejected this page as an embed origin.';
    default:
      return 'The YouTube player hit an unknown error.';
  }
};
