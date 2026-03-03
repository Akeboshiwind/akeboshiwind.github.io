import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";

const LS_PREFIX = "vaultCleaner_";

function useLocalStorage(key, defaultValue) {
  const fullKey = LS_PREFIX + key;
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(fullKey);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch { return defaultValue; }
  });
  useEffect(() => {
    try { localStorage.setItem(fullKey, JSON.stringify(value)); } catch {}
  }, [value, fullKey]);
  return [value, setValue];
}

// Proper CSV parser: handles quoted fields, embedded commas, and multi-line values
function parseCSV(text) {
  const result = [];
  let pos = 0;
  const len = text.length;

  function parseField() {
    if (pos >= len) return '';
    if (text[pos] === '"') {
      pos++; // skip opening quote
      let field = '';
      while (pos < len) {
        if (text[pos] === '"') {
          if (pos + 1 < len && text[pos + 1] === '"') { field += '"'; pos += 2; }
          else { pos++; break; }
        } else { field += text[pos++]; }
      }
      return field;
    } else {
      let field = '';
      while (pos < len && text[pos] !== ',' && text[pos] !== '\n' && text[pos] !== '\r') {
        field += text[pos++];
      }
      return field;
    }
  }

  function parseRow() {
    const row = [];
    while (pos < len && text[pos] !== '\n' && text[pos] !== '\r') {
      row.push(parseField());
      if (pos < len && text[pos] === ',') pos++;
      else break;
    }
    while (pos < len && (text[pos] === '\r' || text[pos] === '\n')) pos++;
    return row;
  }

  if (pos >= len) return [];
  const headers = parseRow();
  while (pos < len) {
    if (text[pos] === '\r' || text[pos] === '\n') { pos++; continue; }
    const row = parseRow();
    if (row.some(f => f.length > 0)) {
      const obj = {};
      headers.forEach((h, i) => { obj[h.trim()] = row[i] ?? ''; });
      result.push(obj);
    }
  }
  return result;
}

function getDomain(uri) {
  if (!uri) return null;
  try {
    const url = new URL(uri.startsWith('http') ? uri : 'https://' + uri);
    return url.hostname.replace(/^www\./, '');
  } catch { return null; }
}

function normalizeEntries(raw) {
  return raw
    .filter(r => !r.type || r.type === 'login')
    .map((r, i) => ({
      id: String(i),
      name: r.name || '',
      uri: r.login_uri || '',
      username: r.login_username || '',
      totp: r.login_totp || '',
      notes: r.notes || '',
      folder: r.folder || '',
      domain: getDomain(r.login_uri || ''),
    }));
}

const CATEGORIES = {
  social:        { label: 'Social',        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
  shopping:      { label: 'Shopping',      color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
  finance:       { label: 'Finance',       color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
  work:          { label: 'Work',          color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
  entertainment: { label: 'Entertainment', color: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300' },
  gaming:        { label: 'Gaming',        color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
  dev:           { label: 'Dev / Tech',    color: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  news:          { label: 'News',          color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
  email:         { label: 'Email',         color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' },
  government:    { label: 'Government',    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  health:        { label: 'Health',        color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  travel:        { label: 'Travel',        color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
  other:         { label: 'Other',         color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
};

const DECISIONS = {
  keep:    { label: 'Keep',    icon: '✓', active: 'bg-green-600 text-white', badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  archive: { label: 'Archive', icon: '○', active: 'bg-amber-500 text-white',  badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  delete:  { label: 'Delete',  icon: '✗', active: 'bg-red-600 text-white',   badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  skip:    { label: 'Skip',    icon: '→', active: 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200', badge: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' },
};

async function researchEntry(apiKey, entry) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: 'You help users audit old password vault entries to decide what to keep or delete. Be concise and practical.',
      messages: [{
        role: 'user',
        content: `Entry name: ${entry.name || 'unknown'}\nURL: ${entry.uri || 'none'}\nUsername: ${entry.username || 'unknown'}`,
      }],
      tools: [{
        name: 'service_info',
        description: 'Information about a web service to help decide whether to keep or delete the account',
        input_schema: {
          type: 'object',
          properties: {
            description: { type: 'string', description: '1-2 sentences: what this service is or was' },
            category: { type: 'string', enum: Object.keys(CATEGORIES) },
            still_active: { type: 'string', enum: ['yes', 'no', 'unknown'], description: 'Is this service still operating?' },
            data_risk: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Risk level of personal data being left behind if account is abandoned' },
            advice: { type: 'string', description: 'One practical sentence about what to consider before deleting this account' },
          },
          required: ['description', 'category', 'still_active', 'data_risk'],
        },
      }],
      tool_choice: { type: 'tool', name: 'service_info' },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error: ${response.status}`);
  }
  const data = await response.json();
  const toolUse = data.content.find(c => c.type === 'tool_use' && c.name === 'service_info');
  if (!toolUse) throw new Error('Unexpected API response');
  return toolUse.input;
}

// --- Sub-components ---

function DecisionBadge({ decision }) {
  const cfg = DECISIONS[decision];
  if (!cfg) return null;
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-bold ${cfg.badge}`}>
      {cfg.icon}
    </span>
  );
}

function ImportView({ onImport }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const fileRef = useRef();

  function handleImport() {
    setError('');
    try {
      const raw = parseCSV(text);
      const entries = normalizeEntries(raw);
      if (entries.length === 0) {
        setError('No login entries found. Make sure you exported from Bitwarden as CSV (not JSON).');
        return;
      }
      onImport(text);
    } catch (e) {
      setError('Failed to parse CSV: ' + e.message);
    }
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setText(ev.target.result);
    reader.readAsText(file);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-xl mx-auto px-4 py-10">
        <a href="../" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mb-6 block transition-colors">← Tools</a>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Vault Cleaner</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Review old password entries one by one. Research what each service is, then decide: keep, archive, or delete.
        </p>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">Import Bitwarden export</h2>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3.5 py-3 text-sm text-blue-800 dark:text-blue-300 mb-4">
            <strong>How to export:</strong> vault.bitwarden.com → Tools → Export Vault → File Format: .csv
          </div>

          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Upload file</label>
          <input ref={fileRef} type="file" accept=".csv" onChange={handleFile}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 mb-3 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border file:border-blue-200 dark:file:border-blue-800 file:bg-blue-50 dark:file:bg-blue-900/20 file:text-blue-600 dark:file:text-blue-400 file:text-sm file:font-medium hover:file:bg-blue-100 dark:hover:file:bg-blue-900/40 cursor-pointer" />

          <div className="text-xs text-gray-400 dark:text-gray-500 text-center my-2">or paste CSV text</div>

          <textarea value={text} onChange={e => { setText(e.target.value); setError(''); }}
            placeholder="Paste your Bitwarden .csv export here…"
            className="w-full h-36 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 font-mono outline-none focus:ring-2 focus:ring-blue-500 resize-y mb-3" />

          {error && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>}

          <button onClick={handleImport} disabled={!text.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors">
            Import & Start Review
          </button>
        </div>
      </div>
    </div>
  );
}

function ResearchPanel({ entry, research, onResearch, apiKey }) {
  const res = research[entry.id];
  const isLoading = res?.status === 'loading';

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">AI Research</span>
        <div className="flex gap-2">
          {res?.result && (
            <button onClick={() => onResearch(entry.id)} disabled={isLoading}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              Refresh
            </button>
          )}
          {!res?.result && (
            <button onClick={() => onResearch(entry.id)}
              disabled={isLoading || !apiKey}
              title={!apiKey ? 'Add a Claude API key in settings first' : ''}
              className="text-xs px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors">
              {isLoading ? 'Researching…' : 'Research with AI'}
            </button>
          )}
        </div>
      </div>

      {!apiKey && !res && (
        <p className="text-xs text-gray-400 dark:text-gray-500">Add your Claude API key in settings (gear icon) to enable AI research.</p>
      )}

      {isLoading && (
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <span className="inline-block animate-spin">⟳</span> Looking up {entry.domain || entry.name}…
        </div>
      )}

      {res?.error && (
        <p className="text-sm text-red-600 dark:text-red-400">{res.error}</p>
      )}

      {res?.result && (() => {
        const r = res.result;
        const cat = CATEGORIES[r.category] || CATEGORIES.other;
        const riskColor = r.data_risk === 'high' ? 'text-red-600 dark:text-red-400'
          : r.data_risk === 'medium' ? 'text-amber-600 dark:text-amber-500'
          : 'text-green-600 dark:text-green-400';
        const activeLabel = r.still_active === 'yes' ? 'Still active'
          : r.still_active === 'no' ? 'Defunct'
          : 'Status unknown';
        const activeCls = r.still_active === 'yes' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : r.still_active === 'no' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
        return (
          <div className="space-y-2">
            <div className="flex gap-1.5 flex-wrap items-center">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}>{cat.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${activeCls}`}>{activeLabel}</span>
              <span className={`text-xs font-semibold ${riskColor}`}>
                {r.data_risk.charAt(0).toUpperCase() + r.data_risk.slice(1)} data risk
              </span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{r.description}</p>
            {r.advice && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic border-l-2 border-gray-200 dark:border-gray-600 pl-2">{r.advice}</p>
            )}
          </div>
        );
      })()}
    </div>
  );
}

function EntryDetail({ entry, decision, research, onDecide, onResearch, apiKey, onPrev, onNext, hasPrev, hasNext, position }) {
  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (!entry) return;
      if (e.key === 'k') onDecide(entry.id, 'keep');
      else if (e.key === 'a') onDecide(entry.id, 'archive');
      else if (e.key === 'd') onDecide(entry.id, 'delete');
      else if (e.key === 's') onDecide(entry.id, 'skip');
      else if (e.key === 'ArrowRight' && hasNext) onNext();
      else if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [entry, onDecide, onNext, onPrev, hasPrev, hasNext]);

  const [showNotes, setShowNotes] = useState(false);
  useEffect(() => setShowNotes(false), [entry?.id]);

  if (!entry) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 dark:text-gray-500 text-sm">Select an entry from the list</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-xl mx-auto px-5 py-4">
        {/* Nav */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <button onClick={onPrev} disabled={!hasPrev}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 transition-colors flex items-center gap-1">
            ← Prev
          </button>
          {position && (
            <span className="text-xs text-gray-400 dark:text-gray-500">{position}</span>
          )}
          <button onClick={onNext} disabled={!hasNext}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 transition-colors flex items-center gap-1">
            Next →
          </button>
        </div>

        {/* Entry info */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug">{entry.name || '(no name)'}</h2>
            {decision && <DecisionBadge decision={decision} />}
          </div>

          {entry.uri ? (
            <a href={entry.uri} target="_blank" rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all block mb-1.5">
              {entry.uri}
            </a>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500 italic block mb-1.5">No URL</span>
          )}

          {entry.username && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{entry.username}</p>
          )}

          <div className="flex gap-1.5 mt-3 flex-wrap">
            {entry.totp && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">TOTP</span>
            )}
            {entry.folder && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">{entry.folder}</span>
            )}
            {entry.notes && (
              <button onClick={() => setShowNotes(s => !s)}
                className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                {showNotes ? 'Hide notes' : 'Notes'}
              </button>
            )}
          </div>

          {showNotes && entry.notes && (
            <pre className="mt-3 text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 max-h-36 overflow-y-auto border border-gray-100 dark:border-gray-700">
              {entry.notes}
            </pre>
          )}
        </div>

        {/* Research */}
        <ResearchPanel entry={entry} research={research} onResearch={onResearch} apiKey={apiKey} />

        {/* Decision buttons */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {Object.entries(DECISIONS).map(([key, cfg]) => (
            <button key={key} onClick={() => onDecide(entry.id, key)}
              className={`py-3 rounded-xl text-sm font-bold transition-colors ${decision === key ? cfg.active + ' ring-2 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-900 ring-current' : decision ? 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'}`}>
              {cfg.label}
            </button>
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 dark:text-gray-500">
          k · keep &nbsp; a · archive &nbsp; d · delete &nbsp; s · skip &nbsp; ← → navigate
        </p>
      </div>
    </div>
  );
}

// --- Main app ---

export default function VaultCleaner() {
  const [rawCSV, setRawCSV] = useLocalStorage('csv', '');
  const [decisions, setDecisions] = useLocalStorage('decisions', {});
  const [researchCache, setResearchCache] = useLocalStorage('research', {});
  const [apiKey, setApiKey] = useLocalStorage('apiKey', '');
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState('unreviewed');
  const [search, setSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const settingsRef = useRef();

  // Close settings on outside click
  useEffect(() => {
    function handler(e) {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setShowSettings(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const entries = useMemo(() => {
    if (!rawCSV) return [];
    try { return normalizeEntries(parseCSV(rawCSV)); } catch { return []; }
  }, [rawCSV]);

  const domainCount = useMemo(() => {
    const counts = {};
    entries.forEach(e => { if (e.domain) counts[e.domain] = (counts[e.domain] || 0) + 1; });
    return counts;
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let list = [...entries];
    if (filter === 'unreviewed') list = list.filter(e => !decisions[e.id]);
    else if (filter === 'keep') list = list.filter(e => decisions[e.id] === 'keep');
    else if (filter === 'archive') list = list.filter(e => decisions[e.id] === 'archive');
    else if (filter === 'delete') list = list.filter(e => decisions[e.id] === 'delete');
    else if (filter === 'nourl') list = list.filter(e => !e.uri);
    else if (filter === 'dupes') list = list.filter(e => e.domain && domainCount[e.domain] > 1);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        e.name.toLowerCase().includes(q) ||
        (e.domain && e.domain.includes(q)) ||
        (e.username && e.username.toLowerCase().includes(q))
      );
    }
    list.sort((a, b) => {
      const da = (a.domain || a.name).toLowerCase();
      const db = (b.domain || b.name).toLowerCase();
      return da.localeCompare(db);
    });
    return list;
  }, [entries, decisions, filter, search, domainCount]);

  const stats = useMemo(() => {
    const decided = Object.keys(decisions).filter(id => entries.find(e => e.id === id));
    return {
      total: entries.length,
      reviewed: decided.length,
      keep: decided.filter(id => decisions[id] === 'keep').length,
      archive: decided.filter(id => decisions[id] === 'archive').length,
      delete: decided.filter(id => decisions[id] === 'delete').length,
      noUrl: entries.filter(e => !e.uri).length,
      dupes: entries.filter(e => e.domain && domainCount[e.domain] > 1).length,
    };
  }, [entries, decisions, domainCount]);

  const selectedEntry = entries.find(e => e.id === selectedId) || null;
  const selectedIdx = filteredEntries.findIndex(e => e.id === selectedId);

  // Auto-select first entry when filter changes or on load
  useEffect(() => {
    if (filteredEntries.length > 0 && (!selectedId || !filteredEntries.find(e => e.id === selectedId))) {
      setSelectedId(filteredEntries[0].id);
    }
  }, [filter, filteredEntries]);

  const handleDecide = useCallback((id, decision) => {
    setDecisions(prev => ({ ...prev, [id]: decision }));
    if (filter === 'unreviewed') {
      // Advance to next unreviewed after deciding
      const remaining = filteredEntries.filter(e => e.id !== id);
      const idx = filteredEntries.findIndex(e => e.id === id);
      if (remaining.length > 0) {
        setSelectedId(remaining[Math.min(idx, remaining.length - 1)].id);
      }
    }
  }, [setDecisions, filteredEntries, filter]);

  const handleResearch = useCallback(async (id) => {
    if (!apiKey) return;
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    setResearchCache(prev => ({ ...prev, [id]: { status: 'loading' } }));
    try {
      const result = await researchEntry(apiKey, entry);
      setResearchCache(prev => ({ ...prev, [id]: { status: 'done', result } }));
    } catch (e) {
      setResearchCache(prev => ({ ...prev, [id]: { status: 'error', error: e.message } }));
    }
  }, [apiKey, entries, setResearchCache]);

  function downloadText(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  function exportDeleteList() {
    const toDelete = entries.filter(e => decisions[e.id] === 'delete');
    const lines = toDelete.map(e => [e.name, e.username, e.uri || 'no URL'].filter(Boolean).join(' | '));
    downloadText(lines.join('\n'), 'vault-to-delete.txt');
  }

  if (!rawCSV) return <ImportView onImport={csv => setRawCSV(csv)} />;

  const filterTabs = [
    { id: 'unreviewed', label: 'Unreviewed', count: stats.total - stats.reviewed },
    { id: 'all',        label: 'All',        count: stats.total },
    { id: 'nourl',      label: 'No URL',     count: stats.noUrl },
    { id: 'dupes',      label: 'Duplicates', count: stats.dupes },
    { id: 'keep',       label: 'Keep',       count: stats.keep },
    { id: 'archive',    label: 'Archive',    count: stats.archive },
    { id: 'delete',     label: 'Delete',     count: stats.delete },
  ];

  const progressPct = stats.total ? Math.round((stats.reviewed / stats.total) * 100) : 0;

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <a href="../" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">← Tools</a>
            <span className="text-gray-200 dark:text-gray-700">|</span>
            <h1 className="font-bold text-gray-900 dark:text-gray-100">Vault Cleaner</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">
              <span className="font-semibold text-gray-900 dark:text-gray-100">{stats.reviewed}</span>/{stats.total} reviewed
              {stats.delete > 0 && <span className="ml-2 text-red-600 dark:text-red-400">· {stats.delete} to delete</span>}
            </div>

            {stats.delete > 0 && (
              <button onClick={exportDeleteList}
                className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                Export delete list
              </button>
            )}

            <div ref={settingsRef} className="relative">
              <button onClick={() => { setShowSettings(s => !s); setApiKeyInput(apiKey); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>

              {showSettings && (
                <div className="absolute right-0 mt-1 w-72 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4 z-10">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Claude API Key</div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Used for AI research. Get one at console.anthropic.com. Stored locally, never sent anywhere else.</p>
                  <input type="password" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)}
                    placeholder="sk-ant-…"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 mb-2" />
                  <button onClick={() => { setApiKey(apiKeyInput); setShowSettings(false); }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 rounded-lg text-sm transition-colors mb-3">
                    Save
                  </button>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-3">
                    <button onClick={() => { if (window.confirm('Clear all data and start over?')) { setRawCSV(''); setDecisions({}); setResearchCache({}); setShowSettings(false); } }}
                      className="w-full text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 py-1 text-center transition-colors">
                      Reset — clear all data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100 dark:bg-gray-700">
          <div className="h-full bg-blue-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left panel: list */}
        <div className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
          <div className="p-2.5 border-b border-gray-100 dark:border-gray-700">
            <input type="text" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div className="flex flex-wrap gap-1 p-2 border-b border-gray-100 dark:border-gray-700">
            {filterTabs.map(tab => (
              <button key={tab.id} onClick={() => { setFilter(tab.id); }}
                className={`text-xs px-2 py-0.5 rounded font-medium transition-colors ${filter === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                {tab.label}{tab.count > 0 ? ` ${tab.count}` : ''}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">No entries</div>
            ) : filteredEntries.map(entry => (
              <button key={entry.id} onClick={() => setSelectedId(entry.id)}
                className={`w-full text-left px-3 py-2 border-b border-gray-100 dark:border-gray-700 flex items-start gap-2 transition-colors ${selectedId === entry.id ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate leading-tight">{entry.name || '(no name)'}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                    {entry.domain || (entry.uri ? entry.uri : 'no URL')}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 flex-shrink-0 mt-0.5">
                  {decisions[entry.id] && <DecisionBadge decision={decisions[entry.id]} />}
                  {!entry.uri && <span className="text-xs text-gray-300 dark:text-gray-600" title="No URL">∅</span>}
                  {entry.domain && domainCount[entry.domain] > 1 && (
                    <span className="text-xs text-amber-400" title="Duplicate domain">×{domainCount[entry.domain]}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right panel: detail */}
        <EntryDetail
          entry={selectedEntry}
          decision={selectedEntry ? decisions[selectedEntry.id] : null}
          research={researchCache}
          onDecide={handleDecide}
          onResearch={handleResearch}
          apiKey={apiKey}
          position={selectedIdx >= 0 ? `${selectedIdx + 1} of ${filteredEntries.length}` : null}
          onPrev={() => { if (selectedIdx > 0) setSelectedId(filteredEntries[selectedIdx - 1].id); }}
          onNext={() => { if (selectedIdx < filteredEntries.length - 1) setSelectedId(filteredEntries[selectedIdx + 1].id); }}
          hasPrev={selectedIdx > 0}
          hasNext={selectedIdx < filteredEntries.length - 1}
        />
      </div>
    </div>
  );
}

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<VaultCleaner />);
