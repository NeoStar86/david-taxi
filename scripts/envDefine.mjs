import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export function getViteEnvDefine(root) {
  const define = {
    "import.meta.env.DEV": JSON.stringify(process.env.NODE_ENV !== "production"),
    "import.meta.env.PROD": JSON.stringify(process.env.NODE_ENV === "production"),
    "import.meta.env.MODE": JSON.stringify(process.env.NODE_ENV === "production" ? "production" : "development"),
  };

  const envPath = path.join(root, ".env");
  if (!existsSync(envPath)) return define;

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key.startsWith("VITE_") || key === "NEXT_PUBLIC_ADMIN_PASSWORD") {
      define[`import.meta.env.${key}`] = JSON.stringify(value);
    }
  }

  return define;
}
