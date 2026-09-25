# Third-party notices

`src/theme/vendor` contains Ant Design 5.29.3 theme algorithms, seed/map/alias token types and alias formatting.
Upstream: https://github.com/ant-design/ant-design/tree/14f397749dca177e5495dc9d1c2f7debfb639545/components/theme

Changes: removed the framework-specific default theme factory; replaced type-only React/cssinjs dependencies and the interface barrel with framework-independent types. The three fontHeight type fields are optional to match the published npm type surface. Algorithm bodies are preserved.

`src/button/tokens.ts` and Button CSS also adapt the defaults and state rules from Ant Design 5.29.3 `components/button/style`; they use static CSS variables instead of React/cssinjs hooks.

`src/input/tokens.ts` and the Input / Checkbox rules in `src/style.css` adapt Ant Design 5.29.3 `components/input/style/token.ts`, `components/input/style/index.ts`, `components/input/style/variants.ts` and `components/checkbox/style/index.ts`. They retain the supported token defaults and basic outlined/checkbox state rules, expressed as static CSS variables; framework hooks, unsupported variants and wave motion are not included.

Ant Design license follows:

MIT LICENSE

Copyright (c) 2015-present Ant UED, https://xtech.antfin.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Switch and Divider supported token defaults and style behavior are also adapted from the same Ant Design 5.29.3 MIT-licensed baseline.

Radio, Tag, Alert, Card, Badge and Avatar supported token defaults and style behavior are adapted from the same Ant Design 5.29.3 MIT-licensed baseline. Radio and Checkbox group API behavior was referenced during the independent Octane implementation. Alert status SVGs are authored here.

Grid, Layout, Collapse, Tabs, Empty, Statistic, Timeline and Descriptions supported token defaults and style rules are adapted from Ant Design 5.29.3 under the MIT license above. Interaction logic is implemented natively in Octane. Empty illustrations are independently authored SVGs, not copies of Ant Design illustrations.

Typography and List supported token defaults and styles are adapted from Ant Design 5.29.3 under the MIT license above; copying, editing, list rendering and responsive grid are independently implemented for Octane.

Spin, Skeleton, Progress and Result supported token defaults and visual rules in `src/loading.css`, `src/feedback.css` and their component modules are adapted from the same Ant Design 5.29.3 MIT-licensed baseline. Loading lifecycle and progress geometry are implemented natively for Octane. Skeleton image placeholders and Result status symbols are independently authored; HTTP status results use numeric artwork instead of Ant Design illustrations.

Segmented, Rate, Breadcrumb, Steps, Pagination, Tooltip and Popover supported token defaults and visual rules in `src/choice.css`, `src/navigation.css`, `src/floating.css` and their component modules are adapted from the same Ant Design 5.29.3 MIT-licensed baseline. Selection, navigation, focus/trigger handling and floating geometry are independently implemented for Octane. Floating content uses Octane's native portal and does not vendor React trigger or positioning runtimes.

InputNumber, Slider and extended Input supported token defaults and visual rules are adapted from the same Ant Design 5.29.3 MIT-licensed baseline. Numeric editing, pointer/keyboard interaction and native input extensions are implemented independently for Octane.

Modal, Drawer, Menu, Dropdown, Message, Notification and Popconfirm supported token defaults and visual rules are adapted from the same Ant Design 5.29.3 MIT baseline. Native Octane dialog management, notice lifecycle, menus and confirmation interactions are independently implemented; no React overlay runtime is vendored.

## QR encoding algorithm

`src/qr-code/vendor/qrcodegen.ts` is vendored from Project Nayuki, commit `3c6d0b3cefb4e049dc337e82237c9644399716a8`, `typescript-javascript/qrcodegen.ts`. Only the namespace was exported for ES module consumption. No React QR runtime is used.

```text
/*
 * QR Code generator library (TypeScript)
 *
 * Copyright (c) Project Nayuki. (MIT License)
 * https://www.nayuki.io/page/qr-code-generator-library
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 * - The above copyright notice and this permission notice shall be included in
 *   all copies or substantial portions of the Software.
 * - The Software is provided "as is", without warranty of any kind, express or
 *   implied, including but not limited to the warranties of merchantability,
 *   fitness for a particular purpose and noninfringement. In no event shall the
 *   authors or copyright holders be liable for any claim, damages or other
 *   liability, whether in an action of contract, tort or otherwise, arising from,
 *   out of or in connection with the Software or the use or other dealings in the
 *   Software.
 */
```

## Additional component styles

Affix, Anchor, FloatButton, Image, Carousel, Splitter, Watermark, QRCode and Tour defaults and styles reference Ant Design 5.29.3 (MIT, copyright Ant Design), under the Ant Design license reproduced above. Implementations use the Octane runtime. Source paths and the pinned revision are recorded in `.sync-upstream.json`. Icon demo paths are independently authored; no full upstream icon collection is bundled.
