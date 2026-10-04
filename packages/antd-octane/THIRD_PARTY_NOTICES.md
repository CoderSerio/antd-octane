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

Affix, Anchor, FloatButton, Image, Carousel, Splitter, Watermark, QRCode, Tour and Calendar defaults and styles reference Ant Design 5.29.3 (MIT, copyright Ant Design), under the Ant Design license reproduced above. Implementations use the Octane runtime. Source paths and the pinned revision are recorded in `.sync-upstream.json`. Icon demo paths are independently authored; no full upstream icon collection is bundled.

`site/src/component-reference.tsx`, `site/src/pages/avatar.tsx` and the API note
rules in `site/src/style.css` adapt the Avatar fallback Tip and Markdown
blockquote/inline-code styles from the same pinned revision's
`components/avatar/index.zh-CN.md` and
`.dumi/theme/common/styles/Markdown.tsx`. Theme values are supplied by the native
Octane theme context; the Ant Design MIT license above applies.

## Avatar demo icons

`src/_util/feedback-icons.tsx` contains the UserOutlined and AntDesignOutlined
SVG definitions from `@ant-design/icons-svg` 4.6.0, used by Ant Design 5.29.3's
Avatar demos. The paths and view boxes are preserved and rendered with the native
Octane `createIcon` adapter. They are re-exported from `antd-octane/icons` for
named imports in demos and consumers. Copyright Ant UED; the MIT license above
applies. This is an Octane icon adapter for the examples, not a full React icon
collection. `site/src/demos/avatar-icons.tsx` now only keeps the compatibility
avatar URL export.

### rc-segmented 2.7.1, rc-picker 4.11.3

```text
The MIT License (MIT)

Copyright (c) 2019-present afc163

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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

### rc-collapse 3.9.0, rc-dialog 9.6.0, rc-menu 9.16.1

```text
The MIT License (MIT)

Copyright (c) 2014-present yiminghe

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

### rc-image 7.12.0, rc-table 7.54.0, rc-virtual-list 3.19.2, rc-dropdown 4.2.1

```text
MIT LICENSE

Copyright (c) 2015-present Alipay.com, https://www.alipay.com/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
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
