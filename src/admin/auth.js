const SESSION_KEY = "david-taxi-admin-session";
const SESSION_MS = 1000 * 60 * 60 * 24;
const DEFAULT_USERNAME = "david";
const DEFAULT_PASSWORD = "1234";

export function getAdminUsername() {
  const configured = import.meta.env.VITE_ADMIN_USERNAME;
  if (typeof configured === "string" && configured.trim()) {
    return configured.trim();
  }
  return DEFAULT_USERNAME;
}

export function getAdminPassword() {
  const configured = import.meta.env.VITE_ADMIN_PASSWORD;
  if (typeof configured === "string" && configured.length > 0) {
    return configured;
  }
  return DEFAULT_PASSWORD;
}

export function loginAdmin(username, password) {
  const expectedUser = getAdminUsername();
  const expectedPassword = getAdminPassword();
  const normalizedUser = username.trim();

  if (normalizedUser !== expectedUser || password !== expectedPassword) {
    return false;
  }

  const expiresAt = Date.now() + SESSION_MS;
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      expiresAt,
      username: expectedUser,
      token: btoa(`${expectedUser}:${expiresAt}`),
    }),
  );
  return true;
}

export function logoutAdmin() {
  localStorage.removeItem(SESSION_KEY);
}

export function isAdminAuthenticated() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    if (!session?.expiresAt || Date.now() > session.expiresAt) {
      logoutAdmin();
      return false;
    }
    if (session.username && session.username !== getAdminUsername()) {
      logoutAdmin();
      return false;
    }
    return true;
  } catch {
    logoutAdmin();
    return false;
  }
}
