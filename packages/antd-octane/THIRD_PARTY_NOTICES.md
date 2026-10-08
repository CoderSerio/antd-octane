# Third-party notices

## Octane brand mark

`site/public/favicon.svg` uses the two flame paths from Octane's
[`icon-black.svg`](https://github.com/octanejs/octane/blob/9b6c3a48e1f196c7097b48d429f6997169556922/icon-black.svg).
The outer flame was recolored to `#1677FF` and the inner flame to `#F5222D`;
their geometry is unchanged. The wordmark path is not included.

Octane is licensed under the MIT license:

```text
MIT License

Copyright (c) 2026 Dominic Gannaway

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

`src/color-picker` is an original Octane solid-color implementation referencing
Ant Design 5.29.3's ColorPicker value and callback APIs. Color conversion uses
the existing MIT-licensed `@ant-design/fast-color` dependency. It does not copy
the upstream React picker or gradient implementation.

`src/theme/vendor` contains Ant Design 5.29.3 theme algorithms, seed/map/alias token types and alias formatting.
Upstream: https://github.com/ant-design/ant-design/tree/14f397749dca177e5495dc9d1c2f7debfb639545/components/theme

Changes: removed the framework-specific default theme factory; replaced type-only React/cssinjs dependencies and the interface barrel with framework-independent types. The three fontHeight type fields are optional to match the published npm type surface. Algorithm bodies are preserved.

`src/button/tokens.ts` and Button CSS also adapt the defaults and state rules from Ant Design 5.29.3 `components/button/style`; they use static CSS variables instead of React/cssinjs hooks.

The Flex, Space, Divider, Grid, Layout, Splitter, Anchor, Breadcrumb,
Dropdown, Menu, Pagination, Steps and Tabs native components adapt Ant Design
5.29.3 component behavior and style rules, including semantic item styles, RTL,
Sider triggers, Splitter size allocation and collapse controls, dropdown menu
rendering, menu focus, pagination page windows, steps variants and tab overflow.
React hooks and cssinjs are replaced with Octane hooks, native DOM events and CSS
variables. Pagination page-window and size-change behavior also reference
`rc-pagination` 5.1.0; step and tab behavior reference `rc-steps` 6.0.1 and
`rc-tabs` 15.7.0. Those MIT licenses are reproduced in the rc-component notices
below; their React runtime is not bundled.

Layout descendant box sizing, Anchor holder/nested-link spacing, Menu group and
collapsed-icon spacing, Breadcrumb standalone separators, Pagination mini/simple
spacing, Steps label/dot/custom-icon layouts and Tabs card/vertical sizing follow
`components/{layout,anchor,menu,breadcrumb,pagination,steps,tabs}/style` and
`components/breadcrumb/BreadcrumbSeparator.tsx` at that same Ant Design revision.
Disabled editable-tab removal follows `rc-tabs@15.7.0/es/TabNavList/TabNode.js`.
The native DOM keeps buttons for keyboard actions and separate popup wrappers.

Arrow, bar, double-arrow and ellipsis SVG definitions in
`src/_util/layout-icons.tsx` come from `@ant-design/icons-svg` 4.6.0 under the
icon license reproduced below. Layout/navigation API, descriptions and token
references in `site/src/layout/`, `site/src/navigation/` and
`site/src/component-prose.json` are generated from the same pinned Ant Design
sources; framework types are adapted and upstream release history is omitted.
The five `site/src/demos/flex-*` examples adapt `components/flex/demo` basic,
align, gap, wrap and combination. Imports and hooks use Octane; the combination
copy describes the Octane library. The alignment controls and fixed-width card
use scrolling containers on narrow layouts, preserving the sample's dimensions.
Space, Divider, Grid and the first twelve Tabs examples adapt their same-version `components/*/demo`
files. Space omits Upload and Compact combinations whose controls are not
available from the published Octane package. Divider size/variant and Grid
string-gutter examples await publication of the new runtime API. The workspace
runtime now exposes Tabs `renderTabBar` and its per-node wrapper callback, but
the public custom tab-bar and drag examples remain omitted until this API is
published and verified from npm. Layout's basic structure and Splitter's size,
vertical and controlled examples also adapt their same-version source; the
remaining advanced examples stay out of the public site until their runtime
APIs are published and verified.
The eight Anchor examples adapt the official source, including the four 200px
isolated documents. Local documentation anchor links are adjusted to their
actual section IDs. Breadcrumb basic, withIcon, separator and separator-component
examples adapt upstream; parameter, overlay and route demos await publication.
Nine Dropdown examples and four Menu examples adapt their matching upstream
sources, preserving menu items, events and state. Demos needing unpublished
arrow, extra, compound-button, popup-render, collapse or theme APIs are omitted.
Nine Steps examples adapt simple, small-size, icon, step-next, vertical,
vertical-small, error, clickable and label-placement. The label-placement
progress rows and the other five demos await publication of percent, progressDot
and new type APIs. LoadingOutlined explicitly enables the Icon spin prop.
The ten Pagination examples adapt basic, more, changer, jump, mini, simple,
controlled, total, all and itemRender; align and the simple readOnly row await
publication of their new runtime API.
`site/src/development/demos/` adapts the remaining ordinary layout/navigation
examples from the same Ant Design 5.29.3 sources for local development only.
Production builds exclude this catalog until the corresponding APIs are
published. React hooks and event types use Octane equivalents; Layout's side,
fixed and fixed-sider examples use the upstream 360px isolated documents,
while its other examples render in normal document flow. The custom Tabs bar uses native CSS sticky positioning
and the draggable tab node uses native pointer events with the reference
10px activation distance instead of React-specific third-party adapters.
The SVG definitions in `site/src/development/icons.tsx` use the same icon
license. The public demo captions preserve the pinned upstream wording, with
release history omitted.

The native documentation code preview adapts Ant Design 5.29.3 `.dumi/theme/common/CodePreview.tsx`, `LiveCode.tsx`, the Demo/Highlight styles and the preview collapse control. Language conversion uses the pinned TypeScript compiler with preserved JSX, formatted by the existing Biome build tool; both tools run at build time. Displayed examples omit tooling-only lint directives and retain their Octane imports.

Layout/navigation document columns follow the upstream `index.zh-CN.md` demo
metadata. Paragraph resets and the isolated preview browser frame adapt
`.dumi/theme/common/styles/Common.tsx` and `.dumi/theme/common/BrowserFrame.tsx`
from the same version, with CSS variables for native theme tokens.
Isolated Anchor examples use the zero-padding viewport document and horizontal
overflow rule from the same `Common.tsx` and `Reset.tsx` styles, so the upstream
`100vw` sections do not gain an extra horizontal scrollbar.
Reference API data and synchronization omit parameter rows marked deprecated
in the upstream Markdown. The first Octane release documents current APIs
without copying Ant Design's legacy parameter migration history.

`site/src/demos/grid-demo.css` adapts the Grid demo presentation from
`.dumi/theme/common/styles/Markdown.tsx`, using local CSS variables.
The Grid documentation design section preserves the two introductory paragraphs
and references the original grid illustration SVG linked from Ant Design 5.29.3
`components/grid/index.zh-CN.md`, hosted by Ant Design at
`https://gw.alipayobjects.com/zos/bmw-prod/9189c9ef-c601-40dc-9960-c11dbb681888.svg`.
`site/src/demos/layout-navigation-icons.tsx` adapts named SVG definitions from
`@ant-design/icons-svg` 4.6.0 using the published Octane createIcon factory.

`src/input/tokens.ts` and the Input / Checkbox rules in `src/style.css` adapt Ant Design 5.29.3 `components/input/style/token.ts`, `components/input/style/index.ts`, `components/input/style/variants.ts` and `components/checkbox/style/index.ts`. They retain the supported token defaults and basic outlined/checkbox state rules, expressed as static CSS variables; framework hooks, unsupported variants and wave motion are not included.

The component descriptions, usage guidance, API notes and demo captions in
`site/src/component-prose.json` and `site/src/pages/` are adapted from
Ant Design 5.29.3 `components/*/index.zh-CN.md` and `components/*/demo/*.md`
(MIT, copyright Ant UED). Framework-specific wording and code are adapted for
Octane; Ant Design release annotations are omitted from this package's first
version documentation.

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

Grid, Layout, Collapse, Tabs, Empty, Statistic, Timeline and Descriptions supported token defaults and style rules are adapted from Ant Design 5.29.3 under the MIT license above. Interaction logic is implemented natively in Octane. Empty default and simple illustrations now adapt the exact SVG geometry and theme fills from `components/empty/empty.tsx` and `components/empty/simple.tsx` in the pinned Ant Design source.

Typography and List supported token defaults and styles are adapted from Ant Design 5.29.3 under the MIT license above; copying, editing, list rendering and responsive grid are independently implemented for Octane.

Table and Tree supported token defaults and visual rules in `src/table.css`, `src/tree.css` and their component modules are adapted from Ant Design 5.29.3 `components/table/style` and `components/tree/style` under the MIT license above. Sorting, filtering, selection, expansion, tree checking, native virtual windows, sticky layout and drag/drop are implemented with Octane. Behavior and source algorithms are adapted from the Ant Design and rc-component references recorded below; component pages describe remaining limits.

Spin, Skeleton, Progress and Result supported token defaults and visual rules in `src/loading.css`, `src/feedback.css` and their component modules are adapted from the same Ant Design 5.29.3 MIT-licensed baseline. Loading lifecycle and progress geometry are implemented natively for Octane. Skeleton image placeholders, Result status symbols and HTTP status illustrations use upstream artwork as recorded below.

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

Affix, Anchor, FloatButton, Image, Carousel, Splitter, Watermark, QRCode, Tour, Calendar, Table and Tree defaults and styles reference Ant Design 5.29.3 (MIT, copyright Ant Design), under the Ant Design license reproduced above. Implementations use the Octane runtime. Source paths and the pinned revision are recorded in `.sync-upstream.json`.

`src/affix/index.tsx`, `src/affix/utils.ts`, `src/affix/style/index.ts`, and
`src/_util/throttleByAnimationFrame.ts` adapt Ant Design 5.29.3's corresponding
Affix and frame-throttle source files, including the common component font and
box-sizing reset. The native implementation uses Octane hooks, browser
ResizeObserver, cancellable requestAnimationFrame callbacks, and inline resolved
style tokens. Target event scope, rounded boundary checks, hidden-node behavior,
separate placeholder, and fixed top/bottom styles follow the pinned source.
The native frame scheduler dispatches queued measurements together, preserving
sibling layout reads before Octane microtask-rendered callbacks change the page.

## Data display API and token references

`site/src/data-display/*.json` adapts the Chinese API tables from Ant Design
5.29.3 `components/*/index.zh-CN.md` and the Tooltip shared props document.
It also includes component/global token metadata and defaults from the published
`antd/es/version/token-meta.json` and `token.json`. `ReactNode` and `ReactElement`
are documented as `OctaneNode`; version columns are omitted to retain the site's
four-column API layout. Upstream release badges and historical version conditions
are omitted because they do not describe the first Octane release. Tables without
a default-value column use a dash instead of treating upstream versions as
defaults. The source license is the Ant Design MIT license above.

`src/theme/component-tokens.ts` adapts the same version's public style token
interfaces, including upstream descriptions, using Octane's `CSSProperties`.
`scripts/sync-display-reference.mjs` reproduces both artifacts from a checkout
of the pinned tag. Individual component pages and the compatibility page describe
implementation differences; these reference tables do not certify complete parity.

`site/src/component-reference.tsx`, `site/src/pages/avatar.tsx` and the API note
rules in `site/src/style.css` adapt the Avatar fallback Tip and Markdown
blockquote/inline-code styles from the same pinned revision's
`components/avatar/index.zh-CN.md` and
`.dumi/theme/common/styles/Markdown.tsx`. Theme values are supplied by the native
Octane theme context; the Ant Design MIT license above applies.

The Token table disclosure, type labels, color previews and configuration help
in `site/src/component-reference.tsx` and `site/src/style.css` adapt the same
revision's `.dumi/theme/builtins/ComponentTokenTable`, `TokenTable` and `ColorChunk`.
They use native Octane Popover and HTML details elements. The arrow uses the
RightOutlined SVG definition from `@ant-design/icons-svg` 4.6.0 (MIT, Ant UED).

## Avatar demo icons

`src/_util/feedback-icons.tsx` contains the UserOutlined and AntDesignOutlined
SVG definitions from `@ant-design/icons-svg` 4.6.0, used by Ant Design 5.29.3's
Avatar demos. The paths and view boxes are preserved and rendered with the native
Octane `createIcon` adapter. They are re-exported from `antd-octane/icons` for
named imports in demos and consumers. Copyright Ant UED; the MIT license above
applies. This is an Octane icon adapter for the examples, not a full React icon
collection. `site/src/demos/avatar-icons.tsx` now only keeps the compatibility
avatar URL export.

## Native data display source adapters

The 20 data display components reference Ant Design 5.29.3 at commit
`14f397749dca177e5495dc9d1c2f7debfb639545`, including compound components,
semantic slots, locale data, Empty artwork, motion and component Tokens.
The module paths and development-only rc dependencies are recorded in
`.sync-upstream.json`. Framework hooks, state, refs and portals are adapted to
Octane; no React component, trigger, dialog, table or picker runtime is bundled.

`src/image/icons.tsx`, `src/tree/icons.ts`, the Tag/Timeline/Collapse/Tour
close, loading and arrow icons, QRCode's ReloadOutlined, and Table's
FilterFilled/SearchOutlined/RightOutlined/CaretUpOutlined/CaretDownOutlined,
and Calendar's DownOutlined mask preserve SVG paths
from `@ant-design/icons-svg` 4.6.0. The Ant UED MIT license above applies.

The rc source references and their licenses are reproduced below. The QRCode
path/image helpers additionally derive from qrcode.react, whose ISC notice
follows these MIT notices. The separate Nayuki encoder retains its original
license in the vendor file and in the QR encoding section above.

### rc-collapse 3.9.0, rc-dialog 9.6.0, rc-menu 9.16.1

```text
The MIT License (MIT)

Copyright (c) 2014-present yiminghe

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### rc-tree 5.13.1

```text
MIT LICENSE

Copyright (c) 2015-present Alipay.com, https://www.alipay.com/

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
```

### rc-image 7.12.0, rc-table 7.54.0, rc-virtual-list 3.19.2, rc-dropdown 4.2.1

```text
MIT LICENSE

Copyright (c) 2015-present Alipay.com, https://www.alipay.com/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### rc-segmented 2.7.1, rc-picker 4.11.3

```text
The MIT License (MIT)

Copyright (c) 2019-present afc163

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### rc-util 5.44.4

```text
The MIT License (MIT)

Copyright (c) 2014-present yiminghe
Copyright (c) 2015-present Alipay.com, https://www.alipay.com/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### @ant-design/react-slick 1.1.2

```text
The MIT License (MIT)

Copyright (c) 2014 Kiran Abburi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### @rc-component/trigger 2.3.1, @rc-component/qrcode 1.1.3

```text
The MIT License (MIT)
Copyright (c) 2015-present Alipay.com, https://www.alipay.com/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### @rc-component/tour 1.15.1

```text
MIT License

Copyright (c) 2019-present react-component

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### qrcode.react path and image helpers

Source: https://github.com/zpao/qrcode.react

```text
ISC License

Copyright (c) 2015, Paul O’Shannessy

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.

This product bundles QR Code Generator, which is available under a
"MIT" license. For details, see src/third-party/qrcodegen.
```

## Feedback and Other native adaptations

The feedback and other API tables, token interfaces, and site examples are adapted
from Ant Design 5.29.3 at commit `14f397749dca177e5495dc9d1c2f7debfb639545`
(`components/{affix,alert,app,config-provider,drawer,message,modal,notification,popconfirm,progress,result,skeleton,spin,watermark}`).
The Result exception illustrations, Watermark clipping algorithm, Spin percent
algorithm, Progress layout and component splitting follow those sources under
the Ant Design MIT license reproduced above. React-specific runtime adapters are
replaced by Octane-native implementations.

Watermark's root prop contract, text metrics, frame debounce, latest-clip cache,
overlay management, mutation handling and portal inheritance follow
`components/watermark/{index,utils,useRafDebounce,useSingletonCache,useWatermark,useClips}`
in Ant Design 5.29.3 under that license. Cache key equality follows rc-util
5.44.4 `es/isEqual.js`, MIT © 2014-present yiminghe and © 2015-present Alipay.com;
the MIT permission and warranty terms reproduced above apply. Mutation observer
options follow @rc-component/mutate-observer 1.1.0 `es/useMutateObserver.js`,
MIT © 2019-present react-component; the same MIT terms apply.

ConfigProvider's separate size and disabled contexts and public useConfig hook
follow `components/config-provider/{SizeContext,DisabledContext,hooks/useConfig}`
and Form's context providers in Ant Design 5.29.3 under the same MIT license.
The complete useConfig browser example follows
`components/config-provider/demo/useConfig.tsx`. Form's baseline label/control
structure, prefix resolution, colon and required marker behavior, help/extra
spacing, three layouts, and ten component token defaults follow
`components/form/{Form,FormItem,FormItemLabel,FormItemInput,style/index}` under
that license. Validation motion and responsive grid columns are not ported.

The shared native wave effect, target geometry, color selection, event filtering,
frame debounce and custom effect contract follow `components/_util/wave`, and
the Inset/Shake browser cases follow `components/config-provider/demo/wave.tsx`
in Ant Design 5.29.3 under that license. Transient effects use native DOM nodes
instead of a React render root. Visibility checks follow rc-util 5.44.4
`lib/Dom/isVisible.js`, MIT © 2014-present yiminghe and © 2015-present Alipay.com;
the MIT terms above apply.

Button's default loading icon structure and the Switch loading icon metrics
follow `components/button/{DefaultLoadingIcon,IconWrapper}` and
`components/switch/{index,style/index}` in Ant Design 5.29.3 under that license.

Button, Checkbox, Radio and Select prefix resolution, root class placement and
disabled option precedence follow their component modules and
`components/config-provider/demo/prefixCls.tsx` in Ant Design 5.29.3. Native
components retain static `ant-*` stylesheet aliases alongside configured prefixes.
Radio button hover and active colors follow `components/radio/style/index.ts`.
Select's empty state, outlined focus and option metrics follow
`components/config-provider/defaultRenderEmpty.tsx`, `components/empty/style`
and `components/select/style/{token,dropdown,single,variants}`. Its unscaled
popup offset flooring references @rc-component/trigger 2.3.1
`es/hooks/useAlign.js`, MIT © 2015-present Alipay.com; the MIT terms above apply.

The Happy Work browser comparison independently adapts the DOM effect from
@ant-design/happy-work-theme 1.0.1, commit
`a9e5ad982b8fad8daac209934e7ce172b7bb3314`, MIT © 2015-present Alipay.com.
Its source and full license are retained in
`tests/browser/vendor/happy-work-theme/`. The independent React reference uses
@ctrl/tinycolor 3.6.1, commit `ee70e0014e069cad3f4e177ee0cb819fdf4794ea`,
MIT © Scott Cooper, with required source modules and full license retained in
`tests/browser/vendor/tinycolor/`. These development references are not bundled
into the published component package.

Progress circle geometry and conic gradient masks are adapted from rc-progress
4.0.0, MIT © 2015-present react-component; its MIT license is reproduced above.
Internal and site feedback icons use SVG definitions from @ant-design/icons-svg
4.6.0, MIT © 2018-present Ant UED. The Ant Design MIT license above applies to
these definitions.

Notification stack measurements, transforms and hover handling are adapted from
rc-notification 5.6.4 (`es/NoticeList.js`, `es/hooks/useStack.js`). Native notice
progress, timer effects and hover callbacks follow `es/Notice.js`, with explicit
Octane unmount cleanup. Progress element styles follow Ant Design 5.29.3
`components/notification/style/index.ts`. Notice
replacement, overflow and close semantics follow `es/Notifications.js`, under the MIT
license © 2014-present yiminghe; the MIT permission and warranty terms reproduced
above apply. Source: https://github.com/react-component/notification/tree/v5.6.4

Notice enter/leave keyframes follow Ant Design 5.29.3 message and notification
styles. The native motion list retains leaving entries and merges reordered or
reopened keys following rc-motion 2.9.5 (`es/CSSMotionList.js`, `es/util/diff.js`),
under the MIT license © 2019-present afc163; the MIT permission and warranty
terms reproduced above apply. Source: https://github.com/react-component/motion/tree/v2.9.5

The static holder browser example follows Ant Design 5.29.3
`components/config-provider/demo/holderRender.tsx`. Native Message and
Notification GlobalHolder configuration precedence follows
`components/{message,notification}/index.tsx`; direct hooks receive their own
configuration. Message content layout follows `components/message/PurePanel.tsx`
and `components/message/style/index.ts`. Confirm content, footer actions, icon
fallbacks, title presence and layout follow `components/modal/ConfirmDialog.tsx`
and `components/modal/style/{confirm,index}.ts`. Deferred confirmation button
focus follows `components/_util/ActionButton.tsx`; dialog focus after entering
follows rc-dialog 9.7.1 `es/Dialog/index.js` (MIT © 2015-present react-component).
The Ant Design MIT license and the MIT permission/warranty terms reproduced
above apply. Source: https://github.com/ant-design/ant-design/tree/5.29.3/components

The development warning context, aggregation and message conventions follow
Ant Design 5.29.3 `components/_util/warning.ts` and
`components/config-provider/index.tsx`, with the library identity changed to
antd-octane. The warning browser example follows
`components/config-provider/demo/warning.tsx`. Native Input.Group follows
`components/input/Group.tsx` and `components/input/style/index.ts`; Alert
message presence and close action styles follow `components/alert/Alert.tsx`
and `components/alert/style/index.ts`. The comparison document shares the
box-sizing reset in `antd/dist/reset.css`. The Ant Design MIT permission and
warranty terms reproduced above apply.
Source: https://github.com/ant-design/ant-design/tree/5.29.3/components

- Further native development-warning call sites are adapted from Ant Design
  **5.29.3** (MIT): `components/tag/index.tsx`, `card/Card.tsx`,
  `collapse/Collapse.tsx`, `collapse/CollapsePanel.tsx`,
  `descriptions/index.tsx`, `descriptions/hooks/useRow.ts`, `image/index.tsx`,
  `timeline/Timeline.tsx`, `statistic/Countdown.tsx`, `progress/progress.tsx`,
  `progress/Line.tsx`, `spin/index.tsx`, `modal/Modal.tsx`,
  `modal/ConfirmDialog.tsx`, `tooltip/index.tsx` and `result/index.tsx`.
  Result and Modal string-icon diagnostics refer to `OctaneNode`, adapting
  React-specific terminology to this native package.
- Drawer legacy aliases, callback/style priority and token-driven panel styles
  are adapted from Ant Design **5.29.3** (MIT),
  `components/drawer/index.tsx`, `DrawerPanel.tsx` and `style/index.ts`.
- Native SVG child keys follow the generated-tree convention in
  `@ant-design/icons` **5.6.1** (MIT), `es/utils.js` (`generate`).

Notification configuration, API readiness and static-call queuing follow
Ant Design 5.29.3 `components/notification/{index,useNotification,util,PurePanel}`;
notification content, close controls and hover timing also follow rc-notification
5.6.4 `es/Notice.js` and `es/hooks/useNotification.js`. The native `notification/PureContent.tsx` and `util.tsx`
adapt the upstream content and close-icon helpers to Octane. Filled status icons,
content offsets, action float/margins, notification padding and focus outlines
follow `components/notification/style/index.ts` and `components/style/index.tsx`.
All are MIT licensed; the Ant Design and rc-notification notices above apply.
Native Notification's `interface.ts` and `useNotification.tsx` separation,
numeric offsets, readonly notice type and readonly hook result follow the same
version's `components/notification/{interface.ts,useNotification.tsx}`.
Message's click callback uses Octane's native `MouseEventHandler<HTMLDivElement>`
to retain the upstream element-specific `currentTarget` contract; its hook result
also follows upstream's readonly tuple declaration. Notification's public click
callback remains `() => void`, while the internal notice retains DOM event
forwarding, as in rc-notification `es/Notice.js`.
Notification holder margins and pointer hit testing follow
`components/notification/style/{index,placement}.ts`; Message holder pointer
transparency and content hit testing follow `components/message/style/index.ts`.

Native Skeleton interfaces, loading property presence, inferred part defaults,
class/style priority and element separation follow Ant Design **5.29.3**
`components/skeleton/{Skeleton,Element,Title,Paragraph,Avatar,Button,Input,Image,Node}.tsx`
and `style/index.ts` (MIT). The Image SVG path is taken from upstream `Image.tsx`.
Native `skeleton/useSkeletonStyle.ts` supplies the corresponding token variables
for preset geometry, scalable image dimensions and separate element/block radii.
Static canonical classes remain alongside custom prefixes; this adaptation does
not implement upstream's CSS-in-JS hash or CSS variable isolation engine.

ConfigProvider legacy button-spacing/popup-width configuration, its deprecated
SizeContext getter and warning-policy layering follow Ant Design **5.29.3**
`components/config-provider/{index,PropWarning,SizeContext}.tsx` (MIT).
Native Select popup-width precedence and option styles follow
`components/select/index.tsx` and `components/select/style/{dropdown,token}.ts`;
width/min-width selection follows rc-select **14.16.8** `es/SelectTrigger.js`,
and inset flooring follows @rc-component/trigger **2.3.1**
`es/hooks/useAlign.js` (MIT © react-component). These versions are development
references; the runtime implementations remain native to Octane.


Native Message types, hook readiness, typed overload precedence, callable
thenables, static task cancellation, holder configuration and content rendering
follow Ant Design 5.29.3 `components/message/{interface.ts,useMessage.tsx,util.ts,
index.tsx,PurePanel.tsx}` and `style/index.ts` (MIT). Shared static-context warnings
follow `components/config-provider/index.tsx`; the native text identifies
antd-octane and its holder lifecycle. Named Message icon labels, loading rotation
and filled SVG definitions follow `@ant-design/icons` 5.6.1 (MIT). React remains a
development comparison dependency; the runtime is implemented with Octane.

Native App module separation, default context, nested configuration, wrapper
props, RTL and alias-token styles follow Ant Design **5.29.3**
`components/app/{index.tsx,App.tsx,context.ts,useApp.ts,style/index.ts}` (MIT).
The native App style hook registers deduplicated, theme-scoped class rules with
Octane's insertion effect and removes them after the final owner unmounts.
Custom wrapper components receive the caller's original style prop; App token
resets and RTL remain class rules. Component rules precede authored styles,
following the upstream CSS-in-JS prepend order. This is a native adaptation,
not the upstream hashed/cssVar or SSR extraction engine.
ConfigProvider's public `CSPConfig` and parent/child nonce resolution follow
`components/config-provider/{context.ts,index.tsx}`. App style insertion reads
that context, following `components/theme/util/genStyleUtils.ts` and
`@ant-design/cssinjs` style registration. Setting the DOM style node's nonce
before insertion follows `rc-util/es/Dom/dynamicCSS.js` (MIT). The native cache
also includes the nonce so styles authorized for different policies do not
share an entry; it releases and re-registers styles when that nonce changes.
The native style registrar in `src/style/{context.ts,index.tsx,useStyleRegister.ts}`
is an Octane implementation of the small subset needed by the App and Modal
adaptations. Its optional `StyleProvider` `layer` value follows the inheritance
and explicit override behavior of `@ant-design/cssinjs@1.24.0`
`es/StyleContext.js`; it is not a vendored React cssinjs runtime and does not
claim the upstream cache, hashPriority, cssVar or SSR extraction surface. The
registrar prepends default owned style nodes and appends layered nodes so a
declared application layer order remains effective, scopes hashes by layer
mode, sets the CSP nonce before insertion and removes the node after the final
owner unmounts.
Table filter menu roles, sequential focus entries, active-item navigation and
delayed submenu focus adapt `rc-menu@9.16.1/es/{MenuItem.js,SubMenu/SubMenuList.js,hooks/useAccessibility.js}`.
`src/table/useFilterDropdownAccessibility.ts` adapts `rc-dropdown@4.2.1/es/hooks/useAccessibility.js`
for Table's overlay Tab/Escape handling and focus attempts. Filter focus outlines
and selected/hover styles follow `components/dropdown/style/index.ts` and
`components/style/index.tsx` in Ant Design 5.29.3. Checkbox/Radio share the native
adaptation of `components/checkbox/useBubbleLock.ts`; `src/_util/useCheckedActivation.ts`
is an Octane-specific bridge that records native checked activation across
ancestor updates between click and change. These hooks include native cleanup.
Fractional popup layout measurement and unscaled leading/trailing inset flooring
in `src/_util/floating.tsx` follow `@rc-component/trigger@2.3.1/es/hooks/useAlign.js`.
The native `getLayoutSize` helper preserves border-box fractions while excluding
the popup's entry/leave motion transform; it avoids integer offsetWidth/Height
rounding changing the overflow flip decision at a viewport boundary.
Fixed-popup containing block mirror measurements in `getPopupContainerSize`
also follow useAlign's leading/trailing measurements, preserving fractional
viewport dimensions under browser zoom. Native measurement temporarily excludes
the popup's own motion transform and restores all modified inline properties.
Public GetProps, GetProp and GetRef utilities adapt
`components/_util/type.ts` to native Octane callable components and refs.
GetRef's component-only constraint matches the documented upstream utility;
React class instances are not Octane components.
ConfigProvider global theme/undefined-field semantics and its sticky motion
boundary follow `components/config-provider/{index.tsx,MotionWrapper.tsx}`;
`config-provider/cssVariables.ts` adapts the upstream file of the same name,
retaining the MIT-licensed color calculations and replacing rc-util style
injection with native DOM insertion. Static per-confirmation roots, configuration
snapshots and holderRender capture follow `components/modal/confirm.tsx` (MIT).
Octane's static Message API re-registers its instance after a holder remount;
Ant Design 5.29.3's stale-instance edge case is documented as a reference
lifecycle difference rather than replicated as a permanently inert API.


The explicit Spin props, Indicator/Looper/Progress module split, trailing delay
activation, percentage-holder lifecycle and detailed geometry in `src/spin/`
and `src/loading.css` are adapted from Ant Design 5.29.3
`components/spin/index.tsx`, `components/spin/Indicator/`, `usePercent.ts`, and
`style/index.ts` (MIT). The native effect uses a cancellable timeout for the
upstream debounce's single trailing call. Canonical static class aliases remain;
this adaptation does not implement upstream CSS-in-JS namespace isolation.

The native Progress explicit props and ARIA/ref contract, raw size propagation,
line gradient sorting, steps rounding, token styles and shape splitting follow
Ant Design 5.29.3 `components/progress/{progress,Line,Steps,Circle,utils}` and
`components/progress/style/index.ts` (MIT). The internal
`src/progress/rc-progress/{Circle,PtgCircle,util,useCircleId,useTransitionDuration}`
modules adapt rc-progress 4.0.0 `es/Circle/{index,PtgCircle,util}`, `es/common.js`
and `es/hooks/useId.js` under the rc-progress MIT license reproduced above.
Stable IDs, refs and post-commit effects use Octane's native runtime.


Result's explicit props, Icon/Extra rendering split, truthiness rules, exception
selection and static artwork exports follow Ant Design 5.29.3
`components/result/index.tsx` (MIT). Native token styles and scoped CSS adapt
`components/result/style/index.ts` and the common/icon/link rules in
`components/style/index.tsx`. Existing SVG paths are retained. The native
adaptation preserves canonical class aliases and scopes the common link styles;
it does not reproduce upstream global CSS-in-JS namespace isolation.


Alert's explicit props, IconNode/CloseIconNode split, custom icon cloning, close
precedence and measured leave lifecycle follow Ant Design 5.29.3
`components/alert/{Alert,ErrorBoundary}.tsx` and `components/alert/style/index.ts`
(MIT). Native CSS also follows the actual emitted selectors, preserves canonical
class aliases and scopes common link/icon rules. It does not implement global
CSS-in-JS namespace isolation. The optional native motion leave-end callback
follows rc-motion's before-removal timing; Octane's error boundary supplies
native error stacks rather than React component stacks. Button transition easing
used by the Alert action examples follows `components/button/style/index.ts`.

## react-fast-marquee

The demo-only `site/src/demos/native-marquee.tsx` and `.css` adapt the default
50px/s, two-track loop, width observation and hover-pause behavior of
react-fast-marquee 1.6.5's `dist/index.js`. Its React runtime is used only in
browser comparison fixtures, not the published native component runtime.

```text
MIT License

Copyright (c) 2020 justin-chu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


## Drawer panel, layering and lifecycle alignment

The native Drawer implementation, panel decomposition, accessibility placement,
semantic styles and Token rules are adapted from Ant Design **5.29.3** (MIT),
`components/drawer/index.tsx`, `DrawerPanel.tsx`, `style/index.ts`,
`components/_util/hooks/useClosable.tsx` and `useZIndex.ts`.
The shared native `src/_util/hooks/useZIndex.ts` and `zindexContext.ts` adapt
Ant Design 5.29.3's container/consumer offsets and inherited context. Modal and
Drawer currently use this hook; declaring the other upstream offsets does not
imply that every other floating component has adopted them. Modal mask/wrapper
stacking and Escape behavior follow **rc-dialog 9.6.0** (MIT, license reproduced
earlier) `src/Dialog/index.tsx`; body-portal vertical scroll locking follows
**@rc-component/portal 1.1.2** (MIT)
`src/Portal.tsx` and `useScrollLocker.tsx`. The runtime uses native Octane
implementations of these behaviors, without those React runtime dependencies.
Push context, zero-size focus sentinels, mask click handling and panel refs follow
**rc-drawer 7.3.0** (MIT), `src/Drawer.tsx`, `DrawerPopup.tsx` and `DrawerPanel.tsx`.
The implementation uses Octane's own portal, hooks and motion management; it does
not ship React or rc-drawer as a runtime dependency. The documented disabled close
button behavior is preserved; Ant Design 5.29.3's DrawerPanel omits that native
button attribute.

rc-drawer 7.3.0 license:

```text
MIT LICENSE

Copyright (c) 2015-present Alipay.com, https://www.alipay.com/

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
```


### @rc-component/portal 1.1.2

```text
MIT License

Copyright (c) 2019-present react-component

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


## Ordinary Modal panel and Footer alignment

`src/modal/Modal.tsx`, `shared.tsx`, `context.ts`,
`components/NormalCancelBtn.tsx`, `components/NormalOkBtn.tsx`,
`useModalStyle.ts` and the shared `src/_util/hooks/useClosable.tsx` adapt
Ant Design **5.29.3**'s corresponding Modal, close configuration and style
sources (MIT, copyright Ant UED). The panel slots in `ModalPanel.tsx`, content
sentinels, retained inner content, wrapper click handling and callback order in
`src/_util/dialog.tsx` follow **rc-dialog 9.6.0** (MIT, copyright yiminghe).
The dependency licenses are reproduced above. The native implementation uses
Octane contexts, descriptors, refs and lifecycle hooks, without React runtime
substitution. Public and private style defaults include wireframe and responsive
screen tokens. The anchor Button line-height correction follows the upstream
Button style's inherited anchor line-height.
The native Modal style registration also adapts the selector structure and
defaults from `components/modal/style/index.ts` and `style/confirm.ts` (MIT,
copyright Ant UED), keeping the default unlayered cascade and offering the
source-only optional layer mode described above.
Image preview's static root and fixed mask/wrapper use
`components/image/style/index.ts` and the shared Modal mask styles, preserving
mouse access to the page after rc-dialog hides its retained panel.

Development fixtures in `tests/browser/modal-demos-upstream/` contain sixteen
Ant Design 5.29.3 `components/modal/demo/*.tsx` source examples under that same
MIT license. They are compiled by React only in the comparison server and are
not included in the published runtime package.

## Modal confirmation actions, static roots and hook instances

`src/_util/ActionButton.tsx`, `src/modal/ConfirmDialog.tsx`, `HookModal.tsx`,
`components/ConfirmOkBtn.tsx`, `components/ConfirmCancelBtn.tsx`, `confirm.tsx`,
`useModal.tsx`, `destroyFns.ts` and the confirmation context/types adapt
Ant Design **5.29.3** `components/_util/ActionButton.tsx`, `components/modal/`
confirmation, hook and button sources (MIT, copyright Ant UED).
The corresponding confirmation style rules derive from
`components/modal/style/confirm.ts` and legacy danger Button rules from
`components/button/style/index.ts`. The native code uses Octane descriptors,
external stores, refs, effects and separate static roots. It does not vendor
React, rc-dialog or the upstream hook runtime into the published package.

Adapted behavior includes arity-dependent action callbacks, per-button loading,
button prop precedence, await-mode rejection handling, delayed autofocus,
function-update replacement versus merge, original static close callbacks and
hook/global destruction. Focus restoration uses rc-dialog **9.6.0**'s closed
state guard (MIT, copyright yiminghe). The comparison copies use React only in
the development server, with a React 19 render adapter for upstream static APIs.
Static root unmount is deferred beyond the current commit, following
**rc-util 5.44.4** `es/React/render.js`'s modern unmount (MIT, copyright yiminghe).

Named `createIcon` factories default their accessible label to the definition
name; the shared icon wrapper centers text. These defaults follow
**@ant-design/icons 5.6.1** `components/AntdIcon` and `utils` icon styles (MIT,
copyright Ant UED). Caller-provided accessible labels take precedence.

## Modal draggable and custom style demo references

The development-only official Modal demo copies use **react-draggable 4.4.6**
and **antd-style 3.7.1**, matching the versions selected from the Ant Design
5.29.3 development baseline. These React libraries are not published runtime
substitutes. `site/src/demos/native-draggable.tsx` adapts react-draggable's
`Draggable.js`, `DraggableCore.js`, `utils/domFns.js` and `utils/positionFns.js`
mouse/touch start, offset-parent coordinates, bounds slack, drag classes,
selection handling and cleanup to Octane for this demo's supported input.
It does not implement the full react-draggable public API.

react-draggable 4.4.6 is licensed as follows:

```text
(MIT License)

Copyright (c) 2014-2016 Matt Zabriskie. All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
```

antd-style 3.7.1 is licensed as follows:

```text
MIT License

Copyright (c) 2022-current Arvin Xu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
