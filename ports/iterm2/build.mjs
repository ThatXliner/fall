// Generates Fall.itermcolors, an iTerm2 color preset.
import { ANSI_ORDER, emit, loadPalette } from "../../lib/palette.mjs";

const { swatches, editor, terminal } = loadPalette();

const colors = {
  ...Object.fromEntries(ANSI_ORDER.map((name, index) => [`Ansi ${index} Color`, terminal[name]])),
  "Background Color": editor.background,
  "Foreground Color": editor.foreground,
  "Bold Color": terminal.brightWhite,
  "Cursor Color": editor.cursor,
  "Cursor Text Color": editor.background,
  "Selection Color": editor.selection,
  "Selected Text Color": editor.foreground,
  "Link Color": swatches.green,
  "Badge Color": swatches.pink,
  "Cursor Guide Color": editor.lineHighlight,
  "Tab Color": editor.background,
  "Underline Color": swatches.pink,
};

const channel = (hex, offset) => (Number.parseInt(hex.slice(offset, offset + 2), 16) / 255).toFixed(6);
const entry = ([key, hex]) => `\t<key>${key}</key>
\t<dict>
\t\t<key>Alpha Component</key>
\t\t<real>1</real>
\t\t<key>Blue Component</key>
\t\t<real>${channel(hex, 5)}</real>
\t\t<key>Color Space</key>
\t\t<string>sRGB</string>
\t\t<key>Green Component</key>
\t\t<real>${channel(hex, 3)}</real>
\t\t<key>Red Component</key>
\t\t<real>${channel(hex, 1)}</real>
\t</dict>`;

const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
${Object.entries(colors).toSorted(([a], [b]) => a.localeCompare(b)).map(entry).join("\n")}
</dict>
</plist>
`;

emit(new URL("./Fall.itermcolors", import.meta.url), plist);
