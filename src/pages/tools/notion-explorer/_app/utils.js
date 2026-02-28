// Extract a Notion page/database ID from:
// - https://www.notion.so/Workspace/Title-a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
// - https://www.notion.so/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
// - a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6 (32 hex chars, no hyphens)
// - a1b2c3d4-e5f6-a7b8-c9d0-e1f2a3b4c5d6 (UUID format)
export function extractNotionId(input) {
  if (!input) return null;
  const s = input.trim();

  if (s.startsWith('http')) {
    try {
      const url = new URL(s);
      const segments = url.pathname.split('/').filter(Boolean);
      const last = segments[segments.length - 1];
      const m = last.match(/([a-f0-9]{32})$/i);
      if (m) return toUUID(m[1]);
      const u = last.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
      if (u) return u[0];
    } catch { /* invalid URL */ }
  }

  const noHyphens = s.replace(/-/g, '');
  if (/^[a-f0-9]{32}$/i.test(noHyphens)) return toUUID(noHyphens);

  if (/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(s)) return s;

  return null;
}

function toUUID(hex32) {
  return `${hex32.slice(0, 8)}-${hex32.slice(8, 12)}-${hex32.slice(12, 16)}-${hex32.slice(16, 20)}-${hex32.slice(20)}`;
}

export function getTitle(obj) {
  if (!obj) return 'Untitled';
  if (Array.isArray(obj.title)) {
    return obj.title.map(t => t.plain_text).join('') || 'Untitled';
  }
  if (obj.properties) {
    const titleProp = Object.values(obj.properties).find(p => p.type === 'title');
    if (titleProp?.title?.length > 0) {
      return titleProp.title.map(t => t.plain_text).join('');
    }
  }
  return 'Untitled';
}

export function formatDate(str) {
  if (!str) return '';
  try {
    return new Date(str).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return str;
  }
}

export function richTextToString(richText) {
  return (richText || []).map(t => t.plain_text).join('');
}
