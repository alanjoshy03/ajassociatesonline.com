# AJ Associates website: the complete code guide

*A study guide for the developer. Read it in order once, then use the "Reviewer questions" part (section 17) before any meeting.*

Everything in this guide was checked against the actual files in the project. Where I say "line" or name a function, it exists in the code.

---

## Contents

1. The 60-second explanation
2. The big picture (architecture)
3. Languages and technologies used
4. The folder map
5. The build system (`tools/build.py`)
6. HTML: how the pages are structured
7. CSS: how the design works
8. JavaScript: every feature in `js/app.js`
9. The forms and how enquiries reach you
10. The checklists and PDF generator
11. Deployment: GitHub, Netlify, redirects, headers, security
12. SEO and structured data
13. Performance and low-end devices
14. Accessibility
15. Local preview and the daily workflow
16. Honest limits: what a sharp reviewer could challenge
17. Reviewer questions with model answers
18. Practice exercises
19. Glossary
20. One-page cheat sheet

---

## 1. The 60-second explanation

Say this out loud until it comes naturally:

> "It is a static website: plain HTML, CSS and JavaScript, with no framework, no database and no server code. To avoid repeating the header, menu and footer on 21 pages, I wrote a small Python script, `build.py`, that stitches the page content, which is stored in small HTML files, into a common template and writes out the final pages. It also generates the sitemap, the redirect rules, the security headers and 21 PDF checklists. The result is uploaded to GitHub and Netlify publishes it automatically. Forms are handled by Netlify Forms, so there is no backend to maintain. I chose this because it is fast on weak phones, very cheap to host, hard to hack and easy to maintain."

Key numbers to remember:
- **24 HTML files** (22 public pages, plus a 404 page and an error page). Eight of them are service pages inside `services/`.
- **One stylesheet** (`css/styles.css`, about 100 KB, about 1,300 lines).
- **One script** (`js/app.js`, about 56 KB, about 860 lines), no libraries.
- **One build script** (`tools/build.py`, about 1,100 lines) plus `tools/checklists.py` (the checklist data).
- **21 downloadable PDFs**, generated from code.
- **Zero** third-party scripts, trackers, frameworks or CDNs. Fonts are hosted on the same site.

---

## 2. The big picture (architecture)

```
  YOU EDIT                        YOU RUN                         YOU UPLOAD                 VISITOR SEES
  --------                        -------                         ----------                 ------------
  tools/partials/*.html   ─┐
  tools/checklists.py     ─┤──►  python tools/build.py  ──►  index.html, about.html, ...  ──►  GitHub  ──►  Netlify  ──►  browser
  tools/build.py (chrome) ─┤       (the "generator")         services/*.html
  css/styles.css          ─┤                                  downloads/*.pdf
  js/app.js               ─┘                                  _redirects, netlify.toml,
                                                              sitemap.xml, robots.txt ...
```

There are three layers:

1. **Source layer** (what you edit): partials, the data file, the CSS and JS, and the template code inside `build.py`.
2. **Build layer** (Python): turns the source into finished files. This happens on your computer, not on the server.
3. **Delivery layer** (Netlify): serves the finished files, applies the redirects and security headers, and handles form submissions.

**Why this design?** A *static* site means every page is a finished file. When a visitor opens a page, the server just sends the file. Nothing is computed per visitor, so it is fast, there is nothing to hack (no database, no login, no server code), and hosting is free or nearly free.

**What "dynamic" things exist then?** Anything interactive (the tax estimate, due-date calendar, package finder, quiz, FAQ search) runs in the visitor's browser using JavaScript. Forms are sent to Netlify's form service.

---

## 3. Languages and technologies used

| Technology | Where | What it does here |
|---|---|---|
| **HTML5** | `tools/partials/*.html`, templates in `build.py`, generated pages | The structure and content of the pages. Uses semantic tags (`header`, `main`, `nav`, `section`, `footer`, `details`), forms, inline SVG icons |
| **CSS3** | `css/styles.css` | All the visual design: variables, grid, flexbox, `clamp()`, `clip-path` slanted edges, transitions, view transitions, print styles, dark-on-light themes |
| **JavaScript (vanilla, ES5 style)** | `js/app.js` | All interactivity. Written with `var` and function expressions on purpose, so it runs on old phones. No jQuery, no React |
| **Python 3** | `tools/build.py`, `tools/checklists.py`, `tools/preview.py` | The static site generator, the data file for checklists, the local preview server |
| **Regular expressions (regex)** | Throughout `build.py` | Used to find and rewrite parts of the HTML text (links, headings, tags) |
| **ReportLab (Python library)** | `build_checklist_pdfs()` | Draws the 21 checklist PDFs |
| **JSON-LD** | Generated in `build.py` | Machine-readable data for search engines (organisation, services, breadcrumbs) |
| **TOML** | `netlify.toml` | Netlify's settings file: security headers and caching rules |
| **Netlify `_redirects` format** | `_redirects` | Redirect and rewrite rules (clean URLs, old links) |
| **Markdown** | `tools/*.md` | Documentation for you |
| **Git / GitHub** | Version control and the deploy trigger | You push files; Netlify watches the repository |
| **Netlify** | Hosting | Serves the site, redirects, headers, HTTPS, Forms |

**What is NOT used (and why you should be able to say it):**
- No React/Vue/Angular: a brochure site doesn't need a client-side framework. It would add size and slow weak phones.
- No Bootstrap/Tailwind: hand-written CSS is smaller and gives a custom look.
- No jQuery: modern browsers do everything it used to do.
- No database and no backend: nothing to secure or pay for.
- No WordPress: no plugins to hack, no updates to break, much faster. The trade-off is that you cannot edit content in a web panel (see section 16).

---

## 4. The folder map

```
Public Website/
├── index.html                             GENERATED home page (stays at the top)
├── pages/                                 GENERATED pages (about.html, faq.html, contact.html ...)
├── services/                              GENERATED service pages (taxation.html, ...)
├── downloads/                             GENERATED checklist PDFs (21)
├── 404.html                               GENERATED not-found page (Netlify needs it at the top)
├── css/styles.css                         The one stylesheet (you edit this)
├── js/app.js                              The one script (you edit this)
├── assets/                                Images (.webp, .jpg) and fonts/
│   └── fonts/                             inter.woff2, playfair.woff2, playfair-italic.woff2
├── _redirects                             GENERATED redirect rules for Netlify
├── netlify.toml                           GENERATED headers + caching + CSP
├── sitemap.xml, robots.txt                GENERATED for search engines
├── (the app manifest and icons)           assets/icons/: site.webmanifest (GENERATED), icon-192.png, icon-512.png, favicon-32.png
├── .well-known/security.txt               GENERATED (how to report a security problem)
├── favicon.ico, apple-touch-icon.png      Icons that browsers ask for at the top
└── tools/                                 NOT part of the public site
    ├── build.py                           The generator (the heart of the project)
    ├── checklists.py                      Data for the 21 checklists
    ├── preview.py, PREVIEW.bat            Local test server
    ├── partials/*.html                    The page content, one file per section (19 files)
    ├── HOW-TO-EDIT.md                     How to make changes
    ├── LAUNCH-CHECKLIST.md                Pre-launch steps
    └── CODE-GUIDE.md                      This guide
```


**Where the pages live.** The build writes `index.html` and `404.html` at the top and every other page into `pages/` (service pages into `services/`). The addresses visitors see do not change (`/about`, `/services/taxation`): `_redirects` serves `/about` from `pages/about.html`, and it sends anyone who asks for `/about.html` or `/pages/about.html` to `/about`.

**Golden rule:** files marked GENERATED are overwritten every time you run the build. If you edit them by hand, your changes vanish. Edit the source instead.

---

## 5. The build system (`tools/build.py`)

This is the most important file to understand, because it is what makes the project unusual for a "website" and is where a reviewer will probe.

### 5.1 The idea

Every page on the site has the same header, menu, footer, `<head>`, loading screen and scripts. Writing these 21 times would be error-prone: change a menu item and you must edit 21 files. Instead:

- The **page-specific content** lives in small files: `tools/partials/hero.html`, `faq.html`, and so on.
- The **common parts** (header, footer, `<head>`) are Python functions in `build.py`.
- `build.py` combines them and writes the finished pages.

This is the DRY principle (*Don't Repeat Yourself*). It is the same idea as a template engine such as Jinja or Django templates, but written by hand with Python strings.

### 5.2 The configuration at the top

```python
SITE = 'https://ajassociatesonline.com'   # the ONE address the site lives at
BETA = True                               # shows the "beta" tag; set False at launch
FIRM_IDS = {'GSTIN': '...', ...}          # shown in the footer; empty ones are skipped
HOLIDAYS = {'2026-10-02': 'Gandhi Jayanti', ...}   # the booking form refuses these dates
V = '233'                                 # cache-busting version number
```

- `SITE` is used for canonical links, the sitemap, JSON-LD and redirects, so there is one place to change the domain.
- `V` is appended to the CSS and JS file names (`styles.css?v=233`). Browsers cache files; changing the number forces a fresh download after you update them. This is called **cache busting**.
- `HOLIDAYS` is also read by the booking form's date rules.

### 5.3 Reading a partial

```python
def part(name):
    with open(os.path.join(PART, name + '.html'), encoding='utf-8') as f:
        return f.read()
```

It simply reads a file from `tools/partials/` and returns its text. A page body is built by joining partials, e.g. the About page:

```python
body = h1ize(fix_links(team, 'about.html')) + '\n\n' + fix_links(part('principles'), 'about.html') + ...
```

### 5.4 Services are parsed from HTML (`parse_services`)

The services list is written once, as HTML in `partials/services.html` (a set of `<details name="svc">` blocks). `parse_services()` uses regex to pull out each service's number, title, lead sentence, bullet items and WhatsApp link, and puts them in a Python list of dictionaries called `SERVICES`. That list then feeds:
- the Services index page,
- the 7 individual service pages,
- the mega-menu in the header,
- the sitemap and JSON-LD,
- the redirect rules.

So if you add a service in one place, every part of the site updates after a rebuild. `assert len(SERVICES) == 8` is a safety check: if someone breaks the file, the build stops instead of publishing a half-broken site.

Regex example (what `re.findall` does):

```python
re.findall(r'<details name="svc"[^>]*>(.*?)</details>', src, re.S)
```
"Find every `<details name="svc" ...> ... </details>` block, capturing what is inside." `re.S` lets `.` match line breaks too.

### 5.5 The shared pieces

- `SPRITE`: one hidden block of inline SVG icons (`<symbol id="i-arrow">` ...). Pages use them with `<svg><use href="#i-arrow"/></svg>`. This is an **SVG sprite**: icons cost no extra requests.
- `head(...)`: builds the `<head>` (title, description, Open Graph for social previews, canonical link, icons, font preloads, the "lite" detection script, the stylesheet and the script).
- `header(cur)`: builds the navigation bar, mega-menu and mobile menu. `cur` is the current page key so the right item gets `aria-current="page"`.
- `footer()`: builds the footer.
- `SPLASH`, `SPLASH_JS`, `NOSCRIPT`: the loading screen markup, the small script that decides whether to show it, and the message shown if JavaScript is off.

### 5.6 The `page()` function: the pipeline

Every page goes through `page(filename, cur, title, desc, body)`. Read it slowly, it is the spine of the project:

1. **Assemble** the full HTML text: `head` + loading screen + noscript notice + "Skip to content" link + SVG sprite + `header` + `<main id="main">` + the page body + `footer`.
2. **`tag_contact_links`**: adds `?from=page~place` to every link to the Contact page, so you can later see which button led to an enquiry (explained in 5.8).
3. **`absolutize`**: rewrites relative links (`href="about.html"`) into root-absolute ones (`href="/about.html"`), so a page works whether it is served at `/about` or at `/services/taxation`.
4. **`cleanurls`**: rewrites `/about.html` into the clean address `/about`, and service files into `/services/taxation`.
5. **`fix_heading_levels`**: makes sure no heading level is skipped for screen readers (5.9).
6. **Write** the result to disk, using `out_file()` to put service pages inside `services/`.

The order matters. For example `absolutize` must run before `cleanurls`, because `cleanurls` only understands root-absolute links.

### 5.7 Clean URLs

Visitors see `/services/taxation`, not `service-taxation.html`. Two helper functions do this:

```python
def clean_path(filename):
    if filename == 'index.html': return '/'
    n = filename[:-5]                       # drop ".html"
    return '/services/' + n[len('service-'):] if n.startswith('service-') else '/' + n
```

Normal pages get `/about`. Netlify serves `about.html` at `/about` through a rewrite rule that `write_deploy_files()` generates. Service pages are written as real files under `services/`, so `/services/taxation` resolves to `services/taxation.html` automatically (Netlify also serves `.html` files without the extension, called "pretty URLs").

### 5.8 Source tracking (`tag_contact_links`)

Business goal: when an enquiry arrives, know which button brought the visitor.

How it works, step by step:
1. At build time the script scans each page's HTML with a regex (`TAG_RE`) that finds section/header/footer/details tags and every `<a href="contact.html">`.
2. It remembers which section it is currently inside (`sec_ctx` works out a name from a `data-from`, an `id`, a class or an `aria-label`).
3. It rewrites each contact link to `contact.html?from=<page>~<section>`, e.g. `?from=services~hero`. Links inside the header/menu are skipped, so those count as "direct".
4. On the Contact page, JavaScript reads `from`, saves it in `sessionStorage`, fills hidden form fields called `source`, `referrer` and `campaign`, and then cleans the address bar with `history.replaceState` so visitors never see the tag.

Result: each enquiry in Netlify shows `source = services~hero`, for example. `data-from="..."` on a link overrides the automatic name. (An early version used `data-src`, which broke because `absolutize` treats anything ending `src=` as a file path; it was renamed to `data-from`. That is a good "debugging story" to tell.)

### 5.9 Heading levels (`fix_heading_levels`, `h1ize`)

- `h1ize` turns the first `<h2>` on a page into the page's `<h1>`, keeping the same look (class `h2`). Every page needs exactly one `<h1>` for SEO and accessibility.
- `fix_heading_levels` scans headings in order. If a page jumps from `<h1>` to `<h3>`, it adds `aria-level="2"` to the `<h3>`, so a screen reader announces a logical outline while the visual size stays as designed.

### 5.10 The other `build_*` functions

| Function | Output |
|---|---|
| `build_home`, `build_services_index`, `build_service_pages`, `build_packages`, `build_about`, `build_collab`, `build_careers`, `build_contact`, `build_faq`, `build_resources`, `build_starting`, `build_owners` | The main pages, each combining a `page_hero(...)` heading with partials |
| `build_legal` | Privacy policy and Terms and Conditions |
| `build_updates` | The Updates page from the `UPDATES` list (official notes with source lines) |
| `build_checklist_pdfs` | The 21 PDFs (section 10) |
| `build_error_pages` | `404.html` (top level) and `pages/error.html`, served at `/error` (both marked `noindex`) |
| `write_deploy_files` | `_redirects`, `netlify.toml`, `sitemap.xml`, `robots.txt`, `assets/icons/site.webmanifest`, `security.txt`, `.gitignore` |

The last lines run everything:

```python
if __name__ == '__main__':
    build_home(); build_services_index(); ...; build_error_pages(); write_deploy_files()
```
`if __name__ == '__main__':` means "only run this when the file is executed directly, not when imported". You will be asked about this in any Python viva.

### 5.11 What `write_deploy_files()` generates

1. **`.well-known/security.txt`**: a standard file telling researchers where to report a vulnerability.
2. **`assets/icons/site.webmanifest`**: name, theme colour and icons (used by browsers when saving the site).
3. **`sitemap.xml`**: a list of every public page, for search engines.
4. **`robots.txt`**: "allow everything, but not `/tools/`", and where the sitemap is.
5. **`_redirects`**: described in section 11.
6. **`netlify.toml`**: security headers, caching and the Content Security Policy.
7. **`.gitignore`**: files git should skip.

The script also computes, for every inline `<script>` in the pages, a SHA-256 hash, and puts those hashes in the Content Security Policy (section 11.3). Because this happens automatically at each build, the policy stays correct when scripts change.

---

## 6. HTML: how the pages are structured

### 6.1 The skeleton of every page

```html
<!DOCTYPE html>
<html lang="en">
<head> ...meta, fonts, CSS, JS, JSON-LD... </head>
<body>
  <div id="splash">...</div>            <!-- first-visit loading screen -->
  <noscript>...</noscript>              <!-- only shown if JS is off -->
  <a class="skip" href="#main">Skip to content</a>
  <svg> ...icon sprite... </svg>
  <header id="hdr"> ...logo, nav, mega menu... </header>
  <main id="main"> ...page body (sections)... </main>
  <footer> ... </footer>
</body>
</html>
```

### 6.2 Semantic HTML

- `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>` describe the *meaning* of each block, not just how it looks. Screen readers and search engines use them. Each `<section>` has an `aria-labelledby` pointing to its heading's `id` so it is announced by name.
- `<details>` / `<summary>` give accordions (services, FAQ answers, "I have a specific problem") with **no JavaScript**. They open and close natively and are keyboard-accessible.
- `<ol>`/`<ul>` for lists, `<blockquote>` for quotes, `<label>` wrapped around every form control.

### 6.3 Progressive enhancement

The most important design principle in the whole project, and a favourite viva topic:

> The page must work without JavaScript, then JavaScript improves it.

Examples:
- The reveal-on-scroll animation hides content only when JS has added the class `js` to `<html>` (the `.js:not(.lite) .rv` rule). With JS off, everything is simply visible.
- Contact forms are real `<form method="POST">` elements that Netlify can process even without JS; JS only upgrades them to send without a page reload.
- The `<noscript>` message tells visitors which parts need JS and gives phone/email alternatives.
- The pull-quote word-by-word fill only runs if JS runs, and it is skipped for reduced-motion users.

### 6.4 The "lite" mode

Inside `<head>` there is a tiny inline script:

```js
if (navigator.connection.saveData || navigator.deviceMemory <= 2 || navigator.hardwareConcurrency <= 2)
    document.documentElement.classList.add('lite');
```

It marks low-end devices (Data Saver on, 2 GB RAM or less, 2 CPU cores or fewer). CSS then switches off animations and transitions with `.lite *{transition:none!important; animation:none!important}`. The loading screen is also skipped. It runs *inline in the head* so it takes effect before the first paint, avoiding a flash.

### 6.5 Forms

Every form control has a `<label>`. The consent checkbox is `required`. A hidden input called `website` is the **honeypot** (see section 9). Forms use `novalidate` so the script can show consistent messages through `reportValidity()`.

### 6.6 Images and fonts

- Images are `.webp` (smaller than JPEG/PNG) with width/height set to prevent layout shift.
- Two font families are **self-hosted** as `.woff2` (Playfair Display for headings, Inter for body). `font-display: swap` shows readable text immediately using a fallback and swaps when the font arrives. Preload tags in `<head>` start the download early.

---

## 7. CSS: how the design works

All in `css/styles.css`. It is organised top to bottom: tokens, reset, typography, layout, components, page-specific blocks, then responsive and special modes.

### 7.1 Design tokens (CSS variables)

```css
:root {
  --paper: #f6f2ea;  --ink: #0b1526;  --navy: #0d2b52;
  --blue: #1f4f96;   --brass: #b4884a;  --brass-ink: #86601f;
  --serif: "Playfair Display", Georgia, serif;
  --sans: "Inter", system-ui, ...;
  --cut: clamp(22px, 4.2vw, 68px);     /* height of the slanted edges */
  --gut: clamp(1.4rem, 5.5vw, 4rem);   /* side margins */
}
```
One place to change the whole palette. `brass` is the decoration colour; `brass-ink` is a darker brass used for *text* so it passes contrast rules.

### 7.2 Reset and base

`box-sizing: border-box` for every element (padding does not add to width), margins zeroed on text elements, `:focus-visible` shows a clear brass outline for keyboard users, `overflow-x: clip` stops sideways scrolling.

### 7.3 Responsive design without lots of breakpoints

Most sizes use `clamp(min, preferred, max)`:

```css
h1 { font-size: clamp(2.35rem, 6.6vw, 4.7rem); }
```
"Never smaller than 2.35rem, never larger than 4.7rem, and in between scale with the screen width." This gives smooth scaling and fewer media queries. Layout uses CSS **Grid** and **Flexbox**, e.g. `grid-template-columns: 5fr 7fr` for two columns on desktop and a single column on phones.

`.wrap { width: min(1240px, 100% - var(--gut) * 2); margin-inline: auto; }` is the centred content container used everywhere.

### 7.4 The slanted section edges

The signature look comes from `clip-path`:

```css
.band { clip-path: polygon(0 var(--cut), 100% 0, 100% calc(100% - var(--cut)), 0 100%);
        margin: calc(var(--cut) * -1) 0; }
```
`polygon()` lists the corner points (x y). Moving the top-left corner down by `--cut` and the top-right to 0 produces a diagonal edge. Negative margins pull neighbouring sections under the diagonal so there is no gap. The same `clip-path` idea produces the cut corners on cards.

### 7.5 Animations (cheap ones only)

All motion uses only `opacity` and `transform`, which the browser can animate on the GPU without recalculating layout (good for weak phones).

- **Reveal on scroll**: `.js:not(.lite) .rv {opacity:0; transform:translateY(22px)}` then `.rv.in {opacity:1; transform:none}`. JavaScript adds `.in` when the element scrolls into view.
- **Hover effects** on rows (`transform: scale(1.07)`, background tint).
- **Page transitions**: `@view-transition { navigation: auto; }` plus `::view-transition-new(root)` keyframes give a diagonal wipe between pages. This is the cross-document **View Transitions API**, supported in current Chrome/Edge and ignored by browsers that don't support it (they just navigate normally).
- Everything is switched off under `@media (prefers-reduced-motion: reduce)` and in `.lite` mode.

### 7.6 Fit-to-screen (`zoom`)

Some sections (Home hero, Contact, Team) are scaled to fit one screen on large landscape displays. The CSS side is `.fit { zoom: var(--z) }`, and the JavaScript computes `--z` (section 8.8). `zoom` scales everything inside, text, images and spacing, proportionally without changing the layout rules. The code first checks `'zoom' in document.documentElement.style` and does nothing if unsupported.

### 7.7 Print styles

`@media print` hides the header, buttons, forms and decorations so pages and checklists print cleanly.

### 7.8 Debugging tip

In the browser, right-click an element, choose **Inspect**, and you will see which CSS rule applies. Since you wrote or approved each block, you should be able to find any rule by searching its class name in `styles.css`.

---

## 8. JavaScript: every feature in `js/app.js`

### 8.1 Structure

The whole file is one **IIFE** (Immediately Invoked Function Expression):

```js
(function () {
  'use strict';
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  ...
})();
```

- The IIFE keeps all variables private, so nothing pollutes the global scope.
- `'use strict'` turns silent mistakes into errors.
- `$` and `$$` are two tiny helpers (like jQuery's `$`), returning one element or an array.
- **Each feature starts with `var thing = $('#id'); if (thing) { ... }`.** One script is loaded on every page, but each block only runs if its elements exist. This is why a single file works for all 23 pages.
- It uses `var` and `function () {}` instead of `let`, `const` and arrow functions, to run on older phones.

### 8.2 Loading screen

First visit in a session only. The inline head script sets `sessionStorage['aj-splash']` and adds class `splash` to `<html>` (unless lite mode or reduced-motion). `app.js` then waits for `window.load` and keeps the screen visible for at least 2 seconds (counted from when it appeared), with a 4.5 s failsafe so a slow network can never trap a visitor.

### 8.3 Content protection

```js
['selectstart','dragstart','copy','cut','contextmenu'].forEach(function (ev) {
  document.addEventListener(ev, function (e) { if (!inField(e.target)) e.preventDefault(); });
});
```
Cancels selecting, copying, dragging and right-click, except inside form fields. **Be honest about this:** it is a deterrent only. Anyone can still view the source, take a screenshot or disable JS. It is not security (see section 16).

### 8.4 Navigation

- The burger button toggles class `open` on the nav and sets `aria-expanded` (so screen readers know the state). It also adds `nav-open` to `<html>` which locks page scrolling behind the menu on phones.
- On phones, rows expand like an accordion. `Escape` closes the menu. On resize above 1059 px the phone menu closes.
- **Mega-menu**: hovering or focusing a service highlights it and shows its preview panel (`show(i)` toggles class `on` on the item and the panel).

### 8.5 Scroll behaviour

One passive scroll listener, throttled with `requestAnimationFrame`:
- adds `stuck` (shadow) to the header after 8 px,
- shows the floating chat button after 400 px,
- scales a thin progress bar (`transform: scaleX(progress)`).

`{ passive: true }` tells the browser the handler will never call `preventDefault`, so scrolling stays smooth. The `tick` flag ensures only one frame update is queued at a time. This is a standard performance pattern.

### 8.6 Due dates (`CAL`, `nextOf`, `dueLabel`)

The site shows "what's due next" based on the **visitor's own date**.

```js
var CAL = {
  m: [[0, 7, 'TDS / TCS deposit'], [0, 11, 'GSTR-1, monthly filers'], ...],   // monthly: day of month
  q: [[6, 15, 'Advance tax, first instalment'], ...],                          // [month, day]
  a: [[7, 31, '...'], [9, 30, 'Tax audit report', new Date(2026, 9, 21)], ...] // 4th value: one-off extended date
};
```
`nextOf(entry, kind)` returns the next occurrence on or after today:
- monthly: this month's date, or next month's if it has passed,
- yearly/quarterly: this year's date, or next year's if it has passed,
- if a one-off date is given and still ahead, use that.

`dueLabel(n, d)` turns days-left into text: "Due today", "Tomorrow", "In 12 days", or "Nov 2026" when further out. The Home card shows the next four dates from all three lists, sorted. The Resources calendar has tabs (monthly / quarterly / annual) and uses the same data, so there is one source of truth.

### 8.7 The tax estimate (explained with numbers)

```js
var tax = function (t) {                      // t = taxable income
  var left = t, r = 0, i, x;
  for (i = 0; i < 6 && left > 0; i++) { x = Math.min(left, 400000); r += x * i * 0.05; left -= x; }
  if (left > 0) r += left * 0.3;
  r = t <= 1200000 ? 0 : Math.min(r, t - 1200000);
  return r * 1.04;
};
```
It models the **new tax regime for tax year 2026-27** (as coded):
- Salary minus the ₹75,000 standard deduction gives taxable income `t`.
- Each loop turn takes a ₹4,00,000 slab. Slab number `i` is taxed at `i × 5%`: 0%, 5%, 10%, 15%, 20%, 25%. Anything above ₹24,00,000 is taxed at 30%.
- **Rebate**: if `t` is up to ₹12,00,000, tax is zero.
- **Marginal relief**: just above ₹12,00,000 the tax is capped at the amount above ₹12,00,000 (`Math.min(r, t - 1200000)`), so earning ₹1 more never costs more than ₹1 extra in tax.
- Finally multiply by 1.04 for the 4% health and education cess.

Worked example, salary ₹20,00,000: `t = 19,25,000`.
Slabs: 0–4L at 0% = 0; 4–8L at 5% = 20,000; 8–12L at 10% = 40,000; 12–16L at 15% = 60,000; 16L–19.25L (3.25L) at 20% = 65,000. Sum = 1,85,000. Rebate not applicable (above 12L). With cess: 1,85,000 × 1.04 = **₹1,92,400**.

Worked example near the edge, `t = 12,50,000`: slabs give 20,000 + 40,000 + (0.5L at 15% = 7,500) = 67,500. Marginal relief caps it at `t − 12,00,000 = 50,000`. With cess: **₹52,000**.

Be ready to say: "It is an indicative estimate for a salaried person under the new regime, not advice." (The wording on the site already says this kind of thing.) The slider updates the result on every `input` event, and `toLocaleString('en-IN')` formats numbers in the Indian way (12,00,000).

### 8.8 Reveal on scroll (IntersectionObserver)

```js
var rv = new IntersectionObserver(function (es) {
  es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
$$('.rv').forEach(function (el) { rv.observe(el); });
```
`IntersectionObserver` tells you when an element enters the viewport, far cheaper than checking scroll positions yourself. Each element is un-observed after it appears once. If the browser lacks the API or the device is `lite`, everything just gets class `in` immediately.

### 8.9 Fit-to-screen (`fitAll`)

On landscape screens at least 900 px wide, the sections with class `fit-me` are scaled to fit the viewport height:
1. Measure the section's natural height at zoom 1.
2. Compute the available height (window height minus header) minus paddings and any slanted-edge overlap.
3. `z = budget / natural height`, clamped between 0.55 and a per-section maximum (Home 0.84, Contact 1.05, Team 1.22).
4. Apply `style.zoom = z` and adjust padding/min-height by `1/z`, since the zoomed content is smaller.

It re-runs on resize, after fonts load, and on a custom event `aj-refit` (fired when the Contact page switches between its two tabs, since they differ in height). Resize events are debounced with a 60 ms timer so it doesn't run constantly.

### 8.10 Other features

- **FAQ**: search box filters questions, category tabs, deep links (`#gst-registration` opens that answer), "was this helpful?".
- **Structure quiz** (company formation page): a few questions leading to a suggested structure.
- **Package finder**: filters packages by entity type and turnover, and builds the contact link with a source tag.
- **Checklists**: ticking boxes updates a progress bar ("3 of 8 ready"); the first cards are shown and the rest expand with "See all"; groups work as accordions.
- **Styled dropdowns and date picker**: the real `<select>` and `<input type="date">` stay in the page (so validation and form data still work and it is the fallback), and a styled list or calendar is layered over them. The booking date picker refuses Sundays and the dates in `HOLIDAYS`.
- **Printing**: before printing, all FAQ answers open; afterwards they close again (`beforeprint` / `afterprint`).
- **Pull-quote reveal** on About: JavaScript wraps each word in a `<span class="w">` and adds class `on` progressively as the quote scrolls into view.
- **Skip link**: moves focus to `<main>` without adding `#main` to the address bar.

---

## 9. The forms and how enquiries reach you

### 9.1 Netlify Forms (no backend)

The form tag:

```html
<form id="cform" name="contact" method="POST" action="/contact?sent=1" data-netlify="true" netlify-honeypot="website" novalidate>
  <input type="hidden" name="form-name" value="contact">
  <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
  ...
```

How Netlify makes it work:
1. At **deploy time**, Netlify scans the HTML for forms with `data-netlify="true"` and registers them by name (`contact`, `booking`, `collab`).
2. When a visitor submits, the data is POSTed to the site; Netlify intercepts it and stores it in the dashboard (Forms section), where you can set an email notification.
3. The hidden `form-name` field tells Netlify which form the POST belongs to.

### 9.2 What the script does

```js
fetch('/', { method: 'POST',
             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
             body: new URLSearchParams(new FormData(form)).toString() })
```
It sends the same data in the background (no page reload), shows "Sending…", then a thank-you message, or an error that points to the email address. If JS is off, the browser submits the form normally and lands on `/contact?sent=1`, where a script shows the thank-you.

### 9.3 Spam protection

**Honeypot**: the `website` field is hidden from people (CSS and `aria-hidden`) but visible to bots, which fill every field. If it contains anything, `guard()` stops the submission, and Netlify also discards it (`netlify-honeypot="website"`).

### 9.4 Consent and data

A required consent checkbox links to the Privacy policy, which is written around India's DPDP Act 2023 (data fiduciary, rights, grievance contact, retention). The extra fields `source`, `referrer`, `campaign` are used only for your own tracking of where enquiries came from.

---

## 10. The checklists and PDF generator

### 10.1 Data

`tools/checklists.py` holds `GROUPS`: 7 groups, 21 checklists. Each checklist is a dictionary:

```python
{'slug': 'llp-incorporation', 'tag': 'New ventures', 'title': 'LLP incorporation',
 'note': 'At least two designated partners...', 'items': ['PAN of every partner', ...]}
```
To add or change a checklist you edit this file and rebuild. Nothing else is touched.

### 10.2 HTML cards

`checklists_section()` loops over groups and lists and builds HTML cards: a title, tick boxes, a progress bar and a "Download as PDF" link. This is **data-driven generation**: the same data creates both the web card and the PDF.

### 10.3 PDFs with ReportLab

`build_checklist_pdfs()` draws each PDF using ReportLab's `canvas`:
- A4 page (`W, H = A4`). Positions are in points; `mm = 2.835` converts millimetres to points.
- A navy header band, the title, intro text, then each item with a drawn checkbox square.
- `simpleSplit()` wraps long lines to a width.
- If the next item will not fit above the footer (`y - len(lines)*5.8*mm < 40*mm`), it draws the footer, calls `showPage()` for a new page and continues.
- It deletes PDFs of checklists that no longer exist, so the folder always matches the data.
- If ReportLab isn't installed, the build prints a message and keeps going.

The PDF coordinate system starts at the **bottom-left**, so "y decreases as you go down the page". That is a common surprise worth knowing.

---

## 11. Deployment: GitHub, Netlify, redirects, headers, security

### 11.1 The deploy flow

1. Run `python tools/build.py`.
2. Check locally with the preview.
3. Upload/commit the generated files to the GitHub repository.
4. Netlify is connected to the repository; it detects the change and publishes in about a minute. `netlify.toml` sets `publish = "."` (the whole folder) and no build command, because the files are already built.

### 11.2 `_redirects`

Format: `from  to  status`.

| Rule | Meaning |
|---|---|
| `/about /about.html 200` | **Rewrite**: serve the file but keep the address `/about` |
| `/about.html /about 301!` | **Permanent redirect** to the clean address (the `!` forces it even if a file exists) |
| `http://www.ajassociatesonline.com/* → https://ajassociatesonline.com/:splat 301!` | Everything lands on one canonical address (`:splat` keeps the rest of the path) |
| `/tools/* /404.html 404!` | Source files are never public |
| `/accessibility* → /terms 301!` | Old removed page leads somewhere sensible |

Why redirects matter: one address per page avoids duplicate-content problems with search engines, and old links keep working.

### 11.3 Security headers and the Content Security Policy

From `netlify.toml`:

| Header | What it does |
|---|---|
| `X-Content-Type-Options: nosniff` | Browser must trust the declared file type, preventing a sneaky file being run as a script |
| `X-Frame-Options: SAMEORIGIN` | Other sites cannot put your site in a frame (clickjacking defence) |
| `Referrer-Policy: strict-origin-when-cross-origin` | Limits what address info is sent to other sites |
| `Permissions-Policy: camera=(), microphone=(), geolocation=()` | The site declares it never needs these |
| `Strict-Transport-Security` | Browsers must use HTTPS for a year |
| `Content-Security-Policy` | A whitelist of where scripts, styles, images, fonts and frames may load from |

The CSP in plain words: `default-src 'self'` (only this site's files by default); `script-src 'self'` plus the **SHA-256 hashes** of the two inline scripts (so only those exact scripts may run inline, and any injected script would be blocked); `style-src 'self' 'unsafe-inline'` (inline `style=` attributes are used); `frame-src` allows only Google Maps; `object-src 'none'`; `form-action 'self'`; `frame-ancestors 'self'`.

Why hashes? Without them you would have to allow `'unsafe-inline'` for scripts, which defeats most of the protection. This is why the project has **no inline event handlers** (`onclick=` etc.), only `addEventListener` in the script file.

### 11.4 Caching

- HTML: `max-age=0, must-revalidate` (always check for a fresh version).
- CSS/JS: 1 hour with revalidation, plus the `?v=233` trick for instant refresh.
- Images: 7 days.
- Fonts: 1 year, `immutable` (they never change).

---

## 12. SEO and structured data

- **Per-page `<title>` and meta description**, written per page.
- **Canonical link** on every page: the one official address.
- **Open Graph and Twitter card tags** with a 1200×630 image, so a link shared on WhatsApp or LinkedIn shows a proper preview.
- **JSON-LD** (`<script type="application/ld+json">`) in JSON, generated by `org_graph()` and `page_ld()`:
  - Home: `ProfessionalService` + `LocalBusiness` (name, address, phone, opening hours, areas served, a catalogue of the eight services, the GSTIN as `taxID`), and `WebSite`.
  - Each inner page: `BreadcrumbList`.
  - Each service page: a `Service` entry linked to the organisation.
  These can make search results richer and help local search.
- **`sitemap.xml`** and **`robots.txt`**, generated.
- **One `<h1>` per page**, logical heading order, descriptive link text, meaningful alt text.
- **Clean, stable URLs** with permanent redirects from old ones.
- `404.html` and `error.html` are `noindex, nofollow` (shouldn't appear in search).

Honest note: SEO is only set up technically. Ranking depends on content quality, time, backlinks and a verified Google Business Profile.

---

## 13. Performance and low-end devices

Why this site should be quick on a budget phone:
- Total CSS 100 KB, JS 56 KB, no libraries, no tracking, no CDN requests. Pages are small HTML files.
- Fonts: only Latin subsets of two families, self-hosted `woff2`, preloaded, `font-display: swap`.
- Images in WebP, sized, with width/height to prevent layout jumps.
- Script loaded with `defer` (does not block rendering) and `fetchpriority="high"`.
- Animation only with `opacity` and `transform`; scroll handlers throttled with `requestAnimationFrame` and `passive`.
- `lite` mode removes motion for Save-Data, low RAM or few CPU cores, and `prefers-reduced-motion` is respected.
- Long-lived caching for fonts and images.

If asked to prove it: run **Lighthouse** (in Chrome DevTools) and quote the real scores. Don't claim numbers you haven't measured.

---

## 14. Accessibility

What was done, and how to explain it:
- **Skip to content** link as the first focusable element (hidden until you press Tab).
- **Landmarks** (`header`, `nav`, `main`, `footer`) and **heading order** that never skips a level (`fix_heading_levels`).
- **Keyboard**: everything reachable and operable; `:focus-visible` outline; Escape closes menus; the menu button has `aria-expanded`.
- **Colour contrast**: text colours were chosen and audited (`brass-ink` for text, `brass` only for decoration).
- **Tap targets** at least 24 px.
- **Forms**: real labels, required fields, error messages through the browser, consent checkbox.
- **Reduced motion** respected; the site works with JS off.
- **ARIA** used sparingly: `aria-expanded`, `aria-current`, `aria-live` (progress counts), `aria-hidden` on decoration.
- **Screen-reader text** for icons; decorative SVGs hidden.

Standard to mention: **WCAG 2.1 AA** is the target. Say "designed to follow", not "certified", unless a formal audit is done.

---

## 15. Local preview and the daily workflow

### 15.1 `tools/preview.py`

A small custom web server built on Python's `http.server`. Why not just open `index.html`? Because the pages use root-absolute links (`/css/styles.css`), which only work through a server. The script:
1. Reads `_redirects` and applies the same 301 and 200 rules, so `/about` works locally exactly as on Netlify.
2. If `/something` has no file but `/something.html` exists, serves that (mimicking Netlify's pretty URLs).
3. On a missing page, returns `404.html` with a 404 status.

Run it: `python tools/preview.py` (or double-click `tools/PREVIEW.bat`), then open http://localhost:8123.

### 15.2 The four-step change loop

1. Edit the right source file.
2. If you changed CSS or JS, increase `V` in `build.py`.
3. `python tools/build.py`.
4. Preview, then upload to GitHub. Netlify publishes.

---

## 16. Honest limits: what a sharp reviewer could challenge

Knowing your project's weak points is more convincing than pretending it has none.

1. **No content management system.** Text changes need the build step (or you doing it). *Answer:* a deliberate trade-off for speed and security; a CMS (for example Decap or a headless CMS) can be added later, or a maintenance plan covers edits.
2. **The "content protection" is cosmetic.** It stops casual copying, not a determined person. *Answer:* say so plainly. Real protection is not possible for public web content. (If a reviewer dislikes it for accessibility reasons, it can be removed; it does not block screen readers.)
3. **Regex-based HTML processing is fragile.** `build.py` edits HTML text with regex rather than a proper HTML parser. It works on this site's controlled markup, and assertions catch some breakages. *Answer:* correct, and the next improvement would be a parser such as BeautifulSoup or a template engine such as Jinja2.
4. **Forms depend on Netlify.** Moving host means replacing the form handling. *Answer:* acceptable lock-in; the forms are plain HTML so they can post to any endpoint.
5. **The tax estimate is simplified.** One regime, a salaried person, standard deduction only; rules change every Budget. *Answer:* labelled as an estimate, and the numbers live in one function to update.
6. **Due dates and holidays are hand-maintained.** They need yearly updates. *Answer:* documented in HOW-TO-EDIT; the shared `CAL` and `HOLIDAYS` make it a small job.
7. **Browser support for newer features.** `zoom`, cross-document view transitions and `clip-path` are modern. *Answer:* each is an enhancement with a safe fallback (feature checks or ignored CSS), so older browsers still get a working page.
8. **No automated tests.** Verification was by build assertions, link/anchor checks, accessibility audits and manual browser checks. *Answer:* honest; for a site this size, a build-time link checker plus audits is proportionate, and tests could be added.
9. **No analytics.** By design (privacy). Can be added with the Privacy policy updated.
10. **Solo-maintainer risk.** One person understands the build. *Answer:* that is what `HOW-TO-EDIT.md` and this guide are for.

---

## 17. Reviewer questions with model answers

**Q1. Why didn't you use WordPress / React / a framework?**
> It is a brochure site with a few interactive tools. A framework would add hundreds of KB for no benefit and slow weak phones. Static files are faster, cheaper, nearly unhackable and simple to host. I wrote a small generator so I still avoid duplicating the header and footer.

**Q2. What is a static site generator and did you use one?**
> It turns templates and content into finished pages ahead of time. I wrote a minimal one in Python instead of using Hugo or Jekyll, because the project is small and I wanted full control and no extra dependencies.

**Q3. How do forms work with no server?**
> Netlify Forms. At deploy time Netlify finds forms marked `data-netlify`, and a POST from the page is stored in its dashboard and can email me. My JavaScript sends the POST in the background for a smoother experience; without JavaScript the normal form post still works. A honeypot field filters bots.

**Q4. How is the site secured?**
> There is no database or server code to attack. Netlify serves it over HTTPS with HSTS. I set security headers and a strict Content Security Policy that allows only my own scripts, plus hashes of two inline scripts, so injected scripts would be blocked. There are no inline event handlers, no third-party scripts, and forms have a honeypot and consent.

**Q5. What happens if JavaScript is disabled?**
> Content, navigation links, service pages, forms and downloads still work. Animations, the tax slider, due-date calendar, menu on phones and FAQ search need JavaScript; a notice explains this and gives phone and email alternatives.

**Q6. How do you make it fast on low-end phones?**
> No frameworks, small CSS and JS, self-hosted subset fonts, WebP images, deferred script, only opacity/transform animations, throttled scroll handlers, and a "lite" mode that detects Save-Data, low memory or low CPU and turns animations off.

**Q7. How does your SEO work?**
> Unique titles and descriptions, canonical URLs, one H1 per page, sitemap and robots files, Open Graph previews, and JSON-LD for the business, services and breadcrumbs. Clean URLs with redirects from the old ones. Ranking still needs good content and a Google Business Profile.

**Q8. Explain the build process.**
> `build.py` reads partial HTML files, wraps each in the common header, footer and head, then post-processes the text: contact links get source tags, links are made root-absolute and cleaned, and heading levels are fixed. It writes the pages, the sitemap, redirects and security headers, and generates 21 PDFs from a data file.

**Q9. What is the `V` number?**
> A cache-busting version. Browsers store CSS and JS; changing `?v=` forces a fresh download after I update them.

**Q10. What is a Content Security Policy and why hashes?**
> It tells the browser which sources may load scripts, styles and frames. Hashes allow only my exact inline scripts. Without hashes I would have to allow all inline scripts, which removes most of the protection.

**Q11. What is progressive enhancement?**
> Build the page to work as plain HTML first, then add CSS and JavaScript as improvements. Features check for support and fall back safely.

**Q12. How do clean URLs work?**
> The script writes normal files; Netlify rewrite rules in `_redirects` serve `/about` from `about.html`, and permanent redirects send `/about.html` to `/about`. Service pages live in a `services/` folder so their addresses are real paths.

**Q13. How does the tax estimate work, and can I trust it?**
> It follows the new-regime slabs for 2026-27 with the standard deduction, rebate with marginal relief and 4% cess, in about eight lines of code. It is an estimate for a salaried person and is labelled as such; the rules sit in one function so they are easy to update after a Budget.

**Q14. How do you handle accessibility?**
> Semantic landmarks, logical headings, skip link, keyboard focus styles, ARIA only where needed, audited contrast, 24 px minimum targets, labelled forms, reduced-motion support, and no dependence on JavaScript for content.

**Q15. What would you improve with more time?**
> A proper HTML parser or template engine in the build, automated link and accessibility tests in a CI pipeline, a lightweight CMS for client edits, analytics with consent if the business wants it, and measured Lighthouse results published in the documentation.

**Q16. How would this scale if the firm grew?**
> Static hosting scales to very high traffic through the CDN. New pages and services are one edit plus a rebuild. If they need accounts, a client portal or payments, that is where a backend would be added, as a separate service.

**Q17. Did you use AI tools?** *(prepare for this honestly)*
> Yes, I used AI assistance in building it, as many developers now do. The architecture decisions, content direction, review and testing were mine, and I can explain every part of it. I am responsible for it and for maintaining it.
> (If you are not yet able to explain a part, study that section of this guide until you are. Never claim to have written something you cannot explain.)

**Q18. Why Python for the build, not Node?**
> I know Python well, it ships with standard libraries for files and regex, it has ReportLab for PDFs, and the build has no dependencies beyond that.

**Q19. How does the site know today's date for the due-date card?**
> `new Date()` in the visitor's browser, with the time set to midnight. The calendar data is stored once; `nextOf` finds the next occurrence of each date from today.

**Q20. What is `sessionStorage` used for?**
> Three things: remembering the loading screen already played, and keeping the traffic-source tags (`aj-from`, `aj-camp`, `aj-ref`) between pages so they can be attached to the contact form. It is cleared when the tab closes and never leaves the browser except when the visitor submits a form.

---

## 18. Practice exercises

Do these in order. Each one teaches a different part. After every change run `python tools/build.py` and view it through the preview.

1. **Trace a page.** Open `about.html` in the browser and in an editor. Find the same text in `tools/partials/team.html`. Identify which part of the page comes from `build.py` and which from the partial.
2. **Change a colour.** Edit `--brass` in `:root`. Rebuild (raise `V` first). See where it changes.
3. **Change the footer.** Find `footer()` in `build.py`, change one word, rebuild, and confirm all pages changed.
4. **Add a checklist item.** Open `tools/checklists.py`, add an item, rebuild. Confirm it appears on the Resources page and in the PDF.
5. **Add a holiday.** Add a date to `HOLIDAYS`, rebuild, and try to book that date.
6. **Break and fix.** Remove a closing tag in a partial, rebuild, view the page, then fix it. Learn how errors look.
7. **Read a redirect.** Open `_redirects`, pick one line, and explain it in your own words.
8. **Trace a form.** Submit the contact form on the preview (it will fail locally because Netlify isn't there). Find the exact code line that sends it and the line that shows the error.
9. **Estimate by hand.** Pick a salary, calculate the tax on paper using section 8.7, then check the slider.
10. **Add a service** (stretch). Add a `<details name="svc">` block in `partials/services.html`, add a slug to `SLUGS`, change `assert len(SERVICES) == 8`, rebuild, and watch the menu, sitemap and pages update.

---

## 19. Glossary

| Term | Meaning |
|---|---|
| **Static site** | Every page is a ready-made file; no per-visitor computation |
| **Static site generator** | A program that produces those files from templates and content |
| **Partial** | A small HTML file holding one section of a page |
| **DRY** | Don't Repeat Yourself: define things once |
| **IIFE** | A function that runs immediately, used to keep variables private |
| **DOM** | The live tree of page elements that JavaScript can change |
| **Event listener** | Code that runs when something happens (click, scroll, submit) |
| **Debounce / throttle** | Limiting how often a handler runs |
| **`requestAnimationFrame`** | Runs code just before the next screen paint |
| **Passive listener** | Promises not to block scrolling |
| **IntersectionObserver** | Browser API that reports when elements enter the viewport |
| **Progressive enhancement** | Works as plain HTML; extras are added when supported |
| **CSS variable** | A reusable value such as `--brass` |
| **`clamp()`** | A CSS size that scales between a minimum and a maximum |
| **`clip-path`** | CSS that cuts an element into a shape |
| **Grid / Flexbox** | CSS layout systems |
| **View Transitions** | Browser feature for animated changes between pages |
| **Cache busting** | Changing a file's URL (`?v=`) to force a new download |
| **CDN** | Network of servers that delivers files from a location near the visitor |
| **301 redirect** | Permanent redirect |
| **Rewrite (200)** | Serves one file under a different address without changing the address bar |
| **Canonical URL** | The one official address for a page |
| **JSON-LD** | Data format that describes the page to search engines |
| **CSP** | Content Security Policy: a whitelist for what the page may load or run |
| **HSTS** | Forces HTTPS |
| **Honeypot** | A hidden field only bots fill in, used to catch spam |
| **WCAG** | Web Content Accessibility Guidelines |
| **ARIA** | Attributes that add meaning for assistive technology |
| **Regex** | A pattern language for searching and replacing text |
| **Netlify Forms** | Netlify's built-in service for storing form submissions |
| **DPDP Act** | India's Digital Personal Data Protection Act, 2023 |
| **Lighthouse** | Chrome's tool that scores performance, accessibility, SEO |

---

## 20. One-page cheat sheet

**What:** static website, HTML + CSS + vanilla JS, generated by a Python script, hosted on Netlify via GitHub.

**Pipeline:** partials + `build.py` → pages in root and `services/` → push to GitHub → Netlify publishes.

**Edit where?** Content: `tools/partials/*.html` · Menu/footer/head: `tools/build.py` · Design: `css/styles.css` · Behaviour: `js/app.js` · Checklists: `tools/checklists.py`.

**Change loop:** edit → raise `V` if CSS/JS changed → `python tools/build.py` → preview (`python tools/preview.py`) → upload.

**Forms:** `data-netlify` + hidden `form-name` + honeypot `website` + `fetch('/')` POST.

**Security:** HTTPS/HSTS, CSP with script hashes, no inline handlers, no third-party scripts, nosniff, frame protection.

**Performance:** ~100 KB CSS, ~56 KB JS, no libraries, self-hosted subset fonts, WebP, deferred script, opacity/transform only, lite mode.

**Accessibility:** skip link, landmarks, heading order, focus styles, ARIA sparingly, reduced motion, works without JS.

**SEO:** titles, descriptions, canonicals, one H1, sitemap, robots, Open Graph, JSON-LD, clean URLs and redirects.

**Be upfront about:** content protection is cosmetic, no CMS, regex-based build, simplified tax estimate, manual yearly updates, AI-assisted build (you can explain it all).

**Three sentences for any tough question:**
1. "That was a deliberate trade-off: here is why."
2. "The limitation is X, and here is how I would handle it."
3. "I can show you exactly where in the code that happens."
