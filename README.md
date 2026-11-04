# dsh-mermaid-panel

A DeepSeek Harness client plugin that adds a **Mermaid** page to the right Sidebar. It renders the Mermaid diagrams in the conversation you are reading, without touching the conversation itself.

**中文。** 这是 DeepSeek Harness 的客户端插件，在右侧栏加一页 Mermaid。它渲染当前打开的对话里的图，不改对话本身。卡片上是按宽度摆好的整图；点击图，或点「放大」，进入全屏后再用滚轮、拖动和键盘缩放。安装用下面的 Install：插件市场、`dsh plugin --profile web add dsh-mermaid-panel`、发布页上的 `.tgz`，或本目录的检出。这一段之后是英文全文。

> Published as `dsh-mermaid-panel`, not `dsh-mermaid`: that package name belongs to
> [MrmoLabs/dsh-mermaid](https://github.com/MrmoLabs/dsh-mermaid), which renders
> diagrams inline in the chat instead. The two do different things and can be
> installed side by side.

## What it does

- Registers one right-Sidebar page type (`mermaid`) and a guide capsule, so the empty Sidebar offers it as a door.
- Scans the rendered conversation for code blocks whose first line declares a Mermaid diagram, and renders them in the page's own React tree.
- Each card keeps the authored source one click away, plus copy.
- The card shows the diagram fitted and whole. Click the diagram, or **Enlarge**, to open the full-screen view. Zoom and pan live there, not on the card.
- Re-renders when the palette changes; the Sidebar's own docking, splitting, and per-Session tab persistence apply unchanged.

The chat's code block is never hidden or replaced. Copying the source from the transcript, quoting it, or letting the model read it back still works, and a change to the chat's DOM costs the page its input rather than the transcript.

## What it deliberately does not do

- It does not modify DeepSeek Harness. Everything it uses is a declared public extension point: `ctx.sidebarRightTabs`, `sidebar.right.pane.tab`, and the `ctx.locale` / `ctx.slots` services.
- It does not render inline in the transcript. Replacing a chat code block in place would need a rendering seam that the product does not have, so the diagram lives in the Sidebar instead.

## How it finds diagrams

The chat renders an unknown language as a plain code card with no language attribute, so the page reads the first declaration line and accepts:

- `graph` / `flowchart` followed by a direction (`TB`, `TD`, `BT`, `RL`, `LR`);
- a known diagram keyword such as `sequenceDiagram`, `classDiagram`, `stateDiagram`, `erDiagram`, `gantt`, `pie`, `journey`, `gitGraph`, `mindmap`, `timeline`, `xychart-beta`, `quadrantChart`, and the rest;
- leading blank lines, `%%` comments, and a YAML front-matter block.

Mermaid's own parser is the final word: a source that fails to render shows the failure notice and its source instead of a diagram.

## Viewing

The card is a fitted preview. A wheel over the card scrolls the page. The preview does not zoom or pan, because that fought the page it sits in.

**Enlarge**, or a click on the diagram, opens the same diagram full screen. That view is a portal on `document.body`, so the Sidebar's scroll container cannot clip it. It keeps no state once the card is gone.

- The wheel zooms around the pointer. **−**, **+**, the percentage, **Fit**, and **Close** sit in the top bar.
- Dragging pans.
- `+` and `-` zoom from the center (`=` and `_` do the same). `0` fits the diagram to the window. `Esc` closes the view.

## Install

You need DeepSeek Harness and a profile whose Web GUI has the right Sidebar. The commands below use the `web` profile. `package.json` sets `engines.dsh` to `*`; this repository does not name a minimum release.

Client plugins reach the page at load. After installing, hard-refresh the Web GUI. A host restart does not load a new client plugin into a page that is already open.

### From the plugin market

The repository publishes a format 1 market index at

```
https://raw.githubusercontent.com/Natsubrei/dsh-mermaid-panel/main/index.json
```

Add it in **Plugins → Discover → Add index**, then install **Mermaid diagrams** from the list. Discover ships off by default: switch on **Custom plugin markets** under the Plugins page's experimental list first. The index entry pins a git commit, so installation is reproducible and needs neither npm nor a token. DSH runs `git` against this repository. It does not download the release tarball.

The entry is generated, not hand-edited. `pnpm run market` reads `package.json` and the current commit and rewrites `index.json`. Run it after the commit that carries the built artifacts, then commit the index on its own. See [CONTRIBUTING.md](CONTRIBUTING.md).

### From npm

The npm package is `dsh-mermaid-panel`. This install does not clone the git repository:

```sh
dsh plugin --profile web add dsh-mermaid-panel
```

That follows the `latest` dist-tag. To pin a release, append `@` and the `version` field from `package.json`.

### From the GitHub release

Each release uploads one asset named `dsh-mermaid-panel.tgz`, so this URL stays stable:

```sh
dsh plugin --profile web add https://github.com/Natsubrei/dsh-mermaid-panel/releases/latest/download/dsh-mermaid-panel.tgz
```

Release notes from 0.1.3 still show `github.com/Natsubrei/dsh-mermaid` and `dsh-mermaid.tgz`. That name is the package before 0.1.4. Use the command above.

### From a checkout

`client.js` and `client.mermaid.js` are committed. Installing this directory does not require a build. From the repository root:

```sh
dsh plugin --profile web add .
```

`dsh plugin` anchors a relative spec to the directory you invoked it from, so `.` is this checkout.

Build only when you change the page. The lockfile is `pnpm-lock.yaml`, and `build.mjs` imports `esbuild`:

```sh
pnpm install
pnpm run build
```

`pnpm run build` runs `node build.mjs`. Install the directory again with the same `dsh plugin` command. The change loop is in [CONTRIBUTING.md](CONTRIBUTING.md).

## Layout

| File | Role |
| --- | --- |
| `index.js` | Host half. Rendering is browser-only, so it contributes nothing. |
| `src/client.jsx` | The page type, its body, and the scan. Built into `client.js`. |
| `src/diagram-source.mjs` | Which sources are diagrams, their keys, and whether a scan changed. |
| `src/viewport.mjs` | Fit ratio, wheel factor, and zoom. |
| `src/render-policy.mjs` | Streaming keep rule and the one-at-a-time render queue. |
| `client.mermaid.js` | The Mermaid engine as a lazy loader chunk, requested on the first diagram. |
| `cordis.patch.yml` | Inserts the plugin into the profile. |
| `locale/en.json`, `locale/zh.json` | Plugin-inventory title and description. |
| `index.json` | The market index this repository publishes; generated by `scripts/market-index.mjs`. |
| `scripts/market-index.mjs` | Rewrites `index.json` from `package.json` and the current commit. |
| `CONTRIBUTING.md` | How to change the page and what a release must not skip. |
| `CHANGELOG.md` | User-visible versions. |
| `AGENTS.md` | The release steps and the gotchas that otherwise cost an afternoon. |

## How to reach it

The page type contributes one guide capsule, the same door `ui-sidebar-terminal` uses. Open the right Sidebar and pick **Mermaid** on the guide page. If the Sidebar has exactly one door registered — ours, when no other type offers a guide capsule — the Sidebar seeds that page as its first tab instead of the guide; that seeding rule belongs to the Sidebar, not to this plugin.

## Limits

- The page reads the DOM of the conversation that is on screen. If the chat's code-card markup changes, the page shows its empty state until the selectors are updated.
- Sources are read from what the chat has mounted, so history the chat has not rendered yet (virtualized or collapsed) is not included.
- An open page observes the document to notice a remounted conversation, so a streaming turn costs one debounced scan every ~240 ms.
- The engine is a 3.5 MB chunk, downloaded once per page load on first diagram.
- The full-screen view holds the zoom it opened with. A diagram that changes while the view is open updates in place, and that zoom stays where it was.

## Project

Maintainer: [Natsubrei](https://github.com/Natsubrei). Questions and bugs go to [Issues](https://github.com/Natsubrei/dsh-mermaid-panel/issues). Vulnerability reports stay off the public issue list; see [SECURITY.md](SECURITY.md).

- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)
- [Code of conduct](CODE_OF_CONDUCT.md)
- [License](LICENSE) (MIT)
