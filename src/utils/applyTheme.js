function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return "245, 197, 24";
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

export function applyTheme(theme) {
  if (typeof document === "undefined" || !theme) return;

  const root = document.documentElement;
  const isLight = theme.mode === "light";

  const pageBg = isLight ? "#f4f1e8" : theme.pageBg || "#070708";
  const pageBgSoft = isLight ? "#ebe6da" : theme.pageBgSoft || "#121218";
  const textColor = isLight ? "#070708" : theme.textColor || "#f7f4ec";
  const cardBg = isLight ? "#ffffff" : theme.cardBg || "#16161f";
  const headerBg = isLight ? "#f4f1e8" : theme.headerBg || "#070708";

  root.style.setProperty("--color-gold", theme.accent || "#f5c518");
  root.style.setProperty("--color-gold-deep", theme.accentDeep || "#d9a800");
  root.style.setProperty("--color-gold-glow", `rgba(${hexToRgb(theme.accent || "#f5c518")}, 0.35)`);
  root.style.setProperty("--color-ink", pageBg);
  root.style.setProperty("--color-ink-soft", pageBgSoft);
  root.style.setProperty("--color-cream", textColor);
  root.style.setProperty("--color-panel", cardBg);
  root.style.setProperty("--site-header-bg", headerBg);
  root.style.setProperty("--site-card-bg", cardBg);
  root.dataset.siteTheme = isLight ? "light" : "dark";
}
