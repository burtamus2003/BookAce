# BookAce TODO

Running list of things to look into or build. Add new items as they come up.

## Open

- [ ] Verify the Gmail spam-folder email's headers ("Show original") to confirm SPF/DKIM/DMARC are actually passing now
- [ ] Register `burtamus@gmail.com` on production and decide if it should also be an admin
- [ ] ISBN lookup: some ISBNs (e.g. UK editions) aren't in Open Library's database — consider a fallback provider (Google Books API) when the primary lookup comes up empty
- [ ] Gmail won't show the BIMI logo without a paid Verified Mark Certificate, which requires a registered trademark — revisit if that's worth pursuing
- [ ] SEO pass: metadata/OpenGraph tags per page, sitemap.xml, structured data, check robots.txt still makes sense once public-facing pages exist
- [ ] Per-user color palettes — replace the current stark black/white with something more modern, and let each user pick/customize their own. Needs: a profile/settings page to store the preference per user (schema + UI), and a palette picker. Reference for presets: [Figma's website color schemes library](https://www.figma.com/resource-library/website-color-schemes/) — 53 named schemes across 5 moods (Minimal & Neutral, Warm, Cool, Vibrant & Bold, Modern); worth curating a handful of these (e.g. from the "Modern" or "Minimal and Neutral" groups) as starter presets rather than building a full custom color picker
- [ ] Dashboard: "Random book" discovery section pulling from all members' libraries, visually separated so it's clearly not part of the library owner's own collection — needs decisions on opt-in/privacy (should users be able to exclude their books?) before building
- [ ] "Buy This Book" link on the random book post using an Amazon affiliate tag — needs the actual Associates tag/ID once we get there

## Done

- [x] Admin portal: fixed white-on-white table headers
- [x] Admin portal: role toggle (promote/demote admins)
- [x] Forgot/reset password flow via Resend
- [x] ISBN lookup for adding books
- [x] Book loan tracking (mark loaned, borrower info, reminder email, mark returned)
- [x] Favicon and browser tab title rebrand
- [x] BIMI-compliant logo SVG + DNS record
