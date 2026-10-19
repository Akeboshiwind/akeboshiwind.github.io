// npm run shot -- /markdown-table/ --steps scripts/shot-steps/table-editor.mjs
export default async (page) => {
  await page.getByLabel('Paste a Markdown table').fill([
    '| Fruit  | Colour | Price |',
    '| ------ | ------ | ----: |',
    '| Apple  | Red    |  0.40 |',
    '| Banana | Yellow |  0.25 |',
    '| Cherry | Red    |  3.00 |',
  ].join('\n'));
  await page.getByRole('button', { name: 'Edit table' }).click();
};
