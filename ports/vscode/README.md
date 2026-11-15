# Fall for VS Code

A warm, low-blue dark theme for your eyes. 🍂

Fall reduces blue light, keeps code clear, and still looks good. Trivial parts of code, like comments and brackets, are faded. Every language follows the same color rules: a definition keyword is green and the name it defines is purple.

| Color | Hex | Used for |
| --- | --- | --- |
| Pink | `#FF7092` | Keywords, operators, tags |
| Green | `#7EC892` | Definition keywords (`def`, `class`, `function`, `fn`), links, TODOs |
| Purple | `#D6ABEE` | Function and class names |
| Light Orange | `#FFB370` | Parameters, `self`, attributes |
| Orange | `#F99270` | Constants, numbers, escapes |
| Peach | `#F9C19A` | Strings |
| Maroon | `#C65882` | Comments |

The integrated terminal uses Fall's ANSI palette, which has no true blue either.

## Install

Fall is not on the Marketplace yet. To install it from source:

```sh
git clone https://github.com/ThatXliner/fall.git
cd fall/ports/vscode
npx @vscode/vsce package
code --install-extension fall-theme-*.vsix
```

Then open **Preferences: Color Theme** and choose **Fall**.

## Notes

- In Rust, only `fn` is green. Rust's grammar gives `struct`, `enum`, `trait`, and `impl` the same scope as `let` and `use`, so they stay pink like other keywords.
- With semantic highlighting on, language servers can refine colors. Fall maps their token types to the same roles.

## Build

`themes/fall-color-theme.json` is generated from the [Fall palette](https://github.com/ThatXliner/fall/blob/main/palette/fall.json). Do not edit it by hand. From the repository root:

```sh
npm run build
```

`build.mjs` holds the UI colors and the scope table, which is ported from the Atom theme's rules.
