const AUTH_KEY = "admin_logged_in";
const PASSWORD_KEY = "admin_password";
const DEFAULT_PASSWORD = "1234";

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

/** @returns {{ ok: true } | { ok: false }} */
export function loginAdmin(password) {
  try {
    const expected = getStoredAdminPassword();
    const entered = String(password ?? "").trim();
    if (entered !== expected) {
      return { ok: false };
    }
    localStorage.setItem(AUTH_KEY, "true");
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/** @returns {{ ok: true, message: string } | { ok: false, error: string }} */
export function changeAdminPassword(currentPassword, newPassword, confirmPassword) {
  try {
    const stored = getStoredAdminPassword();
    const current = String(currentPassword ?? "").trim();
    const next = String(newPassword ?? "").trim();
    const confirm = String(confirmPassword ?? "").trim();

    if (current !== stored) {
      return { ok: false, error: "הסיסמה הנוכחית שגויה" };
    }
    if (next !== confirm) {
      return { ok: false, error: "הסיסמאות אינן תואמות" };
    }
    if (next.length === 0) {
      return { ok: false, error: "יש להזין סיסמה חדשה" };
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
