const AUTH_KEY = "david-taxi-admin-authenticated";
const DEFAULT_PASSWORD = "1234";

function configuredPassword() {
  const fromVite = import.meta.env.VITE_ADMIN_PASSWORD;
  const fromNext = import.meta.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  for (const value of [fromVite, fromNext]) {
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return null;
}

export function getAdminPassword() {
  return configuredPassword() ?? DEFAULT_PASSWORD;
}

export function loginAdmin(password) {
  if (password !== getAdminPassword()) {
    return false;
  }
  localStorage.setItem(AUTH_KEY, "true");
  return true;
}

export function logoutAdmin() {
  localStorage.removeItem(AUTH_KEY);
}

export function isAdminAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === "true";
}
