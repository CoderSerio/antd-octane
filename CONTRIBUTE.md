# 贡献指南

欢迎参与 Ant Design for Octane。问题反馈、文档修正、测试和组件实现都可以通过 Issue 或 Pull Request 提交。所有贡献采用相同的代码、文档与验证标准。

## 开始之前

阅读 [README](README.md) 与[兼容范围](docs/compatibility.md)，确认当前版本的能力。较大的 API 调整或新组件，请先通过 Issue 说明使用场景、预期行为和兼容影响，避免重复工作。

仓库保留面向使用者的 API、接入、兼容和贡献文档。内部 RFC、spec、实施计划、临时讨论记录与工作日志保存在仓库外，不随源码提交。公开的设计讨论可以放在相关 Issue 或 PR 中。

## 本地开发

使用 Node.js ≥ `22.22.2` 和 pnpm `10.29.2`：

```bash
pnpm install
pnpm dev
```

主要目录：

| 目录 | 内容 |
| --- | --- |
| `packages/antd-octane/` | 组件实现、主题、类型与发布配置 |
| `site/` | 中文文档站与示例 |
| `tests/` | 单元测试、上游对照与浏览器验证 |
| `scripts/` | 打包与独立消费验证 |
| `docs/` | 公开使用与兼容文档 |

## 分支与 Pull Request

从最新的 `main` 创建分支，PR 的目标分支为 `main`。分支名称描述变更目的，不使用作者、工具或 Agent 名称作前缀。

格式为 `<type>/<kebab-case-description>`，例如：

```text
feat/select
fix/button-focus
docs/tailwind-guide
chore/repository-conventions
release/alpha-1
```

允许的类型：

| 类型 | 用途 |
| --- | --- |
| `feat` | 新功能或组件 |
| `fix` | 行为或样式修复 |
| `docs` | 文档和示例说明 |
| `refactor` | 不改变外部行为的重构 |
| `test` | 测试与验证夹具 |
| `chore` | 仓库维护 |
| `build` | 构建与依赖管理 |
| `ci` | 持续集成 |
| `perf` | 性能改进 |
| `revert` | 回退已有变更 |
| `release` | 发布准备 |

PR 标题采用 Conventional Commits 格式：`type(scope): description`，`scope` 可省略；破坏性变更在类型或 scope 后加 `!`，并在正文解释影响与迁移方式。例如：

```text
feat(select): add controlled selection
fix(button): restore focus after loading
docs: clarify theme compatibility
```

建议开发提交也采用这一格式；不逐条强制检查临时提交标题。使用 squash 合并时，PR 标题作为最终提交标题，正文应围绕最终变更编写。

PR 应说明解决的问题、最终行为、兼容影响及验证结果。界面变更附上截图或对照结果；未覆盖的能力要明确写出。不要把对话记录、调试输出或临时方案当作变更说明。

`main` 通过 PR 更新，不直接推送或强推。合并前必须通过 `check`、`conventions` 检查并解决所有评审讨论；保持线性历史，禁止强推与删除。当前不强制指定数量的批准人，维护者仍需检查最终差异和验证结果后合并。

## 实现约定

- 组件运行时保持 Octane 原生。React 和 antd 仅用作开发对照，不引入为运行时替代实现。
- 公开属性、事件、受控值、ref 与组合方式遵循既有组件的约定；类型声明、示例和实现保持一致。
- 样式复用主题 Token，检查默认、品牌、暗色、紧凑与嵌套配置。不能兼容的 API 或主题行为同步记录到 `docs/compatibility.md` 和组件文档。
- 对可交互组件检查键盘操作、焦点、禁用与加载状态，以及必要的语义属性。
- 文档示例必须能够运行。文档站遵循现有导航、排版和按页加载方式，避免引入不必要的首屏依赖。
- 移植或改写上游代码时保留许可和来源。不要机械格式化 `src/theme/vendor`；修改其算法时同步来源记录与 Token 对照测试。
- 不提交密钥、认证信息、构建产物、临时截图或本机配置。

## 验证要求

提交前运行完整检查：

```bash
pnpm check
pnpm pack:check
```

`pnpm check` 包含 Biome、类型检查、测试、组件包与文档站构建；`pnpm pack:check` 在独立项目中安装打包产物，验证类型与生产构建。

若 Biome 报告可自动修复的问题，执行后重新检查：

```bash
pnpm format
pnpm check
```

涉及界面、样式、主题或交互的修改，需要使用真实浏览器验证相关场景。运行 `pnpm dev:compare` 可打开原生实现与上游对照夹具；具体方法见 [浏览器验证说明](tests/browser/README.md)。文档布局修改同时检查桌面与窄屏、导航及横向溢出。

Tailwind 接入相关修改还应执行 `pnpm tailwind:check`，并按浏览器验证说明检查独立消费项目。有限的测试结果不应描述为完整视觉、无障碍或 API 兼容。

## 发布

版本号、变更说明和发布配置通过 `release/<description>` 分支提交 PR，由维护者完成发布。Alpha 版本使用 npm 的 `alpha` 标签；发布前确认包内容、安装方式和公开文档一致，不把仓库尚未发布的能力描述为已发布能力。

## 许可

提交代码即表示你有权按本项目 [MIT 许可](LICENSE) 提供该贡献。新增第三方代码或资源时，保留必要的版权与许可声明，并更新[第三方声明](packages/antd-octane/THIRD_PARTY_NOTICES.md)。
