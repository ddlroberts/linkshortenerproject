# UI Conventions — Shadcn, Base UI, Tailwind CSS v4

---

## Rules

> **ALL UI elements must use Shadcn UI components.**
> **Do NOT create custom components.** If a component does not exist in `components/ui/`, add it with `npx shadcn add <component>` — never hand-write one.

---

## Component Library

This project uses **shadcn** with the `base-nova` style variant. Components are generated into `components/ui/` and built on top of **Base UI React** (`@base-ui/react`) primitives.

- Run `npx shadcn add <component>` to add new components. Do not hand-write Base UI primitives from scratch.
- `components.json` controls the shadcn config (style, aliases, CSS variable usage).
- Do not edit generated files in `components/ui/` directly unless customizing for the project.

### Component aliases

| Alias | Path |
|-------|------|
| `@/components` | `components/` |
| `@/components/ui` | `components/ui/` |
| `@/lib` | `lib/` |
| `@/hooks` | `hooks/` |

---

## Tailwind CSS v4

This project uses **Tailwind CSS v4** (`tailwindcss ^4`). Tailwind v4 has significant breaking changes from v3.

### Key differences from Tailwind v3

- **No `tailwind.config.js`** — configuration is done via CSS using `@theme` in `app/globals.css`.
- **PostCSS plugin**: uses `@tailwindcss/postcss` instead of `tailwindcss` as the PostCSS plugin.
- **No `@apply` with arbitrary values** in CSS — use CSS variables or utility classes directly.
- CSS variables are defined in `app/globals.css` under `:root` and `@theme`.

### Utility usage

Use Tailwind utility classes for all styling. Do not write custom CSS outside of `globals.css` unless absolutely necessary (e.g., a third-party override).

```tsx
// ✅ Correct
<div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">

// ❌ Avoid inline styles
<div style={{ display: 'flex', alignItems: 'center' }}>
```

### Class merging

Use `cn()` from `@/lib/utils` to merge conditional Tailwind classes:

```tsx
import { cn } from '@/lib/utils'

<div className={cn('flex items-center', isActive && 'bg-primary text-white')} />
```

`cn` uses `clsx` + `tailwind-merge` under the hood.

---

## Icons

Use **Lucide React** (`lucide-react`) for all icons. Do not add other icon libraries.

```tsx
import { Link2, Trash2, Copy } from 'lucide-react'

<Link2 className="size-4" />
```

Default icon size via shadcn: `size-4` (`1rem`). Adjust with `size-*` utilities.

---

## Button Component

The `Button` component (`components/ui/button.tsx`) wraps Base UI's `Button` primitive with shadcn variants.

```tsx
import { Button } from '@/components/ui/button'

<Button variant="default" size="default">Create Link</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive" size="icon"><Trash2 /></Button>
```

Available variants: `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`  
Available sizes: `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`

---

## Dark Mode

The project supports dark mode via CSS variables and Tailwind's `dark:` variant. Dark mode classes are applied to `:root` using the `dark` class on `<html>`.

Always pair light and dark utility classes:

```tsx
<div className="bg-white text-black dark:bg-zinc-900 dark:text-white">
```

---

## Fonts

Geist Sans and Geist Mono are loaded in `app/layout.tsx` via `next/font/google` and applied as CSS variables:

```css
--font-geist-sans
--font-geist-mono
```

Reference them in Tailwind via `font-sans` / `font-mono`, which map to these variables via `globals.css`.

---

## Animations

`tw-animate-css` is installed for animation utilities. Use `animate-*` classes for simple entrance/exit animations.

---

## General Conventions

- Use `h-*`, `w-*`, and `size-*` for dimensions. Prefer `size-*` when width and height are equal.
- Use `gap-*` for spacing between flex/grid children, not `space-x-*`/`space-y-*`.
- Use `rounded-lg` as the default border radius for cards and inputs; `rounded-full` for pills and avatars.
- Avoid hardcoded color values (e.g., `text-[#333]`). Use Tailwind semantic tokens (`text-foreground`, `text-muted-foreground`, etc.) defined as CSS variables.
