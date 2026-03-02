import { useState, useMemo, useCallback, useEffect } from "react";
import { createRoot } from "react-dom/client";

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

// Confidence calculation: P(catching ≥1 defect) = 1 - (1-d)^n
// where d = assumed defect rate, n = number of passed checks
const DEFECT_THRESHOLDS = [
  { rate: 0.01, label: "1%", desc: "1-in-100 entries broken" },
  { rate: 0.05, label: "5%", desc: "1-in-20 entries broken" },
  { rate: 0.10, label: "10%", desc: "1-in-10 entries broken" },
  { rate: 0.20, label: "20%", desc: "1-in-5 entries broken" },
];

function ConfidenceMeter({ passedCount, failedCount }) {
  const confidences = DEFECT_THRESHOLDS.map(t => ({
    ...t,
    confidence: failedCount > 0 ? null : 1 - Math.pow(1 - t.rate, passedCount),
  }));

  const headline = failedCount > 0 ? null : 1 - Math.pow(1 - 0.05, passedCount);
  const headlinePct = headline !== null ? Math.min(headline * 100, 99.99) : 0;

  const samplesFor90at5 = Math.ceil(Math.log(1 - 0.90) / Math.log(1 - 0.05)); // 45
  const samplesFor95at5 = Math.ceil(Math.log(1 - 0.95) / Math.log(1 - 0.05)); // 59

  return (
    <div style={{
      background: "#0a0a16", border: "1px solid #1e1e3a", borderRadius: 12,
      padding: 20, marginBottom: 20,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ color: "#818cf8", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>
            Detection Confidence
          </div>
          <div style={{ color: "#6b7280", fontSize: 12, lineHeight: 1.5 }}>
            {failedCount > 0
              ? "Failures detected — defect rate is non-zero. Fix issues before continuing."
              : passedCount === 0
              ? "Start checking entries to build confidence."
              : `With ${passedCount} passed check${passedCount !== 1 ? "s" : ""} and 0 failures:`}
          </div>
        </div>
        {failedCount > 0 ? (
          <div style={{
            background: "#2e0a0a", border: "1px solid #7f1d1d", borderRadius: 8,
            padding: "8px 14px", textAlign: "center",
          }}>
            <div style={{ color: "#f87171", fontSize: 20, fontWeight: 800 }}>!</div>
            <div style={{ color: "#f87171", fontSize: 10, fontWeight: 700 }}>{failedCount} FAIL{failedCount > 1 ? "S" : ""}</div>
          </div>
        ) : (
          <div style={{ textAlign: "right" }}>
            <div style={{
              fontSize: 28, fontWeight: 800, fontFamily: "'Space Mono', monospace",
              color: headlinePct >= 95 ? "#34d399" : headlinePct >= 80 ? "#818cf8" : headlinePct >= 50 ? "#fbbf24" : "#6b7280",
              lineHeight: 1,
            }}>
              {passedCount === 0 ? "—" : `${headlinePct.toFixed(1)}%`}
            </div>
            <div style={{ color: "#4b5563", fontSize: 10, marginTop: 2 }}>at 5% defect rate</div>
          </div>
        )}
      </div>

      {failedCount === 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{
            width: "100%", height: 8, background: "#111", borderRadius: 4,
            overflow: "hidden", position: "relative",
          }}>
            <div style={{
              width: `${headlinePct}%`, height: "100%", borderRadius: 4,
              background: headlinePct >= 95 ? "linear-gradient(90deg, #059669, #34d399)"
                : headlinePct >= 80 ? "linear-gradient(90deg, #4338ca, #818cf8)"
                : headlinePct >= 50 ? "linear-gradient(90deg, #b45309, #fbbf24)"
                : "linear-gradient(90deg, #374151, #6b7280)",
              transition: "width 0.5s ease, background 0.5s ease",
            }} />
            {[90, 95].map(pct => (
              <div key={pct} style={{
                position: "absolute", top: 0, left: `${pct}%`, width: 1, height: "100%",
                background: headlinePct >= pct ? "transparent" : "#333",
              }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ color: "#333", fontSize: 10 }}>0%</span>
            <span style={{ color: headlinePct >= 90 ? "#34d399" : "#333", fontSize: 10, position: "relative", left: "-5%" }}>90%</span>
            <span style={{ color: headlinePct >= 95 ? "#34d399" : "#333", fontSize: 10 }}>95%</span>
          </div>
        </div>
      )}

      {passedCount > 0 && failedCount === 0 && (
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6,
        }}>
          {confidences.map(c => {
            const pct = c.confidence !== null ? c.confidence * 100 : 0;
            return (
              <div key={c.label} style={{
                background: "#0c0c14", border: "1px solid #16162a", borderRadius: 8,
                padding: "10px 8px", textAlign: "center",
              }}>
                <div style={{
                  fontSize: 16, fontWeight: 800, fontFamily: "'Space Mono', monospace",
                  color: pct >= 95 ? "#34d399" : pct >= 80 ? "#818cf8" : pct >= 50 ? "#fbbf24" : "#6b7280",
                }}>
                  {pct >= 99.99 ? ">99.9" : pct.toFixed(1)}%
                </div>
                <div style={{ color: "#6b7280", fontSize: 10, marginTop: 2 }}>
                  if {c.label} broken
                </div>
                <div style={{ color: "#333", fontSize: 9, marginTop: 1 }}>
                  {c.desc}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {passedCount > 0 && passedCount < samplesFor95at5 && failedCount === 0 && (
        <div style={{ marginTop: 12, color: "#4b5563", fontSize: 11, lineHeight: 1.6 }}>
          {passedCount < samplesFor90at5
            ? `${samplesFor90at5 - passedCount} more passing checks for 90% confidence at 5% defect rate. For CXP, ~15-20 is pragmatically sufficient.`
            : `${samplesFor95at5 - passedCount} more for 95% confidence at 5% defect rate.`}
        </div>
      )}

      {passedCount >= samplesFor95at5 && failedCount === 0 && (
        <div style={{ marginTop: 12, color: "#34d399", fontSize: 12, fontWeight: 600 }}>
          ✓ Statistically robust — 95%+ confidence of catching a 5% defect rate.
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pass: { bg: "#0a2e1a", color: "#34d399", border: "#166534", text: "PASS" },
    fail: { bg: "#2e0a0a", color: "#f87171", border: "#7f1d1d", text: "FAIL" },
    warn: { bg: "#2e2a0a", color: "#fbbf24", border: "#78350f", text: "WARN" },
    pending: { bg: "#1a1a2e", color: "#818cf8", border: "#312e81", text: "—" },
  };
  const s = styles[status] || styles.pending;
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 4,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "'JetBrains Mono', monospace",
    }}>{s.text}</span>
  );
}

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
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 100px 100px 70px",
      gap: 12, alignItems: "center", padding: "10px 0",
      borderBottom: "1px solid #1e1e2e",
    }}>
      <span style={{ color: "#c4b5fd", fontSize: 14, fontFamily: "'Space Mono', monospace" }}>{label}</span>
      <input type="number" min="0" placeholder="BW" value={bwValue}
        onChange={e => onBwChange(e.target.value)}
        style={inputStyle} />
      <input type="number" min="0" placeholder="AP" value={apValue}
        onChange={e => onApChange(e.target.value)}
        style={inputStyle} />
      <div style={{ textAlign: "center" }}><StatusBadge status={status} /></div>
    </div>
  );
}

function SpotCheckItem({ item, checked, result, onToggle, onResult }) {
  return (
    <div style={{
      padding: "12px 16px", borderRadius: 8,
      background: checked ? (result === "pass" ? "#0a1e14" : result === "fail" ? "#1e0a0a" : "#0f0f1a") : "#0c0c14",
      border: `1px solid ${checked ? (result === "pass" ? "#166534" : result === "fail" ? "#7f1d1d" : "#1e1e3a") : "#16162a"}`,
      transition: "all 0.2s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flex: 1 }}>
          <input type="checkbox" checked={checked} onChange={onToggle}
            style={{ accentColor: "#818cf8", width: 16, height: 16 }} />
          <span style={{ color: "#e2e8f0", fontSize: 14, fontFamily: "'Space Mono', monospace" }}>{item.label}</span>
        </label>
        {checked && (
          <div style={{ display: "flex", gap: 4 }}>
            <button onClick={() => onResult("pass")}
              style={{ ...tinyBtnStyle, background: result === "pass" ? "#166534" : "#111", color: result === "pass" ? "#34d399" : "#555" }}>✓</button>
            <button onClick={() => onResult("fail")}
              style={{ ...tinyBtnStyle, background: result === "fail" ? "#7f1d1d" : "#111", color: result === "fail" ? "#f87171" : "#555" }}>✗</button>
          </div>
        )}
      </div>
      <div style={{ color: "#6b7280", fontSize: 12, marginLeft: 24, fontFamily: "'Space Mono', monospace" }}>{item.desc}</div>
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
    <div style={{ marginTop: 16 }}>
      <h3 style={h3Style}>⊟ Name Diff Tool</h3>
      <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 12, fontFamily: "'Space Mono', monospace" }}>
        Paste entry names from Bitwarden and Apple Passwords to find what's missing. One name per line.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <label style={labelStyle}>Bitwarden names</label>
          <textarea value={bwNames} onChange={e => setBwNames(e.target.value)}
            placeholder={"GitHub\nNetflix\nAWS Console\n…"}
            style={{ ...textareaStyle, height: 140 }} />
        </div>
        <div>
          <label style={labelStyle}>Apple Passwords names</label>
          <textarea value={apNames} onChange={e => setApNames(e.target.value)}
            placeholder={"github.com\nnetflix.com\nAWS Console\n…"}
            style={{ ...textareaStyle, height: 140 }} />
        </div>
      </div>

      {(diff.bwCount > 0 || diff.apCount > 0) && (
        <>
          <input type="text" placeholder="Search names..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ ...inputStyle, width: "100%", marginBottom: 12 }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={statBoxStyle("#312e81")}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#818cf8" }}>{diff.matched.length}</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>Matched</div>
            </div>
            <div style={statBoxStyle("#7f1d1d")}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#f87171" }}>{diff.missing.length}</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>Missing from AP</div>
            </div>
            <div style={statBoxStyle("#78350f")}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fbbf24" }}>{diff.extra.length}</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>Extra in AP</div>
            </div>
          </div>

          {filtered.missing.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ ...labelStyle, color: "#f87171" }}>Missing from Apple Passwords ({filtered.missing.length})</label>
              <div style={{ background: "#1a0a0a", border: "1px solid #7f1d1d", borderRadius: 8, padding: 12, maxHeight: 160, overflowY: "auto" }}>
                {filtered.missing.map((n, i) => (
                  <div key={i} style={{ color: "#fca5a5", fontSize: 13, padding: "3px 0", fontFamily: "'Space Mono', monospace" }}>• {n}</div>
                ))}
              </div>
            </div>
          )}
          {filtered.extra.length > 0 && (
            <div>
              <label style={{ ...labelStyle, color: "#fbbf24" }}>Extra in Apple Passwords ({filtered.extra.length})</label>
              <div style={{ background: "#1a1a0a", border: "1px solid #78350f", borderRadius: 8, padding: 12, maxHeight: 160, overflowY: "auto" }}>
                {filtered.extra.map((n, i) => (
                  <div key={i} style={{ color: "#fde68a", fontSize: 13, padding: "3px 0", fontFamily: "'Space Mono', monospace" }}>• {n}</div>
                ))}
              </div>
            </div>
          )}
          <p style={{ color: "#4b5563", fontSize: 11, marginTop: 8, fontFamily: "'Space Mono', monospace" }}>
            Note: Name matching is case-insensitive and exact. Apple Passwords may use domain names instead of titles — extras are likely renamed entries, not actual extras.
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
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <h4 style={{ color: "#c4b5fd", fontSize: 14, fontFamily: "'Space Mono', monospace", margin: 0 }}>
          {type.icon} {type.label}
          {items.length > 0 && <span style={{ color: "#6b7280", fontWeight: 400 }}> — {doneCount}/{items.length}</span>}
        </h4>
        <button onClick={addItem} style={addBtnStyle}>+ Add</button>
      </div>
      <p style={{ color: "#4b5563", fontSize: 12, marginBottom: 8, fontFamily: "'Space Mono', monospace" }}>{type.tip}</p>
      {items.map((item, i) => (
        <div key={i} style={{
          display: "flex", gap: 8, alignItems: "center", marginBottom: 4,
          opacity: item.done ? 0.5 : 1, transition: "opacity 0.2s",
        }}>
          <input type="checkbox" checked={item.done} onChange={() => updateItem(i, "done", !item.done)}
            style={{ accentColor: "#818cf8", width: 14, height: 14 }} />
          <input type="text" placeholder="Item name…" value={item.name}
            onChange={e => updateItem(i, "name", e.target.value)}
            style={{ ...inputStyle, flex: 1, textDecoration: item.done ? "line-through" : "none" }} />
          <button onClick={() => removeItem(i)}
            style={{ ...tinyBtnStyle, color: "#4b5563", background: "transparent" }}>×</button>
        </div>
      ))}
    </div>
  );
}

function ProgressRing({ progress, size = 48, stroke = 4 }) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progress / 100) * circ;
  const color = progress === 100 ? "#34d399" : progress > 60 ? "#818cf8" : "#fbbf24";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1e1e2e" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.4s ease, stroke 0.4s ease" }} />
    </svg>
  );
}

// Styles
const inputStyle = {
  background: "#0c0c14", border: "1px solid #1e1e3a", borderRadius: 6,
  color: "#e2e8f0", padding: "8px 12px", fontSize: 13, outline: "none",
  fontFamily: "'Space Mono', monospace",
};
const textareaStyle = {
  ...inputStyle, width: "100%", resize: "vertical", boxSizing: "border-box",
};
const labelStyle = {
  display: "block", color: "#818cf8", fontSize: 11, fontWeight: 700,
  marginBottom: 4, letterSpacing: 1, textTransform: "uppercase",
  fontFamily: "'Space Mono', monospace",
};
const h3Style = {
  color: "#e2e8f0", fontSize: 16, fontWeight: 700, marginBottom: 12,
  fontFamily: "'Space Mono', monospace",
};
const tinyBtnStyle = {
  padding: "4px 10px", borderRadius: 4, border: "1px solid #1e1e3a",
  cursor: "pointer", fontSize: 14, fontWeight: 700, transition: "all 0.15s",
};
const addBtnStyle = {
  padding: "4px 14px", borderRadius: 6, border: "1px solid #312e81",
  background: "#1a1a2e", color: "#818cf8", cursor: "pointer", fontSize: 12,
  fontFamily: "'Space Mono', monospace", fontWeight: 600,
};
const statBoxStyle = (borderColor) => ({
  background: "#0c0c14", border: `1px solid ${borderColor}`, borderRadius: 8,
  padding: "12px 8px", textAlign: "center",
});

function MigrationValidator() {
  const [activePhase, setActivePhase] = useLocalStorage("activePhase", "counts");

  // Phase 1: Counts
  const [counts, setCounts] = useLocalStorage("counts", {
    logins: { bw: "", ap: "" },
    passkeys: { bw: "", ap: "" },
    totp: { bw: "", ap: "" },
    secureNotes: { bw: "", ap: "" },
    cards: { bw: "", ap: "" },
    identities: { bw: "", ap: "" },
    attachments: { bw: "", ap: "" },
  });

  // Phase 2: Spot checks
  const [spotChecks, setSpotChecks] = useLocalStorage("spotChecks",
    Object.fromEntries(SPOT_CHECK_CATEGORIES.map(c => [c.id, { items: Array(c.target).fill(null).map(() => ({ checked: false, result: null })) }]))
  );

  // Phase 3: Real-world
  const [realWorld, setRealWorld] = useLocalStorage("realWorld", {
    banking: false, email: false, totp_site: false, passkey_site: false, complex_pw: false,
  });

  // Phase 4: Edge cases
  const [edgeCases, setEdgeCases] = useLocalStorage("edgeCases",
    Object.fromEntries(EDGE_CASES.map(e => [e.id, { checked: false, result: null }]))
  );

  // Phase 5: Uplock items
  const [uplockItems, setUplockItems] = useLocalStorage("uplockItems",
    Object.fromEntries(UPLOCK_TYPES.map(t => [t.id, []]))
  );

  // Phase 6: Cutover
  const [cutoverSteps, setCutoverSteps] = useLocalStorage("cutoverSteps",
    Object.fromEntries(CUTOVER_STEPS.map(s => [s.id, false]))
  );

  // Progress calculation
  const progress = useMemo(() => {
    const phases = {};

    // Counts: % of fields filled
    const countFields = Object.values(counts);
    const filledCount = countFields.filter(c => c.bw !== "" && c.ap !== "").length;
    phases.counts = Math.round((filledCount / countFields.length) * 100);

    // Spot checks: % of target checks completed with a result
    const totalTarget = SPOT_CHECK_CATEGORIES.reduce((s, c) => s + c.target, 0);
    const totalDone = Object.values(spotChecks).reduce((s, cat) =>
      s + cat.items.filter(i => i.checked && i.result).length, 0);
    phases.spotcheck = Math.round((totalDone / totalTarget) * 100);

    // Real world: % checked
    const rwDone = Object.values(realWorld).filter(Boolean).length;
    phases.realworld = Math.round((rwDone / Object.keys(realWorld).length) * 100);

    // Edge cases: % with result
    const ecDone = Object.values(edgeCases).filter(e => e.checked && e.result).length;
    phases.edgecases = Math.round((ecDone / EDGE_CASES.length) * 100);

    // Uplock: % done
    const uplockTotal = Object.values(uplockItems).reduce((s, arr) => s + arr.length, 0);
    const uplockDone = Object.values(uplockItems).reduce((s, arr) => s + arr.filter(i => i.done).length, 0);
    phases.uplock = uplockTotal === 0 ? 0 : Math.round((uplockDone / uplockTotal) * 100);

    // Cutover
    const cutDone = Object.values(cutoverSteps).filter(Boolean).length;
    phases.cutover = Math.round((cutDone / CUTOVER_STEPS.length) * 100);

    const overall = Math.round(Object.values(phases).reduce((s, v) => s + v, 0) / 6);
    return { ...phases, overall };
  }, [counts, spotChecks, realWorld, edgeCases, uplockItems, cutoverSteps]);

  // Feedback
  const feedback = useMemo(() => {
    const msgs = [];
    // Count mismatches
    const loginBw = parseInt(counts.logins.bw) || 0;
    const loginAp = parseInt(counts.logins.ap) || 0;
    if (counts.logins.bw && counts.logins.ap) {
      if (loginBw > 0 && loginAp === 0) msgs.push({ type: "fail", text: "No logins in Apple Passwords — CXP transfer may have failed entirely." });
      else if (loginBw > 0 && Math.abs(loginAp - loginBw) / loginBw > 0.15)
        msgs.push({ type: "fail", text: `Login count mismatch: ${loginBw} in BW vs ${loginAp} in AP (>${15}% difference). Use the name diff tool to find what's missing.` });
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

    // Spot check failures
    const failures = Object.values(spotChecks).flatMap(c => c.items).filter(i => i.result === "fail").length;
    if (failures > 0) msgs.push({ type: "fail", text: `${failures} spot check failure${failures > 1 ? "s" : ""} found. Investigate before proceeding with cutover.` });

    // Secure notes / cards / identities reminders
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

    // Cutover readiness
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
    <div style={{
      minHeight: "100vh", background: "#06060e", color: "#e2e8f0",
      fontFamily: "'Space Mono', monospace",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "24px 24px 16px", borderBottom: "1px solid #1e1e2e",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>
            Migration Validator
          </h1>
          <p style={{ color: "#4b5563", fontSize: 12, margin: "4px 0 0" }}>Bitwarden → Apple Passwords + Uplock</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ProgressRing progress={progress.overall} />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: progress.overall === 100 ? "#34d399" : "#818cf8" }}>
              {progress.overall}%
            </div>
            <div style={{ fontSize: 11, color: "#4b5563" }}>complete</div>
          </div>
        </div>
      </div>

      {/* Feedback bar */}
      {feedback.length > 0 && (
        <div style={{ padding: "12px 24px", background: "#0a0a16", borderBottom: "1px solid #1e1e2e" }}>
          {feedback.map((msg, i) => (
            <div key={i} style={{
              display: "flex", gap: 8, alignItems: "flex-start", padding: "4px 0",
              color: msg.type === "fail" ? "#f87171" : msg.type === "warn" ? "#fbbf24" : "#34d399",
              fontSize: 13,
            }}>
              <span>{msg.type === "fail" ? "✗" : msg.type === "warn" ? "⚠" : "✓"}</span>
              <span>{msg.text}</span>
            </div>
          ))}
        </div>
      )}

      {/* Phase nav */}
      <div style={{
        display: "flex", gap: 2, padding: "12px 24px",
        borderBottom: "1px solid #1e1e2e", overflowX: "auto",
      }}>
        {PHASES.map(phase => (
          <button key={phase.id} onClick={() => setActivePhase(phase.id)}
            style={{
              padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer",
              background: activePhase === phase.id ? "#1a1a2e" : "transparent",
              color: activePhase === phase.id ? "#818cf8" : "#4b5563",
              fontSize: 12, fontWeight: 700, fontFamily: "'Space Mono', monospace",
              transition: "all 0.15s", whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: 6,
            }}>
            <span>{phase.icon}</span>
            <span>{phase.label}</span>
            {progress[phase.id] === 100 && <span style={{ color: "#34d399", fontSize: 10 }}>✓</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>

        {/* Phase 1: Counts */}
        {activePhase === "counts" && (
          <div>
            <h3 style={h3Style}>Phase 1: Count Validation</h3>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>
              Compare item counts side by side. BW = Bitwarden web vault, AP = Apple Passwords app.
            </p>

            <div style={{
              display: "grid", gridTemplateColumns: "1fr 100px 100px 70px",
              gap: 12, padding: "8px 0", marginBottom: 4,
            }}>
              <span style={labelStyle}>Item type</span>
              <span style={labelStyle}>Bitwarden</span>
              <span style={labelStyle}>Apple PW</span>
              <span style={{ ...labelStyle, textAlign: "center" }}>Status</span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ color: "#818cf8", fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: "8px 0 4px", textTransform: "uppercase" }}>
                Should have transferred
              </div>
              <CountRow label="Logins" bwValue={counts.logins.bw} apValue={counts.logins.ap}
                onBwChange={v => updateCount("logins", "bw", v)} onApChange={v => updateCount("logins", "ap", v)} />
              <CountRow label="Passkeys" bwValue={counts.passkeys.bw} apValue={counts.passkeys.ap}
                onBwChange={v => updateCount("passkeys", "bw", v)} onApChange={v => updateCount("passkeys", "ap", v)} />
              <CountRow label="TOTP codes" bwValue={counts.totp.bw} apValue={counts.totp.ap}
                onBwChange={v => updateCount("totp", "bw", v)} onApChange={v => updateCount("totp", "ap", v)} />
            </div>

            <div>
              <div style={{ color: "#fbbf24", fontSize: 11, fontWeight: 700, letterSpacing: 1, padding: "8px 0 4px", textTransform: "uppercase" }}>
                Won't transfer — need Uplock
              </div>
              {["secureNotes", "cards", "identities", "attachments"].map(key => (
                <div key={key} style={{
                  display: "grid", gridTemplateColumns: "1fr 100px 1fr 70px",
                  gap: 12, alignItems: "center", padding: "10px 0",
                  borderBottom: "1px solid #1e1e2e",
                }}>
                  <span style={{ color: "#fbbf24", fontSize: 14, fontFamily: "'Space Mono', monospace" }}>
                    {key === "secureNotes" ? "Secure Notes" : key === "cards" ? "Cards" : key === "identities" ? "Identities" : "Attachments"}
                  </span>
                  <input type="number" min="0" placeholder="BW" value={counts[key].bw}
                    onChange={e => updateCount(key, "bw", e.target.value)}
                    style={inputStyle} />
                  <span style={{ color: "#4b5563", fontSize: 12 }}>→ Uplock</span>
                  <div style={{ textAlign: "center" }}>
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
            <h3 style={h3Style}>Phase 2: Spot Check Passwords</h3>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 8 }}>
              Check each item, then mark ✓ or ✗. For each: verify URL, username, password, TOTP, and notes match.
            </p>
            <ConfidenceMeter
              passedCount={Object.values(spotChecks).flatMap(c => c.items).filter(i => i.result === "pass").length}
              failedCount={Object.values(spotChecks).flatMap(c => c.items).filter(i => i.result === "fail").length}
            />

            {SPOT_CHECK_CATEGORIES.map(cat => (
              <div key={cat.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={labelStyle}>{cat.label} ({cat.target})</label>
                  <span style={{ color: "#4b5563", fontSize: 11 }}>
                    {spotChecks[cat.id].items.filter(i => i.result === "pass").length}/{cat.target} passed
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
            <h3 style={h3Style}>Phase 3: Live Login Tests</h3>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>
              Actually sign in to these sites using Apple Passwords autofill. This tests the full flow, not just data presence.
            </p>
            {[
              { key: "banking", label: "Banking / financial site", desc: "Verify password and any 2FA" },
              { key: "email", label: "Email account", desc: "Primary email provider" },
              { key: "totp_site", label: "Site with TOTP", desc: "Verify the code works for 2FA" },
              { key: "passkey_site", label: "Passkey login", desc: "If applicable" },
              { key: "complex_pw", label: "Complex password site", desc: "Special chars, long password" },
            ].map(item => (
              <label key={item.key} style={{
                display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 16px",
                background: realWorld[item.key] ? "#0a1e14" : "#0c0c14",
                border: `1px solid ${realWorld[item.key] ? "#166534" : "#16162a"}`,
                borderRadius: 8, marginBottom: 6, cursor: "pointer", transition: "all 0.2s",
              }}>
                <input type="checkbox" checked={realWorld[item.key]}
                  onChange={() => setRealWorld(p => ({ ...p, [item.key]: !p[item.key] }))}
                  style={{ accentColor: "#818cf8", width: 16, height: 16, marginTop: 2 }} />
                <div>
                  <div style={{ color: "#e2e8f0", fontSize: 14 }}>{item.label}</div>
                  <div style={{ color: "#4b5563", fontSize: 12 }}>{item.desc}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Phase 4: Edge Cases */}
        {activePhase === "edgecases" && (
          <div>
            <h3 style={h3Style}>Phase 4: Edge Cases</h3>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>
              Check each edge case. Mark ✓ if handled correctly or ✗ if data was lost.
            </p>
            {EDGE_CASES.map(ec => (
              <div key={ec.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px", background: "#0c0c14", border: "1px solid #16162a",
                borderRadius: 8, marginBottom: 6,
              }}>
                <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer", flex: 1 }}>
                  <input type="checkbox" checked={edgeCases[ec.id].checked}
                    onChange={() => setEdgeCases(p => ({
                      ...p, [ec.id]: { ...p[ec.id], checked: !p[ec.id].checked }
                    }))}
                    style={{ accentColor: "#818cf8", width: 16, height: 16 }} />
                  <span style={{ color: "#e2e8f0", fontSize: 14 }}>{ec.label}</span>
                </label>
                {edgeCases[ec.id].checked && (
                  <div style={{ display: "flex", gap: 4 }}>
                    <button onClick={() => setEdgeCases(p => ({ ...p, [ec.id]: { ...p[ec.id], result: "pass" } }))}
                      style={{ ...tinyBtnStyle, background: edgeCases[ec.id].result === "pass" ? "#166534" : "#111", color: edgeCases[ec.id].result === "pass" ? "#34d399" : "#555" }}>✓</button>
                    <button onClick={() => setEdgeCases(p => ({ ...p, [ec.id]: { ...p[ec.id], result: "fail" } }))}
                      style={{ ...tinyBtnStyle, background: edgeCases[ec.id].result === "fail" ? "#7f1d1d" : "#111", color: edgeCases[ec.id].result === "fail" ? "#f87171" : "#555" }}>✗</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Phase 5: Uplock */}
        {activePhase === "uplock" && (
          <div>
            <h3 style={h3Style}>Phase 5: Uplock Migration</h3>
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>
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
            <h3 style={h3Style}>Phase 6: Cutover</h3>
            {progress.spotcheck < 80 && (
              <div style={{
                padding: "12px 16px", background: "#1e0a0a", border: "1px solid #7f1d1d",
                borderRadius: 8, marginBottom: 16, color: "#fca5a5", fontSize: 13,
              }}>
                ⚠ Spot checks are only {progress.spotcheck}% complete. Finish validation before proceeding.
              </div>
            )}
            <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 16 }}>
              Only proceed after all validation passes. These steps are in order.
            </p>
            {CUTOVER_STEPS.map((step, i) => (
              <label key={step.id} style={{
                display: "flex", gap: 12, alignItems: "center", padding: "14px 16px",
                background: cutoverSteps[step.id] ? "#0a1e14" : "#0c0c14",
                border: `1px solid ${cutoverSteps[step.id] ? "#166534" : "#16162a"}`,
                borderRadius: 8, marginBottom: 6, cursor: "pointer", transition: "all 0.2s",
              }}>
                <input type="checkbox" checked={cutoverSteps[step.id]}
                  onChange={() => setCutoverSteps(p => ({ ...p, [step.id]: !p[step.id] }))}
                  style={{ accentColor: "#818cf8", width: 16, height: 16 }} />
                <span style={{ color: "#6b7280", fontSize: 13, fontWeight: 700, marginRight: 4 }}>{i + 1}.</span>
                <span style={{
                  color: cutoverSteps[step.id] ? "#34d399" : "#e2e8f0", fontSize: 14,
                  textDecoration: cutoverSteps[step.id] ? "line-through" : "none",
                }}>{step.label}</span>
              </label>
            ))}

            {progress.cutover === 100 && (
              <div style={{
                marginTop: 20, padding: "20px 24px", background: "#0a1e14",
                border: "1px solid #166534", borderRadius: 12, textAlign: "center",
              }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
                <div style={{ color: "#34d399", fontSize: 16, fontWeight: 700 }}>Migration Complete</div>
                <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>
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
