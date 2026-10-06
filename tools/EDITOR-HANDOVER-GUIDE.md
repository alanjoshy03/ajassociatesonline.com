# AJ Associates website: guide for the person editing it

*Written for someone who is editing the website on behalf of the developer, Alan Joshy. You do not need to be a programmer. You do need to follow the steps in order and be careful.*

---

## Contents

1. Read this first: the six rules
2. What you need before you start
3. How the website is put together (the simple version)
4. The editing routine (the same four steps, every time)
5. Where to find what you want to change
6. Step-by-step jobs
7. Checking your work before it goes live
8. Publishing: GitHub and Netlify
9. If you make a mistake: going back
10. Regular jobs: monthly, every Budget, yearly
11. Troubleshooting
12. How the website should sound (wording rules)
13. Things you must never do
14. Who to contact
15. Quick reference card

---

## 1. Read this first: the six rules

1. **Never edit the finished `.html` pages directly** (`index.html`, everything inside `pages/` and `services/`, and so on). They are produced by a program, and the next time it runs your changes disappear. You edit the *source files*, then run the program. Section 4 explains how.
2. **Always take a backup** of the whole project folder before you start (copy the folder and add today's date to its name).
3. **Always look at the result on your own computer before you publish.** Section 7 explains how.
4. **Change one thing at a time**, check it, then change the next.
5. **Never put passwords, OTPs, bank details or client information** in any file of this website.
6. **If something looks wrong and you are not sure, stop and contact Alan** (section 14). A wrong guess on a live website is hard to undo for the visitors who saw it.

---

## 2. What you need before you start

### 2.1 Accounts (ask the firm or Alan for access)

| What | Used for | Where the login is kept |
|---|---|---|
| **GitHub** account with access to the website's repository | Storing the website files and publishing changes | *(fill in who holds it)* |
| **Netlify** account (the site is hosted here) | Seeing form enquiries, checking that a publish worked, going back to an older version | *(fill in)* |
| **Domain registrar** (where `ajassociatesonline.com` was bought) | Only for domain or email settings | *(fill in)* |
| **Google account** for Search Console / Business Profile | Only if search settings need changing | *(fill in)* |

Do not write the passwords in this document. Keep them in a password manager or ask the owner each time.

### 2.2 Software on your computer (one-time setup, Windows)

1. **Python 3.** Download from python.org and install it. On the first screen **tick "Add python.exe to PATH"**, then click Install.
2. **A text editor.** Install **Visual Studio Code** (code.visualstudio.com). Do not use Word or Notepad to edit the files, because they can damage the text. If you must use something simple, use Notepad++.
3. **Google Chrome** (to preview and test).
4. **ReportLab** (only needed when you change the downloadable checklist PDFs). Open PowerShell and type:

```
python -m pip install reportlab
```

   If you skip this, everything still works, but the PDFs are simply not regenerated.

### 2.3 Get the project folder

Ask Alan for the latest copy of the project folder (named something like `Public Website`), or download it from the GitHub repository ("Code", then "Download ZIP") and unzip it. Keep it somewhere simple, like `D:\Websites\AJ-Associates`. The rest of this guide calls this "the project folder".

### 2.4 Open a terminal in the project folder

In File Explorer, open the project folder, click the address bar at the top, type `powershell` and press Enter. A blue window opens, already pointing at the project folder. Every command in this guide is typed there.

Check it works by typing:

```
python --version
```

You should see something like `Python 3.12.1`. If you see an error, Python was not installed correctly (see section 11).

---

## 3. How the website is put together (the simple version)

Think of it like a newspaper printing process:

- The **pieces of text and layout for each page** are kept in small files (called *partials*) in the folder `tools/partials/`.
- The **menu, footer and settings** that appear on every page are kept in one file, `tools/build.py`.
- The **look** (colours, fonts, spacing) is in `css/styles.css`.
- The **behaviour** (calculators, calendar, menus) is in `js/app.js`.
- A program called the **build** (`python tools/build.py`) takes all these and "prints" the finished pages, the sitemap, the PDF checklists and the settings files.
- The finished files are uploaded to GitHub, and the hosting service (Netlify) publishes them automatically.

So the real working files are inside `tools/`, `css/`, `js/` and `assets/`. Everything else in the main folder is the *printed output*.

**Which files are finished output (do not edit by hand):**
`index.html` and `404.html` at the top, everything in `pages/`, `services/` and `downloads/`, plus `_redirects`, `netlify.toml`, `sitemap.xml`, `robots.txt`, `site.webmanifest`.

---

## 4. The editing routine (the same four steps, every time)

### Step 1: Edit the source file

Open the project folder in Visual Studio Code (File, then Open Folder). Find the right file using section 5, make your change and **save** (Ctrl+S).

### Step 2: If you changed the design or behaviour, raise the version number

Only needed if you changed `css/styles.css` or `js/app.js` (or any picture or font). Open `tools/build.py` and find this line near the top:

```
V = '233'
```

Increase the number by one (`'234'`). This forces visitors' browsers to download the new version instead of showing an old saved copy. (Text-only changes do not need this.)

### Step 3: Build

In the PowerShell window in the project folder:

```
python tools/build.py
```

After a few seconds you will see a list of "wrote ..." lines and the word **Done.** at the end. If you see a red error instead, read section 11.

### Step 4: Preview and check, then publish

```
python tools/preview.py
```

Open Chrome and go to **http://localhost:8123**. Look at the page you changed (and the pages around it). Press Ctrl+C in PowerShell when you finish. Then follow section 7 (checks) and section 8 (publishing).

> **Do not double-click `index.html` to look at the site.** It will look broken, because the pages expect to be served by a web server. Always use the preview in Step 4. You can also simply double-click `tools/PREVIEW.bat`.

---

## 5. Where to find what you want to change

| To change... | Edit this file |
|---|---|
| Home page headline, intro and the "Due soon" card text | `tools/partials/hero.html` |
| The numbers strip on Home | `tools/partials/band.html` |
| "Where to start" rows on Home | `tools/partials/route.html` |
| The three questions on Home | `tools/partials/ask.html` |
| The eight services (Home, Services page and each service page) | `tools/partials/services.html` |
| "How we work" | `tools/partials/approach.html` |
| Testimonials / reviews | `tools/partials/reviews.html` |
| Industries we serve | `tools/partials/industries.html` |
| About page: Jithu and Alan cards and the team quote | `tools/partials/team.html` |
| About page: "Three things we hold ourselves to" and the opening line | `tools/partials/principles.html` |
| Packages page and the finder's wording | `tools/partials/packages.html` and `tools/partials/packages_more.html` |
| What each package includes, and the "who it's for" lines | `js/app.js` (search for `size changes what a business needs`) |
| Starting a business page | `tools/partials/starting.html` |
| For business owners page | `tools/partials/owners.html` |
| Collaboration page and form | `tools/partials/network.html` |
| Contact page, forms and booking time slots | `tools/partials/contact.html` |
| FAQs | `tools/partials/faq.html` |
| Resources page text (calendar, estimate) | `tools/partials/resources.html` |
| The document checklists and their PDFs | `tools/checklists.py` |
| Updates page (dated notes) | `tools/build.py` (search for `UPDATES`) |
| Privacy policy / Terms and Conditions | `tools/partials/privacy.html` / `tools/partials/terms.html` |
| Menu, footer, phone, email, WhatsApp number, registration numbers, holidays | Top of `tools/build.py` |
| Careers page | `tools/build.py` (search for `build_careers`) |
| Due-date lists | `js/app.js` (search for `CAL`) |
| Tax estimate rates | `js/app.js` (search for `new regime`) |
| Colours, fonts, spacing | `css/styles.css` (top of the file, "design tokens") |
| Photos and images | `assets/` folder |

**Tip:** in Visual Studio Code press **Ctrl+Shift+F** to search all files for a word or sentence you see on the website. The result tells you exactly which file holds it.

---

## 6. Step-by-step jobs

For every job below, finish with steps 3 and 4 of section 4 (build, then preview).

### 6.1 Change a sentence or word on a page

1. On the website, copy the exact words you want to change.
2. In Visual Studio Code, press Ctrl+Shift+F and paste the words.
3. Open the file it finds (it will be in `tools/partials/` or `tools/build.py`).
4. Change the words. Leave the angle brackets (`<p>`, `</p>`, `<em>` and so on) exactly as they are.
5. Save, build, preview.

**What the tags mean:** `<p>...</p>` is a paragraph; `<h2>...</h2>` is a heading; `<em>...</em>` shows the words in blue italics; `<b>...</b>` is bold; `<a href="...">...</a>` is a link. Always keep the opening and closing tag as a pair.

Use a straight apostrophe carefully: the site uses the curly one (’) in text. If you copy words from the website, the curly one comes with it.

### 6.2 Change the phone number, email address or WhatsApp number

1. Open `tools/build.py`. At the top, find these lines:
   - `WA = '...'` is the main WhatsApp number (with country code, no plus or spaces).
   - `INFO = '...'` is the email address.
   - `PHONE_TEL = '+91...'` is the phone number in dial format.
   - `PHONE_SHOW = '+91 ...'` is the same number as visitors see it.
2. Change them. Then search the whole project (Ctrl+Shift+F) for the **old number**, because it is also written in a few partial files (Privacy policy, Contact page, FAQs, Careers). Change each one.
3. The numbers for Jithu and Alan's "Get in touch" buttons are in `tools/partials/team.html`, in the `https://wa.me/91...` links.

### 6.3 Change the address or opening hours

Search for `Chullickal` (address) or `Mon – Sat` (hours) with Ctrl+Shift+F. The address appears in `tools/build.py`, `tools/partials/contact.html`, `tools/partials/privacy.html` and `tools/partials/faq.html`. Opening hours are in `tools/build.py` in two places: the footer line and the search-engine data (`openingHoursSpecification`, written as `'opens': '09:00'`). Change all of them so they agree.

### 6.4 Add a holiday (the booking form will refuse that date)

1. Open `tools/build.py`, find `HOLIDAYS`.
2. Add a line in the same style:

```
    '2027-11-01': 'Kerala Piravi',
```

   Dates are **year-month-day**. Do not forget the comma at the end. Sundays are handled automatically.
3. Festivals such as Onam, Vishu and Eid move every year, so this list needs new dates each year. It currently runs to the end of 2027.

### 6.5 Add or change a FAQ

1. Open `tools/partials/faq.html`.
2. Find a question in the right category, and copy the whole block from `<details id="...">` to its matching `</details>`.
3. Paste it just below, then change the `id` (use small letters and hyphens, for example `gst-return-dates`), the question and the answer.
4. If the answer mentions a law, limit or date, keep the small line at the end, `<p class="faq-asof">as of dd-mm-yyyy</p>`, and put today's date.

### 6.6 Update the "as of" dates

After you have *checked* the answers are still correct, use find-and-replace in Visual Studio Code: press Ctrl+Shift+H, search for `as of 01-10-2026`, replace with the new date, and replace in `tools/partials/faq.html` and `tools/partials/resources.html`. Only do this after checking the content. Changing the date without checking is misleading to visitors.

### 6.7 Add a note to the Updates page

Open `tools/build.py` and find `UPDATES = [`. The newest item goes at the top. Copy an existing one and edit it:

```
    {'date': '2026-10-15', 'tag': 'GST', 'src': GST_SRC,
     'title': 'A short headline',
     'body': ['First paragraph.',
              'Second paragraph.']},
```

- `date` is year-month-day. `tag` is the label ("Income tax", "GST", "Companies"). `src` links to the official source and can be `IT_SRC`, `GST_SRC` or `MCA_SRC` (set a few lines above). Leave out the `'src': ...` part if there is no official source.
- Only publish a note once you have seen it on the official website (incometax.gov.in, gst.gov.in, gstcouncil.gov.in, mca.gov.in). Do not copy from news sites or WhatsApp forwards.
- Keep apostrophes inside the text as the curly kind (’), or the program will read them as the end of the text and show an error.
- Remove notes that are no longer useful.
- Also update the line "checked on ..." near the top of the same function, `build_updates`.

### 6.8 Change due dates (Home card and Resources calendar)

Open `js/app.js` and search for `due dates, worked out`. You will see the list called `CAL`. Each line is `[month, day, 'name']`. When the government **extends** a date for this year only, add a fourth value, a one-off date, for example `new Date(2026, 9, 21)`. **Months in this list start at 0**, so January is 0 and October is 9. Once the date has passed, the normal yearly date takes over, but remove the one-off value afterwards to keep the file tidy. Raise `V` (section 4, step 2).

### 6.9 Update the tax estimate after a Budget

1. Open `js/app.js`, search for `new regime`. Under it is the `tax` function.
2. The slab width (₹4,00,000), the 5% steps, the rebate limit (`1200000`), the standard deduction (`75000`, search for `75000`) and the cess (`1.04`) are all there.
3. Update the label text ("2026-27") in `tools/partials/resources.html` and the Home card text in `tools/partials/hero.html`.
4. **Test several salaries by hand** after any change. Ask Alan to verify before publishing. Wrong tax figures on a tax firm's website are a serious problem.
5. Raise `V`.

### 6.10 Change what a package includes

Open `js/app.js` and search for `size changes what a business needs`. The Packages answer is built from two layers: a line for the business type and lines for the turnover size. The pieces are:

- `NAME` and `WHO`: the plan's name and its "who it's for" sentence.
- `LEAD`: the first of the three points on the card, one per business type.
- `BIZ_PTS` and `IND_PTS`: the other two points, one pair for each of the four turnover stops (business, and individual).
- `BASE`, `BIZ_DET` and `IND_DET`: the longer list behind "See everything included".

Change only the words inside the quotes and keep the commas and brackets. Anything about tax limits (for example when an audit applies) should be checked against the official rules first, then raise `V`.

### 6.11 Add or change a document checklist

1. Open `tools/checklists.py`.
2. Each checklist looks like this:

```
{'slug': 'llp-incorporation', 'tag': 'New ventures', 'title': 'LLP incorporation',
 'note': 'Optional line shown under the title.',
 'items': ['First document', 'Second document']},
```

3. `slug` must be unique and use only small letters and hyphens (it becomes the PDF's file name). To add an item, add a new quoted line inside `items`, with a comma.
4. Make sure ReportLab is installed (section 2.2), build, and check the PDF in `downloads/` opens and looks right.
5. Upload the **whole `downloads/` folder** afterwards.

### 6.12 Add a new service (or change a service name)

The eight services are all defined in `tools/partials/services.html`. Each is a block starting with `<details name="svc"` and ending `</details>`.

- **Changing a name or description:** edit the text inside that block. The page and menu update after the build.
- **Adding a ninth service:** this touches more files and is easier to get wrong, so do it carefully:
  1. In `tools/partials/services.html`, copy a whole `<details name="svc" ...> ... </details>` block, paste it at the end, and edit the number, title, lead sentence, bullet items and WhatsApp link.
  2. In `tools/build.py`, find `SLUGS = [...]` and add a new entry such as `'service-your-name'` (small letters and hyphens, same order as the blocks).
  3. In the same file find `assert len(SERVICES) == 7` and change `8` to `9`.
  4. Build. Then check the Services page, the menu on desktop and on a phone, and the new service page.
  5. Because the number of services appears in a few sentences ("eight services"), search for the word `eight` (and `seven`) and fix it. You also need to add the new service to the two "Service" drop-downs in `tools/partials/contact.html`, and give it a small line illustration in `SVC_ART` in `tools/build.py`.
  If anything fails, restore your backup and contact Alan.

### 6.13 Replace the Jithu and Alan photos

1. Prepare each picture as a **portrait, 4:5 shape** (for example 800 × 1000 pixels), a clean background and similar style for both.
2. Convert to **WebP** (squoosh.app works in a browser; choose WebP, quality 80).
3. Name them exactly `jithu-s.webp` and `alan-s.webp` and put them in the `assets/` folder, replacing the old ones.
4. Open `tools/partials/team.html`, find the picture's `src="assets/alan-s.webp?v=3"` (or `jithu-s.webp`) and raise the number after `?v=` by one. Browsers keep images for a week, so without this, returning visitors would still see the old photo.
5. Raise `V`, build, preview, and check both cards on a phone and a laptop. Keep the width and height numbers in that same `<img>` tag matching the new picture's size.

### 6.14 Change testimonials or the rating

Testimonials are in `tools/partials/reviews.html`. The rating on Home is in `tools/partials/band.html`, and a copy for search engines is in `tools/build.py` (search for `aggregateRating`). **Only show real reviews with the client's permission.** Never invent numbers.

### 6.15 Change the booking time slots

In `tools/partials/contact.html` find `Preferred time` and edit the `<option>` lines.

### 6.16 Change the Privacy policy or Terms

1. Edit `tools/partials/privacy.html` or `tools/partials/terms.html`.
2. Update the "Last updated" date at the top.
3. These are legal documents. Do not rewrite them casually; ask Alan or the firm's legal adviser first.

### 6.17 Update the footer registration numbers

In `tools/build.py`, find `FIRM_IDS`. Fill in the ones that apply (for example the ICAI firm registration number). Empty ones are left out. Check the footer on the preview.

### 6.18 Change the colours or fonts

Open `css/styles.css`. The first lines contain the colour list (`--paper`, `--ink`, `--navy`, `--blue`, `--brass`...). Change a colour code there and it changes everywhere. Be careful: pale text on pale backgrounds is hard to read. Raise `V`.

### 6.19 Switch the site out of "Beta" (when the client approves)

In `tools/build.py` change `BETA = True` to `BETA = False`, build and upload. The small "beta" tag and the footer note disappear.

---

## 7. Checking your work before it goes live

Before publishing, with the preview open (`python tools/preview.py`):

- [ ] The page you changed looks right, and the text has no typing mistakes. Read it aloud once.
- [ ] Scroll the whole page: nothing is overlapping, cut off or missing.
- [ ] Click every link you added or changed.
- [ ] Look at the page at phone width: in Chrome press F12, then click the small phone/tablet icon at the top left of the panel, and choose a phone size.
- [ ] Open at least three other pages (Home, Services, Contact) to make sure nothing else broke.
- [ ] If you changed numbers (tax, dates, prices, phone numbers), check them against a trusted source twice.
- [ ] Open the browser's console (F12, "Console" tab). There should be **no red messages**.
- [ ] If you changed the PDFs, open one from the Resources page.

If any check fails, fix it before moving on. Do not publish "to see how it looks".

---

## 8. Publishing: GitHub and Netlify

The website publishes automatically: when new files arrive in the GitHub repository, Netlify notices and updates the live website about a minute later.

### 8.1 What to upload

Upload **everything in the project folder except** these (they are not part of the public site): the `tools/` folder, any `_legacy/` folder, any `.zip` files and the `.claude/` folder.

In practice that means: `index.html` and `404.html` (the two pages that stay at the top), the `pages/` folder, the `services/` folder, `downloads/`, `css/`, `js/`, `assets/`, `_redirects`, `netlify.toml`, `sitemap.xml`, `robots.txt`, `favicon.ico`, `apple-touch-icon.png` and the `.well-known/` folder.

**Rule of thumb:** after any build, many `.html` files change (the build writes them all), so upload them all: `index.html`, `404.html` and the whole `pages/` and `services/` folders. After a CSS or JS change, the version number changed too, so *all* of those pages must be uploaded, not just one. (Uploading the whole set every time is the safest habit.)

### 8.2 How to upload (using the GitHub website)

1. Sign in to GitHub and open the website's repository.
2. Click **Add file**, then **Upload files**.
3. Drag the files and folders from your project folder into the page. (Folders can be dragged in too.)
4. Type a short note in the "Commit changes" box, such as `Update FAQ answers, 2 Nov`.
5. Click **Commit changes**.

*(If you are comfortable with Git on your computer, committing and pushing does the same thing.)*

### 8.3 Confirm it worked

1. Open the Netlify dashboard, then the site, then **Deploys**. The top entry should say **Published** (green) within a minute or two. If it says **Failed**, click it and read the error, and contact Alan.
2. Open the live website and press **Ctrl+Shift+R** (hard refresh) so the browser doesn't show an old copy.
3. Check the page you changed on the real address, on a laptop and on a phone.

### 8.4 Where enquiries arrive

In Netlify: the site, then **Forms**. You will see three forms: `contact`, `booking` and `collab`. Each submission also shows `source`, `referrer` and `campaign` fields that tell you which button the visitor came from, and a `journey` field that lists the pages they went through and the choices they made on the way (for example "Page: home > Chose: starting a business > Page: starting-a-business > Page: contact"). The firm should set an email notification: Forms, then **Form notifications**, then **Add notification**, then Email, so enquiries are emailed to the firm.

Check the **Spam** tab occasionally, in case a genuine enquiry was caught.

---

## 9. If you make a mistake: going back

**Before publishing:** copy your backup folder back over the project folder.

**After publishing (the site shows something wrong):** you can restore the previous version in about a minute without any files:

1. Netlify dashboard, then the site, then **Deploys**.
2. Find the last deploy that was working (look at the time and your commit note).
3. Click it, then click **Publish deploy**.
4. The live site now shows that earlier version. (This does not undo your files; fix them on your computer before the next upload, otherwise the next upload will bring the mistake back.)

Then contact Alan if the cause is not obvious.

---

## 10. Regular jobs

### Every month
- Check the **Updates** page. Add any new tax, GST or company-law deadline or change from the official portals; remove old items that are no longer useful (section 6.7).
- Look at **Netlify Forms** for any enquiry that did not reach the firm's email.
- Click through the site once on a phone to check that nothing is broken.

### Every Union Budget (usually February)
- Update the **tax estimate** (section 6.9) and its labels, and ask Alan to verify the figures.
- Review the **FAQ** answers and the **Resources** text that mention rates, limits or dates, then update their "as of" dates (section 6.6).
- Update the **due-date list** `CAL` if any filing dates changed (section 6.8).

### Every year
- Add the next year's **holidays** (section 6.4). Onam, Vishu and Eid move.
- Move the date in `.well-known/security.txt` forward: in `tools/build.py`, search for `Expires` and change the year.
- Check that the **domain** and any paid services are renewed (ask the owner).
- Review the **Privacy policy** and **Terms** dates.

---

## 11. Troubleshooting

| What you see | What it probably means | What to do |
|---|---|---|
| `python` is not recognised | Python isn't installed or was installed without "Add to PATH" | Reinstall Python and tick "Add python.exe to PATH"; reopen PowerShell |
| Build shows a red error mentioning `SyntaxError` | A quote, bracket or comma was deleted in a `.py` file | Go to the line number shown; compare with the lines around it; restore from backup if unsure |
| Build shows `AssertionError` | The services block was damaged or the count doesn't match | Check `services.html` and the number in `assert len(SERVICES) == ...` |
| Build says "(reportlab not installed...)" | Only the PDFs are skipped | Run `python -m pip install reportlab` if you need PDFs |
| The page didn't change on the live website | Old copy in the browser, or the upload was incomplete | Hard refresh (Ctrl+Shift+R); check Netlify Deploys shows Published; check you uploaded all the pages (`index.html`, `pages/`, `services/`) and bumped `V` for CSS/JS changes |
| My text change vanished | You edited a finished `.html` page instead of the source | Make the change in `tools/partials/...` and build again |
| Page looks unstyled or has no images (in preview) | You opened the file directly instead of using the preview | Use `python tools/preview.py` and http://localhost:8123 |
| A calculator, menu or the calendar stopped working | A mistake in `js/app.js`, or a script is blocked | Press F12, look at the Console for a red message; restore `js/app.js` from the backup |
| A red message mentions "Content Security Policy" | An outside service is blocked by the security rules | Ask Alan; outside services must be allowed in the policy inside `tools/build.py` |
| A link goes to a "Page not found" | The address is wrong or the page was renamed | Check the link text and file name; look for a typo |
| Form works in preview but not live | Netlify doesn't know about the form | Netlify, then Forms: are `contact`, `booking` and `collab` listed? If not, contact Alan |
| Phone shows a different layout than laptop | Normal (the site adapts) | Check the page in both sizes before publishing |

---

## 12. How the website should sound (wording rules)

The owner has strong views on the tone of the site. Follow these when you write or edit text:

- **Plain, human language.** Write the way a helpful person at the firm would speak. Short sentences.
- **No slogans or marketing talk**, and nothing that sounds like a tutorial ("Step 1: ...") or like a machine wrote it.
- **Avoid these kinds of words:** "scope", "indicative", "typical", "comprehensive", "seamless", "robust", "leverage", "end-to-end", "tailored solutions".
- **No price figures** anywhere on the site. Prices are given in conversation.
- **No promises that can't be kept** (for example "guaranteed refund" or a fixed reply time unless confirmed with the firm).
- **No names or photos of staff** beyond the existing Jithu Jenson and Alan Joshy cards on the About page.
- **Legal pages** (Privacy policy, Terms) use formal wording. Don't make them chatty.
- **Facts about law, tax and dates** must come from official sources, and carry an "as of" date where the page style uses one.
- Use **Indian formats**: dates as 02-11-2026, amounts like ₹12,00,000.
- Keep the **blue italic highlights** (`<em>`) to the last few words of a heading, as the existing pages do.

---

## 13. Things you must never do

- Never edit the finished pages (section 1, rule 1).
- Never delete the `tools/` folder or any `partials` file.
- Never remove the lines at the top of `tools/build.py` without understanding them.
- Never upload the `tools/` folder with passwords or private notes added to it.
- Never paste client details, passwords or bank information into any file.
- Never add outside scripts (analytics, chat widgets, ad trackers, fonts or images hosted on other sites) without asking Alan. The security rules will block them, and the Privacy policy would need updating.
- Never publish a change you have not previewed.
- Never change the legal pages without approval.
- Never delete files from GitHub unless you are sure they are not used. (One exception: old `service-*.html` files at the top level, and any old page files such as `about.html` at the top level now that pages live in `pages/`, should be deleted once, because services now live in `services/`. Confirm with Alan first.)

---

## 14. Who to contact

**Developer:** Alan Joshy
Phone / WhatsApp: +91 62824 06091
Email: info@alanjoshy.in

When you ask for help, send:
1. What you were trying to do.
2. The exact words of any red error message (copy and paste).
3. A screenshot of the page.
4. Which file you edited.

---

## 15. Quick reference card

**The routine:**

```
1. Edit the source file (tools/partials/..., tools/build.py, js/app.js, css/styles.css)
2. If css/js/images changed, raise V in tools/build.py by 1
3. python tools/build.py          (look for "Done.")
4. python tools/preview.py        (open http://localhost:8123 and check)
5. Upload everything except tools/ to GitHub  (Commit changes)
6. Netlify, Deploys: wait for "Published", then hard refresh the live site
```

**Rollback:** Netlify, Deploys, click an older working deploy, Publish deploy.

**Search all files:** Ctrl+Shift+F in Visual Studio Code.

**Most common edits:**

| Job | File |
|---|---|
| A sentence on a page | `tools/partials/<page>.html` |
| Phone, email, WhatsApp, footer, holidays | top of `tools/build.py` |
| FAQ | `tools/partials/faq.html` |
| Updates page | `UPDATES` in `tools/build.py` |
| Due dates | `CAL` in `js/app.js` |
| Tax estimate | `new regime` in `js/app.js` |
| Checklists | `tools/checklists.py` |
| Package contents | `BASE`, `BIZ_PTS` and the lists beside them in `js/app.js` |
| Photos | `assets/` (WebP, 4:5 for the team cards) |
| Colours | top of `css/styles.css` |
