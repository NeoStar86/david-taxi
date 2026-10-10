import { useState } from "react";
import { isAdminConfigured, loginAdmin } from "./auth";

export default function AdminLogin({ onSuccess }) {
  const [username, setUsername] = useState("david");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!isAdminConfigured()) {
      setError("הגדרות התחברות חסרות. הוסיפו VITE_ADMIN_USERNAME ו-VITE_ADMIN_PASSWORD לקובץ .env");
      return;
    }

    if (!loginAdmin(username, password)) {
      setError("סיסמה או שם משתמש שגויים");
      return;
    }

    onSuccess();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-10 text-cream">
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-md p-6 sm:p-8">
        <p className="section-kicker">David Taxi Admin</p>
        <h1 className="mt-2 text-2xl font-extrabold">כניסה לניהול האתר</h1>
        <p className="mt-3 text-sm text-cream/70">הזינו שם משתמש וסיסמה כדי לערוך תוכן דינמי.</p>

        <label className="mt-6 block">
          <span className="text-sm font-bold">שם משתמש</span>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
            autoComplete="username"
            required
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-bold">סיסמה</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="mt-3 text-sm font-semibold text-gold">{error}</p>}

        <button type="submit" className="btn-primary mt-6 min-h-12 w-full">
          התחברות
        </button>
      </form>
    </div>
  );
}
