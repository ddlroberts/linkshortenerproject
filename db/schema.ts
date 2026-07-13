import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const links = pgTable('links', {
  id: text('id').primaryKey().default('gen_random_uuid()'),
  userId: text('user_id').notNull(),
  url: text('url').notNull(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})
