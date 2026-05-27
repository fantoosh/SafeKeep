// app.jsx — SafeKeep main app (Flask-backed)
const { useState: aS, useEffect: aE, useMemo: aM, useRef: aR, useCallback: aC } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{ "theme": "light" }/*EDITMODE-END*/;

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [currentUser, setCurrentUser] = aS(null);
  const [items, setItems] = aS([]);
  const [loading, setLoading] = aS(true);
  const [active, setActive] = aS("all");
  const [selected, setSelected] = aS(null);
  const [search, setSearch] = aS("");
  const [sort, setSort] = aS("recent");
  const [toasts, setToasts] = aS([]);
  const [showAdd, setShowAdd] = aS(false);
  const [editing, setEditing] = aS(null);
  const [settings, setSettings] = aS({
    autolock: "5", clipboard: "30", reveal: "15", requireExport: true,
  });

  // Apply theme
  aE(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme);
  }, [tweaks.theme]);

  // Load user + credentials on mount
  aE(() => {
    Promise.all([loadCurrentUser(), loadCredentials()])
      .then(([user, creds]) => {
        if (!user) { window.location.href = "/auth/login"; return; }
        setCurrentUser(user);
        setItems(creds);
      })
      .catch(() => { window.location.href = "/auth/login"; })
      .finally(() => setLoading(false));
  }, []);

  // Filter + sort
  const view = aM(() => {
    let list = [...items];
    if (active === "favorites")  list = list.filter(i => i.favorite);
    else if (active === "logins") list = list.filter(i => i.type === "login");
    else if (active === "cards")  list = list.filter(i => i.type === "card");
    else if (active === "notes")  list = list.filter(i => i.type === "note");
    else if (active === "identities") list = list.filter(i => i.type === "identity");
    else if (active.startsWith("folder:")) {
      const f = active.split(":")[1];
      list = list.filter(i => i.folder === f);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(i =>
        (i.name || "").toLowerCase().includes(q) ||
        (i.username || "").toLowerCase().includes(q) ||
        (i.website || "").toLowerCase().includes(q)
      );
    }
    if (sort === "name") list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    return list;
  }, [items, active, search, sort]);

  const counts = aM(() => ({
    all: items.length,
    favorites: items.filter(i => i.favorite).length,
    logins: items.filter(i => i.type === "login").length,
    cards: 0, notes: 0, identities: 0,
    issues: items.filter(i => i.breached || i.reused || i.health === "weak").length,
    folders: items.reduce((acc, i) => { if (i.folder) acc[i.folder] = (acc[i.folder] || 0) + 1; return acc; }, {}),
  }), [items]);

  // Toasts
  const pushToast = aC((message, withCountdown = false) => {
    const id = Math.random();
    setToasts(t => [...t, { id, message }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 2500);
  }, []);

  const handleCopy = aC((label, value) => {
    navigator.clipboard?.writeText(value);
    pushToast(`${label} copied`);
  }, [pushToast]);

  // Keyboard shortcuts
  aE(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") { e.preventDefault(); setShowAdd(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Refresh items from API
  const refreshItems = aC(async () => {
    const creds = await loadCredentials();
    setItems(creds);
    return creds;
  }, []);

  if (loading) return (
    <div style={{ display: "grid", placeItems: "center", height: "100vh", color: "var(--ink-3)", fontFamily: "var(--font-sans)", fontSize: 13 }}>
      Loading vault…
    </div>
  );

  const showList = ["all", "favorites", "logins", "cards", "notes", "identities"].includes(active) || active.startsWith("folder:");

  return (
    <>
      <div className="app">

        {/* Sidebar */}
        <Sidebar
          active={active}
          onSelect={(id) => { setActive(id); setSelected(null); }}
          counts={counts}
          currentUser={currentUser}
          onLock={() => { window.location.href = "/auth/logout"; }}
        />

        <div className="main">
          <TopBar onAdd={() => setShowAdd(true)} title={titleFor(active)} user={currentUser}/>
          {showList ? (
            <VaultList
              items={view}
              selected={selected}
              onSelect={setSelected}
              onToggleFav={(id) => setItems(its => its.map(i => i.id === id ? { ...i, favorite: !i.favorite } : i))}
              search={search}
              onSearch={setSearch}
              sort={sort}
              onSort={setSort}
            />
          ) : (
            <>
              {active === "security" && (
                <SecurityDashboard
                  items={items}
                  onSelect={(it) => { setActive("all"); setSelected(it); }}
                />
              )}
              {active === "generator" && (
                <div className="main-scroll">
                  <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 36px 60px" }}>
                    <h1 className="h1" style={{ marginBottom: 6 }}>Password generator</h1>
                    <p className="muted" style={{ margin: "0 0 24px", fontSize: 13.5 }}>
                      Cryptographically random. Generated locally with <span className="mono">crypto.getRandomValues</span>.
                    </p>
                    <GeneratorPanel/>
                  </div>
                </div>
              )}
              {active === "import" && <ImportExport/>}
              {active === "settings" && (
                <SettingsView
                  settings={settings}
                  onChange={(patch) => setSettings(s => ({ ...s, ...patch }))}
                  currentUser={currentUser}
                />
              )}
            </>
          )}
        </div>

      </div>

      {/* Item detail modal */}
      {selected && (
        <ItemDetailModal
          item={selected}
          onClose={() => setSelected(null)}
          onCopy={handleCopy}
          onEdit={() => setEditing(selected)}
          onDelete={async () => {
            if (!confirm(`Delete "${selected.name}"? This cannot be undone.`)) return;
            await deleteCredential(selected.id);
            setSelected(null);
            await refreshItems();
            pushToast("Deleted");
          }}
          onLaunchGen={() => setEditing(selected)}
        />
      )}

      {/* Add modal */}
      {showAdd && (
        <CredentialModal
          onClose={() => setShowAdd(false)}
          onSave={async ({ name, website, username, password }) => {
            await createCredential({ website: name || website, username, password });
            const creds = await refreshItems();
            setSelected(creds.find(c => c.username === username) || creds[0]);
            setShowAdd(false);
            pushToast("Added to vault");
          }}
        />
      )}

      {/* Edit modal */}
      {editing && (
        <CredentialModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={async ({ name, website, username, password }) => {
            await updateCredential(editing.id, { website: name || website, username, password });
            const creds = await refreshItems();
            setSelected(creds.find(c => c.id === editing.id) || creds[0]);
            setEditing(null);
            pushToast("Saved");
          }}
        />
      )}

      {/* Toast stack */}
      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className="toast">{t.message}</div>
        ))}
      </div>

      <TweaksPanel>
        <TweakSection label="Theme"/>
        <TweakRadio
          label="Color scheme"
          value={tweaks.theme}
          options={["light", "dim", "dark"]}
          onChange={(v) => setTweak("theme", v)}
        />
      </TweaksPanel>
    </>
  );
}

function ItemDetailModal({ item, onClose, onCopy, onEdit, onDelete, onLaunchGen }) {
  aE(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="item-modal-backdrop" onClick={onClose}>
      <div className="item-modal" onClick={e => e.stopPropagation()}>
        <button className="item-modal-close btn icon ghost" onClick={onClose} title="Close">
          <Ic.X size={16}/>
        </button>
        <VaultDetail
          item={item}
          onCopy={onCopy}
          onEdit={onEdit}
          onDelete={onDelete}
          onLaunchGen={onLaunchGen}
        />
      </div>
    </div>
  );
}

function titleFor(active) {
  const titles = {
    all: "All items", favorites: "Favorites", logins: "Logins",
    cards: "Cards", notes: "Notes", identities: "Identities",
    security: "Security", generator: "Generator", import: "Import & export",
    settings: "Settings",
  };
  if (active.startsWith("folder:")) return active.split(":")[1];
  return titles[active] || "Vault";
}

function TopBar({ onAdd, title, user }) {
  return (
    <div className="topbar">
      <span className="h2">{title}</span>
      <div className="spacer"/>
      {user && <span style={{ fontSize: 12, color: "var(--ink-3)", marginRight: 8 }}>{user.username}</span>}
      <button className="btn primary sm" onClick={onAdd} style={{ gap: 6 }}>
        <Ic.Plus size={13}/> New item
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
