# Changelog

User-visible changes. Dates are the version commits, in `+0800`.

## Unreleased

- An edit that keeps the same source length updates the card. A new diagram earlier in the conversation no longer remounts the later cards.
- Diagram keywords track Mermaid 11.17.2. `zenuml` is no longer treated as a diagram. A bare `graph` or `flowchart` still needs a direction, and `info` is still ignored.
- A diagram larger than the window fits inside the full-screen view. The wheel treats a line-mode notch as 16 pixels. A diagram that changes while the view is open refits, unless you have already zoomed or panned.
- A failed render of an unchanged source shows the failure notice. A longer source that is still being streamed keeps the previous diagram.
- Renders run one at a time, so one diagram cannot clear the engine state of another.

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
