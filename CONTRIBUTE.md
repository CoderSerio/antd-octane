# 贡献指南

感谢你愿意改进 Ant Design for Octane。文档、可复现的错误、行为测试、组件能力和无障碍改进都欢迎提交。本项目仍处于 Alpha 阶段；开始前请阅读 [README](README.md)、[组件覆盖清单](https://coderserio.github.io/antd-octane/#components/coverage)与[兼容说明](https://coderserio.github.io/antd-octane/#compatibility)，避免把“已有组件入口”理解为“上游 API 已全部实现”。

## 选择任务

先搜索已有 [Issues](https://github.com/CoderSerio/antd-octane/issues) 和 Pull Requests。修正错字、示例或明确的缺陷可以直接提交 PR；新增组件、较大的 API 变更或可能影响兼容性的工作，请先开 Issue，说明使用场景、预期行为、对应的 [Ant Design 5 文档](https://5x.ant.design/components/overview/)及计划覆盖的范围。Octane 语法和编译约定以 [Octane 文档](https://octanejs.dev/docs)为准；[Antdv Next](https://antdv-next.com/components/overview-cn)可作为案例与文档组织的参考。

报告缺陷时，请提供使用的 `antd-octane` / `octane` 版本、最小复现、实际与预期结果。交互问题最好说明浏览器、键盘操作、焦点和主题状态。

## 本地开发

需要 Node.js ≥ `22.22.2` 和 pnpm `10.29.2`：

```bash
git clone https://github.com/CoderSerio/antd-octane.git
cd antd-octane
pnpm install
pnpm dev
```

| 路径 | 用途 |
| --- | --- |
| `packages/antd-octane/src/` | Octane 原生组件、主题、样式与公开类型 |
| `site/src/pages/`、`site/src/demos/` | 面向使用者的文档、API 与可运行案例 |
| `tests/` | 行为测试、独立浏览器对照夹具 |
| `scripts/pack-check.mjs` | 打包后在独立应用中验证 TSX / TSRX 消费 |

文档站的 `site/package.json` 固定依赖**已发布的 npm 包**。新组件可以先在源码、测试和浏览器夹具中完成；发布相应包版本后，再更新站点依赖、锁文件和公开示例。不要让文档站展示用户尚不能安装的 API。

仓库只跟踪面向使用者的文档和必要的来源记录。内部 RFC、临时计划、工作日志与截图不要提交到仓库；`docs/` 已被忽略。公开的设计讨论放在 Issue 或 PR 中。

## 实现与验证

- 组件运行时使用 Octane 原生 API。React 与 `antd` 仅用于开发对照；不要把它们引入发布包作为运行时依赖。
- 公开 props、事件、受控值、ref、组合方式与 TypeScript 声明应一致。实现上游能力时，检查键盘、焦点、禁用、加载及必要的语义属性。
- 样式使用主题 Token，并检查默认、暗色、紧凑和嵌套配置。未支持的 API 或主题行为要在对应组件页和兼容说明中写明。
- 修改或移植上游代码时保留许可与来源。`src/theme/vendor` 不做机械格式化；修改算法时同步来源记录和 Token 对照测试。
- 文档示例必须能够运行，并与已发布包版本一致。不要把有限的测试写成完整视觉、无障碍、SSR 或 API 兼容结论。

提交前运行：

```bash
pnpm check
pnpm pack:check
```

`pnpm check` 包含 Biome、类型、测试及组件包和站点构建。Biome 如报告机械格式问题，先运行 `pnpm format`，再重跑检查。界面、交互、样式或主题变更还需在真实浏览器中验证；`pnpm dev:compare` 启动原生与上游对照夹具，步骤见[浏览器验证说明](tests/browser/README.md)。文档布局同时检查桌面与窄屏。Tailwind 相关修改另跑 `pnpm tailwind:check`。

## 分支与 Pull Request

从最新 `main` 创建目的明确的分支，格式为 `<type>/<kebab-case-description>`，例如 `feat/select-multiple`、`fix/button-focus`、`docs/getting-started` 或 `release/alpha-7`。可用类型包括 `feat`、`fix`、`docs`、`refactor`、`test`、`chore`、`build`、`ci`、`perf`、`revert` 和 `release`。不要用作者、工具或 Agent 名称作分支前缀。

PR 指向 `main`，标题采用 Conventional Commits 格式，如 `feat(select): support multiple selection`。正文简要说明问题、最终行为、兼容影响和验证结果；界面变化附必要的浏览器对照或截图。一个 PR 尽量聚焦一个可评审的主题。使用 squash 合并时，PR 标题会成为最终提交标题。

`main` 只通过 PR 更新，不直接推送或强推。合并前须通过 `check`、`conventions`，解决评审讨论，并由维护者检查最终差异。仓库要求线性历史；当前不强制指定批准人数。

## 发布

版本号、[更新日志](CHANGELOG.md)和发布配置通过 `release/<description>` 分支提交 PR。Alpha 包使用 npm `alpha` 标签；发布前确认打包内容、安装命令和公开文档一致，发布后核对 dist-tag，并从 registry 在独立项目中安装验证。站点依赖只能在 npm 版本实际可安装后升级。

## 编程 Agent

参与**仓库开发**的 Agent 请阅读根目录 [AGENTS.md](AGENTS.md)，其中列出文件边界、检查和发布顺序。协助**应用使用**本库的 Agent 应从站点的 [llms.txt](site/public/llms.txt) 和当前安装版本的类型声明入手；这两种上下文不应混用。

## 许可

提交代码即表示你有权按本项目 [MIT 许可](LICENSE)提供贡献。新增第三方代码或素材时，请更新[第三方声明](packages/antd-octane/THIRD_PARTY_NOTICES.md)。
