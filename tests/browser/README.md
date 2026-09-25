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

## Documentation layout checks

Build the site and open its production preview (currently `http://127.0.0.1:4174/`). Check:

- The top-level development/components navigation switches the left menu, and local search opens a matching page.
- Direct links such as `#start/usage` and Button's API anchor scroll to visible content; back/forward restores the route.
- The theme dialog traps focus, closes with Escape, and returns focus to its trigger. Brand, dark and compact settings still update demos.
- At 390px, the menu collapses after navigation, the dialog fits, and the document has no horizontal overflow (code blocks scroll internally).
- A fresh overview load requests only its page and shared modules. Expanding the first Button source requests exactly one additional source module.

The current build has approximately 105 KB gzip of JavaScript for the overview, including shared modules, and 9.4 KB gzip of CSS. Pages, component implementations and example sources are split into separate chunks. These are build artifact sizes, not field performance scores. No runtime dependencies were added for navigation, code highlighting or search.

## Input and Checkbox

`compare-inputs.mjs` uses the same separate renderer documents and five themes. It compares six Input cases (default, small, large, error, warning, disabled) and six Checkbox cases (default, checked, indeterminate and their disabled states). Base, hover and available focus states include checkbox pseudo-element dimensions/colors. The current fixture performs 1,760 property comparisons; expect `differences: []`.

Run it with the same `playwright-cli run-code` method as `compare.mjs`, substituting `compare-inputs.mjs`. The scope is deliberately limited: no claim of full pixel, motion, browser or accessibility parity.

`compare-foundation.mjs` 对照 Switch 与 Divider 在五组主题下的 420 个根元素样式值。只覆盖夹具中的尺寸、颜色、字体和间距，不代表完整状态或子元素视觉一致。

`compare-display.mjs` 对照 Radio、Tag、Alert、Card、Badge、Avatar 的常用形态，在五组主题下比较 1,235 个根元素和关键子元素样式值。组件级主题包含显式 token 覆盖。真实文档浏览器另检验选择组键盘/受控行为、标签取消关闭、头像缩放和提示移除。

`compare-layout.mjs` 对照 Grid、Layout、Collapse、Tabs、Empty、Statistic、Timeline、Descriptions 在五组主题下的 1,330 项稳定样式值；组件级主题显式覆盖该批组件 token。`verify-layout.mjs` 检查生产文档的键盘操作、面板输入保留、增删焦点、响应式布局及八个页面的移动端溢出。

`compare-content.mjs` 比较 Typography 与 List 五组主题下的 770 项样式值；`verify-content.mjs` 验证文档里的编辑保存/取消/焦点、复制文本、展开收起、列表操作和响应式网格。复制测试用可观察的 Clipboard stub，不验证浏览器权限弹窗。
