# How to edit the AJ Associates website

*Website developed by **Alan Joshy** — +91 62824 06091 · info@alanjoshy.in*

This guide is for changing the site without a developer. It is kept in the `tools/` folder, which visitors
cannot open (the site returns "page not found" for anything under `/tools/`).

## How the site is put together

The public pages (`index.html`, `about.html`, `faq.html` and so on) are **generated**. Do not edit them by hand,
because the next rebuild overwrites them. Instead you edit the source files and rebuild.

- **Source for each page's content:** `tools/partials/*.html`
- **Header, menu, footer, closing banner, Careers page, 404 page, holiday list, registration numbers:** `tools/build.py`
- **Colours, fonts and layout:** `css/styles.css`
- **Interactive parts** (tax estimate, structure guide, package finder, deadline calendar, forms, dropdowns): `js/app.js`

## The three steps for any change

1. **Edit** the right source file (see the table below).
2. **Rebuild.** Open a terminal in the project folder and run:

   ```
   python tools/build.py
   ```

   You need Python 3 installed. The script rewrites all the pages in a couple of seconds and prints "Done."
3. **Upload** to GitHub. Netlify publishes it automatically a minute or so later.

If you changed `css/styles.css` or `js/app.js`, first raise the number `V` near the top of `tools/build.py`
(for example from `'88'` to `'89'`) before step 2. That makes visitors' browsers download the new files
instead of using old copies.

## What to upload

Everything in the project folder **except** `tools/`, `_legacy/`, any `.zip` file and the `.claude/` folder.
In practice: all the `.html` files, `css/`, `js/`, `assets/`, the icon files, `site.webmanifest`,
`.well-known/`, `netlify.toml`, `_redirects`, `sitemap.xml` and `robots.txt`.
(Uploading `tools/` is harmless, but it is not needed.)

## Where each thing lives

| To change… | Edit |
|---|---|
| Home headline and the box beside it | `tools/partials/hero.html` |
| Home numbers strip (300+ clients and so on) | `tools/partials/band.html` |
| The three questions on Home | `tools/partials/ask.html` |
| The seven services (Home, Services page and each service page) | `tools/partials/services.html` |
| "How we work" | `tools/partials/approach.html` |
| Testimonials | `tools/partials/reviews.html` |
| Partners (About page) | `tools/partials/team.html` |
| Commitments (About page) | `tools/partials/principles.html` |
| Industries we serve | `tools/partials/industries.html` |
| Packages and the package finder text | `tools/partials/packages.html` (the package lists themselves are in `js/app.js`, search for `PK`) |
| Collab page | `tools/partials/network.html` |
| Contact page and booking form | `tools/partials/contact.html` |
| FAQs | `tools/partials/faq.html` |
| Resources (calendar text, checklists, notes) | `tools/partials/resources.html` |
| Privacy policy / Terms | `tools/partials/privacy.html` / `tools/partials/terms.html` |
| Menu, footer, phone numbers, email, WhatsApp number | `tools/build.py` (top of the file) |
| Careers page | `tools/build.py`, search for `build_careers` |

## Common jobs

**Change a phone number, email or the WhatsApp number.** At the top of `tools/build.py`: `WA`, `INFO`,
`PHONE_TEL` and `PHONE_SHOW`. Rebuild and upload.

**Add or change registration numbers in the footer.** In `tools/build.py`, edit `FIRM_IDS`. Only the ones you fill in
are shown. Currently the GSTIN is set.

**Add a holiday (the booking form will refuse that date).** In `tools/build.py`, add a line to `HOLIDAYS`, for example
`'2026-11-01': 'Kerala Piravi',`. Dates are year-month-day. Sundays are already handled. The list needs new dates
every year, because festivals such as Onam, Vishu and Eid move.

**Add a FAQ.** Open `tools/partials/faq.html`, copy one whole `<details id="...">...</details>` block inside the right
category, and change the `id`, the question and the answer. If the answer states a law, limit or date, keep the small
"as of dd-mm-yyyy" line at its end and use today's date.

**Update the "as of" dates.** Use find-and-replace in `tools/partials/faq.html` and `tools/partials/resources.html`
to change `as of 01-10-2026` to the new date, once the answers have been checked.

**Change testimonials or the Google rating.** Testimonials are in `tools/partials/reviews.html`. The rating shown on
Home is in `tools/partials/band.html`, and a copy is in the hidden search data near the top of `tools/build.py`
(search for `aggregateRating`).

**Change the tax estimate.** The rates, rebate and standard deduction are in `js/app.js` (search for `new regime`). Update after each Budget and change the "FY 2025-26" label in
`tools/partials/hero.html`.

**Change the deadline dates on the Resources page.** In `js/app.js`, search for `CAL`. Each line is month, day and name.

**Change the booking slots.** In `tools/partials/contact.html`, the "Preferred time" list.

**Remove the "Beta" marker when the site is final.** In `tools/build.py`, change `BETA = True` to `BETA = False`, rebuild
and upload. The small "Beta" tag in the navbar and the note in the footer disappear.

**Turn off the no-copy / no-select protection.** Text, images and links cannot be selected, copied or dragged. To remove
it, delete the block commented "content protection" in `css/styles.css` and in `js/app.js`, then raise `V`, rebuild and
upload. Form fields always stay editable.

## Things that need attention once a year

- The tax estimate rates (after the Budget).
- The holiday list.
- The "as of" dates on FAQs and Resources, after a review.
- The expiry date in `.well-known/security.txt`: in `tools/build.py`, search for `Expires`. It is currently
  30 September 2027; move it forward by a year.

## Netlify settings to check after the site is live

- **Forms:** three forms should be listed ("contact", "collab", "booking"). Under Forms, Form notifications, add an
  email notification to the firm's address for each.
- **Primary domain:** set `ajassociatesonline.com` as the primary domain, so the free `netlify.app` address redirects to it.
- **Security headers:** these are set in `netlify.toml` (generated by the build). If you ever add an outside service
  (analytics, a chat widget, a map from another provider), it has to be allowed in the `Content-Security-Policy` line in
  `tools/build.py` (search for `csp =`), or the browser will block it.

## If something looks wrong

- **The page did not change after uploading.** Raise `V`, rebuild, upload again, and hard refresh the browser (Ctrl+Shift+R).
- **A page shows old text.** You probably edited the generated `.html` file. Edit the matching file in `tools/partials/`
  and rebuild.
- **A feature stopped working.** Open the browser's developer console (F12). A red message mentioning "Content Security
  Policy" means a script or service is being blocked by the rules in `tools/build.py`.

## Developer

**Alan Joshy**
Phone: +91 62824 06091
Email: info@alanjoshy.in

For anything this guide does not cover, contact the developer.

## What the site is built with

**Languages**
- HTML5 and CSS3 (CSS variables, grid, flexbox, `clip-path` for the diagonal shapes, view transitions for the page-to-page effect)
- Vanilla JavaScript (no frameworks or libraries, so the site stays light on low-end devices)
- Python 3, only for the build script `tools/build.py` (standard library only). It is used when editing and is not part of the live site.

**Hosting and services**
- GitHub for the source files and Netlify for hosting, HTTPS, redirects, security headers, the 404 page and form handling
- Google Maps embed on the Contact page
- WhatsApp click-to-chat links and standard email and phone links
- No analytics, no tracking, no cookies set by the site

**Fonts and graphics**
- Playfair Display and Inter, both open-source (SIL Open Font License), served from the site itself (`assets/fonts/`) so nothing is loaded from outside
- Icons are drawn as inline SVG; illustrations and the logo are WebP images in `assets/`
- Image and font preparation (logo variants, share image, favicons) was done with Python and the Pillow and fontTools libraries. These are not needed to edit or run the site.

**Design and performance approach**
- Progressive enhancement: every page works without JavaScript, and the interactive parts add to it
- Low-end device mode: animation is switched off for data-saver, low-memory, few-core and "reduce motion" settings
- Home, Packages, Leadership, Collab and Contact scale to fit one screen on smaller laptops
- Security headers and a strict Content Security Policy are generated by the build script into `netlify.toml`

