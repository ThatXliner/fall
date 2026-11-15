import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

import { contrast, loadPalette } from "../lib/palette.mjs";

const TARGET_RATIO = 6;
const CONTRAST_CHECKED = ["keyword", "constant", "parameter", "string", "important", "function"];
// Variable names in ports/atom/styles/colors.less, by palette swatch.
const ATOM_COLORS = {
  pink: "keyword-color",
  orange: "constant-color",
  lightOrange: "arg-color",
  peach: "string-color",
  green: "important-color",
  purple: "function-color",
  maroon: "mono-3",
  background: "syntax-bg",
};
const GENERATED_PORTS = ["ports/t3code/build.mjs"];

const { swatches, syntax, editor } = loadPalette();
const failures = [];

for (const role of CONTRAST_CHECKED) {
  const ratio = contrast(syntax[role], editor.background);
  if (ratio < TARGET_RATIO) {
    failures.push(`syntax.${role} ${syntax[role]} has contrast ${ratio.toFixed(2)}, below ${TARGET_RATIO}`);
  }
}

const atomColors = readFileSync(new URL("../ports/atom/styles/colors.less", import.meta.url), "utf8");
for (const [swatch, variable] of Object.entries(ATOM_COLORS)) {
  const match = new RegExp(`^@${variable}:\\s*(#[0-9a-fA-F]{6})`, "m").exec(atomColors);
  if (match?.[1].toUpperCase() !== swatches[swatch]) {
    failures.push(`Atom @${variable} is ${match?.[1] ?? "missing"}, palette ${swatch} is ${swatches[swatch]}`);
  }
}

for (const port of GENERATED_PORTS) {
  try {
    execFileSync(process.execPath, [port, "--check"], { stdio: "pipe" });
  } catch (error) {
    failures.push(error.stderr.toString().trim());
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("Palette contrast, Atom colors, and generated ports are all good.");
