# Browser comparison fixture

Run `pnpm dev:compare`, then open:

- `http://127.0.0.1:4175/tests/browser/index.html?renderer=octane&theme=brand`
- `http://127.0.0.1:4175/tests/browser/index.html?renderer=antd&theme=brand`

Themes: `default`, `brand`, `dark`, `compact`, `component`.

Renderers are loaded into separate documents to prevent antd's CSS from affecting native components. The fixture compares 16 Button cases. `compare.mjs` exports a Playwright page function for `playwright-cli run-code`; it reads 12 base style properties and three hover/active properties for each case, across five themes (1,440 comparisons). Transitions are disabled only while measuring stable states.

Example with Playwright CLI installed:

```bash
playwright-cli --session antd-compare open http://127.0.0.1:4175/tests/browser/index.html
playwright-cli --session antd-compare run-code "$(node --input-type=module -e 'import compare from "./tests/browser/compare.mjs"; process.stdout.write(compare.toString())')"
```

Expect `differences: []`. This is a limited style comparison, not a full visual or accessibility certification. Browser checks also cover the real document site's theme controls, nested scopes, loading behavior, code expansion, navigation and mobile overflow.
