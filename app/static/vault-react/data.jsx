// data.jsx — API layer for Flask backend
// Replaces the static SEED_VAULT with real API calls

// ─── Helpers ─────────────────────────────────────────────
function siteInitial(site = "") {
  return (site.replace(/^https?:\/\/(www\.)?/, "")[0] || "?").toUpperCase();
}

const PALETTE = [
  { bg: "oklch(0.92 0.05 250)", color: "oklch(0.38 0.12 250)" },
  { bg: "oklch(0.92 0.05 155)", color: "oklch(0.38 0.12 155)" },
  { bg: "oklch(0.92 0.05 75)",  color: "oklch(0.38 0.12 75)"  },
  { bg: "oklch(0.92 0.05 310)", color: "oklch(0.38 0.12 310)" },
  { bg: "oklch(0.92 0.05 25)",  color: "oklch(0.38 0.12 25)"  },
  { bg: "oklch(0.92 0.05 190)", color: "oklch(0.38 0.12 190)" },
];

function siteColorClass(site = "") {
  const idx = (site.charCodeAt(0) || 0) % PALETTE.length;
  return PALETTE[idx];
}

function scorePassword(pw = "") {
  if (!pw) return { score: 0, label: "—", entropy: 0 };
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
  const entropy = Math.floor(pw.length * Math.log2(pool || 1));
  let score = 0;
  if (entropy >= 20) score = 1;
  if (entropy >= 40) score = 2;
  if (entropy >= 60) score = 3;
  if (entropy >= 80) score = 4;
  if (entropy >= 100) score = 5;
  const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"];
  return { score, label: labels[score], entropy };
}

function generatePassword({ length = 16, upper = true, lower = true, digits = true, symbols = true, ambiguous = false } = {}) {
  let chars = "";
  if (lower)   chars += ambiguous ? "abcdefghijklmnopqrstuvwxyz" : "abcdefghjkmnpqrstuvwxyz";
  if (upper)   chars += ambiguous ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "ABCDEFGHJKMNPQRSTUVWXYZ";
  if (digits)  chars += ambiguous ? "0123456789" : "23456789";
  if (symbols) chars += "!@#$%^&*-_=+";
  if (!chars)  chars = "abcdefghijklmnopqrstuvwxyz";
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, n => chars[n % chars.length]).join("");
}

// ─── API calls ────────────────────────────────────────────
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
    ...options,
  });
  if (res.status === 401) {
    window.location.href = "/auth/login";
    return null;
  }
  if (!res.ok) throw new Error("API error: " + res.status);
  return res.json();
}

async function loadCredentials() {
  const data = await apiFetch("/api/credentials");
  if (!data) return [];
  // Detect reused passwords
  const pwCounts = {};
  data.forEach(c => { pwCounts[c.password] = (pwCounts[c.password] || 0) + 1; });
  return data.map(c => {
    const strength = scorePassword(c.password);
    return {
      id: c.id,
      type: "login",
      name: c.website,
      website: c.website,
      username: c.username,
      password: c.password,
      folder: "Personal",
      favorite: false,
      lastUsed: "recently",
      health: strength.score >= 4 ? "strong" : strength.score <= 2 ? "weak" : "fair",
      reused: pwCounts[c.password] > 1,
      breached: false,
    };
  });
}

async function createCredential({ website, username, password }) {
  return apiFetch("/api/credentials", {
    method: "POST",
    body: JSON.stringify({ website, username, password }),
  });
}

async function updateCredential(id, { website, username, password }) {
  return apiFetch("/api/credentials/" + id, {
    method: "PUT",
    body: JSON.stringify({ website, username, password }),
  });
}

async function deleteCredential(id) {
  return apiFetch("/api/credentials/" + id, { method: "DELETE" });
}

async function loadCurrentUser() {
  try {
    return await apiFetch("/api/me");
  } catch {
    return null;
  }
}

window.siteInitial = siteInitial;
window.siteColorClass = siteColorClass;
window.scorePassword = scorePassword;
window.generatePassword = generatePassword;
window.loadCredentials = loadCredentials;
window.createCredential = createCredential;
window.updateCredential = updateCredential;
window.deleteCredential = deleteCredential;
window.loadCurrentUser = loadCurrentUser;
