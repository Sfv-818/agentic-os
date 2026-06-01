import { spawn } from "node:child_process";

const isWin = process.platform === "win32";

/**
 * Check whether a CLI command is resolvable on this machine.
 * Returns { found: boolean, ms: number }.
 */
export function probeCommand(command) {
  const start = Date.now();
  return new Promise((resolve) => {
    const finder = isWin ? "where" : "which";
    const child = spawn(finder, [command], { shell: true });
    let found = false;
    child.stdout.on("data", (d) => {
      if (String(d).trim().length > 0) found = true;
    });
    child.on("error", () => resolve({ found: false, ms: Date.now() - start }));
    child.on("close", (code) =>
      resolve({ found: found && code === 0, ms: Date.now() - start })
    );
  });
}

/**
 * Run an agent CLI one-shot, feeding the prompt over stdin.
 * Works with `claude -p` (headless print mode) and similar agents that
 * read a prompt from stdin. Returns the trimmed stdout.
 */
export function runAgent(agent, prompt, { timeoutMs = 120000 } = {}) {
  return new Promise((resolve, reject) => {
    const args = Array.isArray(agent.args) ? agent.args : [];
    const child = spawn(agent.command, args, { shell: true });

    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error("The agent took too long to respond (timeout)."));
    }, timeoutMs);

    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (err += d));
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(new Error(`Could not start "${agent.command}": ${e.message}`));
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0 && out.trim()) {
        resolve(out.trim());
      } else if (out.trim()) {
        resolve(out.trim());
      } else {
        reject(new Error(err.trim() || `Agent exited with code ${code} and no output.`));
      }
    });

    // Feed the prompt over stdin so we never have to shell-escape it.
    try {
      child.stdin.write(prompt);
      child.stdin.end();
    } catch {
      /* stdin may already be closed on spawn error */
    }
  });
}
