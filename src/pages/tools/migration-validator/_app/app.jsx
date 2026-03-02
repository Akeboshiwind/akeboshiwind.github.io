import { useState, useMemo, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./app.css";

const LS_PREFIX = "migrationValidator_";

function useLocalStorage(key, initialValue) {
  const fullKey = LS_PREFIX + key;
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(fullKey);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(fullKey, JSON.stringify(value));
    } catch {}
  }, [value, fullKey]);
  return [value, setValue];
}

const PHASES = [
  { id: "counts", label: "Counts", icon: "⊞" },
  { id: "spotcheck", label: "Spot Check", icon: "⊡" },
  { id: "realworld", label: "Live Test", icon: "◎" },
  { id: "edgecases", label: "Edge Cases", icon: "◇" },
  { id: "uplock", label: "Uplock", icon: "◈" },
  { id: "cutover", label: "Cutover", icon: "⊙" },
];

const SPOT_CHECK_CATEGORIES = [
  { id: "frequent", label: "Frequently used", desc: "Email, bank, social media", target: 4 },
  { id: "totp", label: "With TOTP codes", desc: "Verify codes match simultaneously", target: 3 },
  { id: "special", label: "Special chars in password", desc: "Symbols, unicode, emoji", target: 3 },
  { id: "long", label: "Long passwords (40+ chars)", desc: "Check for truncation", target: 2 },
  { id: "multiurl", label: "Multiple URLs", desc: "Check all domains work", target: 2 },
  { id: "custom", label: "Custom fields", desc: "Check if data landed in notes", target: 2 },
  { id: "notes", label: "With notes", desc: "Verify notes content preserved", target: 2 },
  { id: "passkey", label: "Passkey login", desc: "If you have any", target: 1 },
  { id: "recent", label: "Recently added", desc: "Last week or so", target: 2 },
];

const UPLOCK_TYPES = [
  { id: "notes", label: "Secure Notes", icon: "📝", tip: "Copy-paste content from Bitwarden" },
  { id: "cards", label: "Cards", icon: "💳", tip: "Use Smart Fill — point camera at card" },
  { id: "identities", label: "Identities", icon: "🪪", tip: "Use Smart Fill for physical documents" },
  { id: "attachments", label: "File Attachments", icon: "📎", tip: "Download from Bitwarden web vault first" },
];

const CUTOVER_STEPS = [
  { id: "autofill", label: "Set Apple Passwords as autofill provider" },
  { id: "disable_bw", label: "Disable Bitwarden autofill (keep app installed)" },
  { id: "extension", label: "Install iCloud Passwords browser extension if needed" },
  { id: "parallel", label: "Run both in parallel for 1-2 weeks" },
  { id: "deactivate", label: "After parallel period — deactivate Bitwarden" },
];

const EDGE_CASES = [
  { id: "multi_url_autofill", label: "Multi-URL logins autofill on all domains" },
  { id: "custom_fields_fate", label: "Custom fields — check if in Notes or lost" },
  { id: "non_http", label: "Non-http URIs (androidapp://, etc) — likely lost" },
  { id: "cards_wallet", label: "Cards — check if in Apple Wallet or dropped" },
  { id: "identities_fate", label: "Identities — check if transferred anywhere" },
];

const DEFECT_THRESHOLDS = [
  { rate: 0.01, label: "1%", desc: "1-in-100 broken" },
  { rate: 0.05, label: "5%", desc: "1-in-20 broken" },
  { rate: 0.10, label: "10%", desc: "1-in-10 broken" },
  { rate: 0.20, label: "20%", desc: "1-in-5 broken" },
];

function ConfidenceMeter({ passedCount, failedCount }) {
  const confidences = DEFECT_THRESHOLDS.map(t => ({
    ...t,
    confidence: failedCount > 0 ? null : 1 - Math.pow(1 - t.rate, passedCount),
  }));

  const headline = failedCount > 0 ? null : 1 - Math.pow(1 - 0.05, passedCount);
  const headlinePct = headline !== null ? Math.min(headline * 100, 99.99) : 0;
  const samplesFor90at5 = Math.ceil(Math.log(1 - 0.90) / Math.log(1 - 0.05));
  const samplesFor95at5 = Math.ceil(Math.log(1 - 0.95) / Math.log(1 - 0.05));

  const headlineColor = headlinePct >= 95 ? "text-green-600 dark:text-green-400"
    : headlinePct >= 80 ? "text-blue-600 dark:text-blue-400"
    : headlinePct >= 50 ? "text-amber-600 dark:text-amber-500"
    : "text-gray-400 dark:text-gray-500";

  const barColor = headlinePct >= 95 ? "bg-green-500"
    : headlinePct >= 80 ? "bg-blue-500"
    : headlinePct >= 50 ? "bg-amber-500"
    : "bg-gray-300 dark:bg-gray-600";

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
      <div className="flex justify-between items-start mb-4 gap-4">
        <div>
          <div className="text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-1">
            Detection Confidence
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {failedCount > 0
              ? "Failures detected — defect rate is non-zero. Fix issues before continuing."
              : passedCount === 0
              ? "Start checking entries to build confidence."
              : `With ${passedCount} passed check${passedCount !== 1 ? "s" : ""} and 0 failures:`}
          </div>
        </div>
        {failedCount > 0 ? (
          <div className="flex-shrink-0 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2 text-center">
            <div className="text-red-600 dark:text-red-400 text-xl font-bold">!</div>
            <div className="text-red-600 dark:text-red-400 text-xs font-bold">{failedCount} FAIL{failedCount > 1 ? "S" : ""}</div>
          </div>
        ) : (
          <div className="flex-shrink-0 text-right">
            <div className={`text-3xl font-bold tabular-nums ${headlineColor}`}>
              {passedCount === 0 ? "—" : `${headlinePct.toFixed(1)}%`}
            </div>
            <div className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">at 5% defect rate</div>
          </div>
        )}
      </div>

      {failedCount === 0 && (
        <div className="mb-4">
          <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${headlinePct}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-400 dark:text-gray-500">
            <span>0%</span>
            <span className={headlinePct >= 90 ? "text-green-500 font-medium" : ""}>90%</span>
            <span className={headlinePct >= 95 ? "text-green-500 font-medium" : ""}>95%</span>
          </div>
        </div>
      )}

      {passedCount > 0 && failedCount === 0 && (
        <div className="grid grid-cols-4 gap-2">
          {confidences.map(c => {
            const pct = c.confidence !== null ? c.confidence * 100 : 0;
            const color = pct >= 95 ? "text-green-600 dark:text-green-400"
              : pct >= 80 ? "text-blue-600 dark:text-blue-400"
              : pct >= 50 ? "text-amber-600 dark:text-amber-500"
              : "text-gray-400 dark:text-gray-500";
            return (
              <div key={c.label} className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-center">
                <div className={`text-base font-bold tabular-nums ${color}`}>
                  {pct >= 99.99 ? ">99.9" : pct.toFixed(1)}%
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">if {c.label} broken</div>
                <div className="text-gray-400 dark:text-gray-500 text-xs">{c.desc}</div>
              </div>
            );
          })}
        </div>
      )}

      {passedCount > 0 && passedCount < samplesFor95at5 && failedCount === 0 && (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
          {passedCount < samplesFor90at5
            ? `${samplesFor90at5 - passedCount} more passing checks for 90% confidence at 5% defect rate. ~15–20 is pragmatically sufficient.`
            : `${samplesFor95at5 - passedCount} more for 95% confidence at 5% defect rate.`}
        </p>
      )}

      {passedCount >= samplesFor95at5 && failedCount === 0 && (
        <p className="mt-3 text-sm text-green-600 dark:text-green-400 font-semibold">
          ✓ Statistically robust — 95%+ confidence of catching a 5% defect rate.
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const cls = {
    pass: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
    fail: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
    warn: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 border-amber-200 dark:border-amber-800",
    pending: "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600",
  };
  const text = { pass: "PASS", fail: "FAIL", warn: "WARN", pending: "—" };
  const s = cls[status] || cls.pending;
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold tracking-wide border ${s}`}>
      {text[status] || "—"}
    </span>
  );
}

const inputCls = "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 w-full";

function CountRow({ label, bwValue, apValue, onBwChange, onApChange, tolerance = 0.05 }) {
  const bw = parseInt(bwValue) || 0;
  const ap = parseInt(apValue) || 0;
  const filled = bwValue !== "" && apValue !== "";
  let status = "pending";
  if (filled) {
    if (bw === 0 && ap === 0) status = "pass";
    else if (bw === 0) status = ap > 0 ? "warn" : "pass";
    else {
      const diff = Math.abs(ap - bw) / bw;
      status = diff <= tolerance ? "pass" : diff <= 0.15 ? "warn" : "fail";
    }
  }
  return (
    <div className="grid grid-cols-[1fr_100px_100px_70px] gap-3 items-center py-2.5 border-b border-gray-100 dark:border-gray-700">
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <input type="number" min="0" placeholder="BW" value={bwValue} onChange={e => onBwChange(e.target.value)} className={inputCls} />
      <input type="number" min="0" placeholder="AP" value={apValue} onChange={e => onApChange(e.target.value)} className={inputCls} />
      <div className="text-center"><StatusBadge status={status} /></div>
    </div>
  );
}

function SpotCheckItem({ item, checked, result, onToggle, onResult }) {
  const bgCls = checked
    ? result === "pass" ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800"
    : result === "fail" ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
    : "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"
    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
  return (
    <div className={`p-3 rounded-lg border transition-all ${bgCls}`}>
      <div className="flex justify-between items-center mb-1">
        <label className="flex items-center gap-2 cursor-pointer flex-1">
          <input type="checkbox" checked={checked} onChange={onToggle} className="accent-blue-600 w-4 h-4" />
          <span className="text-sm text-gray-800 dark:text-gray-200">{item.label}</span>
        </label>
        {checked && (
          <div className="flex gap-1.5">
            <button onClick={() => onResult("pass")}
              className={`px-2.5 py-1 rounded text-sm font-bold border transition-colors ${result === "pass" ? "bg-green-600 text-white border-green-600" : "bg-white dark:bg-gray-700 text-gray-400 border-gray-200 dark:border-gray-600 hover:border-green-400"}`}>✓</button>
            <button onClick={() => onResult("fail")}
              className={`px-2.5 py-1 rounded text-sm font-bold border transition-colors ${result === "fail" ? "bg-red-600 text-white border-red-600" : "bg-white dark:bg-gray-700 text-gray-400 border-gray-200 dark:border-gray-600 hover:border-red-400"}`}>✗</button>
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">{item.desc}</p>
    </div>
  );
}

function NameDiffTool() {
  const [bwNames, setBwNames] = useState("");
  const [apNames, setApNames] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const diff = useMemo(() => {
    const bwSet = new Set(bwNames.split("\n").map(s => s.trim().toLowerCase()).filter(Boolean));
    const apSet = new Set(apNames.split("\n").map(s => s.trim().toLowerCase()).filter(Boolean));
    const missing = [...bwSet].filter(n => !apSet.has(n));
    const extra = [...apSet].filter(n => !bwSet.has(n));
    const matched = [...bwSet].filter(n => apSet.has(n));
    return { missing, extra, matched, bwCount: bwSet.size, apCount: apSet.size };
  }, [bwNames, apNames]);

  const filtered = useMemo(() => {
    if (!searchTerm) return diff;
    const term = searchTerm.toLowerCase();
    return {
      ...diff,
      missing: diff.missing.filter(n => n.includes(term)),
      extra: diff.extra.filter(n => n.includes(term)),
      matched: diff.matched.filter(n => n.includes(term)),
    };
  }, [diff, searchTerm]);

  return (
    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">⊟ Name Diff Tool</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        Paste entry names from Bitwarden and Apple Passwords to find what's missing. One name per line.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Bitwarden names</label>
          <textarea value={bwNames} onChange={e => setBwNames(e.target.value)}
            placeholder={"GitHub\nNetflix\nAWS Console"}
            className="w-full h-36 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Apple Passwords names</label>
          <textarea value={apNames} onChange={e => setApNames(e.target.value)}
            placeholder={"github.com\nnetflix.com\nAWS Console"}
            className="w-full h-36 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 resize-y" />
        </div>
      </div>

      {(diff.bwCount > 0 || diff.apCount > 0) && (
        <>
          <input type="text" placeholder="Search names..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-blue-500 mb-3" />

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{diff.matched.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Matched</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{diff.missing.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Missing from AP</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-500">{diff.extra.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Extra in AP</div>
            </div>
          </div>

          {filtered.missing.length > 0 && (
            <div className="mb-3">
              <label className="block text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-1">Missing from Apple Passwords ({filtered.missing.length})</label>
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-3 max-h-40 overflow-y-auto">
                {filtered.missing.map((n, i) => (
                  <div key={i} className="text-sm text-red-700 dark:text-red-300 py-0.5">• {n}</div>
                ))}
              </div>
            </div>
          )}
          {filtered.extra.length > 0 && (
            <div className="mb-3">
              <label className="block text-xs font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-wide mb-1">Extra in Apple Passwords ({filtered.extra.length})</label>
              <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-3 max-h-40 overflow-y-auto">
                {filtered.extra.map((n, i) => (
                  <div key={i} className="text-sm text-amber-700 dark:text-amber-300 py-0.5">• {n}</div>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Note: Matching is case-insensitive and exact. Apple Passwords may use domain names — extras are likely renamed entries, not actual extras.
          </p>
        </>
      )}
    </div>
  );
}

function UplockSection({ items, setItems, type }) {
  const addItem = () => setItems([...items, { name: "", done: false }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, val) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: val };
    setItems(next);
  };
  const doneCount = items.filter(i => i.done).length;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {type.icon} {type.label}
          {items.length > 0 && <span className="text-gray-400 dark:text-gray-500 font-normal"> — {doneCount}/{items.length}</span>}
        </h4>
        <button onClick={addItem}
          className="text-xs px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-medium transition-colors">
          + Add
        </button>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{type.tip}</p>
      {items.map((item, i) => (
        <div key={i} className={`flex gap-2 items-center mb-1.5 transition-opacity ${item.done ? "opacity-50" : ""}`}>
          <input type="checkbox" checked={item.done} onChange={() => updateItem(i, "done", !item.done)}
            className="accent-blue-600 w-3.5 h-3.5 flex-shrink-0" />
          <input type="text" placeholder="Item name…" value={item.name}
            onChange={e => updateItem(i, "name", e.target.value)}
            className={`flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded px-2 py-1 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-1 focus:ring-blue-500 ${item.done ? "line-through" : ""}`} />
          <button onClick={() => removeItem(i)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none px-1 flex-shrink-0">×</button>
        </div>
      ))}
    </div>
  );
}

function ProgressRing({ progress, size = 48, stroke = 4 }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progress / 100) * circ;
  const color = progress === 100 ? "#16a34a" : progress > 60 ? "#2563eb" : "#d97706";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.4s ease" }} />
    </svg>
  );
}

function MigrationValidator() {
  const [activePhase, setActivePhase] = useLocalStorage("activePhase", "counts");

  const [counts, setCounts] = useLocalStorage("counts", {
    logins: { bw: "", ap: "" },
    passkeys: { bw: "", ap: "" },
    totp: { bw: "", ap: "" },
    secureNotes: { bw: "", ap: "" },
    cards: { bw: "", ap: "" },
    identities: { bw: "", ap: "" },
    attachments: { bw: "", ap: "" },
  });

  const [spotChecks, setSpotChecks] = useLocalStorage("spotChecks",
    Object.fromEntries(SPOT_CHECK_CATEGORIES.map(c => [c.id, { items: Array(c.target).fill(null).map(() => ({ checked: false, result: null })) }]))
  );

  const [realWorld, setRealWorld] = useLocalStorage("realWorld", {
    banking: false, email: false, totp_site: false, passkey_site: false, complex_pw: false,
  });

  const [edgeCases, setEdgeCases] = useLocalStorage("edgeCases",
    Object.fromEntries(EDGE_CASES.map(e => [e.id, { checked: false, result: null }]))
  );

  const [uplockItems, setUplockItems] = useLocalStorage("uplockItems",
    Object.fromEntries(UPLOCK_TYPES.map(t => [t.id, []]))
  );

  const [cutoverSteps, setCutoverSteps] = useLocalStorage("cutoverSteps",
    Object.fromEntries(CUTOVER_STEPS.map(s => [s.id, false]))
  );

  const progress = useMemo(() => {
    const phases = {};

    const countFields = Object.values(counts);
    const filledCount = countFields.filter(c => c.bw !== "" && c.ap !== "").length;
    phases.counts = Math.round((filledCount / countFields.length) * 100);

    const totalTarget = SPOT_CHECK_CATEGORIES.reduce((s, c) => s + c.target, 0);
    const totalDone = Object.values(spotChecks).reduce((s, cat) =>
      s + cat.items.filter(i => i.checked && i.result).length, 0);
    phases.spotcheck = Math.round((totalDone / totalTarget) * 100);

    const rwDone = Object.values(realWorld).filter(Boolean).length;
    phases.realworld = Math.round((rwDone / Object.keys(realWorld).length) * 100);

    const ecDone = Object.values(edgeCases).filter(e => e.checked && e.result).length;
    phases.edgecases = Math.round((ecDone / EDGE_CASES.length) * 100);

    const uplockTotal = Object.values(uplockItems).reduce((s, arr) => s + arr.length, 0);
    const uplockDone = Object.values(uplockItems).reduce((s, arr) => s + arr.filter(i => i.done).length, 0);
    phases.uplock = uplockTotal === 0 ? 0 : Math.round((uplockDone / uplockTotal) * 100);

    const cutDone = Object.values(cutoverSteps).filter(Boolean).length;
    phases.cutover = Math.round((cutDone / CUTOVER_STEPS.length) * 100);

    const overall = Math.round(Object.values(phases).reduce((s, v) => s + v, 0) / 6);
    return { ...phases, overall };
  }, [counts, spotChecks, realWorld, edgeCases, uplockItems, cutoverSteps]);

  const feedback = useMemo(() => {
    const msgs = [];
    const loginBw = parseInt(counts.logins.bw) || 0;
    const loginAp = parseInt(counts.logins.ap) || 0;
    if (counts.logins.bw && counts.logins.ap) {
      if (loginBw > 0 && loginAp === 0) msgs.push({ type: "fail", text: "No logins in Apple Passwords — CXP transfer may have failed entirely." });
      else if (loginBw > 0 && Math.abs(loginAp - loginBw) / loginBw > 0.15)
        msgs.push({ type: "fail", text: `Login count mismatch: ${loginBw} in BW vs ${loginAp} in AP (>15% difference). Use the name diff tool to find what's missing.` });
      else if (loginBw > 0 && Math.abs(loginAp - loginBw) / loginBw > 0.05)
        msgs.push({ type: "warn", text: `Login count slightly off: ${loginBw} in BW vs ${loginAp} in AP. Multi-URL entries may have split. Check the diff tool.` });
      else msgs.push({ type: "pass", text: `Login counts match: ${loginBw} → ${loginAp}` });
    }

    const totpBw = parseInt(counts.totp.bw) || 0;
    const totpAp = parseInt(counts.totp.ap) || 0;
    if (counts.totp.bw && counts.totp.ap && totpBw > 0) {
      if (totpAp < totpBw) msgs.push({ type: "warn", text: `${totpBw - totpAp} TOTP codes may not have transferred. Verify critical ones generate matching codes.` });
      else msgs.push({ type: "pass", text: `TOTP codes: ${totpAp} transferred (expected ${totpBw})` });
    }

    const failures = Object.values(spotChecks).flatMap(c => c.items).filter(i => i.result === "fail").length;
    if (failures > 0) msgs.push({ type: "fail", text: `${failures} spot check failure${failures > 1 ? "s" : ""} found. Investigate before proceeding with cutover.` });

    const noteCount = parseInt(counts.secureNotes.bw) || 0;
    const cardCount = parseInt(counts.cards.bw) || 0;
    const identCount = parseInt(counts.identities.bw) || 0;
    const attachCount = parseInt(counts.attachments.bw) || 0;
    const manualTotal = noteCount + cardCount + identCount + attachCount;
    if (manualTotal > 0) {
      const uplockAdded = Object.values(uplockItems).reduce((s, arr) => s + arr.length, 0);
      const uplockDone = Object.values(uplockItems).reduce((s, arr) => s + arr.filter(i => i.done).length, 0);
      if (uplockAdded === 0) msgs.push({ type: "warn", text: `You have ${manualTotal} items in Bitwarden that need manual Uplock migration. Add them in the Uplock tab.` });
      else if (uplockDone < uplockAdded) msgs.push({ type: "warn", text: `${uplockAdded - uplockDone} Uplock items still pending.` });
      else msgs.push({ type: "pass", text: `All ${uplockDone} Uplock items migrated.` });
    }

    const spotDone = Object.values(spotChecks).flatMap(c => c.items).filter(i => i.checked && i.result === "pass").length;
    const readyForCutover = failures === 0 && spotDone >= 10 && progress.counts === 100;
    if (readyForCutover && progress.uplock >= 100)
      msgs.push({ type: "pass", text: "Ready for cutover! Proceed to Phase 6." });
    else if (readyForCutover)
      msgs.push({ type: "warn", text: "Passwords look good. Finish Uplock migration before cutover." });

    return msgs;
  }, [counts, spotChecks, uplockItems, progress]);

  const updateCount = (key, field, value) => {
    setCounts(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const updateSpotCheck = (catId, idx, field, value) => {
    setSpotChecks(prev => {
      const next = { ...prev };
      const items = [...next[catId].items];
      items[idx] = { ...items[idx], [field]: value };
      next[catId] = { items };
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <a href="../" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mb-1 block transition-colors">← Tools</a>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Migration Validator</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Bitwarden → Apple Passwords + Uplock</p>
          </div>
          <div className="flex items-center gap-3">
            <ProgressRing progress={progress.overall} />
            <div className="text-right">
              <div className={`text-xl font-bold tabular-nums ${progress.overall === 100 ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}`}>
                {progress.overall}%
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback bar */}
      {feedback.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-3xl mx-auto px-4 py-2.5 space-y-1">
            {feedback.map((msg, i) => (
              <div key={i} className={`flex gap-2 items-start text-sm ${msg.type === "fail" ? "text-red-600 dark:text-red-400" : msg.type === "warn" ? "text-amber-600 dark:text-amber-500" : "text-green-600 dark:text-green-400"}`}>
                <span className="flex-shrink-0">{msg.type === "fail" ? "✗" : msg.type === "warn" ? "⚠" : "✓"}</span>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Phase nav */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 flex overflow-x-auto">
          {PHASES.map(phase => (
            <button key={phase.id} onClick={() => setActivePhase(phase.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activePhase === phase.id ? "border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"}`}>
              <span>{phase.icon}</span>
              <span>{phase.label}</span>
              {progress[phase.id] === 100 && <span className="text-green-500 text-xs ml-0.5">✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Phase 1: Counts */}
        {activePhase === "counts" && (
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">Phase 1: Count Validation</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Compare item counts side by side. BW = Bitwarden web vault, AP = Apple Passwords app.
            </p>

            <div className="grid grid-cols-[1fr_100px_100px_70px] gap-3 pb-1.5 mb-1">
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Item type</span>
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Bitwarden</span>
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Apple PW</span>
              <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide text-center">Status</span>
            </div>

            <div className="mb-6">
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide py-2">Should have transferred</div>
              <CountRow label="Logins" bwValue={counts.logins.bw} apValue={counts.logins.ap}
                onBwChange={v => updateCount("logins", "bw", v)} onApChange={v => updateCount("logins", "ap", v)} />
              <CountRow label="Passkeys" bwValue={counts.passkeys.bw} apValue={counts.passkeys.ap}
                onBwChange={v => updateCount("passkeys", "bw", v)} onApChange={v => updateCount("passkeys", "ap", v)} />
              <CountRow label="TOTP codes" bwValue={counts.totp.bw} apValue={counts.totp.ap}
                onBwChange={v => updateCount("totp", "bw", v)} onApChange={v => updateCount("totp", "ap", v)} />
            </div>

            <div>
              <div className="text-xs font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-wide py-2">Won't transfer — need Uplock</div>
              {["secureNotes", "cards", "identities", "attachments"].map(key => (
                <div key={key} className="grid grid-cols-[1fr_100px_1fr_70px] gap-3 items-center py-2.5 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-amber-700 dark:text-amber-400">
                    {key === "secureNotes" ? "Secure Notes" : key === "cards" ? "Cards" : key === "identities" ? "Identities" : "Attachments"}
                  </span>
                  <input type="number" min="0" placeholder="BW" value={counts[key].bw}
                    onChange={e => updateCount(key, "bw", e.target.value)}
                    className={inputCls} />
                  <span className="text-sm text-gray-400 dark:text-gray-500">→ Uplock</span>
                  <div className="text-center">
                    {counts[key].bw && parseInt(counts[key].bw) > 0
                      ? <StatusBadge status="warn" />
                      : counts[key].bw !== "" ? <StatusBadge status="pass" /> : <StatusBadge status="pending" />}
                  </div>
                </div>
              ))}
            </div>

            <NameDiffTool />
          </div>
        )}

        {/* Phase 2: Spot Checks */}
        {activePhase === "spotcheck" && (
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">Phase 2: Spot Check Passwords</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Check each item, then mark ✓ or ✗. For each: verify URL, username, password, TOTP, and notes match.
            </p>
            <ConfidenceMeter
              passedCount={Object.values(spotChecks).flatMap(c => c.items).filter(i => i.result === "pass").length}
              failedCount={Object.values(spotChecks).flatMap(c => c.items).filter(i => i.result === "fail").length}
            />

            {SPOT_CHECK_CATEGORIES.map(cat => (
              <div key={cat.id} className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{cat.label} ({cat.target})</label>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {spotChecks[cat.id].items.filter(i => i.result === "pass").length}/{cat.target} passed
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {spotChecks[cat.id].items.map((item, i) => (
                    <SpotCheckItem key={i} item={{ ...cat, label: `${cat.label} #${i + 1}`, desc: cat.desc }}
                      checked={item.checked} result={item.result}
                      onToggle={() => updateSpotCheck(cat.id, i, "checked", !item.checked)}
                      onResult={(r) => updateSpotCheck(cat.id, i, "result", r)} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phase 3: Real-world */}
        {activePhase === "realworld" && (
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">Phase 3: Live Login Tests</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Actually sign in to these sites using Apple Passwords autofill. This tests the full flow, not just data presence.
            </p>
            {[
              { key: "banking", label: "Banking / financial site", desc: "Verify password and any 2FA" },
              { key: "email", label: "Email account", desc: "Primary email provider" },
              { key: "totp_site", label: "Site with TOTP", desc: "Verify the code works for 2FA" },
              { key: "passkey_site", label: "Passkey login", desc: "If applicable" },
              { key: "complex_pw", label: "Complex password site", desc: "Special chars, long password" },
            ].map(item => (
              <label key={item.key}
                className={`flex gap-3 items-start p-3.5 rounded-xl border mb-2 cursor-pointer transition-all ${realWorld[item.key] ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"}`}>
                <input type="checkbox" checked={realWorld[item.key]}
                  onChange={() => setRealWorld(p => ({ ...p, [item.key]: !p[item.key] }))}
                  className="accent-blue-600 w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Phase 4: Edge Cases */}
        {activePhase === "edgecases" && (
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">Phase 4: Edge Cases</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Check each edge case. Mark ✓ if handled correctly or ✗ if data was lost.
            </p>
            {EDGE_CASES.map(ec => (
              <div key={ec.id}
                className="flex justify-between items-center p-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl mb-2">
                <label className="flex gap-2.5 items-center cursor-pointer flex-1">
                  <input type="checkbox" checked={edgeCases[ec.id].checked}
                    onChange={() => setEdgeCases(p => ({ ...p, [ec.id]: { ...p[ec.id], checked: !p[ec.id].checked } }))}
                    className="accent-blue-600 w-4 h-4 flex-shrink-0" />
                  <span className="text-sm text-gray-800 dark:text-gray-200">{ec.label}</span>
                </label>
                {edgeCases[ec.id].checked && (
                  <div className="flex gap-1.5 ml-3">
                    <button onClick={() => setEdgeCases(p => ({ ...p, [ec.id]: { ...p[ec.id], result: "pass" } }))}
                      className={`px-2.5 py-1 rounded text-sm font-bold border transition-colors ${edgeCases[ec.id].result === "pass" ? "bg-green-600 text-white border-green-600" : "bg-white dark:bg-gray-700 text-gray-400 border-gray-200 dark:border-gray-600 hover:border-green-400"}`}>✓</button>
                    <button onClick={() => setEdgeCases(p => ({ ...p, [ec.id]: { ...p[ec.id], result: "fail" } }))}
                      className={`px-2.5 py-1 rounded text-sm font-bold border transition-colors ${edgeCases[ec.id].result === "fail" ? "bg-red-600 text-white border-red-600" : "bg-white dark:bg-gray-700 text-gray-400 border-gray-200 dark:border-gray-600 hover:border-red-400"}`}>✗</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Phase 5: Uplock */}
        {activePhase === "uplock" && (
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">Phase 5: Uplock Migration</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              Add items from Bitwarden that need manual migration to Uplock. Check them off as you go.
            </p>
            {UPLOCK_TYPES.map(type => (
              <UplockSection key={type.id} type={type}
                items={uplockItems[type.id]}
                setItems={(items) => setUplockItems(p => ({ ...p, [type.id]: items }))} />
            ))}
          </div>
        )}

        {/* Phase 6: Cutover */}
        {activePhase === "cutover" && (
          <div>
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">Phase 6: Cutover</h3>
            {progress.spotcheck < 80 && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl mb-4 text-sm text-amber-700 dark:text-amber-400">
                ⚠ Spot checks are only {progress.spotcheck}% complete. Finish validation before proceeding.
              </div>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Only proceed after all validation passes. These steps are in order.
            </p>
            {CUTOVER_STEPS.map((step, i) => (
              <label key={step.id}
                className={`flex gap-3 items-center p-3.5 rounded-xl border mb-2 cursor-pointer transition-all ${cutoverSteps[step.id] ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"}`}>
                <input type="checkbox" checked={cutoverSteps[step.id]}
                  onChange={() => setCutoverSteps(p => ({ ...p, [step.id]: !p[step.id] }))}
                  className="accent-blue-600 w-4 h-4 flex-shrink-0" />
                <span className="text-sm text-gray-400 dark:text-gray-500 font-semibold w-5 flex-shrink-0">{i + 1}.</span>
                <span className={`text-sm ${cutoverSteps[step.id] ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-200"}`}>{step.label}</span>
              </label>
            ))}

            {progress.cutover === 100 && (
              <div className="mt-5 p-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-center">
                <div className="text-3xl mb-2">✓</div>
                <div className="text-green-700 dark:text-green-400 font-bold">Migration Complete</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Keep Bitwarden installed for 1-2 weeks as a safety net.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<MigrationValidator />);
