const SESSION_KEY = "david-taxi-admin-session";
const SESSION_MS = 1000 * 60 * 60 * 24;

export function getAdminUsername() {
  return import.meta.env.VITE_ADMIN_USERNAME ?? "david";
}

export function getAdminPassword() {
  return import.meta.env.VITE_ADMIN_PASSWORD ?? "";
}

export function isAdminConfigured() {
  return Boolean(getAdminUsername() && getAdminPassword());
}

export function loginAdmin(username, password) {
  const expectedUser = getAdminUsername();
  const expectedPassword = getAdminPassword();

  if (!expectedPassword) return false;
  if (username.trim() !== expectedUser || password !== expectedPassword) return false;

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
