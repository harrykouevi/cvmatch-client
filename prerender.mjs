// Build-time prerender for the homepage ("/") only.
// Renders the REAL App component tree to static HTML and injects it into
// dist/index.html so crawlers see the same hero content users see.
// No SSR server at runtime — this runs once during `npm run build`.

import { build } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = __dirname;
const distIndex = resolve(root, "dist/index.html");
const ssrOutDir = resolve(root, ".ssr-tmp");

async function run() {
  // 1. Build an SSR bundle of the server entry into a temp dir.
  await build({
    root,
    logLevel: "warn",
    build: {
      ssr: resolve(root, "src/entry-server.jsx"),
      outDir: ssrOutDir,
      emptyOutDir: true,
      rollupOptions: { output: { entryFileNames: "entry-server.mjs" } },
    },
  });

  // 2. Import the compiled render() and produce homepage HTML.
  // const { render } = await import(resolve(ssrOutDir, "entry-server.mjs"));
  const entryPath = resolve(ssrOutDir, "entry-server.mjs");
  const { render } = await import(pathToFileURL(entryPath).href);
  const appHtml = render("/");

  // 3. Inject into the built dist/index.html inside <div id="root"></div>.
  let html = readFileSync(distIndex, "utf-8");
  if (!html.includes('<div id="root"></div>')) {
    throw new Error('Could not find empty <div id="root"></div> in dist/index.html');
  }
  html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  writeFileSync(distIndex, html, "utf-8");

  // 4. Clean up temp SSR output.
  rmSync(ssrOutDir, { recursive: true, force: true });

  console.log("[prerender] homepage injected into dist/index.html");
}

run().catch((err) => {
  console.error("[prerender] failed:", err);
  process.exit(1);
});
