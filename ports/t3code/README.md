# Fall for T3 Code

[`fall.json`](./fall.json) is a T3 Code theme. It colors the whole app with the Fall palette and recolors code blocks in chat with Fall's syntax colors.

## Install

**From the app.** On web or desktop, open **Settings → Appearance**, choose **Create theme**, and import `fall.json`.

**On a server.** Copy `fall.json` into `~/.t3/userdata/themes/`, then switch connected clients to it:

```sh
cp fall.json ~/.t3/userdata/themes/fall.json
t3 theme set fall
```

Fall then appears in **Settings → Appearance** for every web and desktop client of that server.

## Build

`fall.json` is generated. Do not edit it by hand.

```sh
npm run build   # from the repository root
```

`build.mjs` maps each of T3 Code's 61 color roles to a Fall color. Fall avoids blue, so the roles T3 Code colors blue by default (`focus`, `update`) use pink and purple instead.

## Syntax colors

T3 Code highlights code with a fixed Shiki theme, `pierre-dark`, and has no color roles for syntax tokens. The theme's custom CSS maps each `pierre-dark` token color to the Fall color for the same scopes. Comments are also italic, as in the Atom theme.

## Limitations

- Dark only. Fall has no light variant, so Appearance offers it for dark mode only. Choose another theme for light mode.
- The diff panel and file previews render code inside shadow roots, which theme CSS cannot reach. Code there keeps the `pierre-dark` colors.
- `pierre-dark` gives class keywords and class names one color, so both appear purple. The Atom theme shows the keyword in green.
- The CSS matches `pierre-dark`'s exact colors. If T3 Code changes its code theme, rebuild after updating `PIERRE_DARK_TOKENS` in `build.mjs`.
