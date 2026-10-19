// npm run shot -- /markdown-preview/ --viewport --steps scripts/shot-steps/preview-end.mjs
export default async (page) => {
  const sections = Array.from({ length: 12 }, (_, i) => `## Section ${i + 1}\n\nSome text for section ${i + 1}.`);
  await page.getByPlaceholder('Write GitHub Flavoured Markdown here...').fill(['# Notes', ...sections, 'The last line.'].join('\n\n'));
  await page.getByRole('button', { name: 'Preview' }).click();
  await page.getByText('The last line.').scrollIntoViewIfNeeded();
};
