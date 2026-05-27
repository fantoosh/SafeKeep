// Sidebar + topbar shells, generator, modals
const { useState: uS, useEffect: uE, useMemo: uM, useRef: uR } = React;

function Sidebar({ active, onSelect, counts, onLock }) {
  const items = [
    { id: "all",       label: "All items",      icon: <Ic.Vault/>,    count: counts.all },
    { id: "favorites", label: "Favorites",      icon: <Ic.Star/>,     count: counts.favorites },
    { id: "logins",    label: "Logins",         icon: <Ic.Key/>,      count: counts.logins },
    { id: "cards",     label: "Cards",          icon: <Ic.Card/>,     count: counts.cards },
    { id: "notes",     label: "Notes",          icon: <Ic.Note/>,     count: counts.notes },
    { id: "identities",label: "Identities",     icon: <Ic.Identity/>, count: counts.identities },
  ];
  const tools = [
    { id: "security",  label: "Security",       icon: <Ic.ShieldCheck/>, badge: counts.issues },
    { id: "generator", label: "Generator",      icon: <Ic.Refresh/>   },
    { id: "import",    label: "Import / export",icon: <Ic.Upload/>    },
    { id: "settings",  label: "Settings",       icon: <Ic.Settings/>  },
  ];
  const folders = ["Personal", "Work", "Finance"];

  return (
    <aside className="sidebar">
      <div className="brand">
        <Logo size={24}/>
        <div className="brand-name">SafeKeep</div>
      </div>

      <nav className="nav">
        <div className="nav-section">
          {items.map(it => (
            <button key={it.id} className={`nav-item ${active === it.id ? "active" : ""}`}
                    onClick={() => onSelect(it.id)}>
              <span style={{ color: "var(--ink-3)" }}>{it.icon}</span>
              <span>{it.label}</span>
              <span className="count">{it.count}</span>
            </button>
          ))}
        </div>

        <div className="nav-section">
          <div className="h3">Folders</div>
          {folders.map(f => (
            <button key={f} className={`nav-item ${active === `folder:${f}` ? "active" : ""}`}
                    onClick={() => onSelect(`folder:${f}`)}>
              <span style={{ color: "var(--ink-3)" }}><Ic.Folder/></span>
              <span>{f}</span>
              <span className="count">{counts.folders[f] || 0}</span>
            </button>
          ))}
        </div>

        <div className="nav-section">
          <div className="h3">Tools</div>
          {tools.map(it => (
            <button key={it.id} className={`nav-item ${active === it.id ? "active" : ""}`}
                    onClick={() => onSelect(it.id)}>
              <span style={{ color: "var(--ink-3)" }}>{it.icon}</span>
              <span>{it.label}</span>
              {it.badge > 0 && <span className="pill bad" style={{ marginLeft: "auto", height: 18, fontSize: 10.5 }}>{it.badge}</span>}
            </button>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={onLock} style={{ width: "100%" }}>
          <span style={{ color: "var(--ink-3)" }}><Ic.Lock/></span>
          <span>Lock vault</span>
          <span className="kbd" style={{ marginLeft: "auto" }}>⌘L</span>
        </button>
      </div>
    </aside>
  );
}

// ─── Generator (works as modal AND standalone view) ───
function GeneratorPanel({ initial, onUse, embedded }) {
  const [length, setLength] = uS(initial?.length ?? 18);
  const [upper, setUpper] = uS(true);
  const [lower, setLower] = uS(true);
  const [digits, setDigits] = uS(true);
  const [symbols, setSymbols] = uS(true);
  const [ambig, setAmbig] = uS(false);
  const [mode, setMode] = uS("password"); // password | passphrase
  const [words, setWords] = uS(4);
  const [separator, setSeparator] = uS("-");

  const [generated, setGenerated] = uS("");
  const regen = () => {
    if (mode === "password") {
      setGenerated(generatePassword({ length, upper, lower, digits, symbols, ambiguous: ambig }));
    } else {
      const list = ["raven","copper","ember","quartz","valley","mosaic","cobalt","spruce","linen","pebble","verdant","sable","amber","fjord","glade","harbor","ivory","kestrel","lichen","mantle","oasis","peony"];
      const picks = [];
      const arr = new Uint32Array(words);
      crypto.getRandomValues(arr);
      for (let i = 0; i < words; i++) picks.push(list[arr[i] % list.length]);
      setGenerated(picks.join(separator));
    }
  };
  uE(() => { regen(); /* eslint-disable-next-line */ }, [length, upper, lower, digits, symbols, ambig, mode, words, separator]);

  const strength = scorePassword(generated);

  return (
    <div style={{ padding: embedded ? 0 : "0" }}>
      <div className="card" style={{ padding: 18, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-3)", letterSpacing: 0.04, textTransform: "uppercase", marginBottom: 10 }}>
          Generated {mode}
        </div>
        <div className="mono"
             style={{
               fontSize: 22, lineHeight: 1.4,
               wordBreak: "break-all",
               minHeight: 64,
               color: "var(--ink)",
               letterSpacing: 0.02,
             }}>
          {[...generated].map((c, i) => {
            const isDigit = /[0-9]/.test(c);
            const isSym = /[^a-zA-Z0-9]/.test(c);
            return <span key={i} style={{
              color: isDigit ? "var(--accent)" : isSym ? "var(--bad)" : "var(--ink)",
            }}>{c}</span>;
          })}
        </div>

        <div className={`strength s${strength.score}`} style={{ marginTop: 14 }}>
          {[0,1,2,3,4].map(i => <div key={i} className="seg"/>)}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "var(--ink-3)", marginTop: 4 }}>
          <span>{strength.label}</span>
          <span className="mono">{strength.entropy} bits · {generated.length} chars</span>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
          <button className="btn" onClick={regen}>
            <Ic.Refresh size={14}/> Regenerate
          </button>
          <button className="btn" onClick={() => { navigator.clipboard?.writeText(generated); window.dispatchEvent(new CustomEvent("sk-clip", { detail: generated })); }}>
            <Ic.Copy size={14}/> Copy
          </button>
          <div className="spacer"/>
          {onUse && <button className="btn primary" onClick={() => onUse(generated)}>Use password</button>}
        </div>
      </div>

      <div className="card" style={{ padding: 18 }}>
        <div className="seg-control" style={{ marginBottom: 18 }}>
          <button className={mode === "password" ? "on" : ""} onClick={() => setMode("password")}>Password</button>
          <button className={mode === "passphrase" ? "on" : ""} onClick={() => setMode("passphrase")}>Passphrase</button>
        </div>

        {mode === "password" && (
          <>
            <SliderRow label="Length" value={length} min={6} max={64}
                       onChange={setLength} suffix="chars"/>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
              <CheckRow label="Uppercase A–Z" checked={upper} onChange={setUpper}/>
              <CheckRow label="Lowercase a–z" checked={lower} onChange={setLower}/>
              <CheckRow label="Digits 0–9" checked={digits} onChange={setDigits}/>
              <CheckRow label="Symbols !@#$" checked={symbols} onChange={setSymbols}/>
              <CheckRow label="Allow ambiguous (l, 1, O, 0)" checked={ambig} onChange={setAmbig}/>
            </div>
          </>
        )}

        {mode === "passphrase" && (
          <>
            <SliderRow label="Words" value={words} min={3} max={10} onChange={setWords}/>
            <div className="field" style={{ marginTop: 14 }}>
              <label>Separator</label>
              <div className="seg-control">
                {["-", ".", " ", "_", "+"].map(s => (
                  <button key={s} className={separator === s ? "on" : ""} onClick={() => setSeparator(s)}>
                    {s === " " ? "space" : s}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SliderRow({ label, value, onChange, min, max, suffix }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-2)" }}>{label}</span>
        <span className="mono" style={{ fontSize: 12, color: "var(--ink-2)" }}>{value} {suffix}</span>
      </div>
      <input type="range" min={min} max={max} value={value}
             onChange={e => onChange(parseInt(e.target.value))}
             style={{ width: "100%", accentColor: "var(--accent)" }}/>
    </div>
  );
}

function CheckRow({ label, checked, onChange }) {
  return (
    <label className="check" style={{ height: 28 }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}/>
      <span className="box"></span>
      <span style={{ color: "var(--ink-2)" }}>{label}</span>
    </label>
  );
}

window.Sidebar = Sidebar;
window.GeneratorPanel = GeneratorPanel;
