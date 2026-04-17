const REPO = 'https://github.com/akeboshiwind/akeboshiwind.github.io';
const BRANCH = process.env.HISTORY_BRANCH || 'master';

export function historyFromPath(repoPath) {
  return `${REPO}/commits/${BRANCH}/${repoPath}`;
}

export function historyFromPagePath(pathname) {
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  return historyFromPath(`src/pages/${slug}`);
}
