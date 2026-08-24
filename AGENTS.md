<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# AGENTS.md

## What this project is

A school assignment ("Trabalho de Ensino Religioso") — a medieval 2D canvas
platformer game about the Crusades. All UI text is Portuguese (pt-BR). Generated
with Lovable on the TanStack Start template (`tanstack_start_ts_current`,
see `.lovable/project.json`).

## Commands

Package manager is **Bun** (`bun.lock`, `bunfig.toml`). npm also works.

```sh
bun install        # install deps
bun run dev        # dev server (vite dev)
bun run build      # production build (nitro; Cloudflare is the default target)
bun run build:dev  # build in development mode
bun run preview    # preview the production build
bun run lint       # ESLint (includes Prettier rules — see below)
bun run format     # Prettier --write .
```

- **No tests and no CI exist.** There is no test script; don't invent one.
- No dedicated typecheck script; `tsconfig.json` has `"noEmit": true`, so a
  plain `tsc` run is a typecheck.
- Build output/deploy target is Nitro with Cloudflare preset (see comment in
  `vite.config.ts` and `.wrangler/` entries in `.gitignore`).

## Critical gotchas

### Vite config is a wrapper — do not add standard plugins manually

`vite.config.ts` uses `defineConfig` from `@lovable.dev/vite-tanstack-config`,
which **already includes** TanStack devtools, `tanstackStart`, `viteReact`,
`tailwindcss`, `tsConfigPaths`, `nitro`, `VITE_*` env injection, the `@` path
alias, and dedupe/error-logger plugins. Adding any of these by hand creates
duplicate plugins and **breaks the app**. Pass extra options via
`defineConfig({ vite: { ... }, ... })` instead.

The `tanstackStart: { server: { entry: "server" } }` line redirects the SSR
server entry to `src/server.ts` — keep it.

### SSR error-handling chain (don't break it)

Three cooperating pieces recover errors that h3/Nitro would otherwise swallow
into an opaque `{"unhandled":true,"message":"HTTPError"}` 500:

- `src/server.ts` — custom server entry wrapping
  `@tanstack/react-start/server-entry`; detects swallowed 500s and re-renders
  a static error page (`src/lib/error-page.ts`), pulling the real stack from
  `src/lib/error-capture.ts`.
- `src/start.ts` — `createStart()` with an error middleware and CSRF
  middleware. **Defining `src/start.ts` opts out of Start's defaults, which is
  why CSRF is re-added explicitly.** If you edit this file, keep both.
- `src/lib/lovable-error-reporting.ts` — forwards boundary-caught errors to
  Lovable editor telemetry hooks (no-ops outside the editor preview).

### Bun supply-chain guard

`bunfig.toml` sets `minimumReleaseAge = 86400` (24h): dependency versions
published less than a day ago are skipped on install. If a brand-new release
seems uninstallable, that's why. Adding an entry to
`minimumReleaseAgeExcludes` requires user confirmation — only `@lovable.dev/*`
packages are excluded today.

### Stray duplicate files

`vite.config(1).ts` and `src/components/ui/hover-card(1).tsx` are
byte-identical browser-download duplicates. They are inert (Vite only reads
`vite.config.ts`), safe to delete, and should never be edited.

## Architecture

Request flow: `vite.config.ts` (Lovable wrapper) → `src/server.ts` (SSR fetch
wrapper) → TanStack Start entry (`src/start.ts` middleware: error + CSRF) →
router from `src/router.tsx` (built from generated route tree, with a
`QueryClient` in router context) → routes in `src/routes/`.

### Routing (TanStack Router, file-based)

- Route files live in `src/routes/`; conventions are documented in
  `src/routes/README.md` (dynamic params use `$id` not `{id}`, splats read
  `_splat`, layouts are `_layout.tsx`, etc.).
- `src/routeTree.gen.ts` is **auto-generated — never edit it** (also in
  `.prettierignore`).
- `src/routes/__root.tsx` is the only root layout. It uses
  `createRootRouteWithContext<{ queryClient: QueryClient }>()`; `RootShell`
  (`shellComponent`) renders the html/head/body document shell, and
  `RootComponent` wraps everything in `QueryClientProvider`. Do not remove the
  `<Outlet />`. It also defines custom `notFoundComponent`/`errorComponent`
  that report through `reportLovableError`.

### The app itself: one big game file

`src/routes/index.tsx` contains the entire product: menu/credits/game screens
and a full canvas game loop inside a single `useEffect` (fixed 900×520 canvas,
4×-width scrolling village). Game structure to know before editing:

- Phases: `intro` (house interior) → `village` → `shieldhouse` → `fase2`.
- Enemies (`soldier` ×2, `general`) run a state machine:
  `idle → charging → vulnerable → dizzy → pinned → gone`, timed in frames
  (60 fps assumptions: `CHARGE=120`, `VULN=240`, `DIZZY=180`).
- Controls: A/D move, Space jump/act, E/W/Q color-matched dodge during enemy
  strikes. World positions are constants (`KNIGHT_X`, `SOLDIER1_X`, `GENERAL_X`,
  `MILL_X`, …) at the top of the file.

## Conventions

### TypeScript

`tsconfig.json` is strict **plus** `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, and
`noImplicitReturns`. Consequences you'll see in existing code:

- Array/record index access yields `T | undefined` → non-null assertions like
  `ATTACKS[0]!` are the established pattern.
- Import path alias: `@/*` → `./src/*`.

### ESLint (`eslint.config.js`)

- Importing `server-only` is an **error**: TanStack Start doesn't use that
  package. Mark server-only modules with a `*.server.ts` suffix or
  `@tanstack/react-start/server-only`.
- `eslint-plugin-prettier` is active, so `bun run lint` also fails on
  formatting — run `bun run format` before committing.
- `@typescript-eslint/no-unused-vars` is off; ignores: `dist`, `.output`,
  `.vinxi`.

### Prettier (`.prettierrc`)

100 print width, double quotes, semicolons, trailing commas everywhere.

### Styling — Tailwind v4 via CSS, no config file

`src/styles.css` uses `@import "tailwindcss"` + `@theme inline` to map CSS
custom properties to utilities. There is **no `tailwind.config.js`**. Rules
from the file's header comment: all colors must be `oklch`; to add a semantic
color, define it in `:root` and `.dark`, then register it in `@theme inline` as
`--color-<name>: var(--<name>)`.

### UI components — shadcn/ui

`components.json` (new-york style, no RSC, lucide icons). Primitives live in
`src/components/ui/`; compose them rather than editing them. `cn()` from
`src/lib/utils.ts` (clsx + tailwind-merge) merges class names.
