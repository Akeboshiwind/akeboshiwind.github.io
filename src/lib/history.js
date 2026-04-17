const REPO = 'https://github.com/akeboshiwind/akeboshiwind.github.io';
const BRANCH = process.env.HISTORY_BRANCH || 'master';

export function historyFromPath(repoPath) {
  return `${REPO}/commits/${BRANCH}/${repoPath}`;
}

export function historyFromPagePath(pathname) {
  const base = import.meta.env.BASE_URL;
  let rest = pathname;
  if (base && rest.startsWith(base)) rest = rest.slice(base.length);
  const slug = rest.replace(/^\/+|\/+$/g, '');
  return historyFromPath(`src/pages/${slug}`);
}
