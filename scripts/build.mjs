import { spawnSync } from "node:child_process";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";
import { getViteEnvDefine } from "./envDefine.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

await mkdir(path.join(dist, "assets"), { recursive: true });

const html = await readFile(path.join(root, "index.html"), "utf8");
await writeFile(
  path.join(dist, "index.html"),
  html.replace(
    '<script type="module" src="/src/main.jsx"></script>',
    '<link rel="stylesheet" href="/assets/index.css" />\n    <script type="module" src="/assets/main.js"></script>',
  ),
);

await esbuild.build({
  absWorkingDir: root,
  entryPoints: ["src/main.jsx"],
  bundle: true,
  outfile: "dist/assets/main.js",
  format: "esm",
  jsx: "automatic",
  minify: true,
  loader: { ".js": "jsx" },
  define: getViteEnvDefine(root),
  plugins: [
    {
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
    },
  ],
});

const tailwindBin = path.join(root, "node_modules", "@tailwindcss", "cli", "dist", "index.mjs");
const css = spawnSync(
  process.execPath,
  [tailwindBin, "-i", "src/index.css", "-o", "dist/assets/index.css", "--minify"],
  { cwd: root, stdio: "inherit" },
);

if (css.status !== 0) {
  process.exit(css.status ?? 1);
}

await cp(path.join(root, "public"), dist, { recursive: true, force: true });

const builtIndex = await readFile(path.join(dist, "index.html"), "utf8");
await writeFile(path.join(dist, "404.html"), builtIndex);
