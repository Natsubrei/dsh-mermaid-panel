## What changed

## Check

- [ ] The edit is in `src/client.jsx`. `client.js` and `client.mermaid.js` came from `pnpm run build`.
- [ ] `grep -m1 '  id: "' client.js` matches the `name` in `package.json`.
- [ ] `node --check client.js` exits 0.
- [ ] `index.json` was not edited by hand.
