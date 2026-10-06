# AJ Associates website: launch checklist

Tick each box as you go. Items marked **(you)** need you. Items marked **(me)** I can do when you ask.

---

## 0. Client review (before anything below)

The site stays on the beta address (dev.ajassociatesonline.com) until the client has approved it. Nothing in sections 3 and 4 happens before that.

- [ ] **(you)** Send the client the beta link, with a short note saying it is a draft for review.
- [ ] **(you)** Ask them to go through it with these questions:
  - Are the **services** right? Is anything missing, or anything listed that you don't offer?
  - Are the **service names and descriptions** how you'd describe your own work?
  - Is anything **said about the firm** wrong, or something you'd rather not promise (reply times, "checked several times", who does what)?
  - Are the **contact details, address, hours and WhatsApp numbers** correct?
  - Which **industries** and **packages** should be added, changed or removed?
  - Are there any **photos, quotes or registration numbers** to add?
- [ ] **(you)** Collect their answers in one list (a message or a document), not piece by piece.
- [ ] **(me)** Make all the changes in one round, then send the client the updated link.
- [ ] **(you)** Get a clear "approved" from the client before moving to section 1 onwards.

Adding or changing a service means editing `tools/partials/services.html` and `tools/build.py` (the service pages, menu and the services list), and `tools/HOW-TO-EDIT.md` explains the steps. Ask me and I'll do it.

---

## 1. Content only you can give

- [ ] **(you)** Photos of Jithu and Alan: 4:5 portrait, clean background, same style for both. Replace `assets/jithu-s.webp` and `assets/alan-s.webp`.
- [ ] **(you)** Reply-time wording: confirm what the site says about how fast you reply is true.
- [ ] **(you)** Registration numbers in the footer: fill in the firm registration no. and ICAI FRN in `FIRM_IDS` in `tools/build.py` if you want them shown. Empty ones are left out.
- [ ] **(you)** Client quotes or a review count: only if real and the client agrees. Skip this if you have none.
- [ ] **(you)** Holiday dates: the list in `tools/build.py` covers up to early 2027. Add the next year's dates before it runs out (Onam, Vishu, Eid and so on move every year).

## 2. Email and forms

- [ ] **(you)** Set up the email DNS records for `info@ajassociatesonline.com` with your email provider, so mail sends and receives properly.
- [ ] **(you)** In Netlify, go to Forms, then Notifications, and add an email notification for form submissions. Without it, enquiries sit in Netlify and nobody is told.
- [ ] **(you)** Send a test through each form on the live site: enquiry, booking, careers and collaboration. Check each one arrives and shows the source and campaign fields.
- [ ] **(you)** Check the Netlify spam folder after a day, in case real enquiries are caught.

## 3. Switch to the final domain

- [ ] **(you)** Point `ajassociatesonline.com` at the Netlify site and wait for the HTTPS certificate to show as issued.
- [ ] **(you)** Turn off any password or "noindex" protection on the Netlify site that was used for the beta address.
- [ ] **(me)** Set `BETA = False` in `tools/build.py` and rebuild. This removes the small "beta" tag in the navbar and the footer note.
- [ ] **(you)** Upload the rebuilt files to GitHub. Delete the old top-level page files from GitHub if they are still there (`service-*.html`, and `about.html`, `faq.html` and the other page files that now live in `pages/`). Only `index.html` and `404.html` stay at the top.
- [ ] **(you)** Check that `http://` and `www.` both land on `https://ajassociatesonline.com`.

## 4. Search

- [ ] **(you)** Add the site in Google Search Console and send me the verification code. **(me)** I'll add it to the pages.
- [ ] **(you)** Submit `https://ajassociatesonline.com/sitemap.xml` in Search Console.
- [ ] **(you)** Claim the Google Business Profile with the same address and phone number as the site.
- [ ] **(you)** Check `robots.txt` on the live site: it should allow everything except `/tools/`.

## 5. Final checks on the live site

- [ ] **(you)** Open every page on a real phone: Home, About, Services, each service page, Packages, Starting a business, For business owners, Resources, Updates, FAQ, Contact, Careers, Collaboration, Privacy, Terms.
- [ ] **(you)** Open the menu on the phone, tap each link, and check the page doesn't scroll sideways.
- [ ] **(you)** Download a couple of the checklist PDFs and open them.
- [ ] **(you)** Click every WhatsApp and phone link and check they open the right number.
- [ ] **(you)** Type a wrong address such as `/abc` and check the friendly 404 page appears.
- [ ] **(you)** Press Tab on any page and check "Skip to content" appears.
- [ ] **(me)** Final proofread of all wording in one pass, after the photos and quotes are in.

## 6. First two weeks after launch

- [ ] **(you)** Decide on analytics. If you add any, tell me which, and I'll update the Privacy policy to match.
- [ ] **(you)** Note which pages visitors use and where they leave, then ask me for changes based on that.
- [ ] **(you)** Re-check the Updates page and the Resources calendar each month so due dates stay right. See the "Due dates" section in `tools/HOW-TO-EDIT.md`.

---

**Only change the wording of the site, or add features, after this list is done.** Real visitors will show what's missing better than guessing will.
