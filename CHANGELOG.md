# Changelog

User-visible changes. Dates are the version commits, in `+0800`.

## 0.1.4 — 2026-10-23

- The package name is `dsh-mermaid-panel`. `dsh-mermaid` belongs to [MrmoLabs/dsh-mermaid](https://github.com/MrmoLabs/dsh-mermaid), so the two could not be installed in one profile under one name.
- The page behavior is the 0.1.3 behavior below.
- Install names are `dsh-mermaid-panel` and the asset `dsh-mermaid-panel.tgz`. The package name before this version was `dsh-mermaid`.

## 0.1.3 — 2026-10-22

- Each diagram is drawn whole, fitted to the card's width. The page scrolls. Cards no longer shrink to share the visible height.
- The card does not zoom or pan. Click the diagram, or **Enlarge**, to open the full-screen view. The wheel, drag, and `+` / `-` / `0` / `Esc` work there.

## 0.1.2 — 2026-10-21

- The right-Sidebar page type id dropped its `@local` prefix. A Sidebar tab saved under the old id does not reopen; pick **Mermaid** on the guide page again.
- Still published as `dsh-mermaid`.

## 0.1.1 — 2026-10-21

- First installable build, published as `dsh-mermaid`, with `client.js` and `client.mermaid.js` committed so a Git install needs no build.
