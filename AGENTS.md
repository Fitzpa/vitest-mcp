# Repository Guidelines

## Project Structure & Module Organization
- Core TypeScript lives in `src/` (`config/`, `plugins/`, `tools/`, `utils/`, `context/`, plus `index.ts` entry). Keep new server features modular under `plugins/` or `tools/`.
- Tests sit in `src/__tests__/` (`*.test.ts` for unit/integration). Additional validation fixtures live in `test-validation/` for manual/broader scenarios.
- Built artifacts are emitted to `dist/` by the build script; do not edit `dist/` directly. Shared docs for the server live in `src/resources/` and are copied into `dist/resources/`.
- Configuration defaults are in `vitest.mcp.config.ts` and `.example.ts`; use the example as a template for local overrides.

## Build, Test, and Development Commands
- `npm run dev` — TypeScript watch build; use during active development.
- `npm run build` — TypeScript compile + copy resources; required before `npm start`.
- `npm start` — run the compiled MCP server from `dist/`.
- `npm run lint` — ESLint over `src/`.
- `npm run typecheck` — strict TS type checking without emit.
- `npm test` or `npm run test:unit` / `test:integration` — Vitest suites; prefer targeted runs (`vitest run src/__tests__/index.test.ts`) to keep feedback fast.
- `npm run test-coverage` — coverage via `@vitest/coverage-istanbul`; use before releases.
- `npm run ci` — canonical pre-publish pipeline (typecheck, lint, tests, build).

## Coding Style & Naming Conventions
- Language: TypeScript (ES modules); target Node 18+. Use 2-space indentation and keep imports sorted logically (stdlib, external, internal).
- Prefer explicit return types on exported functions and narrow types on public APIs; avoid `any` unless there is a documented reason.
- Follow existing naming: tools/plugins in kebab-case file names, classes in PascalCase, helpers in camelCase. Keep resource docs as Markdown in `src/resources/`.
- ESLint config (`eslint.config.js`) enforces `@typescript-eslint` recommendations and disallows unused vars (prefix unused args with `_`).

## Testing Guidelines
- Framework: Vitest. Name tests `*.test.ts`. Unit coverage should accompany new utilities and tools; integration tests belong in `src/__tests__/integration.test.ts` or adjacent files in that folder.
- Keep runs deterministic (avoid watch mode). Use focused runs (`vitest run path -t "test name"`) while iterating and full `npm test` before PRs.
- Capture coverage when altering execution/coverage logic and ensure new branches are exercised.

## Commit & Pull Request Guidelines
- Commit messages: concise, present-tense, imperative summaries (e.g., `Add filtered coverage summary`). Squash local WIP before opening a PR.
- PRs should describe intent, list main changes, note test commands executed, and link issues/tickets. Include screenshots or sample outputs when UX or CLI output changes.
- Avoid committing generated `dist/` unless releasing; rely on CI build.

## Security & Configuration Tips
- Secrets/env: `.env.development` is loaded only when `VITEST_MCP_DEV_MODE=true`; avoid committing env files. Use `VITEST_MCP_DEBUG` for verbose server logs.
- Validate MCP config changes in `vitest.mcp.config.ts` against the example before shipping; keep optional client-specific instructions in `src/resources/` so they are distributed in builds.
