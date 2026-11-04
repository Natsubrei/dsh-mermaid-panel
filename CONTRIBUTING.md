# Contributing

Changes to the page start in `src/client.jsx`. `client.js` and `client.mermaid.js` are build output. Edit those two only by building them.

## Change the page

1. `pnpm install`. The lockfile is `pnpm-lock.yaml`. `build.mjs` needs the `esbuild` and `mermaid` dev dependencies.
2. Edit `src/client.jsx`.
3. `pnpm run build`.
4. The module id is done when `grep -m1 '  id: "' client.js` prints the `name` from `package.json`. That name is also the engine chunk id (`dsh-mermaid-panel/client.mermaid.js`) that `require.async` resolves.
5. `node --check client.js`. A bundle that does not parse shows up only in the GUI.
6. Install this directory into a scratch `web` profile and hard-refresh the Web GUI:

   ```sh
   dsh plugin --profile web add .
   ```

   Run it from the repository root. Client plugins reach the page at load, so a refresh applies them and a host restart does not.

There is no test suite. Step 6 is the test: a conversation that contains a Mermaid code block shows a card, a click opens the full-screen view, and a source Mermaid rejects shows the failure notice plus the source. The chat's own code block stays in place.

Do not hand-edit `index.json`. `pnpm run market` rewrites it. Run that only when publishing, on the commit that already contains the built artifacts, then commit `index.json` alone.

## Release

Publishing is the Release section of [AGENTS.md](AGENTS.md). Do it in that order: version bump and artifacts, tag, unversioned release asset `dsh-mermaid-panel.tgz`, market-index commit, then `npm publish`. The asset keeps that filename so `releases/latest/download/dsh-mermaid-panel.tgz` does not change. The market index does not point at the tarball; it pins a git commit.

A publish that fails after the tag is retried as a publish, not as a new tag.
