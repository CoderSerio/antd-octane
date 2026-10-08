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

Use the current build output to track gzip sizes as component coverage grows. Pages, component implementations and example sources are split into separate chunks. These are build artifact sizes, not field performance scores. No runtime dependencies were added for navigation, code highlighting or search.

## Input and Checkbox

`compare-inputs.mjs` uses the same separate renderer documents and five themes. It compares six Input cases (default, small, large, error, warning, disabled) and six Checkbox cases (default, checked, indeterminate and their disabled states). Base, hover and available focus states include checkbox pseudo-element dimensions/colors. The current fixture performs 1,760 property comparisons; expect `differences: []`.

Run it with the same `playwright-cli run-code` method as `compare.mjs`, substituting `compare-inputs.mjs`. The scope is deliberately limited: no claim of full pixel, motion, browser or accessibility parity.

`compare-foundation.mjs` 对照 Switch 与 Divider 在五组主题下的 420 个根元素样式值。只覆盖夹具中的尺寸、颜色、字体和间距，不代表完整状态或子元素视觉一致。

`compare-display.mjs` 对照 Radio、Tag、Alert、Card、Badge、Avatar 的常用形态，在五组主题下比较 1,235 个根元素和关键子元素样式值。组件级主题包含显式 token 覆盖。真实文档浏览器另检验选择组键盘/受控行为、标签取消关闭、头像缩放和提示移除。

`compare-layout.mjs` 对照 Grid、Layout、Collapse、Tabs、Empty、Statistic、Timeline、Descriptions 在五组主题下的 1,330 项稳定样式值；组件级主题显式覆盖该批组件 token。`verify-layout.mjs` 检查生产文档的键盘操作、面板输入保留、增删焦点、响应式布局及八个页面的移动端溢出。

`compare-content.mjs` 比较 Typography 与 List 五组主题下的 770 项样式值；`verify-content.mjs` 验证文档里的编辑保存/取消/焦点、复制文本、展开收起、列表操作和响应式网格。复制测试用可观察的 Clipboard stub，不验证浏览器权限弹窗。

`verify-sidebar.mjs` 在 1440、1100、900、720、390px 验证导航行高、完整单行名称、无横向溢出及移动端点击后收起。侧栏采用两站共同的 40px 菜单行高，窄桌面保留 256px 宽度；开发阶段统一放在页头和侧栏底部，避免重复状态标记挤压名称。

`compare-feedback.mjs` 对照 Spin、Skeleton、Progress、Result 五组主题下的 770 项基础尺寸、文字与间距值（含显式组件 token）；不覆盖全部形态、插画或动画。`verify-feedback.mjs` 检查实际文档的加载切换、骨架切换、进度增减、结果状态、窄屏溢出和暗色/紧凑主题。

`spin-position.html` 与 `verify-spin-position.mjs` 检查 Spin 的真实几何位置，覆盖普通圆点、百分比和自动进度、自定义图标、提示、RTL、全屏、尺寸、主题及窄屏；内联 Spin 保持指示器尺寸。运行 `pnpm dev:compare` 后，使用上述 Playwright CLI 方法调用脚本默认导出。

`compare-controls.mjs` 对照 Segmented、Rate、Breadcrumb、Pagination、Steps 五组主题下的 770 项稳定样式。Pagination 的内容内边距对应上游链接节点，容器属性对应上游页码项，避免不同 DOM 结构导致错误结论。

`verify-controls.mjs` 验证这一批组件的真实交互、List 内置分页、完整目录及移动端溢出。`verify-floating.mjs` 验证 Tooltip / Popover 的悬停、聚焦、Escape、内外点击和受控关闭；十二方位在桌面和手机宽度下检查视口边界。这些检查不代表完整动效或所有 API 兼容。

`compare-entry.mjs` 比较 InputNumber 三种尺寸、Slider 轨道、Input 前后缀和 TextArea 在五种主题下的 660 项稳定样式；组件主题包含显式 token 覆盖。`verify-entry.mjs` 验证数值精度、格式化、边界、滑块键盘与拖动。`verify-input-extended.mjs` 检验密码切换、搜索、输入法抑制、清除和 TextArea 实际自动高度，并检查移动端溢出。

`compare-overlays.mjs` 比较 Modal、Drawer、Menu、Popconfirm、Message、Notification 五组主题下的 450 项稳定样式。`verify-dialogs.mjs` 覆盖焦点、滚动锁与 Dropdown 组合；`verify-menu.mjs` 检查菜单键盘和三种触发方式；`verify-notices.mjs` 检查通知计时器、更新、主题与六个位置；`verify-popconfirm.mjs` 检查同步/异步确认与移动端定位。

## 定位、媒体与内容表面

生产文档站启动后，分别运行 `verify-positioning.mjs`、`verify-media.mjs`、`verify-surfaces.mjs`、`verify-app-icon-qr.mjs`、`verify-tour.mjs`。覆盖滚动定位/回顶、图片预览焦点和滚动恢复、轮播键盘/滑动/暂停、Splitter 指针与键盘、实际 Canvas 水印与二维码绘制、App 上下文消息、SVG 图标及 Tour 步骤与关闭。脚本包含窄屏布局检查；不表示全量上游兼容。

`compare-media.mjs` 使用独立 `media-theme.html` 夹具比较五组主题下 Image / Carousel 的 75 项稳定样式。轮播活动指示器按上游伪元素与本库按钮的可见前景比较，不将不同 DOM 结构视作功能差异。

`verify-home.mjs` 检查独立首页默认入口、文档/Logo 往返、搜索、局部主题与真实组件交互，并验证 1440 / 768 / 390 像素布局。

## Tailwind CSS v4 独立消费

`pnpm tailwind:check` 构建库，在临时项目安装 tarball 和固定的 Tailwind 4.3.3 / @tailwindcss/vite 4.3.3，再验证 TypeScript 与生产构建。此命令需要联网安装开发依赖，不修改工作区依赖。设置 `KEEP_TAILWIND_CONSUMER=1` 保留临时项目，按输出路径启动 `pnpm exec vite preview`（配置端口 4176），然后运行 `verify-tailwind.mjs`。浏览器检查 Preflight 下的默认 Button、工具类尺寸与布局、主题切换以及应用侧 token 映射；不代表全量组件或 SSR 兼容。

### Counted input sizing

Open `/tests/browser/input-count-width.html` with `pnpm dev:compare`; add
`?renderer=antd` for the reference. The fixture covers Input, affixes, addons,
TextArea and clearable TextArea with both `200px` and `50%` widths inside a
`400px` container. Each control and its count should share a `200px` outer
width; percentages must not be applied twice by nested wrappers.

### Multiple Select interaction

Open `/tests/browser/select-multiple-compare.html` (or append `?renderer=antd`).
Select Cherry, then press ArrowUp/Enter to remove Apple without closing the
menu. Escape closes the popup; Backspace with an empty search removes the last
removable value. Reset and clear the selection. The output shows the controlled
array for comparison. Searchable inputs preserve native Home/End caret behavior.

### AutoComplete free input

Open `/tests/browser/auto-complete-compare.html` (or append `?renderer=antd`).
Type a value that is not an option: it must remain valid input, and Enter with
no active suggestion must not select another value. Use arrows to skip disabled
suggestions and Enter to confirm. Compare `onSearch` with `onSelect` in the event
output; clear the field and verify focus remains in the input. Toggle empty
options and check that an empty popup is never shown. Add `&dark` (or `?dark`)
for the dark theme fixture.

### Form custom controls and asynchronous validation

Open `/tests/browser/form-mapping.html`. Submit the reserved username, then
finish validation to show an error. Reset, submit again, edit the username
before completing validation and verify the old result is reported as out of
date without restoring its error. Select members and submit the new value:
the output should contain an array collected through the custom `onMove`
trigger and `targetKeys` value property.

### Disabled selection group overrides

Open `/tests/browser/group-disabled.html`. The surrounding ConfigProvider disables
controls, but both groups with `disabled={false}` must remain usable. Click the
enabled checkbox; focus the first radio and press ArrowRight to select the
second. Explicitly disabled options and the two groups inheriting the provider
must remain disabled. This fixture exercises workspace source, not the published
site dependency.

### Form custom control IDs

Open `/tests/browser/form-custom-id.html`. Click the Email label and verify the
custom-ID input receives focus. Submit empty: the same input must receive focus
and reference the visible error text. Enter an email and submit again; the
status should show the saved value. This fixture uses workspace source.
