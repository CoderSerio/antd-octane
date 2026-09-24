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
