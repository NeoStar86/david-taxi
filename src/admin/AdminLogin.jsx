import { useRef, useState } from "react";
import { loginAdmin } from "./auth";

export default function AdminLogin({ onSuccess }) {
  const formRef = useRef(null);
  const [username, setUsername] = useState("david");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function attemptLogin() {
    setError("");
    setSubmitting(true);

    const ok = loginAdmin(username, password);
    if (!ok) {
      setError("סיסמה שגויה, נסה שוב");
      setSubmitting(false);
      return;
    }

    onSuccess();
    setSubmitting(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    attemptLogin();
  }

  function handleEnter(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-10 text-cream">
      <form ref={formRef} onSubmit={handleSubmit} className="glass-card w-full max-w-md p-6 sm:p-8">
        <p className="section-kicker">David Taxi Admin</p>
        <h1 className="mt-2 text-2xl font-extrabold">כניסה לניהול האתר</h1>
        <p className="mt-3 text-sm text-cream/70">הזינו שם משתמש וסיסמה כדי לערוך תוכן דינמי.</p>

        <label className="mt-6 block">
          <span className="text-sm font-bold">שם משתמש</span>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            onKeyDown={handleEnter}
            className="mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
            autoComplete="username"
            required
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-bold">סיסמה</span>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={handleEnter}
            className="mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20"
            autoComplete="current-password"
            required
          />
        </label>

        {error && (
          <p className="mt-3 text-sm font-semibold text-gold" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary mt-6 min-h-12 w-full">
          {submitting ? "מתחבר..." : "התחברות"}
        </button>
      </form>
    </div>
  );
}
