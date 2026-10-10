import { useState } from "react";
import { readImageFileAsDataUrl } from "../utils/imageUpload";

const inputClass =
  "mt-2 w-full min-h-12 rounded-xl border border-white/15 bg-ink/80 px-4 py-3 text-base outline-none focus:border-gold/60 focus:ring-2 focus:ring-gold/20";

export default function AdminImageField({ label, value, onUpdate }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    setBusy(true);
    try {
      const dataUrl = await readImageFileAsDataUrl(file);
      onUpdate(dataUrl, { persist: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "שגיאה בהעלאת התמונה");
    } finally {
      setBusy(false);
    }
  }

  const urlValue = value?.startsWith("data:") ? "" : (value ?? "");

  return (
    <div className="rounded-2xl border border-white/10 bg-ink/40 p-4">
      <p className="text-sm font-bold">{label}</p>
      <label className="mt-3 flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-dashed border-gold/40 bg-gold/5 px-4 py-3 text-sm font-bold text-gold transition hover:bg-gold/10">
        {busy ? "מעבד תמונה..." : "בחירת תמונה מהגלריה / מהמחשב"}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
          disabled={busy}
        />
      </label>

      {error && (
        <p className="mt-2 text-xs font-semibold text-gold" role="alert">
          {error}
        </p>
      )}

      {value ? (
        <div className="mt-3 space-y-2">
          <img src={value} alt={label} className="h-36 w-full rounded-xl border border-white/10 object-cover" />
          <button
            type="button"
            className="text-xs font-bold text-cream/70 underline"
            onClick={() => onUpdate("", { persist: true })}
          >
            הסרת תמונה
          </button>
        </div>
      ) : (
        <p className="mt-2 text-xs text-cream/50">אין תמונה — בחרו קובץ להעלאה</p>
      )}

      <label className="mt-4 block">
        <span className="text-xs font-bold text-cream/60">או הדבקת קישור (URL)</span>
        <input
          className={inputClass}
          value={urlValue}
          onChange={(event) => onUpdate(event.target.value, { persist: false })}
          placeholder="https://..."
        />
      </label>
    </div>
  );
}
