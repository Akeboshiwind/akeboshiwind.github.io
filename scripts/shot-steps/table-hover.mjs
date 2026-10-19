// npm run shot -- /markdown-table/ --width 1280 --steps scripts/shot-steps/table-hover.mjs
import openEditor from './table-editor.mjs';

export default async (page, context) => {
  await openEditor(page, context);
  await page.getByLabel('Row 3, column 2').hover();
};
