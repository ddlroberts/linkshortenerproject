<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Link Shortener — Agent Instructions

This project is a **link shortener** built with Next.js 16 (App Router), Clerk v7, Drizzle ORM, and Neon PostgreSQL.

> **CRITICAL — NON-NEGOTIABLE RULE:**
> You **MUST** read the relevant `/docs` instruction file(s) **BEFORE** writing or generating **ANY** code, no matter how small the change. Skipping this step is not allowed under any circumstances. This project uses versions and conventions that differ significantly from your training data — proceeding without reading the docs will produce incorrect code.

## Instruction Files

> **STOP. Before writing any code:** identify which topic(s) your task touches, then use the `read_file` tool to read **every** relevant docs file listed below. Do not generate a single line of code until you have done this.

For detailed guidelines on specific topics, refer to the modular documentation in the `/docs` directory. **ALWAYS read the relevant `.md` file(s) BEFORE generating ANY code:**

| Topic | File |
|-------|------|
| Next.js 16 conventions (routing, Server Components, Server Functions, Proxy) | [docs/nextjs.md](docs/nextjs.md) |
| Database — Drizzle ORM + Neon PostgreSQL | [docs/database.md](docs/database.md) |
| Authentication — Clerk v7 | [docs/auth.md](docs/auth.md) |
| UI components, Shadcn, Tailwind CSS v4 | [docs/ui.md](docs/ui.md) |



---

## Project Stack

- **Framework**: Next.js 16.2.10 — App Router only. No Pages Router.
- **Language**: TypeScript 5. All files use `.tsx` / `.ts`.
- **Auth**: Clerk v7 (`@clerk/nextjs`). Read `docs/auth.md` before touching auth.
- **Database**: Neon PostgreSQL via Drizzle ORM v1. Read `docs/database.md` before touching the DB.
- **UI**: Shadcn `base-nova` style + Base UI React + Tailwind CSS v4. Read `docs/ui.md` for component and styling conventions.
- **Icons**: Lucide React only.

## Key Breaking Changes (vs. common Next.js knowledge)

1. **`proxy.ts`** — Middleware is renamed to Proxy. The file is `proxy.ts`, not `middleware.ts`.
2. **`params` is a Promise** — Always `await params` in async Server Components; use `use(params)` in Client Components.
3. **`fetch()` is not cached** — Do not assume fetch responses are cached. Use `'use cache'` or `cacheLife` explicitly (requires opt-in via `cacheComponents: true`).
4. **Clerk v7** — `getAuth()` and `withAuth()` are removed. Use `auth()` from `@clerk/nextjs/server`.

## File & Folder Conventions

```
app/                    # App Router — all routes live here
  layout.tsx            # Root layout with ClerkProvider and global header
  page.tsx              # Home page
  sign-in/[[...sign-in]]/page.tsx
  sign-up/[[...sign-up]]/page.tsx
components/
  ui/                   # Shadcn-generated components (do not edit manually)
db/
  index.ts              # Drizzle client export
  schema.ts             # All table definitions
lib/
  utils.ts              # cn() utility and shared helpers
docs/                   # Agent instruction files (this directory)
proxy.ts                # Clerk middleware (Next.js 16 Proxy)
drizzle.config.ts       # Drizzle Kit configuration
```

## General Rules

- **Read the relevant `/docs` file(s) before writing any code — no exceptions.**
- Do not use the `pages/` directory.
- Do not create `middleware.ts` — use `proxy.ts`.
- Do not use `any` in TypeScript. Use `unknown` and narrow types.
- Always verify authentication inside Server Functions before touching the database.
- Use `@/` path aliases for all internal imports.
- Do not install new dependencies without confirming with the user.

