# BookAce TODO

Running list of things to look into or build. Add new items as they come up.

## Open

- [ ] Verify the Gmail spam-folder email's headers ("Show original") to confirm SPF/DKIM/DMARC are actually passing now
- [ ] Register `burtamus@gmail.com` on production and decide if it should also be an admin
- [ ] ISBN lookup: some ISBNs (e.g. UK editions) aren't in Open Library's database — consider a fallback provider (Google Books API) when the primary lookup comes up empty
- [ ] Gmail won't show the BIMI logo without a paid Verified Mark Certificate, which requires a registered trademark — revisit if that's worth pursuing

## Done

- [x] Admin portal: fixed white-on-white table headers
- [x] Admin portal: role toggle (promote/demote admins)
- [x] Forgot/reset password flow via Resend
- [x] ISBN lookup for adding books
- [x] Book loan tracking (mark loaned, borrower info, reminder email, mark returned)
- [x] Favicon and browser tab title rebrand
- [x] BIMI-compliant logo SVG + DNS record
