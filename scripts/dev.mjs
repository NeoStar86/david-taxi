import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync, watch } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import { getViteEnvDefine } from "./envDefine.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const port = 5173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
};

async function writeHtml() {
  const html = await readFile(path.join(root, "index.html"), "utf8");
  const out = html.replace(
    '<script type="module" src="/src/main.jsx"></script>',
    '<link rel="stylesheet" href="/assets/index.css" />\n    <script type="module" src="/assets/main.js"></script>',
  );
  await mkdir(path.join(dist, "assets"), { recursive: true });
  await writeFile(path.join(dist, "index.html"), out);
}

function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const candidates = [
    path.join(dist, clean === "/" ? "index.html" : clean),
    path.join(root, "public", clean),
  ];
  const file = candidates.find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
  if (file) return file;
  if (!path.extname(clean)) {
    const spaIndex = path.join(dist, "index.html");
    if (existsSync(spaIndex)) return spaIndex;
  }
  return null;
}

await writeHtml();

const ignoreCss = {
  name: "ignore-css",
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, (args) => ({
      path: args.path,
      namespace: "ignore-css",
    }));
    build.onLoad({ filter: /.*/, namespace: "ignore-css" }, () => ({
      contents: "",
      loader: "js",
    }));
  },
};

const ctx = await esbuild.context({
  absWorkingDir: root,
  entryPoints: ["src/main.jsx"],
  bundle: true,
  outfile: "dist/assets/main.js",
  format: "esm",
  jsx: "automatic",
  loader: { ".js": "jsx" },
  define: getViteEnvDefine(root),
  plugins: [ignoreCss],
});

await ctx.watch();

const tailwindBin = path.join(root, "node_modules", "@tailwindcss", "cli", "dist", "index.mjs");

function buildCss() {
  const result = spawnSync(
    process.execPath,
    [tailwindBin, "-i", "src/index.css", "-o", "dist/assets/index.css"],
    { cwd: root, stdio: "inherit" },
  );
  if (result.status !== 0) {
    console.error("Tailwind build failed");
  }
}

buildCss();
watch(path.join(root, "src"), { recursive: true }, () => {
  clearTimeout(buildCss.timer);
  buildCss.timer = setTimeout(buildCss, 80);
});

createServer((req, res) => {
  const file = resolveFile(req.url || "/");
  if (!file) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(port, "127.0.0.1", () => {
  console.log(`David Taxi running at http://127.0.0.1:${port}`);
});

function shutdown() {
  ctx.dispose();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
