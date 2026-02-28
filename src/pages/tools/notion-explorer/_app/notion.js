// In dev mode, requests go through the Vite proxy at /notion-proxy which
// forwards to https://api.notion.com/v1, bypassing CORS restrictions.
// In production builds, direct API calls to Notion will fail with a CORS
// error — this tool is intended for local development use.
const NOTION_API_BASE = import.meta.env.DEV
  ? '/notion-proxy'
  : 'https://api.notion.com/v1';

const NOTION_VERSION = '2022-06-28';

function makeHeaders(apiKey) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };
}

async function notionFetch(apiKey, path, options = {}) {
  const url = `${NOTION_API_BASE}${path}`;
  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers: { ...makeHeaders(apiKey), ...options.headers },
    });
  } catch {
    const err = new Error(
      import.meta.env.DEV
        ? 'Could not reach the Notion API via the local proxy. Make sure `npm run dev` is running.'
        : 'The Notion API cannot be called directly from the browser (CORS restriction). Run `npm run dev` to use this tool locally.'
    );
    err.isCorsError = true;
    throw err;
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const err = new Error(body.message || `Notion API error: ${response.status}`);
    err.status = response.status;
    throw err;
  }

  return response.json();
}

export async function searchNotion(apiKey, query, filterType = null) {
  const body = {};
  if (query) body.query = query;
  if (filterType) body.filter = { value: filterType, property: 'object' };
  return notionFetch(apiKey, '/search', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function listDatabases(apiKey) {
  return notionFetch(apiKey, '/search', {
    method: 'POST',
    body: JSON.stringify({
      filter: { value: 'database', property: 'object' },
      sort: { direction: 'descending', timestamp: 'last_edited_time' },
    }),
  });
}

export async function queryDatabase(apiKey, databaseId, pageSize = 20) {
  return notionFetch(apiKey, `/databases/${databaseId}/query`, {
    method: 'POST',
    body: JSON.stringify({ page_size: pageSize }),
  });
}

export async function getPage(apiKey, pageId) {
  return notionFetch(apiKey, `/pages/${pageId}`);
}

export async function getBlockChildren(apiKey, blockId) {
  return notionFetch(apiKey, `/blocks/${blockId}/children?page_size=100`);
}
