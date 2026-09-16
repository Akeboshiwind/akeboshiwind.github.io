// The meal pool. Each meal carries a hue (0–359) used to colour its band in
// the palette. The hues are spread evenly around the wheel — leaning towards
// the dish where there's an obvious colour, spaced out where there isn't — so
// no two meals in a palette read as the same colour.

export const MEALS = [
  { id: 'quesadillas', name: 'Quesadillas', hue: 38 },
  { id: 'pasta', name: 'Pasta', hue: 338 },
  { id: 'aloo-subji', name: 'Aloo subji', hue: 188 },
  { id: 'gobi-subji', name: 'Gobi subji', hue: 218 },
  { id: 'baigan-bharta', name: 'Baigan bharta', hue: 278 },
  { id: 'rajma', name: 'Rajma', hue: 308 },
  { id: 'black-eyed-beans', name: 'Black eyed beans', hue: 248 },
  { id: 'tofu-mutar', name: 'Tofu mutar', hue: 128 },
  { id: 'palak-tofu', name: 'Palak tofu', hue: 158 },
  { id: 'pav-baji', name: 'Pav baji', hue: 8 },
  { id: 'bhindi', name: 'Bhindi', hue: 98 },
  { id: 'sambar', name: 'Sambar', hue: 68 },
];

const BY_ID = new Map(MEALS.map(m => [m.id, m]));

export const mealById = id => BY_ID.get(id);
