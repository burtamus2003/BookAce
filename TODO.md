# BookAce TODO

Open items are tracked as [GitHub Issues](https://github.com/burtamus2003/BookAce/issues) now, not here. This file just keeps a log of what's already shipped.

## Done

- [x] Admin portal: fixed white-on-white table headers
- [x] Admin portal: role toggle (promote/demote admins)
- [x] Forgot/reset password flow via Resend
- [x] ISBN lookup for adding books
- [x] Book loan tracking (mark loaned, borrower info, reminder email, mark returned)
- [x] Favicon and browser tab title rebrand
- [x] BIMI-compliant logo SVG + DNS record
- [x] ISBN lookup: added Google Books as a fallback when Open Library comes up empty (couldn't test live against Google's API in the dev sandbox — worth a real-world check once deployed)
- [x] Top nav menu (shown when logged in and on public pages), with FAQ and Changelog pages
- [x] Per-user color palettes: 6 presets (Classic default + 5 curated, contrast-checked options), a profile page with a live picker, applied everywhere except the landing page (closes #5)
- [x] Custom color palettes: override any preset's colors individually, with a live WCAG contrast warning; selecting a preset always resets custom overrides, and the profile page itself always renders in the neutral default so it can never be hidden by a bad color choice
- [x] LICENSE (all rights reserved) and a real README replacing the create-next-app boilerplate
- [x] Privacy page (plain language, covers borrower data collected via loans) and a bug-report FAQ entry linking to GitHub Issues
- [x] Discover page: daily trending book pulled from Open Library, public, not gated behind login (closes #6)
- [x] Wired up the real Amazon Associate tag (bookace-20) on the Discover page's "View on Amazon" link (closes #7)
