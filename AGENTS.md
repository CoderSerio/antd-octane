# Development notes

- Use Node.js >= 22.22.2 and pnpm 10.29.2.
- Run `pnpm check` and `pnpm pack:check` before handing changes back. If Biome reports mechanical fixes, run `pnpm format` and rerun the gate.
- UI changes also need browser checks. `pnpm dev:compare` serves the native/upstream fixture at `/tests/browser/index.html`; `?renderer=antd` selects the baseline. The comparison procedure is in `tests/browser/compare.mjs`.
- Preserve upstream licenses and provenance when adapting code. Do not mechanically format `src/theme/vendor`; update its source record and token parity tests when changing it.
- Keep runtime components Octane-native. React and antd are development references only.
- Document unsupported API/theme behavior in `docs/compatibility.md` and the site. Do not claim full parity from the limited first-alpha checks.

## Contribution workflow

- Follow `CONTRIBUTE.md` for branch names, PR titles, validation and review. Use semantic branches such as `feat/select`, `fix/button-focus` or `chore/repository-conventions`; do not use tool or author names as branch prefixes.
- Target `main` through pull requests. Do not push directly or force-push to `main`.
- Keep internal RFCs, specs, plans and discussion notes outside the repository. Retain public API, integration, compatibility and contribution documentation.
