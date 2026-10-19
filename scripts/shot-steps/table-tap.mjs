// npm run shot -- /markdown-table/ --width 390 --touch --steps scripts/shot-steps/table-tap.mjs
import openEditor from './table-editor.mjs';

export default async (page, context) => {
  await openEditor(page, context);
  const cell = page.getByLabel('Row 2, column 1');
  await (context.touch ? cell.tap() : cell.click());
};
