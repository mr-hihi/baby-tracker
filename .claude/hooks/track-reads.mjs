#!/usr/bin/env node
// Tier 2a reading-discipline hook (PostToolUse Read): records each Read to reads-<session_id>.log for
// the write-gate (require-conventions-read.mjs) to check.
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
let s = "";
process.stdin.on("data", (d) => (s += d)).on("end", () => {
  try {
    const j = JSON.parse(s);
    const fp = j?.tool_input?.file_path;
    if (!fp) return;
    const sid = j?.session_id || "nosession";
    const dir = process.env.CLAUDE_PROJECT_DIR || ".";
    const log = join(dir, ".claude", "temp", `reads-${sid}.log`);
    mkdirSync(dirname(log), { recursive: true });
    appendFileSync(log, fp + "\n");
  } catch {
    // best-effort tracker — never block on Read
  }
});
