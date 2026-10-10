const AUTH_KEY = "david_admin_auth";
const DEFAULT_PASSWORD = "1234";

function nonEmptyString(value) {
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function getAdminPassword() {
  try {
    if (typeof process !== "undefined" && process.env && process.env.ADMIN_PASSWORD) {
      const fromProcess = nonEmptyString(process.env.ADMIN_PASSWORD);
      if (fromProcess) {
        return fromProcess;
      }
    }
    if (typeof import.meta !== "undefined" && import.meta.env) {
      return (
        nonEmptyString(import.meta.env.ADMIN_PASSWORD) ||
        nonEmptyString(import.meta.env.VITE_ADMIN_PASSWORD) ||
        nonEmptyString(import.meta.env.NEXT_PUBLIC_ADMIN_PASSWORD) ||
        null
      );
    }
  } catch (error) {
    console.error("Error reading admin password env:", error);
  }
  return null;
}

function resolveExpectedPassword() {
  const configured = getAdminPassword();
  if (configured) {
    return configured;
  }
  const isDev =
    typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV === true;
  return isDev ? DEFAULT_PASSWORD : null;
}

/** @returns {{ ok: true } | { ok: false, reason: "wrong" | "missing" }} */
export function loginAdmin(password) {
  try {
    const expected = resolveExpectedPassword();
    if (!expected) {
      return { ok: false, reason: "missing" };
    }
    if (password !== expected) {
      return { ok: false, reason: "wrong" };
    }
    localStorage.setItem(AUTH_KEY, "true");
    return { ok: true };
  } catch (error) {
    console.error("Error reading admin password env:", error);
    return { ok: false, reason: "missing" };
  }
}

export function logoutAdmin() {
  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem("david-taxi-admin-authenticated");
  } catch {
    // ignore storage errors
  }
}

export function isAdminAuthenticated() {
  try {
    if (localStorage.getItem(AUTH_KEY) === "true") {
      return true;
    }
    if (localStorage.getItem("david-taxi-admin-authenticated") === "true") {
      localStorage.setItem(AUTH_KEY, "true");
      localStorage.removeItem("david-taxi-admin-authenticated");
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
