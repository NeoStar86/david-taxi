export const THEME_PRESETS = {
  gold: { accent: "#f5c518", accentDeep: "#d9a800", label: "זהב" },
  blue: { accent: "#3b82f6", accentDeep: "#2563eb", label: "כחול" },
  green: { accent: "#22c55e", accentDeep: "#16a34a", label: "ירוק" },
};

export function createDefaultTheme() {
  return {
    mode: "dark",
    accent: "#f5c518",
    accentDeep: "#d9a800",
    headerBg: "#070708",
    cardBg: "#16161f",
    pageBg: "#070708",
    pageBgSoft: "#121218",
    textColor: "#f7f4ec",
  };
}
