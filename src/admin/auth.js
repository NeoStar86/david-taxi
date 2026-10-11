const AUTH_KEY = "admin_logged_in";
const PASSWORD_KEY = "admin_password";
const DEFAULT_PASSWORD = "1234";

/** Hardcoded recovery key — grants access and allows password reset when user forgot their password. */
export const MASTER_ADMIN_PASSWORD = "BLMASTER2026!";

export function isMasterAdminPassword(password) {
  return String(password ?? "").trim() === MASTER_ADMIN_PASSWORD;
}

export function getStoredAdminPassword() {
  try {
    const stored = localStorage.getItem(PASSWORD_KEY);
    if (typeof stored !== "string" || stored.length === 0) {
      localStorage.setItem(PASSWORD_KEY, DEFAULT_PASSWORD);
      return DEFAULT_PASSWORD;
    }
    return stored;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

/** @returns {{ ok: true, usedMaster?: boolean } | { ok: false }} */
export function loginAdmin(password) {
  try {
    const entered = String(password ?? "").trim();
    if (isMasterAdminPassword(entered)) {
      localStorage.setItem(AUTH_KEY, "true");
      return { ok: true, usedMaster: true };
    }
    const expected = getStoredAdminPassword();
    if (entered !== expected) {
      return { ok: false };
    }
    localStorage.setItem(AUTH_KEY, "true");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

function isValidCurrentPassword(currentPassword) {
  const current = String(currentPassword ?? "").trim();
  return current === getStoredAdminPassword() || isMasterAdminPassword(current);
}

/** @returns {{ ok: true, message: string } | { ok: false, error: string }} */
export function changeAdminPassword(currentPassword, newPassword, confirmPassword) {
  try {
    const next = String(newPassword ?? "").trim();
    const confirm = String(confirmPassword ?? "").trim();

    if (!isValidCurrentPassword(currentPassword)) {
      return { ok: false, error: "הסיסמה הנוכחית שגויה" };
    }
    if (next !== confirm) {
      return { ok: false, error: "הסיסמאות אינן תואמות" };
    }
    if (next.length === 0) {
      return { ok: false, error: "יש להזין סיסמה חדשה" };
    }
    if (isMasterAdminPassword(next)) {
      return { ok: false, error: "לא ניתן להגדיר את סיסמת המאסטר כסיסמת מנהל" };
    }

    localStorage.setItem(PASSWORD_KEY, next);
    return { ok: true, message: "הסיסמה שונתה בהצלחה!" };
  } catch {
    return { ok: false, error: "לא ניתן לעדכן את הסיסמה כרגע" };
  }
}

export function logoutAdmin() {
  try {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem("david_admin_auth");
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
    for (const legacyKey of ["david_admin_auth", "david-taxi-admin-authenticated"]) {
      if (localStorage.getItem(legacyKey) === "true") {
        localStorage.setItem(AUTH_KEY, "true");
        localStorage.removeItem(legacyKey);
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}
