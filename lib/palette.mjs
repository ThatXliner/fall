import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const PALETTE_PATH = new URL("../palette/fall.json", import.meta.url);

/** The palette with every syntax role resolved from a swatch name to its hex. */
export function loadPalette() {
  const raw = JSON.parse(readFileSync(PALETTE_PATH, "utf8"));
  const syntax = Object.fromEntries(
    Object.entries(raw.syntax).map(([role, swatch]) => {
      const hex = raw.swatches[swatch];
      if (!hex) throw new Error(`syntax.${role} names unknown swatch "${swatch}"`);
      return [role, hex];
    }),
  );
  return { ...raw, syntax };
}

function toRgb(hex) {
  const value = hex.replace("#", "");
  return [0, 2, 4].map((i) => Number.parseInt(value.slice(i, i + 2), 16));
}

function toHex(rgb) {
  return `#${rgb.map((c) => Math.round(c).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

/** `amount` of `over` blended onto `base`, in sRGB. */
export function mix(base, over, amount) {
  const a = toRgb(base);
  const b = toRgb(over);
  return toHex(a.map((c, i) => c + (b[i] - c) * amount));
}

function luminance(hex) {
  const [r, g, b] = toRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2.0 contrast ratio. */
export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Writes `contents` to `path`, or with `--check` exits 1 when the file on disk differs. */
export function emit(path, contents) {
  if (process.argv.includes("--check")) {
    let current = "";
    try {
      current = readFileSync(path, "utf8");
    } catch {}
    if (current !== contents) {
      console.error(`${fileURLToPath(path)} is stale. Run npm run build.`);
      process.exit(1);
    }
    return;
  }
  writeFileSync(path, contents);
}
