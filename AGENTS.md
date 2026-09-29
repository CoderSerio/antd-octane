# Agent notes for repository contributors

This file is the operational entry point for coding agents working **in this repository**. For project purpose and user-facing claims, read [README.md](README.md); for contributor workflow, read [CONTRIBUTE.md](CONTRIBUTE.md). Agents helping an application **consume** the package should use [site/public/llms.txt](site/public/llms.txt) and the installed package's types instead.

## Establish the current state

- Check the branch, working tree, package version and relevant open PR before editing. Preserve another contributor's uncommitted work.
- The component package is `packages/antd-octane/`; public guides and runnable cases live in `site/src/pages/` and `site/src/demos/`; browser comparison fixtures live in `tests/browser/`.
- The design/API reference is [Ant Design 5](https://5x.ant.design/components/overview/). [Antdv Next](https://antdv-next.com/components/overview-cn) is a useful example and documentation reference. The Octane version pinned by this repo is authoritative for syntax and compiler integration; consult [Octane's documentation](https://octanejs.dev/docs) and verify examples against the pinned package when upstream docs have moved on.
- A component's presence in navigation does not imply full API parity. Check the actual exports, types, component page, and [compatibility page](site/src/pages/compatibility.tsx) before claiming support.

## Implement and document together

- Keep published runtime components Octane-native. React and `antd` are development references only, never runtime substitutes.
- Match supported props, events, controlled/uncontrolled behavior, refs, themes and types. Exercise keyboard, focus, disabled and loading states for interactive components.
- Use theme Tokens and test default, dark, compact and nested configurations when styling changes. Record unsupported upstream behavior on the relevant component page and compatibility page; do not infer parity from a demo count.
- Preserve upstream provenance and licenses in [THIRD_PARTY_NOTICES.md](packages/antd-octane/THIRD_PARTY_NOTICES.md). Do not mechanically format `packages/antd-octane/src/theme/vendor`; update its source record and token parity checks when changing it.
- The site installs a **published npm version** of `antd-octane`, not workspace source. Finish a new runtime API in source/tests/browser fixtures first; publish and verify its npm version before making public site demos consume it. Keep version, changelog and site dependency in sync with release state.
- Track public API, integration, compatibility and contribution guidance in the repository. Keep internal RFCs, plans, work logs and temporary screenshots outside it. `docs/` is ignored and must not contain tracked files; static site assets belong in `site/public/`.

## Required checks

Before handing back code, run the repository gates:

```bash
pnpm check
pnpm pack:check
```

`pnpm check` runs Biome, TypeScript, tests and library/site builds; `pnpm pack:check` verifies the packed package in independent TSX and TSRX consumers. If Biome reports mechanical issues, run `pnpm format` and repeat the gate. For UI, interaction, style or theme changes, also validate relevant flows in a real browser. `pnpm dev:compare` serves the native/upstream fixture; see [tests/browser/README.md](tests/browser/README.md). Check desktop and narrow layouts for site changes. Run `pnpm tailwind:check` for Tailwind integration changes.

Tests and a few browser comparisons establish only the checked behavior; do not present them as complete API, visual, accessibility, SSR or cross-browser certification.

## Git and release

Follow [CONTRIBUTE.md](CONTRIBUTE.md) for semantic branches, conventional PR titles and review. Target `main` via PR; do not push or force-push directly to `main`. Resolve review threads and pass `check` and `conventions` before merge. Keep PR descriptions short and focused on the final behavior.

Use a `release/<description>` branch for version, changelog and publishing configuration. Alpha uses the npm `alpha` tag. Verify registry availability and a clean install before changing the site to consume a new version. Never describe unpublished source APIs as available from npm.
