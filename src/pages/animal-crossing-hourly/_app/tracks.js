// Scruffy's "Animal Crossing: Taking Root" hourly mixes
// (playlist PLQY6PNl6p3MYWVZa5R5Emdi-CxgM40Scm). Every video is exactly one
// hour long and embeddable, so the video for hour H played at offset
// (minutes * 60 + seconds) lines up with the wall clock.
export const TRACK_SECONDS = 3600;

export const TRACKS = [
  { hour: 0, label: '12 AM', videoId: 'AsM6_fhicWg' },
  { hour: 1, label: '1 AM', videoId: 'tbp02PPpjg8' },
  { hour: 2, label: '2 AM', videoId: 'kMJANxxZojM' },
  { hour: 3, label: '3 AM', videoId: 'poe38GyO5fU' },
  { hour: 4, label: '4 AM', videoId: 'To8ZL_ARBQ0' },
  { hour: 5, label: '5 AM', videoId: 'odCEqn9Rz1w' },
  { hour: 6, label: '6 AM', videoId: 'f8pYxhDEgfg' },
  { hour: 7, label: '7 AM', videoId: '-EvbkIEPyf4' },
  { hour: 8, label: '8 AM', videoId: 'grn83Yt38qY' },
  { hour: 9, label: '9 AM', videoId: 'ACquTCLlOIM' },
  { hour: 10, label: '10 AM', videoId: 'gbCQXFdWHVU' },
  { hour: 11, label: '11 AM', videoId: 'YAAZCej0G-U' },
  { hour: 12, label: '12 PM', videoId: '0zbyDEqSfGQ' },
  { hour: 13, label: '1 PM', videoId: 'DX2LKT7LyZc' },
  { hour: 14, label: '2 PM', videoId: 'PjGfsuEgF6g' },
  { hour: 15, label: '3 PM', videoId: 'AA_pu-2Omtg' },
  { hour: 16, label: '4 PM', videoId: '2QGxavJrkHQ' },
  { hour: 17, label: '5 PM', videoId: 'IV9N_Lr61QY' },
  { hour: 18, label: '6 PM', videoId: '66drz4evPZk' },
  { hour: 19, label: '7 PM', videoId: 'oWL9TbzmY1o' },
  { hour: 20, label: '8 PM', videoId: 'j93RsBBPG5E' },
  { hour: 21, label: '9 PM', videoId: 'eiSOcbhBSWQ' },
  { hour: 22, label: '10 PM', videoId: 'gCmBrd7etjg' },
  { hour: 23, label: '11 PM', videoId: 'w_IyQlLq_fw' },
];

// Where the wall clock sits inside the current hour's video. Clamped just
// short of the end so a seek never lands past the final frame.
export const trackFor = (date = new Date()) => {
  const track = TRACKS[date.getHours()];
  const offset = Math.min(
    date.getMinutes() * 60 + date.getSeconds(),
    TRACK_SECONDS - 1,
  );
  return { ...track, offset };
};

export const formatOffset = (seconds) => {
  const total = Math.max(0, Math.floor(seconds));
  const m = String(Math.floor(total / 60)).padStart(2, '0');
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
};

// The YouTube embed rejects any origin that isn't http(s) with error 153, so
// only forward one when the page is served over a real web origin.
export const embedOrigin = (origin) =>
  /^https?:\/\//.test(origin || '') ? origin : undefined;
