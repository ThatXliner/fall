# Fall for Zed

A warm, low-blue dark theme for [Zed](https://zed.dev). 🍂

The editor, the panels, and the terminal take on Fall's colors. Comments and brackets are faded, names you define are purple, and the terminal's ANSI palette has no true blue.

## Install

```sh
mkdir -p ~/.config/zed/themes
curl -fsSL https://raw.githubusercontent.com/ThatXliner/fall/main/ports/zed/themes/fall.json -o ~/.config/zed/themes/fall.json
```

Then open the theme selector (**Cmd+K Cmd+T** on macOS, **Ctrl+K Ctrl+T** on Linux and Windows) and choose **Fall**.

## Notes

- Zed colors code by tree-sitter capture names. Python's grammar has a capture for definition keywords, so `def`, `class`, and `lambda` are green as in the Atom theme. In other languages they are pink: TypeScript's `function` and `class` share a capture with `const` and `let`, and Rust's `fn` and Go's `func` are plain keywords.

## Build

`themes/fall.json` is generated from the [Fall palette](../../palette/fall.json). Do not edit it by hand. From the repository root, run `npm run build`.
