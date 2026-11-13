// Builds ./ready-site — a version that opens by double-clicking index.html (file://),
// no web server needed. Vite's normal build emits <script type="module">, which browsers
// block on file://, so here esbuild bundles everything into one classic (IIFE) script.
//
//   npm run build:static
import { build } from "esbuild";
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "ready-site");
const nodePaths = process.env.NODE_PATH ? process.env.NODE_PATH.split(":") : [];

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "assets"), { recursive: true });

await build({
  entryPoints: [join(root, "src/main.tsx")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2020", "safari15"],
  jsx: "automatic",
  minify: true,
  legalComments: "none",
  define: { "process.env.NODE_ENV": '"production"' },
  outfile: join(out, "assets/app.js"),
  nodePaths,
  logLevel: "info"
});

const html = readFileSync(join(root, "index.html"), "utf8")
  .replace(/\s*<script type="module" src="\/src\/main.tsx"><\/script>/, "")
  .replace("</head>", '  <link rel="stylesheet" href="./assets/app.css" />\n  <script defer src="./assets/app.js"></script>\n</head>');
writeFileSync(join(out, "index.html"), html);
copyFileSync(join(root, "public/favicon.svg"), join(out, "favicon.svg"));
console.log("✔ ready-site built →", out);
