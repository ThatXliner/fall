import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

/** Every port with a generator, as `ports/<name>/build.mjs`. */
export const GENERATED_PORTS = readdirSync(`${ROOT}/ports`)
  .map((name) => `ports/${name}/build.mjs`)
  .filter((port) => existsSync(`${ROOT}/${port}`));

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const port of GENERATED_PORTS) {
    execFileSync(process.execPath, [port], { cwd: ROOT, stdio: "inherit" });
    console.log(`built ${port}`);
  }
}
