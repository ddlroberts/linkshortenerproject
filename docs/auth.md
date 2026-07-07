# Authentication — Clerk v7

This project uses **@clerk/nextjs v7** for authentication. Clerk v7 has breaking changes from v4/v5 — do not rely on older Clerk patterns.

> **Rule**: Clerk is the **only** authentication method in this project. Do not implement any other auth strategy (JWT, NextAuth, session cookies, etc.).

---

## Proxy (Middleware) Setup

Clerk middleware is configured in `proxy.ts` (Next.js 16 renamed middleware to "proxy"):

```ts
// proxy.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk/:path*',
  ],
}
```

- `auth.protect()` redirects unauthenticated users to the sign-in page automatically.
- Add public routes to the `isPublicRoute` matcher. Everything else is protected by default.
- The `/__clerk/:path*` matcher is required for Clerk's embedded components to function.

---

## ClerkProvider

Wrap the app in `<ClerkProvider>` in the root layout (`app/layout.tsx`). It is already configured with the shadcn theme:

```tsx
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/ui/themes'

<ClerkProvider appearance={{ theme: shadcn }}>
  {children}
</ClerkProvider>
```

Do not add another `ClerkProvider` anywhere else in the tree.

---

## Auth State in UI — `Show` Component

Use Clerk's `<Show>` component (from `@clerk/nextjs`) to conditionally render UI based on auth state. Do not check auth state manually with `useAuth()` for simple show/hide logic.

```tsx
import { Show } from '@clerk/nextjs'

<Show when="signed-out">
  <SignInButton />
  <SignUpButton />
</Show>

<Show when="signed-in">
  <UserButton />
</Show>
```

---

## Homepage Redirect for Authenticated Users

The homepage (`/`) is a public route. Authenticated users who visit it must be redirected to `/dashboard` using `auth()` and `redirect()` at the top of the Server Component:

```tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const { userId } = await auth()
if (userId) redirect('/dashboard')
```

- Always perform this check before rendering any homepage content.
- Use `redirect()` from `next/navigation`, not a client-side router push.

---

## Server-Side Auth

Get the current user's ID in Server Components and Server Functions using `auth()` from `@clerk/nextjs/server`:

```ts
import { auth } from '@clerk/nextjs/server'

// In a Server Component
const { userId } = await auth()
if (!userId) redirect('/sign-in')

// In a Server Function (always verify first)
export async function myAction() {
  'use server'
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  // ...
}
```

- `auth()` returns `{ userId: string | null }` and other session data.
- Always check `userId` before accessing the database in Server Functions.

---

## Sign-In / Sign-Up — Modal Only

Sign-in and sign-up must **always** be launched as a modal. Never embed `<SignIn />` or `<SignUp />` directly in a page as a full-page form.

Use `<SignInButton mode="modal">` and `<SignUpButton mode="modal">` to trigger the modal:

```tsx
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

<SignInButton mode="modal">
  <Button>Sign in</Button>
</SignInButton>

<SignUpButton mode="modal">
  <Button>Sign up</Button>
</SignUpButton>
```

- The `mode="modal"` prop is **required** on every `SignInButton` and `SignUpButton`.
- Do not render `<SignIn />` or `<SignUp />` as standalone page components.
- The `app/sign-in/[[...sign-in]]/` and `app/sign-up/[[...sign-up]]/` route folders must still exist — Clerk uses them internally for OAuth callbacks and multi-step flows, but their `page.tsx` files should not render a visible UI (they can be empty or redirect-only).

The catch-all `[[...sign-in]]` / `[[...sign-up]]` folder naming is required by Clerk for multi-step flows regardless of modal usage.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (safe for client) |
| `CLERK_SECRET_KEY` | Clerk secret key (server-only, never expose) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |

---

## What Not To Do

- Do not use any authentication method other than Clerk.
- Do not use `getAuth()` (deprecated in v7). Use `auth()` instead.
- Do not use `withAuth()` HOC. Use `clerkMiddleware` in `proxy.ts`.
- Do not store Clerk user data in the database. Use the Clerk `userId` as a foreign key reference only.
- Do not expose `CLERK_SECRET_KEY` to the client bundle.
- Do not render `<SignIn />` or `<SignUp />` as full-page components. Always use `mode="modal"`.
- Do not add duplicate `<ClerkProvider>` instances anywhere in the component tree.
