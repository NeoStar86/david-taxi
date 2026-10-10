const AUTH_KEY = "david_admin_auth";
const DEFAULT_PASSWORD = "1234";

export function getAdminPassword() {
  try {
    const fromVite =
      typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_ADMIN_PASSWORD;
    const fromNext =
      typeof import.meta !== "undefined" &&
      import.meta.env &&
      import.meta.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    for (const value of [fromVite, fromNext]) {
      if (typeof value === "string" && value.length > 0) {
        return value;
      }
    }
  } catch {
    // env may be unavailable in some runtimes
  }
  return DEFAULT_PASSWORD;
}

export function loginAdmin(password) {
  try {
    const adminPassword = getAdminPassword();
    if (password !== adminPassword) {
      return false;
    }
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  } catch {
    return false;
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
