# Development notes

- Use Node.js >= 22.22.2 and pnpm 10.29.2.
- Run `pnpm check` and `pnpm pack:check` before handing changes back. If Biome reports mechanical fixes, run `pnpm format` and rerun the gate.
- UI changes also need browser checks. `pnpm dev:compare` serves the native/upstream fixture at `/tests/browser/index.html`; `?renderer=antd` selects the baseline. The comparison procedure is in `tests/browser/compare.mjs`.
- Preserve upstream licenses and provenance when adapting code. Do not mechanically format `src/theme/vendor`; update its source record and token parity tests when changing it.
- Keep runtime components Octane-native. React and antd are development references only.
- Document unsupported API/theme behavior in `docs/compatibility.md` and the site. Do not claim full parity from the limited first-alpha checks.
