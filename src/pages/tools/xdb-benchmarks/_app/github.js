// GitHub Actions API helpers for xtdb/xtdb benchmark workflows

const REPO = 'xtdb/xtdb';
const BASE = 'https://api.github.com';

// Nightly benchmark workflow IDs
export const BENCHMARK_WORKFLOWS = [
  { id: 210169003, name: 'AuctionMark',       key: 'auctionmark' },
  { id: 214460250, name: 'ClickBench',         key: 'clickbench' },
  { id: 232672058, name: 'Fusion',             key: 'fusion' },
  { id: 223619706, name: 'Ingest TX Overhead', key: 'ingest-tx-overhead' },
  { id: 225012787, name: 'Patch',              key: 'patch' },
  { id: 225012788, name: 'Products',           key: 'products' },
  { id: 208760327, name: 'Readings',           key: 'readings' },
  { id: 186222960, name: 'TPC-H',              key: 'tpch' },
  { id: 225012789, name: 'TS Devices',         key: 'ts-devices' },
  { id: 221112688, name: 'TSBS IoT',           key: 'tsbs-iot' },
  { id: 204249915, name: 'Yakbench',           key: 'yakbench' },
];

async function ghFetch(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url, {
    headers: { 'Accept': 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${path}`);
  return res.json();
}

export async function fetchWorkflowRuns(workflowId, { perPage = 30 } = {}) {
  const data = await ghFetch(`/repos/${REPO}/actions/workflows/${workflowId}/runs`, {
    per_page: perPage,
    exclude_pull_requests: true,
  });
  return data.workflow_runs.map(r => ({
    id: r.id,
    runNumber: r.run_number,
    status: r.status,
    conclusion: r.conclusion,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    event: r.event,           // 'schedule' | 'workflow_dispatch' | etc.
    headBranch: r.head_branch,
    headSha: r.head_sha,
    htmlUrl: r.html_url,
    name: r.display_title || r.name,
  }));
}

export async function fetchAllBenchmarkRuns({ perPage = 14 } = {}) {
  const results = await Promise.allSettled(
    BENCHMARK_WORKFLOWS.map(async wf => ({
      workflow: wf,
      runs: await fetchWorkflowRuns(wf.id, { perPage }),
    }))
  );
  return results.map((r, i) => ({
    workflow: BENCHMARK_WORKFLOWS[i],
    runs: r.status === 'fulfilled' ? r.value.runs : [],
    error: r.status === 'rejected' ? r.reason.message : null,
  }));
}
