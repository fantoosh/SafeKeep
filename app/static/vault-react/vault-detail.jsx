// Vault list, detail, security dashboard, settings, import/export
const { useState: vS, useEffect: vE, useMemo: vM, useRef: vR } = React;

// ─── List + detail (split-pane) ─────────────────────
function VaultList({ items, selected, onSelect, onToggleFav, search, onSearch, sort, onSort }) {
  return (
    <div style={{
      borderRight: "1px solid var(--line)",
      background: "var(--bg-elev)",
      display: "flex", flexDirection: "column",
      minWidth: 0, overflow: "hidden",
    }}>
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--line)",
        display: "flex", flexDirection: "column", gap: 10,
        background: "var(--bg-elev)",
      }}>
        <div className="search">
          <Ic.Search size={14}/>
          <input className="input" placeholder="Search vault…"
                 value={search} onChange={e => onSearch(e.target.value)}/>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{items.length} {items.length === 1 ? "item" : "items"}</span>
          <div className="seg-control" style={{ padding: 1 }}>
            <button className={sort === "name" ? "on" : ""} onClick={() => onSort("name")}>Name</button>
            <button className={sort === "recent" ? "on" : ""} onClick={() => onSort("recent")}>Recent</button>
          </div>
        </div>
      </div>

      <div style={{ overflowY: "auto", flex: 1 }}>
        {items.length === 0 && (
          <div className="empty">
            <div className="glyph" style={{ color: "var(--ink-4)" }}><Ic.Search size={20}/></div>
            <div style={{ fontWeight: 500, color: "var(--ink-2)" }}>No matches</div>
            <div style={{ fontSize: 12, marginTop: 4 }}>Try a different search.</div>
          </div>
        )}
        {items.map(it => {
          const tagStyle = siteColorClass(it.website || it.name);
          return (
            <div key={it.id} className={`row ${selected?.id === it.id ? "active" : ""}`}
                 onClick={() => onSelect(it)}
                 style={{ alignItems: "center" }}>
              <div className="site-tag" style={tagStyle}>
                {it.type === "card" ? <Ic.Card size={14}/> :
                 it.type === "note" ? <Ic.Note size={14}/> :
                 it.type === "identity" ? <Ic.Identity size={14}/> :
                 siteInitial(it.website || it.name)}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{
                  fontSize: 13, fontWeight: 500,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {it.name}
                </div>
                <div style={{
                  fontSize: 11.5, color: "var(--ink-3)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {it.username || it.brand || it.lastUsed}
                </div>
              </div>
              <button className="btn icon ghost sm" onClick={(e) => { e.stopPropagation(); onToggleFav(it.id); }}
                      style={{ color: it.favorite ? "var(--warn)" : "var(--ink-4)" }}>
                {it.favorite ? <Ic.StarFill size={13}/> : <Ic.Star size={13}/>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Detail pane ───────────────────────────────────
function VaultDetail({ item, onCopy, onEdit, onDelete, onLaunchGen }) {
  const [reveal, setReveal] = vS(false);
  const [revealCount, setRevealCount] = vS(0);

  vE(() => { setReveal(false); setRevealCount(0); }, [item?.id]);

  vE(() => {
    if (!reveal) return;
    setRevealCount(15);
    const t = setInterval(() => {
      setRevealCount(c => {
        if (c <= 1) { setReveal(false); clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [reveal]);

  if (!item) return (
    <div className="main-scroll">
      <div className="empty">
        <div className="glyph" style={{ color: "var(--ink-4)" }}><Ic.Vault size={22}/></div>
        <div style={{ fontWeight: 500, color: "var(--ink-2)" }}>Select an item</div>
        <div style={{ fontSize: 12, marginTop: 4 }}>Or create a new one with <span className="kbd">⌘N</span></div>
      </div>
    </div>
  );

  const tagStyle = siteColorClass(item.website || item.name);
  const strength = scorePassword(item.password || "");

  return (
    <div className="main-scroll">
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 36px 60px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div className="site-tag lg" style={tagStyle}>
            {item.type === "card" ? <Ic.Card/> :
             item.type === "note" ? <Ic.Note/> :
             item.type === "identity" ? <Ic.Identity/> :
             siteInitial(item.website || item.name)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 className="h1" style={{ marginBottom: 4 }}>{item.name}</h1>
            <div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--ink-3)", fontSize: 12.5 }}>
              {item.website && <span>{item.website}</span>}
              {item.folder && <><span>·</span><span>{item.folder}</span></>}
              {item.lastUsed && <><span>·</span><span>Last used {item.lastUsed}</span></>}
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn" onClick={onEdit}><Ic.Edit size={13}/> Edit</button>
            <button className="btn icon"><Ic.More/></button>
          </div>
        </div>

        {/* Health alerts */}
        {(item.breached || item.reused || item.health === "weak") && (
          <div style={{
            display: "flex", flexDirection: "column", gap: 8,
            marginBottom: 24,
          }}>
            {item.breached && (
              <Alert kind="bad" icon={<Ic.Alert/>} title="Found in a known data breach"
                     body={item.breachInfo || "Change this password as soon as possible."}/>
            )}
            {item.reused && (
              <Alert kind="warn" icon={<Ic.Alert/>} title="Reused password"
                     body="This password is used on more than one site."/>
            )}
            {item.health === "weak" && !item.breached && (
              <Alert kind="warn" icon={<Ic.Alert/>} title="Weak password"
                     body="Consider using the generator to create a stronger one."/>
            )}
          </div>
        )}

        {item.type === "login" && (
          <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 24 }}>
            <DetailRow label="Username" value={item.username} mono onCopy={() => onCopy("Username", item.username)}/>
            <DetailRow label="Password" custom={
              <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                <span className="mono" style={{
                  flex: 1, minWidth: 0,
                  fontSize: 14, letterSpacing: 0.02,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {reveal ? item.password : "•".repeat(Math.min(item.password.length, 24))}
                </span>
                {reveal && <span className="pill" style={{ fontFamily: "var(--font-mono)" }}>{revealCount}s</span>}
              </div>
            } actions={
              <>
                <button className="btn icon ghost sm" onClick={() => setReveal(r => !r)}
                        title={reveal ? "Hide" : "Reveal (15s)"}>
                  {reveal ? <Ic.EyeOff/> : <Ic.Eye/>}
                </button>
                <button className="btn icon ghost sm" onClick={() => onCopy("Password", item.password)} title="Copy">
                  <Ic.Copy/>
                </button>
                <button className="btn icon ghost sm" onClick={onLaunchGen} title="Regenerate">
                  <Ic.Refresh/>
                </button>
              </>
            }/>
            {item.website && (
              <DetailRow label="Website" value={item.website} onCopy={() => onCopy("URL", item.website)}/>
            )}
            {item.otp && (
              <DetailRow label="One-time code" custom={
                <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                  <span className="mono" style={{ fontSize: 18, letterSpacing: 4, color: "var(--accent)" }}>
                    {item.otp.slice(0,3)} {item.otp.slice(3)}
                  </span>
                  <OtpRing/>
                </div>
              } actions={
                <button className="btn icon ghost sm" onClick={() => onCopy("Code", item.otp)}><Ic.Copy/></button>
              }/>
            )}
          </div>
        )}

        {item.type === "card" && (
          <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 24 }}>
            <DetailRow label="Brand" value={item.brand}/>
            <DetailRow label="Number" value={item.number} mono onCopy={() => onCopy("Card number", item.number)}/>
            <DetailRow label="Expiry" value={item.expiry} mono/>
            <DetailRow label="CVV" value={item.cvv} mono onCopy={() => onCopy("CVV", item.cvv)}/>
          </div>
        )}

        {(item.type === "note" || item.type === "identity") && (
          <div className="card" style={{ padding: 18, marginBottom: 24 }}>
            <pre style={{
              margin: 0, fontFamily: "var(--font-sans)", whiteSpace: "pre-wrap",
              fontSize: 13.5, lineHeight: 1.65, color: "var(--ink-2)",
            }}>{item.body}</pre>
          </div>
        )}

        {/* Strength panel */}
        {item.type === "login" && (
          <>
            <div className="h3" style={{ marginBottom: 10 }}>Strength</div>
            <div className="card" style={{ padding: 18, marginBottom: 24 }}>
              <div className={`strength s${strength.score}`}>
                {[0,1,2,3,4].map(i => <div key={i} className="seg"/>)}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12.5 }}>
                <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>{strength.label}</span>
                <span className="mono" style={{ color: "var(--ink-3)" }}>{strength.entropy} bits · {item.password.length} chars</span>
              </div>
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: 8, marginTop: 32, paddingTop: 18, borderTop: "1px solid var(--line)" }}>
          <button className="btn danger" onClick={onDelete}><Ic.Trash size={13}/> Delete</button>
          <div className="spacer"/>
          <span style={{ fontSize: 11.5, color: "var(--ink-4)" }}>Created Mar 14, 2024 · Modified Apr 2, 2026</span>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, custom, actions, mono, onCopy }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 18px",
      borderBottom: "1px solid var(--line)",
      minHeight: 56,
    }}>
      <div style={{ width: 110, fontSize: 12, fontWeight: 500, color: "var(--ink-3)", letterSpacing: 0.01, flexShrink: 0 }}>
        {label}
      </div>
      {custom || (
        <span className={mono ? "mono" : ""} style={{
          flex: 1, fontSize: mono ? 14 : 13.5,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{value}</span>
      )}
      <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
        {actions || (onCopy && (
          <button className="btn icon ghost sm" onClick={onCopy}><Ic.Copy/></button>
        ))}
      </div>
    </div>
  );
}

function Alert({ kind, icon, title, body }) {
  const colors = {
    bad:  { bg: "var(--bad-soft)",  fg: "var(--bad)",  bd: "transparent" },
    warn: { bg: "var(--warn-soft)", fg: "var(--warn)", bd: "transparent" },
    good: { bg: "var(--good-soft)", fg: "var(--good)", bd: "transparent" },
  }[kind];
  return (
    <div style={{
      display: "flex", gap: 12,
      padding: "12px 14px",
      background: colors.bg, color: colors.fg,
      borderRadius: 8,
      fontSize: 12.5,
    }}>
      <div style={{ marginTop: 1 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 500, marginBottom: 2 }}>{title}</div>
        <div style={{ opacity: 0.85 }}>{body}</div>
      </div>
    </div>
  );
}

function OtpRing() {
  const [t, setT] = vS(22);
  vE(() => {
    const id = setInterval(() => setT(s => s <= 1 ? 30 : s - 1), 1000);
    return () => clearInterval(id);
  }, []);
  const pct = t / 30;
  const r = 7, c = 2 * Math.PI * r;
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
      <circle cx="10" cy="10" r={r} stroke="var(--line)" strokeWidth="1.5" fill="none"/>
      <circle cx="10" cy="10" r={r}
              stroke="var(--accent)" strokeWidth="1.5" fill="none"
              strokeDasharray={c} strokeDashoffset={c * (1 - pct)}
              transform="rotate(-90 10 10)" strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear" }}/>
    </svg>
  );
}

window.VaultList = VaultList;
window.VaultDetail = VaultDetail;
