#!/usr/bin/env python3
"""Builds every page of the AJ Associates site from tools/partials/*.html.

Run from anywhere:   python tools/build.py

Header, mega-menu and footer are defined ONCE below; page bodies are the partial files. Edit a partial
(or this file) and re-run the script to regenerate all pages. The generated .html files in the project
root are what you deploy — the tools/ folder does not need to be uploaded.
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PART = os.path.join(ROOT, 'tools', 'partials')
V = '104'   # bump to force browsers to re-download css/js after a change

def part(name):
    with open(os.path.join(PART, name + '.html'), encoding='utf-8') as f:
        return f.read()

SITE = 'https://ajassociatesonline.com'   # the ONE address the site lives at
WA = '916282406091'
INFO = 'info@ajassociatesonline.com'

# Beta mode: shows a small "Beta" tag in the navbar and a note in the footer. Set to False when the site is final.
BETA = True
# Registration numbers shown in the footer. Fill in what applies; empty ones are simply left out.
FIRM_IDS = {'GSTIN': '32ACJFA1724A1Z7', 'Firm registration no.': '', 'ICAI FRN': ''}

# Days the office is closed (public and regional holidays), as 'YYYY-MM-DD': 'Name'. Sundays are handled automatically.
# The booking form will not accept these dates. Add each year's dates (Onam, Vishu, Eid and so on move every year).
HOLIDAYS = {
    '2026-10-02': 'Gandhi Jayanti',
    '2026-10-19': 'Maha Navami',
    '2026-10-20': 'Vijayadashami',
    '2026-11-08': 'Diwali',
    '2026-12-25': 'Christmas',
    '2027-01-26': 'Republic Day',
    '2027-03-26': 'Good Friday',
    '2027-04-14': 'Dr. Ambedkar Jayanti',
    '2027-05-01': 'May Day',
    '2027-08-15': 'Independence Day',
    '2027-10-02': 'Gandhi Jayanti',
    '2027-12-25': 'Christmas',
}
PHONE_TEL = '+918136885152'
PHONE_SHOW = '+91 81368 85152'
WA_HELLO = ('https://wa.me/' + WA + '?text=Greetings%20AJ%20Associates!%20I%20am%20visiting%20your%20website%20and%20would%20like%20'
            'to%20consult%20regarding%20Tax%20%26%20Management%20Advisory.')

# ----------------------------------------------------------------------------- services data
SLUGS = ['service-taxation', 'service-company-formation', 'service-financial-management',
         'service-corporate-secretarial', 'service-lending-capital', 'service-business-strategy',
         'service-staffing-support']

def parse_services(src):
    out = []
    for i, d in enumerate(re.findall(r'<details name="svc"[^>]*>(.*?)</details>', src, re.S)):
        out.append({
            'no': re.search(r'class="no">(\d+)', d).group(1),
            'title': re.search(r'class="t">(.*?)</span>', d).group(1),
            'lead': re.search(r'<div class="pn">\s*<p>(.*?)</p>', d, re.S).group(1).strip(),
            'items': re.findall(r'<li><b>(.*?)</b>(.*?)</li>', d),
            'wa': re.search(r'href="(https://wa\.me[^"]+)"', d).group(1),
            'file': SLUGS[i] + '.html',
        })
    return out

SERVICES_SRC = part('services')
SERVICES = parse_services(SERVICES_SRC)
assert len(SERVICES) == 7

ARROW = '<svg class="i"><use href="#i-arrow"/></svg>'

# ----------------------------------------------------------------------------- shared chrome
SPRITE = '''<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>
  <symbol id="i-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></symbol>
  <symbol id="i-chevr" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></symbol>
  <symbol id="i-chat" viewBox="0 0 24 24"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-9l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/><path d="M8 10h8M8 13h5"/></symbol>
  <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></symbol>
  <symbol id="i-check" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></symbol>
  <symbol id="i-wa" viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z"/><path d="M9 8.2c-.4 1 0 2.4 1.3 3.9s2.900 2.300 4 2.400c.9 0 1.500-.6 1.700-1.200l-1.900-1-.9.800c-.9-.3-2.100-1.400-2.500-2.400l.8-.9-.9-2z"/></symbol>
  <symbol id="i-phone" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></symbol>
  <symbol id="i-mail" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.500 7l8.500 6 8.500-6"/></symbol>
  <symbol id="i-pin" viewBox="0 0 24 24"><path d="M12 21s7-6.100 7-11.500A7 7 0 0 0 5 9.500C5 14.900 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/></symbol>
  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>
  <symbol id="i-star" viewBox="0 0 24 24"><path d="M12 2.500l2.900 6.100 6.600.8-4.900 4.600 1.300 6.600L12 17.300l-5.900 3.300 1.300-6.600L2.500 9.400l6.600-.8z"/></symbol>
</svg>'''

JSON_LD = '''<script type="application/ld+json">
{"@context":"https://schema.org","@type":"ProfessionalService","name":"AJ Associates","description":"Tax, audit and management consultancy","url":"https://ajassociatesonline.com","email":"info@ajassociatesonline.com","telephone":"+918136885152","address":{"@type":"PostalAddress","streetAddress":"Second Floor, 10/1329 G, Bivera, Chullickal Road","addressLocality":"Kochi","addressRegion":"Kerala","postalCode":"682006","addressCountry":"IN"},"openingHours":"Mo-Sa 09:00-18:00","aggregateRating":{"@type":"AggregateRating","ratingValue":"4.9","bestRating":"5"}}
</script>'''

def head(title, desc, extra='', canonical=None, robots=None):
    canon = (f'<link rel="canonical" href="{canonical}">\n<meta property="og:url" content="{canonical}">\n' if canonical else '')
    rb = (f'<meta name="robots" content="{robots}">\n' if robots else '')
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#f6f2ea">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AJ Associates">
<meta property="og:image" content="{SITE}/assets/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="AJ Associates: Compliance done right. Growth made clear.">
<meta name="twitter:card" content="summary_large_image">
{canon}{rb}<link rel="icon" href="favicon.ico" sizes="48x48">
<link rel="icon" href="favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">

<link rel="preload" href="css/styles.css?v={V}" as="style">
<link rel="preload" href="assets/fonts/playfair.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<script>
  /* Progressive enhancement flags. "lite" = save-data, <=2GB RAM or <=2 cores: skip reveal animations. */
  (function (d, n) {{
    var c = d.documentElement.classList; c.add('js');
    if ((n.connection && n.connection.saveData) || (n.deviceMemory && n.deviceMemory <= 2) || (n.hardwareConcurrency && n.hardwareConcurrency <= 2)) c.add('lite');
  }})(document, navigator);
</script>
<link rel="stylesheet" href="css/styles.css?v={V}">
{extra}</head>
'''

def header(cur):
    beta_tag = '<sup class="beta-tag" title="This website is under development">beta</sup>' if BETA else ''
    """cur = key of the current page: home, services, packages, about, collab, careers, contact"""
    def cp(k):
        return ' aria-current="page"' if cur == k else ''
    mega_list = ''.join(
        f'<li><a href="{s["file"]}">{s["title"]}<svg class="i"><use href="#i-chevr"/></svg></a></li>'
        for s in SERVICES)
    mega_detail = ''.join(
        f'<div class="mp"><h4>{s["title"]}</h4><p>{s["lead"]}</p><a href="{s["file"]}">Show more {ARROW}</a></div>'
        for s in SERVICES)
    return f'''<div class="prog" id="prog" aria-hidden="true"></div>
<header class="hdr" id="hdr">
  <div class="wrap hdr-in">
    <a class="brand" href="index.html" aria-label="AJ Associates — home">
      <img src="assets/mark-dark.webp" width="40" height="32" alt="">
      <span><b>AJ ASSOCIATES{beta_tag}</b><small>Tax &amp; Management Consultancy</small></span>
    </a>
    <button class="burger" id="burger" aria-expanded="false" aria-controls="nav" aria-label="Menu"><span></span><span></span><span></span></button>
    <nav class="nav" id="nav" aria-label="Main">
      <a href="index.html"{cp('home')}>Home</a>
      <div class="dd dd-mega">
        <a class="dd-t" href="services.html"{cp('services')}>Services <svg class="i"><use href="#i-chev"/></svg></a>
        <button class="dd-btn" type="button" aria-expanded="false" aria-label="Show services"><svg class="i"><use href="#i-chev"/></svg></button>
        <div class="mega">
          <div class="wrap mega-in">
            <div class="mega-intro">
              <h3>Services</h3>
              <p class="sub">Everything you need, all in one place</p>
              <p>Integrated management consultancy across accounting, tax, legal, audit and compliance — built to support your business at every stage, in Kerala and across India.</p>
              <a class="tlink" href="services.html#industries">Industries we serve {ARROW}</a>
            </div>
            <ul class="mega-list">{mega_list}</ul>
            <div class="mega-detail">{mega_detail}</div>
          </div>
        </div>
      </div>
      <a href="packages.html"{cp('packages')}>Packages</a>
      <div class="dd">
        <a class="dd-t" href="about.html"{cp('about')}>About Us <svg class="i"><use href="#i-chev"/></svg></a>
        <button class="dd-btn" type="button" aria-expanded="false" aria-label="Show About Us links"><svg class="i"><use href="#i-chev"/></svg></button>
        <div class="menu">
          <a href="about.html#team">Our team</a>
          <a href="about.html#commitments">Our commitments</a>
          <a href="faq.html">FAQs</a>
          <a href="resources.html">Resources</a>
          <a href="index.html#approach">How we work</a>
          <a href="index.html#reviews">Testimonials</a>
        </div>
      </div>
      <a href="collab.html"{cp('collab')}>Collab with us</a>
      <a href="careers.html"{cp('careers')}>Careers</a>
      <a class="btn btn-solid" href="contact.html">Book a consultation</a>
    </nav>
  </div>
</header>
'''

def footer():
    beta_note = '<p class="beta-note">Beta version. This website is under development.</p>' if BETA else ''
    ids = ' · '.join(f'{k}: {v}' for k, v in FIRM_IDS.items() if v)
    firm_line = f'<span class="ftr-ids">{ids}</span>' if ids else ''
    CHAT_MAIL = 'mailto:' + INFO + '?subject=Enquiry%20-%20AJ%20Associates&body=Hello%20AJ%20Associates%2C%20I%20would%20like%20to%20get%20in%20touch.'
    return f'''<footer class="ftr">
  <div class="wrap">
    <div class="ftr-grid">
      <div>
        <a class="brand" href="index.html"><img src="assets/mark-light.webp" width="40" height="32" alt=""><span><b>AJ ASSOCIATES</b><small>Tax &amp; Management Consultancy</small></span></a>
        <p class="mission">Supporting companies, SMEs and entrepreneurs through every stage of growth — from incorporation to accounting, tax compliance, audit and corporate finance.</p>
      </div>
      <div>
        <h4>Explore</h4>
        <ul><li><a href="services.html">Services</a></li><li><a href="packages.html">Packages</a></li><li><a href="about.html">About us</a></li><li><a href="faq.html">FAQs</a></li><li><a href="resources.html">Resources</a></li><li><a href="collab.html">Collab with us</a></li><li><a href="careers.html">Careers</a></li><li><a href="contact.html">Contact</a></li></ul>
      </div>
      <div>
        <h4>Follow</h4>
        <ul>
          <li><a href="https://linkedin.com/in/ajassociatesonline" target="_blank" rel="noopener">LinkedIn</a></li>
          <li><a href="https://twitter.com/ajass0ciates" target="_blank" rel="noopener">X / Twitter</a></li>
          <li><a href="https://facebook.com/ajassociatesonline" target="_blank" rel="noopener">Facebook</a></li>
          <li><a href="https://instagram.com/ajassociatesonline" target="_blank" rel="noopener">Instagram</a></li>
        </ul>
      </div>
      <div>
        <h4>Careers</h4>
        <p style="margin:0 0 .8rem">Accountants, tax consultants and freshers — build your practice with us.</p>
        <ul>
          <li><a href="mailto:careers@ajassociatesonline.com?subject=Career%20Application%20-%20AJ%20Associates">careers@ajassociatesonline.com</a></li>
        </ul>
      </div>
    </div>
    <p class="ftr-mark" aria-hidden="true">AJ Associates</p>
    <div class="ftr-bot">
      <span>© <span id="yr">2026</span> AJ Associates. All rights reserved.</span>
      <span class="ftr-legal"><a href="privacy.html">Privacy policy</a> · <a href="terms.html">Terms &amp; disclaimer</a> · <a href="privacy.html#grievances-and-complaints">Grievances</a></span>
      {firm_line}
      <span>Kochi, Kerala · Mon – Sat, 9 AM – 6 PM</span>
    </div>
    {beta_note}
  </div>
</footer>

<div class="chat" id="chat">
  <ul class="chat-menu" id="chat-menu" aria-label="Contact options">
    <li><a href="{WA_HELLO}" target="_blank" rel="noopener"><span class="ic wa"><svg class="i"><use href="#i-wa"/></svg></span><span>WhatsApp<small>Chat with a partner</small></span></a></li>
    <li><a href="{CHAT_MAIL}"><span class="ic mail"><svg class="i"><use href="#i-mail"/></svg></span><span>Email<small>{INFO}</small></span></a></li>
    <li><a href="tel:{PHONE_TEL}"><span class="ic call"><svg class="i"><use href="#i-phone"/></svg></span><span>Call<small>{PHONE_SHOW}</small></span></a></li>
  </ul>
  <button class="chat-btn" id="chat-btn" type="button" aria-expanded="false" aria-controls="chat-menu" aria-label="Chat with us"><svg class="i i-c"><use href="#i-chat"/></svg><svg class="i i-x"><use href="#i-x"/></svg></button>
</div>

<script src="js/app.js?v={V}" defer></script>
</body>
</html>
'''

SPLASH_JS = '''<script>
  /* First page of a visit only, and never on low-end / save-data / reduced-motion devices. */
  (function (d, n, w) {
    try {
      var c = d.documentElement.classList;
      if (c.contains('lite') || (w.matchMedia && w.matchMedia('(prefers-reduced-motion: reduce)').matches) || w.sessionStorage.getItem('aj-splash')) return;
      w.sessionStorage.setItem('aj-splash', '1'); c.add('splash');
    } catch (e) {}
  })(document, navigator, window);
</script>
'''

SPLASH = '''<div id="splash" aria-hidden="true"><div class="sp-in"><img class="sp-mark" src="assets/mark-light.webp" width="80" height="64" alt=""><p class="sp-word">AJ ASSOCIATES</p><span class="sp-line"></span><p class="sp-sub">Tax · Audit · Accounts</p></div></div>'''

def page(filename, cur, title, desc, body, extra_head=''):
    canonical = SITE + '/' if filename == 'index.html' else SITE + '/' + filename
    html = (head(title, desc, extra_head + SPLASH_JS, canonical) + '<body>\n' + SPLASH + '\n<a class="skip" href="#main">Skip to content</a>\n\n'
            + SPRITE + '\n\n' + header(cur) + '\n<main id="main">\n\n' + body.strip() + '\n\n</main>\n\n' + footer())
    with open(os.path.join(ROOT, filename), 'w', encoding='utf-8') as f:
        f.write(html)
    print('  wrote', filename, f'({len(html)//1024} KB)')

# ----------------------------------------------------------------------------- helpers
ANCHORS = {'#contact': 'contact.html', '#packages': 'packages.html', '#services': 'services.html',
           '#team': 'about.html#team', '#partnership': 'collab.html', '#reviews': 'index.html#reviews',
           '#ask': 'index.html#ask', '#commitments': 'about.html#commitments', '#home': 'index.html'}

def fix_links(html, filename):
    """In-page anchors in the partials become real page links; links to the current page stay in-page."""
    for a, t in ANCHORS.items():
        target_file, _, frag = t.partition('#')
        new = ('#' + frag if frag else t) if target_file == filename else t
        if target_file == filename and not frag:
            new = filename
        html = html.replace(f'href="{a}"', f'href="{new}"')
    return html

def h1ize(html):
    """The page's first <h2> becomes its <h1> (same look), so every page has exactly one h1."""
    return re.sub(r'<h2([^>]*)>(.*?)</h2>', lambda m: f'<h1 class="h2"{m.group(1)}>{m.group(2)}</h1>', html, count=1, flags=re.S)

def opt_in(html, old_open, new_open):
    assert old_open in html, old_open
    return html.replace(old_open, new_open, 1)

CTA = f'''<section class="network on-dark cta-band" aria-labelledby="cta-h">
  <div class="wrap cta-in">
    <div class="rv">
      <p class="eyebrow">Let’s talk</p>
      <h2 id="cta-h">Precision in every filing. <em>Confidence in every decision.</em></h2>
    </div>
    <div class="cta-row rv">
      <a class="btn btn-brass" href="contact.html">Book a consultation {ARROW}</a>
      <a class="btn btn-ghost" href="{WA_HELLO}" target="_blank" rel="noopener"><svg class="i"><use href="#i-wa"/></svg> Chat on WhatsApp</a>
    </div>
  </div>
</section>'''

def page_hero(crumbs, title, lead, actions=''):
    trail = ' <span>/</span> '.join(crumbs)
    return f'''<section class="page-hero on-dark">
  <div class="wrap">
    <p class="crumbs">{trail}</p>
    <h1>{title}</h1>
    <p class="lead">{lead}</p>
    {actions}
  </div>
</section>'''

# ----------------------------------------------------------------------------- pages
IND_STRIP = f'''<div class="wrap ind-line" aria-labelledby="is-h">
    <div class="ind-line-in">
      <div class="rv">
        <p class="eyebrow">Industries we serve</p>
        <h2 id="is-h">Every sector, <em>one trusted team.</em></h2>
      </div>
      <div class="rv">
        <ul class="tags">
          <li>Manufacturing</li><li>Retail</li><li>Healthcare</li><li>Education</li><li>Hospitality</li><li>Construction</li><li>IT and start-ups</li><li>Agriculture</li><li>Exports</li><li>Finance</li><li>Professionals</li><li>And more</li>
        </ul>
        <a class="tlink" href="services.html#industries">Explore industries {ARROW}</a>
      </div>
    </div>
  </div>'''

def build_home():
    hero = opt_in(part('hero'), '<section class="hero" id="home">', '<section class="hero fit-me" id="home" data-cut-bottom data-no-gap>')
    services = SERVICES_SRC
    # each accordion panel gets an "Explore" link to its own page, next to the enquire button
    counter = iter(SERVICES)
    def repl(m):
        s = next(counter)
        return (f'<div class="pn-actions"><a class="btn btn-solid btn-sm" href="{s["file"]}">Explore this service {ARROW}</a>'
                f'<a class="btn btn-ghost btn-sm" href="{s["wa"]}" target="_blank" rel="noopener">Enquire</a>'
                + (f'<a class="tlink" href="{SVC_EXTRA[s["file"]][1]}">{SVC_EXTRA[s["file"]][0]} {ARROW}</a>' if s['file'] in SVC_EXTRA else '') + '</div>')
    services = re.sub(r'<a class="btn btn-solid btn-sm" href="https://wa\.me[^"]*"[^>]*>Enquire about this .*?</a>', repl, services, flags=re.S)
    services = services.rstrip()
    assert services.endswith('</section>')
    services = services[:-len('</section>')].rstrip() + '\n  ' + IND_STRIP + '\n</section>'
    approach = opt_in(part('approach'), '<section class="approach on-dark" aria-labelledby="ap-h">', '<section class="approach on-dark" id="approach" aria-labelledby="ap-h">')
    body = '\n\n'.join([hero, part('band'), part('ask'), services, approach, part('reviews'), CTA])
    page('index.html', 'home', 'AJ Associates | Tax, Audit &amp; Management Consultancy in Kochi, Kerala',
         'AJ Associates is a tax, audit and management consultancy in Kochi, Kerala — GST, Income Tax, accounting, company formation, bank loan proposals and corporate compliance, led by experienced partners.',
         fix_links(body, 'index.html'), JSON_LD + '\n')

SVC_ART = {
    'service-taxation.html': '<path d="M100 40h90l30 30v130H100zM190 40v30h30M120 104h80M120 128h80M120 152h50"/><g class="ac"><circle cx="238" cy="172" r="11"/><circle cx="272" cy="204" r="11"/><path d="M276 160l-46 54"/></g>',
    'service-company-formation.html': '<path d="M20 200h280M70 200V80h100v120M90 104h20M130 104h20M90 136h20M130 136h20M112 200v-30h16v30"/><g class="ac"><path d="M196 120h92v64h-92zM210 140h46M210 156h32"/><circle cx="268" cy="162" r="9"/></g>',
    'service-financial-management.html': '<path d="M60 40v160h210M96 200v-50h28v50M146 200v-90h28v90M196 200v-130h28v130"/><path class="ac" d="M80 122l55-36 50 18 66-56M236 48h18v18"/>',
    'service-corporate-secretarial.html': '<path d="M70 200v-30h170v30zM88 170v-30h134v30zM106 140v-30h98v30zM90 185h20M108 155h20M126 125h20"/><g class="ac"><circle cx="262" cy="84" r="22"/><path d="M251 84l8 8 14-16"/></g>',
    'service-lending-capital.html': '<path d="M60 104l100-56 100 56zM90 116v68M134 116v68M186 116v68M230 116v68M70 184h180M56 204h208"/><circle class="ac" cx="160" cy="86" r="14"/>',
    'service-business-strategy.html': '<circle cx="160" cy="120" r="78"/><path d="M160 30v14M160 196v14M70 120h14M236 120h14"/><path class="ac" d="M160 66l22 54-22 54-22-54z"/><path d="M138 120h44"/>',
    'service-staffing-support.html': '<path d="M100 70h120v140H100zM142 86h36"/><circle cx="160" cy="130" r="20"/><path d="M122 192c0-26 76-26 76 0"/><path class="ac" d="M132 70l-18-42M188 70l18-42"/>',
}


QUIZ = '''<section class="sec structure" id="structure-quiz" aria-labelledby="sq-h">
  <div class="wrap sq-grid">
    <div class="rv">
      <p class="eyebrow">Choosing a structure</p>
      <h2 id="sq-h">Not sure which <em>structure suits you?</em></h2>
      <p>Answer five quick questions and see the closest fit. Our team confirms it with you before anything is filed.</p>
      <ul class="sq-cmp">
        <li><b>Sole proprietorship</b><span>One owner, lowest cost and paperwork. Unlimited liability.</span></li>
        <li><b>Partnership firm</b><span>Two or more owners, quick and simple. Unlimited liability.</span></li>
        <li><b>One Person Company</b><span>One owner with limited liability and a company identity.</span></li>
        <li><b>Limited Liability Partnership</b><span>Two or more owners, limited liability, lighter compliance.</span></li>
        <li><b>Private Limited Company</b><span>Built for investors, credibility and growth. More compliance.</span></li>
      </ul>
    </div>
    <div class="sq rv" id="sq" aria-live="polite"></div>
  </div>
</section>'''

SVC_EXTRA = {
    'service-company-formation.html': ('Not sure which structure? Take the guide', 'service-company-formation.html#structure-quiz'),
}

def svc_index_section():
    items = []
    for i, s in enumerate(SERVICES):
        bullets = ''.join(f'<li>{t}</li>' for t, _ in s['items'][:3])
        art = SVC_ART.get(s['file'], '')
        ex = SVC_EXTRA.get(s['file'])
        sx_extra = f'<a class="tlink sx-extra" href="{ex[1]}">{ex[0]} {ARROW}</a>' if ex else ''
        items.append(f'''      <li class="sx-item v{i % 4}{' on' if i == 0 else ''}" style="--i:{i}">
        <a class="sx-row" href="{s["file"]}" aria-expanded="{'true' if i == 0 else 'false'}"><span class="sx-n">{s["no"]}</span><span class="sx-t">{s["title"]}</span><svg class="i"><use href="#i-arrow"/></svg></a>
        <div class="sx-panel">
          <div class="sx-art" aria-hidden="true"><svg viewBox="0 0 320 240" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">{art}</svg></div>
          <div class="sx-body">
            <p>{s["lead"]}</p>
            <ul>{bullets}</ul>
            <a class="btn btn-solid btn-sm" href="{s["file"]}">Explore this service {ARROW}</a>
            {sx_extra}
          </div>
        </div>
      </li>''')
    return ('<section class="sec after-slant" aria-label="All services">\n  <div class="wrap">\n    <ol class="sx-list">\n'
            + '\n'.join(items) + '\n    </ol>\n  </div>\n</section>')


def build_services_index():
    body = page_hero(['<a href="index.html">Home</a>', 'Services'], 'Seven practices, <em>one desk.</em>',
                     'Integrated management consultancy across accounting, tax, legal, audit and compliance — built to support your business at every stage, in Kerala and across India.',
                     f'<div class="cta-row"><a class="btn btn-brass" href="contact.html">Book a consultation {ARROW}</a><a class="btn btn-ghost" href="packages.html">Find your package</a></div>')
    body += '\n\n' + svc_index_section() + '\n\n' + part('industries') + '\n\n' + CTA
    page('services.html', 'services', 'Services | AJ Associates — Tax, Audit, Company Law &amp; Advisory, Kochi',
         'Taxation, company formation, financial management and audit, corporate secretarial, bank loan proposals, business strategy and outsourced staffing for every industry — all under one roof in Kochi, Kerala.',
         body)

def build_service_pages():
    for i, s in enumerate(SERVICES):
        points = ''.join(f'<li class="rv"><span class="k">{n+1:02d}</span><div><h3>{b}</h3><p>{t}</p></div></li>' for n, (b, t) in enumerate(s['items']))
        cur_attr = ' aria-current="page"'
        others = ''.join('<li><a href="' + o['file'] + '"' + (cur_attr if o is s else '') + '>' + o['title'] + '</a></li>' for o in SERVICES)
        ex = SVC_EXTRA.get(s['file'])
        extra = f'<a class="tlink svc-extra" href="{ex[1]}">{ex[0]} {ARROW}</a>' if ex else ''
        hero = page_hero(['<a href="index.html">Home</a>', '<a href="services.html">Services</a>', s['title']], s['title'], s['lead'],
                         f'<div class="cta-row"><a class="btn btn-brass" href="{s["wa"]}" target="_blank" rel="noopener">Enquire about this {ARROW}</a><a class="btn btn-ghost" href="contact.html">Book a consultation</a></div>')
        main = f'''<section class="sec after-slant" aria-label="What is included">
  <div class="wrap svc-page-grid">
    <div>
      <p class="eyebrow rv">What’s included</p>
      <ol class="svc-points" style="margin-top:2rem">{points}</ol>
      <div class="svc-cta rv">
        <a class="btn btn-solid" href="{s["wa"]}" target="_blank" rel="noopener">Enquire on WhatsApp {ARROW}</a>
        <a class="btn btn-ghost" href="packages.html">See packages</a>
        <a class="btn btn-ghost" href="services.html#industries">Industries we serve</a>
      </div>
      {extra}
    </div>
    <aside class="svc-other rv" aria-label="Other services">
      <h3>Other services</h3>
      <ul>{others}</ul>
      <a class="tlink side-ind" href="services.html#industries">Industries we serve {ARROW}</a>
      <div class="side-cta">
        <h4>Not sure what you need?</h4>
        <p>Tell us about your business and our team will point you to the right service.</p>
        <a class="btn btn-brass btn-sm" href="contact.html">Book a consultation {ARROW}</a>
      </div>
    </aside>
  </div>
</section>'''
        page(s['file'], 'services', f'{s["title"]} | AJ Associates, Kochi', s['lead'].replace('&amp;', '&'), hero + '\n\n' + main + '\n\n' + (QUIZ + '\n\n' if s['file'] == 'service-company-formation.html' else '') + CTA)

def build_packages():
    body = h1ize(fix_links(opt_in(part('packages'), '<section class="sec" id="packages">', '<section class="sec fit-me" id="packages">'), 'packages.html'))
    page('packages.html', 'packages', 'Packages | AJ Associates — find the right compliance scope',
         'Choose your business type and turnover to see the tax, accounts and compliance scope we would typically recommend — with our team confirming the final scope and fee.', body)

ABOUT_IND = '''<section class="sec about-ind" aria-label="Industries we serve">
  <div class="wrap">
    <p class="ind-note rv">We serve every sector, from first-generation start-ups to established family enterprises. <a href="services.html#industries">See the industries we serve</a></p>
  </div>
</section>'''

def build_about():
    team = opt_in(part('team'), '<section class="sec team" id="team">', '<section class="sec team fit-me" id="team">')
    body = h1ize(fix_links(team, 'about.html')) + '\n\n' + fix_links(part('principles'), 'about.html') + '\n\n' + ABOUT_IND + '\n\n' + CTA
    page('about.html', 'about', 'About Us | AJ Associates — leadership and commitments',
         'Meet the partners behind AJ Associates and the three commitments we hold ourselves to: statutory precision, a dedicated advisory desk and proactive compliance.', body)

def build_collab():
    net = opt_in(part('network'), '<section class="network on-dark" id="partnership">', '<section class="network on-dark flat fit-me" id="partnership">')
    page('collab.html', 'collab', 'Collab with us | AJ Associates — referrals and collaborations',
         'Banks, fintech platforms, legal practitioners and corporate advisors: propose a referral or joint advisory arrangement with AJ Associates.',
         h1ize(fix_links(net, 'collab.html')))

def legal_body(html):
    """Gives every legal heading an id and adds an "On this page" list under the date line."""
    heads = []
    def sub(m):
        title = m.group(1)
        slug = re.sub(r'[^a-z0-9]+', '-', re.sub(r'<[^>]+>', '', title).lower()).strip('-')
        heads.append((slug, title))
        return f'<h2 id="{slug}">{title}</h2>'
    html = re.sub(r'<h2>(.*?)</h2>', sub, html)
    toc = '<nav class="legal-toc" aria-label="On this page"><p>On this page</p><ol>' + ''.join(f'<li><a href="#{s}">{t}</a></li>' for s, t in heads) + '</ol></nav>'
    return re.sub(r'(<p class="upd">.*?</p>)', lambda m: m.group(1) + '\n    ' + toc, html, count=1)

def build_legal():
    crumbs = lambda t: ['<a href="index.html">Home</a>', t]
    page('privacy.html', 'legal', 'Privacy policy | AJ Associates',
         'How AJ Associates collects, uses and protects the personal information you share through this website.',
         page_hero(crumbs('Privacy policy'), 'Privacy <em>policy.</em>', 'What we collect, why we collect it and the choices you have. Short and clear.') + '\n\n' + legal_body(part('privacy')))
    page('terms.html', 'legal', 'Terms and disclaimer | AJ Associates',
         'The terms for using the AJ Associates website, and an important disclaimer about the general information it contains.',
         page_hero(crumbs('Terms &amp; disclaimer'), 'Terms &amp; <em>disclaimer.</em>', 'The ground rules for using this website, and what the information on it is, and is not.') + '\n\n' + legal_body(part('terms')))

def build_careers():
    hero = page_hero(['<a href="index.html">Home</a>', 'Careers'], 'Build your practice <em>with us.</em>',
                     'We welcome experienced accountants, tax consultants and freshers looking for meaningful professional growth.')
    roles = '''<div class="roles">
      <div class="role rv"><h3>Accountants</h3><p>Bookkeeping, reconciliations, statutory filings and audit support across a varied client base.</p></div>
      <div class="role rv"><h3>Tax consultants</h3><p>Income Tax, GST and TDS work, notice responses and representation alongside the team.</p></div>
      <div class="role rv"><h3>Freshers</h3><p>Begin your career learning the practice hands-on across filings, audits and company law.</p></div>
    </div>'''
    body = hero + f'''

<section class="sec after-slant" aria-label="Careers">
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow">Who we look for</p>
      <h2>Careers of <em>distinction.</em></h2>
      <p>Discover opportunities with our accounting and advisory team in Kochi.</p>
    </div>
    {roles}
    <div class="apply rv">
      <div>
        <h3>How to apply</h3>
        <p>Email your CV to <a href="mailto:careers@ajassociatesonline.com?subject=Career%20Application%20-%20AJ%20Associates"><b>careers@ajassociatesonline.com</b></a>, or message us on WhatsApp.</p>
      </div>
      <div class="cta-row">
        <a class="btn btn-solid" href="mailto:careers@ajassociatesonline.com?subject=Career%20Application%20-%20AJ%20Associates"><svg class="i"><use href="#i-mail"/></svg> Email your CV</a>
        <a class="btn btn-ghost" href="https://wa.me/{WA}?text=Hello,%20I%20am%20interested%20in%20a%20fresher%20/%20accounting%20opportunity%20at%20AJ%20Associates." target="_blank" rel="noopener"><svg class="i"><use href="#i-wa"/></svg> Apply on WhatsApp</a>
      </div>
    </div>
  </div>
</section>

''' + CTA
    page('careers.html', 'careers', 'Careers | AJ Associates — accountants, tax consultants and freshers',
         'Join AJ Associates in Kochi: opportunities for accountants, tax consultants and freshers.', body)

def build_faq():
    hero = page_hero(['<a href="index.html">Home</a>', 'FAQs'], 'Questions, <em>answered.</em>',
                     'Straight answers to what clients ask us most about tax, GST, companies and accounts. Can’t find yours? We’ll answer it personally.')
    cta = (CTA.replace('Let’s talk', 'Still have a question?')
              .replace('Precision in every filing. <em>Confidence in every decision.</em>', 'We’ll answer it <em>personally.</em>'))
    page('faq.html', 'faq', 'FAQs | AJ Associates — tax, GST, company and accounts questions answered',
         'Answers to common questions about income tax returns, GST, notices, company formation, audit and working with AJ Associates in Kochi.',
         hero + '\n\n' + part('faq') + '\n\n' + cta)

def build_resources():
    hero = page_hero(['<a href="index.html">Home</a>', 'Resources'], 'Practical guides, <em>clearly explained.</em>',
                     'Deadlines, checklists and short notes on the questions we hear most. Free to use, and always dated.')
    cta = (CTA.replace('Let’s talk', 'Need a hand?')
              .replace('Precision in every filing. <em>Confidence in every decision.</em>', 'We’ll take it <em>from here.</em>'))
    page('resources.html', 'resources', 'Resources | AJ Associates — deadlines, checklists and tax notes',
         'A live deadline calendar, document checklists and short, clearly explained notes on income tax, GST and compliance from AJ Associates, Kochi.',
         hero + '\n\n' + part('resources') + '\n\n' + cta)

def build_contact():
    body = h1ize(fix_links(opt_in(part('contact'), '<section class="sec contact" id="contact">', '<section class="sec contact fit-me" id="contact">'), 'contact.html'))
    import json
    body = body.replace('<!--HOLIDAYS-->', '<script type="application/json" id="holidays">' + json.dumps(HOLIDAYS, ensure_ascii=False) + '</script>')
    page('contact.html', 'contact', 'Contact & Book a Consultation | AJ Associates, Kochi',
         'Book a consultation with AJ Associates. Visit our office in Chullickal, Kochi, call +91 81368 85152 or message us on WhatsApp.', body)

def absolutize(html):
    """404/error pages are served at ANY missing URL (e.g. /a/b/c), so relative links would break.
    Rewrite every relative href/src to a root-absolute one."""
    return re.sub(r'(href|src)="(?!https?:|mailto:|tel:|#|/|data:|javascript:)([^"]+)"', r'\1="/\2"', html)

def special_page(filename, title, desc, body):
    html = (head(title, desc, '', None, 'noindex, nofollow') + '<body>\n\n' + SPRITE + '\n\n' + header(None)
            + '\n<main id="main">\n\n' + body.strip() + '\n\n</main>\n\n' + footer())
    html = absolutize(html)
    with open(os.path.join(ROOT, filename), 'w', encoding='utf-8') as f:
        f.write(html)
    print('  wrote', filename, f'({len(html)//1024} KB)')

def build_error_pages():
    nf = f'''<section class="notfound" aria-labelledby="nf-h">
  <div class="wrap">
    <p class="nf-n" aria-hidden="true">404</p>
    <p class="eyebrow">Page not found</p>
    <h1 class="h2" id="nf-h">This page has moved, or <em>never existed.</em></h1>
    <p class="lead">Let’s get you back on track — head home, browse our services, or talk to us directly.</p>
    <div class="cta-row">
      <a class="btn btn-solid" href="index.html">Back to home {ARROW}</a>
      <a class="btn btn-ghost" href="services.html">Our services</a>
      <a class="btn btn-ghost" href="contact.html">Contact us</a>
    </div>
  </div>
</section>'''
    er = f'''<section class="notfound" aria-labelledby="nf-h">
  <div class="wrap">
    <p class="nf-n" aria-hidden="true">Oops</p>
    <p class="eyebrow">Something went wrong</p>
    <h1 class="h2" id="nf-h">We hit a snag. <em>Please try again.</em></h1>
    <p class="lead">The page didn’t load as expected. Refresh to try again — and if it keeps happening, message us and we’ll help right away.</p>
    <div class="cta-row">
      <button class="btn btn-solid" type="button" data-reload>Try again {ARROW}</button>
      <a class="btn btn-ghost" href="index.html">Back to home</a>
      <a class="btn btn-ghost" href="{WA_HELLO}" target="_blank" rel="noopener"><svg class="i"><use href="#i-wa"/></svg> Chat on WhatsApp</a>
    </div>
  </div>
</section>'''
    special_page('404.html', 'Page not found | AJ Associates', 'The page you were looking for could not be found.', nf)
    special_page('error.html', 'Something went wrong | AJ Associates', 'Something went wrong while loading this page. Please try again.', er)

PAGES = ['index.html', 'services.html'] + [s['file'] for s in SERVICES] + ['packages.html', 'about.html', 'collab.html', 'careers.html', 'contact.html', 'faq.html', 'resources.html', 'privacy.html', 'terms.html']

def write_deploy_files():
    def w(name, text):
        os.makedirs(os.path.dirname(os.path.join(ROOT, name)) or ROOT, exist_ok=True)
        with open(os.path.join(ROOT, name), 'w', encoding='utf-8', newline='\n') as f:
            f.write(text)
        print('  wrote', name)
    # every inline <script> on the site is allowed by its hash, so the policy can stay strict
    import hashlib, base64, glob
    hashes = set()
    for fn in glob.glob(os.path.join(ROOT, '*.html')):
        for code in re.findall(r'<script>(.*?)</script>', open(fn, encoding='utf-8').read(), flags=re.S):
            hashes.add("'sha256-" + base64.b64encode(hashlib.sha256(code.encode('utf-8')).digest()).decode() + "'")
    csp = ("default-src 'self'; script-src 'self' " + ' '.join(sorted(hashes)) + "; style-src 'self' 'unsafe-inline'; "
           "img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src https://www.google.com https://maps.google.com; "
           "form-action 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'")
    w('.well-known/security.txt', f'Contact: mailto:{INFO}\nExpires: 2027-09-30T18:29:00.000Z\nPreferred-Languages: en\nCanonical: {SITE}/.well-known/security.txt\n')
    w('site.webmanifest', '{\n  "name": "AJ Associates",\n  "short_name": "AJ Associates",\n  "description": "Tax, audit and management consultancy in Kochi, Kerala",\n'
      '  "start_url": "/",\n  "display": "browser",\n  "theme_color": "#f6f2ea",\n  "background_color": "#f6f2ea",\n'
      '  "icons": [\n    {"src": "icon-192.png", "sizes": "192x192", "type": "image/png"},\n'
      '    {"src": "icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}\n  ]\n}\n')
    urls = ''.join(f'  <url><loc>{SITE}/{"" if p == "index.html" else p}</loc></url>\n' for p in PAGES)
    w('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '</urlset>\n')
    w('robots.txt', f'User-agent: *\nAllow: /\nDisallow: /tools/\n\nSitemap: {SITE}/sitemap.xml\n')
    clean = ''.join(f'/{p[:-5]:<32} /{p:<40} 200\n' for p in PAGES if p != 'index.html')
    slash = ''.join(f'/{p[:-5]}/ /{p[:-5]} 301!\n' for p in PAGES if p != 'index.html')
    w('_redirects', f"""# ---- One address only: ajassociatesonline.com --------------------------------------------
# (Also set ajassociatesonline.com as the PRIMARY domain in Netlify > Domain management, so the
#  free *.netlify.app address redirects here too.)
http://www.ajassociatesonline.com/*   {SITE}/:splat   301!
https://www.ajassociatesonline.com/*  {SITE}/:splat   301!
http://ajassociatesonline.com/*       {SITE}/:splat   301!

# Home is the bare domain, never /index.html
/index.html   /   301!

# A trailing slash (/about/) is tidied to /about so styles and images always load
{slash}
# Clean addresses work too (typed or shared) and the address bar stays exactly as typed
{clean}
# Source folders and config are never public
/tools/*        /404.html   404!
/_legacy/*      /404.html   404!
/netlify.toml   /404.html   404!
/.gitignore     /404.html   404!
/_redirects     /404.html   404!

# Anything else that doesn't exist shows /404.html automatically (Netlify serves it at the same address)
""")
    w('netlify.toml', f"""# Netlify settings for ajassociatesonline.com — static site, nothing to build.
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
    Strict-Transport-Security = "max-age=31536000"
    Content-Security-Policy = "{csp}"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=3600, must-revalidate"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=3600, must-revalidate"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=604800"

[[headers]]
  for = "/assets/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
""")
    w('.gitignore', '# not part of the public site\n_legacy/\n*.zip\n.claude/\n__pycache__/\n.DS_Store\nThumbs.db\n')

if __name__ == '__main__':
    print('Building AJ Associates site...')
    build_home(); build_services_index(); build_service_pages(); build_packages()
    build_about(); build_collab(); build_careers(); build_contact(); build_legal(); build_faq(); build_resources()
    build_error_pages(); write_deploy_files()
    print('Done.')
