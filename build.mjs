/**
 * Build the two client artifacts the DeepSeek Harness module loader consumes:
 * `client.js` (the plugin factory) and `client.mermaid.js` (the diagram engine,
 * requested as a local chunk on first use).
 */
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import { build } from 'esbuild'

const root = new URL('.', import.meta.url)
const require = createRequire(import.meta.url)
const PKG = JSON.parse(await readFile(new URL('package.json', root), 'utf8')).name
if (typeof PKG !== 'string' || PKG === '') {
  throw new Error('build: package.json is missing a name')
}

const result = await build({
  entryPoints: [fileURLToPath(new URL('src/client.jsx', root))],
  bundle: true,
  write: false,
  format: 'cjs',
  platform: 'browser',
  target: 'es2022',
  jsx: 'automatic',
  external: ['react', 'react/jsx-runtime', 'react-dom'],
  logLevel: 'info',
})
const bundle = result.outputFiles[0].text

const client = [
  'window.__ModuleLoader__.load({',
  `  id: ${JSON.stringify(PKG)},`,
  '  factory(require) {',
  '    const module = { exports: {} };',
  '    (function (module, exports, require) {',
  bundle,
  '    })(module, module.exports, require);',
  '    const plugin = module.exports;',
  '    return { inject: plugin.inject, apply: (ctx) => plugin.apply(ctx, require) };',
  '  },',
  '});',
  '',
].join('\n')
await writeFile(new URL('client.js', root), client)

/**
 * The engine's distribution publishes itself at script top level: its build
 * declares a `var` that only becomes a global in a classic script's global
 * scope, and its last line reads that var back off `globalThis`. The wrapper
 * below points that read at the function scope instead, keeps the engine for
 * the registration factory, and restores the globals this build writes
 * (`mermaid` included), so loading it leaves the page's globals as it found
 * them. The footer check fails loudly when a mermaid upgrade reshapes that
 * export line; `KEYS` is the set this engine build writes, so re-check it
 * after an upgrade.
 */
const engine = await readFile(require.resolve('mermaid/dist/mermaid.min.js'), 'utf8')
const ENGINE_EXPORT = 'globalThis["mermaid"] = globalThis.__esbuild_esm_mermaid_nm["mermaid"].default;'
if (engine.split(ENGINE_EXPORT).length !== 2) {
  throw new Error('build: the mermaid export line changed; update the wrapper in build.mjs')
}
const engineBody = engine.replace(ENGINE_EXPORT, 'engine = __esbuild_esm_mermaid_nm["mermaid"].default')
const chunk = [
  '(function () {',
  "  'use strict'",
  '  var KEYS = ["mermaid", "fastdom", "fastdomPromised", "injected"]',
  '  var saved = {}, absent = {}',
  '  for (var i = 0; i < KEYS.length; i++) {',
  '    if (Object.prototype.hasOwnProperty.call(globalThis, KEYS[i])) saved[KEYS[i]] = globalThis[KEYS[i]]',
  '    else absent[KEYS[i]] = true',
  '  }',
  '  var engine',
  '  try {',
  engineBody,
  '  } finally {',
  '    for (var j = 0; j < KEYS.length; j++) {',
  '      if (absent[KEYS[j]]) delete globalThis[KEYS[j]]',
  '      else globalThis[KEYS[j]] = saved[KEYS[j]]',
  '    }',
  '  }',
  '  window.__ModuleLoader__.load({',
  `    id: ${JSON.stringify(`${PKG}/client.mermaid.js`)},`,
  '    factory() {',
  '      return { default: engine };',
  '    },',
  '  });',
  '}).call(globalThis);',
  '',
].join('\n')
await writeFile(new URL('client.mermaid.js', root), chunk)

console.log('built client.js and client.mermaid.js')
