// Icons — all 16px stroke 1.5, calm geometric set
const Ic = {};
const mk = (paths, size = 16) => ({ size: s = size, ...rest } = {}) => (
  <svg width={s} height={s} viewBox="0 0 16 16" fill="none"
       stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {paths}
  </svg>
);

Ic.Lock = mk(<><rect x="3" y="7" width="10" height="6.5" rx="1.5"/><path d="M5 7V5a3 3 0 0 1 6 0v2"/></>);
Ic.LockOpen = mk(<><rect x="3" y="7" width="10" height="6.5" rx="1.5"/><path d="M5 7V5a3 3 0 0 1 5.5-1.7"/></>);
Ic.Key = mk(<><circle cx="6" cy="8" r="2.5"/><path d="M8.5 8h5M11 8v2M13 8v1.5"/></>);
Ic.Vault = mk(<><rect x="2" y="3" width="12" height="10" rx="1.5"/><circle cx="9" cy="8" r="2"/><path d="M9 6V5M9 11v-1M11 8h1M6 8h1"/></>);
Ic.Star = mk(<path d="m8 2 1.8 3.7 4 .6-2.9 2.8.7 4L8 11.2 4.4 13.1l.7-4L2.2 6.3l4-.6L8 2Z"/>);
Ic.StarFill = ({ size = 16, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" {...rest}>
    <path d="m8 2 1.8 3.7 4 .6-2.9 2.8.7 4L8 11.2 4.4 13.1l.7-4L2.2 6.3l4-.6L8 2Z"/>
  </svg>
);
Ic.Search = mk(<><circle cx="7" cy="7" r="4.5"/><path d="m13.5 13.5-3.2-3.2"/></>);
Ic.Plus = mk(<><path d="M8 3v10M3 8h10"/></>);
Ic.X = mk(<><path d="m4 4 8 8M12 4l-8 8"/></>);
Ic.Eye = mk(<><path d="M2 8s2.5-4.5 6-4.5S14 8 14 8s-2.5 4.5-6 4.5S2 8 2 8Z"/><circle cx="8" cy="8" r="1.8"/></>);
Ic.EyeOff = mk(<><path d="M2 8s2.5-4.5 6-4.5c1.4 0 2.6.7 3.5 1.5M14 8s-2.5 4.5-6 4.5c-1.4 0-2.6-.7-3.5-1.5"/><path d="M2 2l12 12"/></>);
Ic.Copy = mk(<><rect x="5" y="5" width="8" height="8" rx="1.5"/><path d="M3 10V4a1 1 0 0 1 1-1h6"/></>);
Ic.Check = mk(<path d="m3 8 3 3 7-7"/>);
Ic.Settings = mk(<><circle cx="8" cy="8" r="2"/><path d="M8 1v2M8 13v2M14.5 4.7l-1.7 1M3.2 10.3l-1.7 1M14.5 11.3l-1.7-1M3.2 5.7l-1.7-1M15 8h-2M3 8H1"/></>);
Ic.Shield = mk(<><path d="M8 1.5 3 3.5v3.7c0 3.2 2 6.1 5 7.3 3-1.2 5-4.1 5-7.3V3.5L8 1.5Z"/></>);
Ic.ShieldCheck = mk(<><path d="M8 1.5 3 3.5v3.7c0 3.2 2 6.1 5 7.3 3-1.2 5-4.1 5-7.3V3.5L8 1.5Z"/><path d="m6 8 1.5 1.5L10.5 6.5"/></>);
Ic.Card = mk(<><rect x="2" y="4" width="12" height="9" rx="1.5"/><path d="M2 7h12M5 10.5h2"/></>);
Ic.Note = mk(<><path d="M3 2.5h7L13 5v8.5H3v-11Z"/><path d="M9.5 2.5V5h3M5 8h6M5 11h4"/></>);
Ic.Identity = mk(<><circle cx="8" cy="6.5" r="2.5"/><path d="M3.5 13c.5-2.2 2.4-3.5 4.5-3.5s4 1.3 4.5 3.5"/></>);
Ic.Trash = mk(<><path d="M3 4h10M6 4V2.5h4V4M5 4l.7 9h4.6L11 4"/></>);
Ic.Edit = mk(<><path d="M11 2.5 13.5 5l-8 8H3v-2.5l8-8Z"/></>);
Ic.Refresh = mk(<><path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9"/><path d="M14 2.5V5h-2.5"/></>);
Ic.ChevronRight = mk(<path d="m6 4 4 4-4 4"/>);
Ic.ChevronDown = mk(<path d="m4 6 4 4 4-4"/>);
Ic.ChevronLeft = mk(<path d="m10 4-4 4 4 4"/>);
Ic.Upload = mk(<><path d="M8 11V3M5 6l3-3 3 3M3 13h10"/></>);
Ic.Download = mk(<><path d="M8 3v8M5 8l3 3 3-3M3 13h10"/></>);
Ic.Alert = mk(<><circle cx="8" cy="8" r="6.5"/><path d="M8 5v3.5M8 10.5v.5"/></>);
Ic.Info = mk(<><circle cx="8" cy="8" r="6.5"/><path d="M8 7v4M8 5v.5"/></>);
Ic.Folder = mk(<path d="M2 4.5A1 1 0 0 1 3 3.5h3l1.5 1.5h5.5a1 1 0 0 1 1 1V12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4.5Z"/>);
Ic.Globe = mk(<><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c1.7 2 2.5 4 2.5 6S9.7 14 8 14M8 2C6.3 4 5.5 6 5.5 8S6.3 14 8 14"/></>);
Ic.Mail = mk(<><rect x="2" y="3.5" width="12" height="9" rx="1.5"/><path d="m2.5 5 5.5 4 5.5-4"/></>);
Ic.Briefcase = mk(<><rect x="2" y="5" width="12" height="8" rx="1.5"/><path d="M6 5V3.5h4V5M2 9h12"/></>);
Ic.Home = mk(<><path d="m2 8 6-5 6 5"/><path d="M3.5 7.5V13h9V7.5"/></>);
Ic.Heart = mk(<path d="M8 13s-5-3-5-7a3 3 0 0 1 5-2.2A3 3 0 0 1 13 6c0 4-5 7-5 7Z"/>);
Ic.Filter = mk(<path d="M2.5 3h11l-4 5v5l-3-1.5V8l-4-5Z"/>);
Ic.Sort = mk(<><path d="M4 3v10M4 13l-2-2M4 13l2-2"/><path d="M12 13V3M12 3l-2 2M12 3l2 2"/></>);
Ic.More = mk(<><circle cx="3.5" cy="8" r="1" fill="currentColor"/><circle cx="8" cy="8" r="1" fill="currentColor"/><circle cx="12.5" cy="8" r="1" fill="currentColor"/></>);
Ic.Logout = mk(<><path d="M9 3.5H4A1 1 0 0 0 3 4.5v7a1 1 0 0 0 1 1h5"/><path d="M11 5.5 13.5 8 11 10.5M13.5 8H7"/></>);
Ic.Clock = mk(<><circle cx="8" cy="8" r="6"/><path d="M8 4.5V8l2 1.5"/></>);
Ic.Users = mk(<><circle cx="6" cy="6.5" r="2.5"/><path d="M2 13c.5-2.2 2-3.5 4-3.5s3.5 1.3 4 3.5"/><circle cx="12" cy="6.5" r="2"/><path d="M11 9.5c1.5 0 2.5 1 3 3"/></>);

window.Ic = Ic;

// ─── SafeKeep logo (polished from existing lock mark) ───
function Logo({ size = 22, color }) {
  const c = color || "var(--accent)";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="6" fill={c}/>
      <path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11"
            stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none"/>
      <rect x="6.5" y="11" width="11" height="8" rx="2" fill="white"/>
      <circle cx="12" cy="14.5" r="1.4" fill={c}/>
      <rect x="11.4" y="14.5" width="1.2" height="2.4" rx="0.4" fill={c}/>
    </svg>
  );
}
window.Logo = Logo;

// ─── Toasts (clipboard timer etc.) ───
function ToastStack({ toasts }) {
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className="toast">
          <span>{t.message}</span>
          {t.count != null && <span className="count">{t.count}s</span>}
        </div>
      ))}
    </div>
  );
}
window.ToastStack = ToastStack;

// ─── Tag-from-domain helper ───
function siteInitial(website) {
  if (!website) return "·";
  const cleaned = website.replace(/^https?:\/\//, "").replace(/^www\./, "");
  return cleaned.charAt(0).toUpperCase();
}
function siteColorClass(website) {
  // deterministic muted background from string
  const hash = [...(website || "")].reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = [220, 200, 180, 30, 60, 280, 340, 250];
  const h = hues[hash % hues.length];
  return { background: `oklch(0.94 0.04 ${h})`, color: `oklch(0.4 0.10 ${h})`, borderColor: `oklch(0.88 0.04 ${h})` };
}
window.siteInitial = siteInitial;
window.siteColorClass = siteColorClass;

// ─── Password strength (zxcvbn-ish, simplified) ───
function scorePassword(pw) {
  if (!pw) return { score: 0, label: "Empty", entropy: 0 };
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
  const len = pw.length;
  const entropy = Math.round(len * Math.log2(Math.max(pool, 2)));
  // common-password-ish penalty
  const common = ["password", "123456", "qwerty", "letmein", "welcome", "admin", "iloveyou"];
  const isCommon = common.some(w => pw.toLowerCase().includes(w));
  const repeats = /(.)\1{2,}/.test(pw);
  let score;
  if (isCommon || len < 6) score = 1;
  else if (entropy < 35 || repeats) score = 2;
  else if (entropy < 60) score = 3;
  else if (entropy < 90) score = 4;
  else score = 5;
  const labels = ["Empty", "Very weak", "Weak", "Fair", "Strong", "Very strong"];
  return { score, label: labels[score], entropy };
}
window.scorePassword = scorePassword;

// ─── Generator ───
function generatePassword({ length = 18, upper = true, lower = true, digits = true, symbols = true, ambiguous = false } = {}) {
  let pool = "";
  if (lower) pool += "abcdefghijkmnopqrstuvwxyz" + (ambiguous ? "l" : "");
  if (upper) pool += "ABCDEFGHJKLMNPQRSTUVWXYZ" + (ambiguous ? "IO" : "");
  if (digits) pool += "23456789" + (ambiguous ? "01" : "");
  if (symbols) pool += "!@#$%^&*-_=+?";
  if (!pool) pool = "abcdefghijklmnopqrstuvwxyz";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < length; i++) out += pool[arr[i] % pool.length];
  return out;
}
window.generatePassword = generatePassword;
