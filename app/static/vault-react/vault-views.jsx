// Security dashboard, Settings, Import/Export, AddCredential modal
const { useState: sS, useEffect: sE, useMemo: sM } = React;

// ─── Security dashboard ──────────────────────────────
function SecurityDashboard({ items, onSelect }) {
  const breached = items.filter(i => i.breached);
  const reused = items.filter(i => i.reused);
  const weak = items.filter(i => i.health === "weak" && !i.breached);
  const strong = items.filter(i => i.type === "login" && i.health === "strong" && !i.reused && !i.breached);
  const score = Math.round(
    100 * strong.length / Math.max(items.filter(i => i.type === "login").length, 1)
  );

  return (
    <div className="main-scroll">
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 36px 60px" }}>
        <h1 className="h1" style={{ marginBottom: 6 }}>Security dashboard</h1>
        <p className="muted" style={{ margin: "0 0 28px", fontSize: 13.5 }}>
          Continuous audit of your vault. All checks run locally; passwords never leave your device.
        </p>

        {/* Score */}
        <div className="card" style={{
          padding: 28, marginBottom: 24,
          display: "grid", gridTemplateColumns: "auto 1fr",
          gap: 36, alignItems: "center",
        }}>
          <ScoreRing pct={score / 100}/>
          <div>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 4, letterSpacing: 0.02 }}>VAULT HEALTH SCORE</div>
            <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1 }}>
              {score}<span style={{ color: "var(--ink-4)", fontSize: 22, fontWeight: 400 }}> / 100</span>
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: "var(--ink-2)", maxWidth: 480 }}>
              {score >= 80 ? "Strong overall. A few items below need attention." :
               score >= 60 ? "Healthy, but several items have weak or reused passwords." :
               "Several items need attention to bring your vault to a safe baseline."}
            </div>
            <div style={{ display: "flex", gap: 14, marginTop: 18 }}>
              <Stat n={breached.length} label="Breached" tone="bad"/>
              <Stat n={reused.length} label="Reused" tone="warn"/>
              <Stat n={weak.length} label="Weak" tone="warn"/>
              <Stat n={strong.length} label="Strong" tone="good"/>
            </div>
          </div>
        </div>

        <IssueGroup title="Found in known breaches" tone="bad" items={breached} icon={<Ic.Alert/>}
                    description="These passwords appeared in public credential dumps. Rotate them now."
                    onSelect={onSelect}/>
        <IssueGroup title="Reused across multiple sites" tone="warn" items={reused} icon={<Ic.Refresh/>}
                    description="A breach on one site exposes the others. Generate a unique password for each."
                    onSelect={onSelect}/>
        <IssueGroup title="Weak passwords" tone="warn" items={weak} icon={<Ic.Key/>}
                    description="Below 60 bits of entropy, or matches common patterns."
                    onSelect={onSelect}/>
      </div>
    </div>
  );
}

function ScoreRing({ pct }) {
  const r = 56, c = 2 * Math.PI * r;
  const stroke = pct > 0.8 ? "var(--good)" : pct > 0.5 ? "var(--warn)" : "var(--bad)";
  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} stroke="var(--line)" strokeWidth="10" fill="none"/>
      <circle cx="70" cy="70" r={r} stroke={stroke} strokeWidth="10" fill="none"
              strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
              transform="rotate(-90 70 70)" strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 600ms ease" }}/>
    </svg>
  );
}

function Stat({ n, label, tone }) {
  const colors = { bad: "var(--bad)", warn: "var(--warn)", good: "var(--good)" };
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 600, color: colors[tone], lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{n}</div>
      <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 4, letterSpacing: 0.01 }}>{label}</div>
    </div>
  );
}

function IssueGroup({ title, tone, items, icon, description, onSelect }) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", marginBottom: 10, gap: 10 }}>
        <h2 className="h2">{title}</h2>
        <span className={`pill ${tone}`}>{items.length}</span>
      </div>
      <div className="muted" style={{ fontSize: 12.5, marginBottom: 12 }}>{description}</div>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {items.map(it => {
          const tagStyle = siteColorClass(it.website || it.name);
          return (
            <div key={it.id} className="row" onClick={() => onSelect(it)}
                 style={{ padding: "12px 16px" }}>
              <div className="site-tag" style={tagStyle}>{siteInitial(it.website || it.name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{it.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{it.username}</div>
              </div>
              {it.breached && <span className="pill bad">breached</span>}
              {it.reused && <span className="pill warn">reused</span>}
              {it.health === "weak" && !it.breached && <span className="pill warn">weak</span>}
              <Ic.ChevronRight size={14}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Settings ────────────────────────────────────────
function SettingsView({ settings, onChange }) {
  return (
    <div className="main-scroll">
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 36px 60px" }}>
        <h1 className="h1" style={{ marginBottom: 6 }}>Settings</h1>
        <p className="muted" style={{ margin: "0 0 28px", fontSize: 13.5 }}>Preferences are stored encrypted alongside your vault.</p>

        <SettingsSection title="Security">
          <SettingsRow label="Auto-lock vault" hint="Lock the vault after a period of inactivity.">
            <select className="input" style={{ width: 160 }}
                    value={settings.autolock} onChange={e => onChange({ autolock: e.target.value })}>
              <option value="1">After 1 minute</option>
              <option value="5">After 5 minutes</option>
              <option value="15">After 15 minutes</option>
              <option value="60">After 1 hour</option>
              <option value="never">Never</option>
            </select>
          </SettingsRow>
          <SettingsRow label="Clipboard auto-clear" hint="Wipe copied passwords from the clipboard.">
            <select className="input" style={{ width: 160 }}
                    value={settings.clipboard} onChange={e => onChange({ clipboard: e.target.value })}>
              <option value="10">After 10 seconds</option>
              <option value="30">After 30 seconds</option>
              <option value="60">After 1 minute</option>
              <option value="never">Don't clear</option>
            </select>
          </SettingsRow>
          <SettingsRow label="Reveal timer" hint="Hide visible passwords automatically.">
            <select className="input" style={{ width: 160 }}
                    value={settings.reveal} onChange={e => onChange({ reveal: e.target.value })}>
              <option value="5">5 seconds</option>
              <option value="15">15 seconds</option>
              <option value="30">30 seconds</option>
            </select>
          </SettingsRow>
          <SettingsRow label="Require master on export" hint="Re-prompt before exporting decrypted data.">
            <Switch on={settings.requireExport} onChange={v => onChange({ requireExport: v })}/>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Account">
          <SettingsRow label="Email" hint="alex.morgan@protonmail.com">
            <button className="btn">Change</button>
          </SettingsRow>
          <SettingsRow label="Master password" hint="Last changed 3 months ago.">
            <button className="btn">Change</button>
          </SettingsRow>
          <SettingsRow label="Two-factor authentication" hint="TOTP enabled · Authenticator app">
            <span className="pill good"><Ic.Check size={11}/> Enabled</span>
          </SettingsRow>
          <SettingsRow label="Emergency kit" hint="Printable recovery document with your account ID.">
            <button className="btn"><Ic.Download size={13}/> Download</button>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="Sessions">
          <SessionRow device="Mac · Chrome 134" location="Brooklyn, NY · this device" current/>
          <SessionRow device="iPhone 15 · iOS 18" location="Brooklyn, NY · 2 hours ago"/>
          <SessionRow device="Mac · Firefox" location="Mexico City · 2 weeks ago"/>
        </SettingsSection>

        <SettingsSection title="Danger zone" tone="bad">
          <SettingsRow label="Delete account" hint="This permanently destroys your encrypted vault.">
            <button className="btn danger">Delete account…</button>
          </SettingsRow>
        </SettingsSection>
      </div>
    </div>
  );
}

function SettingsSection({ title, children, tone }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 className="h2" style={{ color: tone === "bad" ? "var(--bad)" : "var(--ink)", marginBottom: 12 }}>{title}</h2>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

function SettingsRow({ label, hint, children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "16px 20px", borderBottom: "1px solid var(--line)",
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 2 }}>{label}</div>
        {hint && <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{hint}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function Switch({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)}
            style={{
              width: 36, height: 20, padding: 2,
              border: "none", borderRadius: 999,
              background: on ? "var(--accent)" : "var(--line-strong)",
              transition: "background 150ms",
              display: "flex", alignItems: "center",
            }}>
      <span style={{
        width: 16, height: 16, borderRadius: "50%",
        background: "white",
        transform: `translateX(${on ? 16 : 0}px)`,
        transition: "transform 150ms",
        boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
      }}/>
    </button>
  );
}

function SessionRow({ device, location, current }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      padding: "14px 20px", borderBottom: "1px solid var(--line)",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: "var(--bg-sunk)",
        display: "grid", placeItems: "center",
        color: "var(--ink-3)",
      }}><Ic.Globe size={14}/></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{device} {current && <span className="pill accent" style={{ marginLeft: 6 }}>This device</span>}</div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{location}</div>
      </div>
      {!current && <button className="btn sm">Revoke</button>}
    </div>
  );
}

// ─── Import / export ─────────────────────────────────
function ImportExport() {
  return (
    <div className="main-scroll">
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 36px 60px" }}>
        <h1 className="h1" style={{ marginBottom: 6 }}>Import &amp; export</h1>
        <p className="muted" style={{ margin: "0 0 28px", fontSize: 13.5 }}>
          Move your vault in or out of SafeKeep. Exports are decrypted client-side; handle them carefully.
        </p>

        <h2 className="h2" style={{ marginBottom: 12 }}>Import from another manager</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
          {["1Password","Bitwarden","LastPass","Dashlane","Apple Passwords","CSV file"].map(p => (
            <button key={p} className="card" style={{
              padding: 18, textAlign: "left",
              display: "flex", alignItems: "center", gap: 12,
              cursor: "pointer", border: "1px solid var(--line)",
              background: "var(--bg-elev)",
            }}>
              <div className="site-tag" style={siteColorClass(p)}>{p[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{p}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>1Pux, JSON, or CSV</div>
              </div>
              <Ic.ChevronRight size={14}/>
            </button>
          ))}
        </div>

        <h2 className="h2" style={{ marginBottom: 12 }}>Export your vault</h2>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <SettingsRow label="Encrypted backup (.skbk)" hint="Argon2id + AES-256-GCM. Restore with your master password.">
            <button className="btn primary"><Ic.Download size={13}/> Export encrypted</button>
          </SettingsRow>
          <SettingsRow label="Plain CSV" hint="Decrypted plaintext. Do not store this on disk.">
            <button className="btn"><Ic.Download size={13}/> Export CSV</button>
          </SettingsRow>
          <SettingsRow label="JSON (for developers)" hint="Vault schema with all metadata.">
            <button className="btn"><Ic.Download size={13}/> Export JSON</button>
          </SettingsRow>
        </div>
      </div>
    </div>
  );
}

// ─── Add / edit credential modal ─────────────────────
function CredentialModal({ initial, onClose, onSave }) {
  const [name, setName] = sS(initial?.name || "");
  const [website, setWebsite] = sS(initial?.website || "");
  const [username, setUsername] = sS(initial?.username || "");
  const [password, setPassword] = sS(initial?.password || "");
  const [folder, setFolder] = sS(initial?.folder || "Personal");
  const [showGen, setShowGen] = sS(false);
  const [reveal, setReveal] = sS(false);
  const strength = sM(() => scorePassword(password), [password]);

  return (
    <div className="modal-veil" onClick={onClose}>
      <div className="modal" style={{ width: 540 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", letterSpacing: 0.04, textTransform: "uppercase", marginBottom: 2 }}>
              {initial ? "Edit login" : "New login"}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
              {name || "Untitled"}
            </div>
          </div>
          <button className="btn icon ghost" onClick={onClose}><Ic.X/></button>
        </div>
        <div className="modal-body">
          <div className="field">
            <label>Name</label>
            <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="GitHub" autoFocus/>
          </div>
          <div className="field">
            <label>Website</label>
            <input className="input" value={website} onChange={e => setWebsite(e.target.value)} placeholder="github.com"/>
          </div>
          <div className="field">
            <label>Username or email</label>
            <input className="input" value={username} onChange={e => setUsername(e.target.value)}/>
          </div>
          <div className="field">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input className="input mono" type={reveal ? "text" : "password"}
                     value={password} onChange={e => setPassword(e.target.value)}
                     style={{ paddingRight: 80, fontSize: 13.5 }}/>
              <div style={{ position: "absolute", right: 4, top: 4, display: "flex", gap: 2 }}>
                <button className="btn icon ghost sm" onClick={() => setReveal(r => !r)} type="button">
                  {reveal ? <Ic.EyeOff/> : <Ic.Eye/>}
                </button>
                <button className="btn icon ghost sm" onClick={() => setShowGen(s => !s)} type="button" title="Generate">
                  <Ic.Refresh/>
                </button>
              </div>
            </div>
            {password && (
              <>
                <div className={`strength s${strength.score}`}>
                  {[0,1,2,3,4].map(i => <div key={i} className="seg"/>)}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--ink-3)" }}>
                  <span>{strength.label}</span>
                  <span className="mono">{strength.entropy} bits</span>
                </div>
              </>
            )}
          </div>

          {showGen && (
            <div style={{ marginTop: 8, marginBottom: 4 }}>
              <GeneratorPanel onUse={(pw) => { setPassword(pw); setShowGen(false); }} embedded/>
            </div>
          )}

          <div className="field">
            <label>Folder</label>
            <select className="input" value={folder} onChange={e => setFolder(e.target.value)}>
              <option>Personal</option>
              <option>Work</option>
              <option>Finance</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn primary" onClick={() => onSave({ name, website, username, password, folder })}
                  disabled={!name || !password}>
            {initial ? "Save changes" : "Add to vault"}
          </button>
        </div>
      </div>
    </div>
  );
}

window.SecurityDashboard = SecurityDashboard;
window.SettingsView = SettingsView;
window.ImportExport = ImportExport;
window.CredentialModal = CredentialModal;
