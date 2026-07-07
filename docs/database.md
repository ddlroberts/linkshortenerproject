# Database — Drizzle ORM + Neon PostgreSQL

This project uses **Drizzle ORM v1.0.0-rc** with **Neon serverless PostgreSQL** (`@neondatabase/serverless`).

---

## Setup

The database client is exported from `db/index.ts`:

```ts
// db/index.ts
import { drizzle } from 'drizzle-orm/neon-http'

const db = drizzle(process.env.DATABASE_URL!)

export { db }
```

Import `db` from `@/db` in Server Components and Server Functions.

---

## Schema

Define all tables in `db/schema.ts` using Drizzle's schema builder.

```ts
// db/schema.ts
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const links = pgTable('links', {
  id: text('id').primaryKey().default('gen_random_uuid()'),
  userId: text('user_id').notNull(),
  url: text('url').notNull(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

Rules:
- Define one `pgTable` export per entity.
- Use `text` for UUIDs and free-form strings. Use `varchar` when there's a meaningful max length.
- Always include `createdAt` on user-facing tables.
- Use `userId` (Clerk user ID as `text`) to associate records with users — do not store a separate users table unless needed.

---

## Querying

Always query inside Server Components or Server Functions — never on the client.

```ts
import { db } from '@/db'
import { links } from '@/db/schema'
import { eq } from 'drizzle-orm'

// Select all links for the current user
const userLinks = await db
  .select()
  .from(links)
  .where(eq(links.userId, userId))

// Select a single link by slug
const [link] = await db
  .select()
  .from(links)
  .where(eq(links.slug, slug))
  .limit(1)
```

Use destructuring `const [row] = await db...` to get a single result. The result is `undefined` if not found.

---

## Mutations

Run mutations inside Server Functions:

```ts
// Insert
await db.insert(links).values({ id: crypto.randomUUID(), userId, url, slug })

// Update
await db.update(links)
  .set({ url: newUrl })
  .where(eq(links.id, linkId))

// Delete
await db.delete(links).where(eq(links.id, linkId))
```

Always verify the record belongs to the current user before updating or deleting:

```ts
const [link] = await db.select().from(links).where(
  and(eq(links.id, linkId), eq(links.userId, userId))
).limit(1)

if (!link) throw new Error('Not found')
```

---

## Migrations

Use Drizzle Kit to manage migrations.

```bash
# Generate migration files from schema changes
npx drizzle-kit generate

# Push schema directly to the database (dev only)
npx drizzle-kit push

# Run migrations
npx drizzle-kit migrate
```

- Do not hand-write SQL migration files. Let Drizzle Kit generate them.
- The `drizzle/` folder holds generated migration files — do not edit them manually.
- `drizzle.config.ts` configures the dialect (`postgresql`), schema path, and output directory.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon connection string (includes credentials) |

Never hardcode the connection string. Always read from `process.env.DATABASE_URL`.

---

## Neon-Specific Notes

- Uses the HTTP transport (`drizzle-orm/neon-http`) which is compatible with serverless/edge environments.
- Connection pooling is handled by Neon automatically — do not use a connection pool client.
- Do not import `pg` or `postgres` directly. Always go through `db` from `@/db`.
