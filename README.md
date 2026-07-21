# BookAce

A personal book-cataloging app. Track what you own, look books up by ISBN, loan them out to friends, and keep collector-level details like condition, edition, and signed copies.

Live at [bookace.app](https://bookace.app).

## Features

- **ISBN lookup** — scan or type an ISBN and title, author, cover art, and publish date are filled in automatically, checking Open Library first and falling back to Google Books for better coverage
- **Collector details** — condition, format, edition/printing, signed-copy flag, reading status, and your own rating on every book
- **Loan tracking** — mark a book as loaned with a borrower's name and email, then send them a reminder from the same panel
- **Per-user color palettes** — pick from a set of curated, contrast-checked themes on your profile page
- **Admin tools** — promote/demote admins, reset passwords, and manage accounts from `/admin`
- **Self-service password reset** via email

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React
- [Drizzle ORM](https://orm.drizzle.team) + Postgres
- [Auth.js (NextAuth) v5](https://authjs.dev) for authentication
- [Resend](https://resend.com) for transactional email
- Tailwind CSS
- Docker, deployed via GitHub Actions → GHCR → a self-hosted VPS

## Local development

You'll need a Postgres database running locally.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` with:
   ```
   DATABASE_URL=postgres://user:password@localhost:5432/bookace
   AUTH_SECRET=some-random-string
   RESEND_API_KEY=your-resend-key
   GOOGLE_BOOKS_API_KEY=optional-for-a-higher-quota
   ```
3. Run migrations:
   ```bash
   npm run db:migrate
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

Other useful scripts: `npm run db:generate` (create a new migration after changing `src/db/schema.ts`) and `npm run db:studio` (browse the database with Drizzle Studio).

## Deployment

Pushing to `main` triggers a GitHub Actions workflow that builds a Docker image and publishes it to `ghcr.io/burtamus2003/bookace:latest`. The production host pulls the new image and restarts the container, which runs pending database migrations automatically on startup before serving traffic.

## Bug reports

Found something broken? [Open an issue](https://github.com/burtamus2003/BookAce/issues/new) — include what you were doing and what you expected to happen.

## License

All rights reserved — see [LICENSE](LICENSE). The code is visible for transparency, but reuse or redistribution isn't permitted without permission.
