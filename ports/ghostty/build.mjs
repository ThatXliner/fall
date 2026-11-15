// Generates Fall, a Ghostty theme file.
import { ANSI_ORDER, emit, loadPalette } from "../../lib/palette.mjs";

const { editor, terminal } = loadPalette();

const lines = [
  ...ANSI_ORDER.map((name, index) => `palette = ${index}=${terminal[name]}`),
  `background = ${editor.background}`,
  `foreground = ${editor.foreground}`,
  `cursor-color = ${editor.cursor}`,
  `cursor-text = ${editor.background}`,
  `selection-background = ${editor.selection}`,
  `selection-foreground = ${editor.foreground}`,
];

emit(new URL("./Fall", import.meta.url), `${lines.join("\n").toLowerCase()}\n`);
