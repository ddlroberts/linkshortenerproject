# Next.js 16 Conventions

This project uses **Next.js 16.2.10** with the App Router. This version contains breaking changes from prior versions. Read these rules before writing any Next.js code.

---

## App Router Fundamentals

- All files live under `app/`. Do not use the `pages/` directory.
- **All layouts and pages are Server Components by default.** Only add `'use client'` when you need interactivity (event handlers, browser APIs, React hooks like `useState`/`useEffect`).
- File-system routing: folders define URL segments. A route is public only when a `page.tsx` or `route.ts` file exists inside the folder.

### Special files

| File | Purpose |
|------|---------|
| `layout.tsx` | Shared UI that wraps child segments. Preserves state between navigations. |
| `page.tsx` | The UI for a specific route, rendered on that URL. |
| `loading.tsx` | Skeleton/suspense boundary shown while a route segment loads. |
| `error.tsx` | Error boundary for a route segment. Must be a Client Component (`'use client'`). |
| `not-found.tsx` | Shown when `notFound()` is called. |
| `route.ts` | API endpoint (Route Handler). Cannot co-exist with `page.tsx` in the same segment. |

---

## `params` is a Promise (Breaking Change)

In Next.js 16, `params` and `searchParams` are **Promises**, not plain objects. You must `await` them.

```tsx
// ✅ Correct — Server Component
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <div>{slug}</div>
}
```

```tsx
// ✅ Correct — Client Component
'use client'
import { use } from 'react'

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  return <div>{slug}</div>
}
```

```tsx
// ❌ Wrong — will throw
export default async function Page({ params }: { params: { slug: string } }) {
  return <div>{params.slug}</div>
}
```

---

## Proxy (formerly Middleware)

Next.js 16 **renamed Middleware to Proxy**. The file is `proxy.ts` at the project root, not `middleware.ts`.

```ts
// proxy.ts
export default function proxy(request: NextRequest) { ... }

export const config = { matcher: [...] }
```

- Do not create a `middleware.ts` file. It will be ignored.
- Proxy is for lightweight request logic only (redirects, auth checks, header rewrites). Do not fetch slow data or run heavy logic inside it.

---

## Server Components

Use Server Components for:
- Database queries (via Drizzle)
- Reading secrets/env vars
- Reducing client-side JS

```tsx
// ✅ Direct DB query in a Server Component
import { db } from '@/db'
import { links } from '@/db/schema'

export default async function Page() {
  const allLinks = await db.select().from(links)
  return <ul>{allLinks.map(l => <li key={l.id}>{l.slug}</li>)}</ul>
}
```

---

## Client Components

Add `'use client'` only when the component needs:
- `useState`, `useEffect`, or other React hooks
- Browser APIs (`window`, `localStorage`, etc.)
- Event handlers (`onClick`, `onChange`)

Keep Client Components as leaf nodes in the tree. Pass data down as props from Server Components.

---

## Data Fetching

- `fetch()` is **not cached by default** in Next.js 16. Identical calls in the same render are deduplicated (memoized), but not persisted across requests.
- To cache data, use the `use cache` directive (see below) or `cacheLife`.
- For databases, query directly in async Server Components using Drizzle.

```tsx
// Preferred: direct DB query
import { db } from '@/db'
import { links } from '@/db/schema'

const result = await db.select().from(links).where(...)
```

---

## Caching with `use cache`

> Only enable if `cacheComponents: true` is set in `next.config.ts`.

```ts
// Data-level caching
import { cacheLife } from 'next/cache'

export async function getLinkBySlug(slug: string) {
  'use cache'
  cacheLife('hours')
  return db.select().from(links).where(eq(links.slug, slug))
}
```

Without `cacheComponents: true`, do not use `'use cache'`.

---

## Server Functions (Server Actions)

Use Server Functions to mutate data. Mark functions with `'use server'` inside a file or at the top of a standalone `actions.ts` file.

```ts
// app/lib/actions.ts
'use server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { links } from '@/db/schema'
import { revalidatePath } from 'next/cache'

export async function createLink(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const url = formData.get('url') as string
  const slug = formData.get('slug') as string

  await db.insert(links).values({ url, slug, userId })
  revalidatePath('/dashboard')
}
```

Rules:
- **Always verify authentication and authorization inside every Server Function.** Never trust that the caller is authenticated.
- Use `revalidatePath` or `revalidateTag` after mutations to bust the cache.
- Server Functions are reachable via direct POST requests — treat them as API endpoints.

---

## Route Handlers

Place `route.ts` files inside `app/` for API endpoints. Supported methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.

```ts
// app/api/links/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'

export async function GET(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userLinks = await db.select().from(links).where(eq(links.userId, userId))
  return NextResponse.json(userLinks)
}
```

- Route Handlers cannot exist at the same segment as `page.tsx`.
- Prefer Server Functions (Server Actions) for form mutations over Route Handlers.

---

## Navigation

- Always use `<Link href="...">` from `next/link` for internal navigation. Do not use `<a>` tags for internal routes.
- Use `redirect()` from `next/navigation` inside Server Components and Server Functions for programmatic redirects.
- Use `useRouter()` only in Client Components for imperative navigation.

---

## Dynamic Routes

```
app/[slug]/page.tsx   →  /:slug
app/dashboard/links/[id]/page.tsx  →  /dashboard/links/:id
```

Use catch-all segments for optional/multi-segment routes: `[[...slug]]`.

---

## TypeScript

- Always use TypeScript. All files use `.tsx` or `.ts` extensions.
- Use `import type` for type-only imports.
- Do not use `any`. Use `unknown` and narrow the type.
