// Parses every ```dbml fence in the docs site.
//
// A schema that fails to parse still builds fine — the page renders an error
// box instead of a diagram, and nothing fails the build. This catches that.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { Parser } from "@dbml/core";

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

const FENCE = /^```dbml([^\n]*)\n([\s\S]*?)^```/gm;

let checked = 0;
let failed = 0;

for (const file of walk("example/docs")) {
  if (!/\.mdx?$/.test(file)) continue;
  const source = readFileSync(file, "utf8");

  for (const match of source.matchAll(FENCE)) {
    checked += 1;
    try {
      Parser.parse(match[2], "dbmlv2");
    } catch (error) {
      failed += 1;
      const line = source.slice(0, match.index).split("\n").length;
      const detail = error?.diags?.[0]?.message ?? error?.message ?? String(error);
      console.error(`FAIL ${file}:${line} — ${detail}`);
    }
  }
}

console.log(`${checked} dbml fences checked, ${failed} failed`);
process.exit(failed ? 1 : 0);
