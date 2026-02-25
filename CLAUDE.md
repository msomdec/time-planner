# Destination Wedding Planner

## Tech Stack
- Next.js 14+ (App Router) with TypeScript
- Tailwind CSS with rose/pink theme
- shadcn/ui components
- Drizzle ORM + better-sqlite3
- @dnd-kit for drag-and-drop
- react-dropzone for file uploads
- Zod for validation

## Conventions
- Pages are server components; interactive parts use "use client"
- API routes use Zod for input validation
- Never SELECT the `data` BLOB column in list queries
- Use `router.refresh()` after mutations in client components
- Font: Inter (body via font-sans), Great Vibes (headings via font-script)
- Colors: rose/pink palette, glass-morphism style

## Commands
- `npm run dev` - Start dev server
- `npx drizzle-kit generate` - Generate migrations
- `npx drizzle-kit push` - Push schema to DB
