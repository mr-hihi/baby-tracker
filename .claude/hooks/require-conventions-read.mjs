#!/usr/bin/env node
// Tier 2b reading-discipline hook (PreToolUse Edit|Write|MultiEdit): blocks editing a package's source
// until that package's own Implement docs were Read this session — package-local, no root fallback.
// Fails open on unparseable input.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

let s = "";
process.stdin.on("data", (d) => (s += d)).on("end", () => {
  let fp = "";
  let sid = "nosession";
  try {
    const j = JSON.parse(s);
    fp = j?.tool_input?.file_path ?? "";
    sid = j?.session_id || "nosession";
  } catch {
    return; // fail open
  }
  if (!fp) return;
  if (!/\.(ts|tsx|js|jsx)$/.test(fp)) return; // only real source
  if (/node_modules|\.spec\.|\.test\./.test(fp)) return; // skip deps + tests

  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const log = join(projectDir, ".claude", "temp", `reads-${sid}.log`);
  let reads = "";
  try {
    reads = readFileSync(log, "utf8");
  } catch {
    // no read-log → nothing read → block below
  }

  // owning package = nearest ancestor of the edited file that has an AGENTS.md, BELOW the repo root
  let pkgRoot = null;
  let dir = dirname(fp);
  while (dir.length > projectDir.length && dir.startsWith(projectDir)) {
    if (existsSync(join(dir, "AGENTS.md"))) {
      pkgRoot = dir;
      break;
    }
    dir = dirname(dir);
  }

  const readAt = (base, name) => reads.includes(join(base, "docs", name));

  // Require the Implement-phase docs of the file's OWNING package — the sub-package for a monorepo
  // file, else the repo root. Package-LOCAL: only docs that package actually ships are required; a
  // doc it doesn't have is skipped (no root fallback). Each edited package is gated by its own docs.
  const base = pkgRoot || projectDir;
  const rel = base === projectDir ? "" : base.slice(projectDir.length + 1);
  const d = rel ? `${rel}/docs` : "docs";

  const need = [];
  for (const name of ["coding-conventions.md", "testing-strategy.md"]) {
    if (existsSync(join(base, "docs", name)) && !readAt(base, name)) need.push(`${d}/${name}`);
  }
  if (need.length === 0) return;

  console.error(
`Blocked: editing ${rel || "workspace-root"} source before reading its Implement-phase docs this session.
Read ${need.join(" + ")} — then edit.
(Implement-phase reading -- AGENTS.md -> AI Agent Guidelines -> Workflow Process.)`,
  );
  process.exit(2);
});
