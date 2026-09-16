// The meal pool. Each meal carries a hue (0–359) used to colour its band in
// the palette. The hues are spread around the wheel — leaning towards the dish
// where there's an obvious colour, spaced out where there isn't — so no two
// meals in a palette read as the same colour. A new meal takes the widest gap
// going, which keeps the spread even without recolouring anything already
// here; store.js asserts the spacing that generation relies on.

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
  { id: 'kala-chana', name: 'Kala chana', hue: 353 },
  { id: 'corn-spinach-sandwich', name: 'Corn & spinach sandwich', hue: 83 },
  { id: 'potato-sandwich', name: 'Potato sandwich', hue: 233 },
  { id: 'cabbage-subji', name: 'Cabbage subji', hue: 173 },
  { id: 'mushroom-muttar', name: 'Mushroom muttar', hue: 293 },
  { id: 'egg-curry', name: 'Egg curry', hue: 23 },
  { id: 'green-pepper-besan', name: 'Green pepper besan', hue: 143 },
];

const BY_ID = new Map(MEALS.map(m => [m.id, m]));

export const mealById = id => BY_ID.get(id);
