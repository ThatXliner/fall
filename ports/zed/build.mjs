// Generates themes/fall.json, a Zed theme family.
import { emit, loadPalette, mix } from "../../lib/palette.mjs";

const { name, swatches, syntax, editor, terminal } = loadPalette();

const bg = editor.background;
const fg = editor.foreground;
const muted = syntax.punctuation;
const accent = swatches.pink;
const sidebar = mix(bg, "#000000", 0.2);
const surface = mix(bg, fg, 0.04);
const border = mix(bg, fg, 0.12);
const alpha = (hex, amount) => `${hex}${Math.round(amount * 255).toString(16).padStart(2, "0").toUpperCase()}`;
const status = (color) => ({ "": color, background: alpha(color, 0.15), border: alpha(color, 0.4) });
const statusKeys = (key, color) =>
  Object.fromEntries(Object.entries(status(color)).map(([part, value]) => [part ? `${key}.${part}` : key, value]));
const ansi = (prefix, names) =>
  Object.fromEntries(Object.entries(names).map(([key, value]) => [`terminal.ansi.${prefix}${key}`, terminal[value]]));
const ANSI_KEYS = { black: "black", red: "red", green: "green", yellow: "yellow", blue: "blue", magenta: "magenta", cyan: "cyan", white: "white" };

const style = {
  background: sidebar,
  "background.appearance": "opaque",
  border,
  "border.variant": alpha(border, 0.6),
  "border.focused": alpha(accent, 0.6),
  "border.selected": accent,
  "border.transparent": alpha(border, 0),
  "border.disabled": alpha(border, 0.5),
  "elevated_surface.background": sidebar,
  "surface.background": sidebar,
  "element.background": surface,
  "element.hover": mix(sidebar, fg, 0.06),
  "element.active": mix(sidebar, fg, 0.1),
  "element.selected": mix(sidebar, fg, 0.1),
  "element.disabled": surface,
  "ghost_element.background": alpha(fg, 0),
  "ghost_element.hover": alpha(fg, 0.06),
  "ghost_element.active": alpha(fg, 0.1),
  "ghost_element.selected": alpha(fg, 0.1),
  "ghost_element.disabled": alpha(fg, 0),
  "drop_target.background": alpha(accent, 0.15),
  text: fg,
  "text.muted": muted,
  "text.placeholder": alpha(muted, 0.8),
  "text.disabled": alpha(muted, 0.6),
  "text.accent": accent,
  icon: fg,
  "icon.muted": muted,
  "icon.disabled": alpha(muted, 0.6),
  "icon.placeholder": alpha(muted, 0.8),
  "icon.accent": accent,
  "link_text.hover": swatches.green,
  "status_bar.background": sidebar,
  "title_bar.background": sidebar,
  "title_bar.inactive_background": sidebar,
  "toolbar.background": bg,
  "tab_bar.background": sidebar,
  "tab.inactive_background": sidebar,
  "tab.active_background": bg,
  "search.match_background": alpha(swatches.lightOrange, 0.3),
  "panel.background": sidebar,
  "panel.focused_border": alpha(accent, 0.6),
  "pane.focused_border": alpha(accent, 0.6),
  "pane_group.border": border,
  "scrollbar.thumb.background": alpha(fg, 0.1),
  "scrollbar.thumb.hover_background": alpha(fg, 0.18),
  "scrollbar.thumb.border": alpha(fg, 0),
  "scrollbar.track.background": alpha(fg, 0),
  "scrollbar.track.border": alpha(fg, 0),
  "editor.foreground": fg,
  "editor.background": bg,
  "editor.gutter.background": bg,
  "editor.subheader.background": sidebar,
  "editor.active_line.background": alpha(editor.lineHighlight, 0.6),
  "editor.highlighted_line.background": alpha(editor.lineHighlight, 0.6),
  "editor.line_number": editor.gutter,
  "editor.active_line_number": fg,
  "editor.invisible": alpha(fg, 0.12),
  "editor.wrap_guide": alpha(fg, 0.08),
  "editor.active_wrap_guide": alpha(fg, 0.16),
  "editor.indent_guide": alpha(fg, 0.08),
  "editor.indent_guide_active": alpha(fg, 0.2),
  "editor.document_highlight.read_background": alpha(fg, 0.08),
  "editor.document_highlight.write_background": alpha(fg, 0.14),
  "editor.document_highlight.bracket_background": alpha(fg, 0.1),
  ...statusKeys("error", editor.removed),
  ...statusKeys("warning", editor.modified),
  ...statusKeys("info", swatches.purple),
  ...statusKeys("hint", muted),
  ...statusKeys("success", editor.added),
  ...statusKeys("created", editor.added),
  ...statusKeys("modified", editor.modified),
  ...statusKeys("deleted", editor.removed),
  ...statusKeys("renamed", swatches.purple),
  ...statusKeys("conflict", swatches.orange),
  ...statusKeys("ignored", muted),
  ...statusKeys("hidden", muted),
  ...statusKeys("predictive", muted),
  ...statusKeys("unreachable", muted),
  "terminal.background": bg,
  "terminal.foreground": fg,
  "terminal.bright_foreground": terminal.brightWhite,
  "terminal.dim_foreground": muted,
  ...ansi("", ANSI_KEYS),
  ...ansi("bright_", Object.fromEntries(Object.entries(ANSI_KEYS).map(([key, value]) => [key, `bright${value[0].toUpperCase()}${value.slice(1)}`]))),
  ...ansi("dim_", ANSI_KEYS),
  accents: [accent, swatches.purple, swatches.green, swatches.orange, swatches.peach],
  players: [{ cursor: editor.cursor, background: editor.cursor, selection: alpha(editor.selection, 0.9) }],
};

// Zed tree-sitter captures by Fall role. Zed resolves a capture to its longest dotted prefix here.
// Python is the only grammar with a capture for just the definition keywords: TypeScript's
// keyword.declaration also covers const and let, and Rust's fn and Go's func are plain keywords.
const CAPTURES = {
  text: ["variable", "property", "namespace", "embedded", "primary"],
  punctuation: ["punctuation", "punctuation.special"],
  keyword: ["keyword", "operator", "tag", "title", "preproc", "type.builtin", "function.decorator", "attribute.builtin"],
  important: ["keyword.definition", "link_text", "link_uri"],
  function: ["function", "type", "constructor", "enum"],
  constant: ["constant", "number", "boolean", "string.escape", "string.special", "label", "variant", "emphasis.strong"],
  parameter: ["variable.parameter", "variable.special", "function.kwargs", "attribute", "lifetime", "emphasis"],
  string: ["string", "string.regex", "text.literal", "punctuation.list_marker"],
};

const highlight = Object.fromEntries(
  Object.entries(CAPTURES).flatMap(([role, captures]) => captures.map((capture) => [capture, { color: syntax[role] }])),
);
Object.assign(highlight, {
  comment: { color: syntax.comment, font_style: "italic" },
  "comment.doc": { color: syntax.comment, font_style: "italic" },
  emphasis: { color: syntax.parameter, font_style: "italic" },
  "emphasis.strong": { color: syntax.constant, font_weight: 700 },
  hint: { color: muted, font_style: "italic" },
  predictive: { color: alpha(muted, 0.8), font_style: "italic" },
});

const theme = {
  $schema: "https://zed.dev/schema/themes/v0.2.0.json",
  name,
  author: "ThatXliner",
  themes: [{ name, appearance: "dark", style: { ...style, syntax: highlight } }],
};

emit(new URL("./themes/fall.json", import.meta.url), `${JSON.stringify(theme, null, 2)}\n`);
