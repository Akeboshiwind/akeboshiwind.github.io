// Azure Log Analytics query helpers

// Public info from xtdb/xtdb repo (terraform.tfvars + main.tf)
export const WORKSPACE_NAME = 'xtdb-bench-cluster-law';
export const RESOURCE_GROUP = 'cloud-benchmark-resources';
export const SUBSCRIPTION_ID = '91804669-c60b-4727-afa2-d7021fe5055b';

// Get a token via: az account get-access-token --resource https://api.loganalytics.io --query accessToken -o tsv
const LA_API = 'https://api.loganalytics.io/v1';

export async function queryLogAnalytics(workspaceId, kql, token, { timespan = 'P14D' } = {}) {
  const url = `${LA_API}/workspaces/${workspaceId}/query`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: kql, timespan }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Log Analytics ${res.status}: ${text}`);
  }
  return res.json();
}

// Convert LA query result to array of objects
export function laResultToRows(result) {
  const table = result?.tables?.[0];
  if (!table) return [];
  const cols = table.columns.map(c => c.name);
  return table.rows.map(row =>
    Object.fromEntries(cols.map((col, i) => [col, row[i]]))
  );
}

// Get workspace GUID from Azure Management API (needs management token)
export async function getWorkspaceId(token) {
  const url = `https://management.azure.com/subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP}/providers/Microsoft.OperationalInsights/workspaces/${WORKSPACE_NAME}?api-version=2023-09-01`;
  const res = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Management API ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.properties?.customerId;
}

// Sample KQL queries for each benchmark type
export const SAMPLE_QUERIES = {
  overview: `
ContainerLog
| where LogEntry startswith "{"
| extend log = parse_json(LogEntry)
| where isnotnull(log.benchmark) and log.stage != "init"
| extend benchmark = tostring(log.benchmark),
         run_id = tostring(log['github-run-id']),
         branch = tostring(log['git-branch']),
         duration_ms = todouble(log['time-taken-ms'])
| where branch == "main"
| summarize TimeGenerated = max(TimeGenerated),
            duration_ms = avg(duration_ms)
    by run_id, benchmark
| order by TimeGenerated desc
| take 100
`.trim(),

  tpch: `
ContainerLog
| where LogEntry startswith "{"
| extend log = parse_json(LogEntry)
| where isnotnull(log.benchmark) and log.stage != "init"
| extend benchmark = tostring(log.benchmark),
         scale_factor = todouble(log.parameters['scale-factor']),
         run_id = tostring(log['github-run-id']),
         branch = tostring(log['git-branch']),
         duration_ms = todouble(log['time-taken-ms'])
| where benchmark == "TPC-H (OLAP)" and scale_factor == 1.0 and branch == "main"
| summarize TimeGenerated = max(TimeGenerated),
            duration_minutes = avg(duration_ms) / 60000
    by run_id
| top 30 by TimeGenerated desc
| order by TimeGenerated asc
`.trim(),

  clickbench: `
ContainerLog
| where LogEntry startswith "{"
| extend log = parse_json(LogEntry)
| where isnotnull(log.benchmark) and log.stage != "init"
| extend benchmark = tostring(log.benchmark),
         run_id = tostring(log['github-run-id']),
         branch = tostring(log['git-branch']),
         duration_ms = todouble(log['time-taken-ms'])
| where benchmark == "Clickbench Hits" and branch == "main"
| summarize TimeGenerated = max(TimeGenerated),
            duration_minutes = avg(duration_ms) / 60000
    by run_id
| top 30 by TimeGenerated desc
| order by TimeGenerated asc
`.trim(),
};
