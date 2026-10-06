#!/usr/bin/env python3
"""Builds the whole site from tools/partials/*.html.

Run it with:  python tools/build.py

The header, menu and footer live in this file. Page content lives in the partials.
Edit either one, run this, and every page gets rewritten. Upload the generated
files, not the tools folder.
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PART = os.path.join(ROOT, 'tools', 'partials')
V = '326'   # bump this whenever css/js changes so browsers fetch the new files

def part(name):
    with open(os.path.join(PART, name + '.html'), encoding='utf-8') as f:
        return f.read()

SITE = 'https://ajassociatesonline.com'   # the one real address of the site
WA = '916282406091'
INFO = 'info@ajassociatesonline.com'

# shows the little "beta" tag in the nav and a note in the footer. False once we go live.
BETA = True
# GitHub Pages ignores _redirects, so while the beta lives there page links keep the /pages folder (/pages/about).
# On Netlify set this to '' and the short addresses (/about) come back through _redirects.
PAGES_DIR = '/pages'
# numbers for the footer. Leave one blank to hide it.
FIRM_IDS = {'GSTIN': '32ACJFA1724A1Z7', 'Firm registration no.': '', 'ICAI FRN': ''}

# days the office is shut, as 'YYYY-MM-DD': 'Name'. Sundays are already blocked.
# the booking form refuses these. Needs new dates every year (Onam, Vishu and Eid move).
HOLIDAYS = {
    '2026-10-02': 'Gandhi Jayanti',
    '2026-10-20': 'Maha Navami',
    '2026-10-21': 'Vijayadashami',
    '2026-11-08': 'Diwali',
    '2026-12-25': 'Christmas',
    '2027-01-02': 'Mannam Jayanti',
    '2027-01-26': 'Republic Day',
    '2027-03-06': 'Maha Shivaratri',
    '2027-03-10': 'Id-ul Fitr (Ramzan)',
    '2027-03-25': 'Maundy Thursday',
    '2027-03-26': 'Good Friday',
    '2027-04-14': 'Dr. Ambedkar Jayanti',
    '2027-04-15': 'Vishu',
    '2027-05-01': 'May Day',
    '2027-05-17': "Id-ul Ad'ha (Bakrid)",
    '2027-08-15': 'Independence Day',
    '2027-08-17': 'Sree Narayana Guru Jayanti',
    '2027-09-11': 'First Onam',
    '2027-09-12': 'Thiruvonam',
    '2027-09-21': 'Sree Narayana Guru Samadhi',
    '2027-10-02': 'Gandhi Jayanti',
    '2027-10-09': 'Maha Navami',
    '2027-10-10': 'Vijayadashami',
    '2027-10-29': 'Diwali',
    '2027-12-25': 'Christmas',
}
PHONE_TEL = '+918136885152'
PHONE_SHOW = '+91 81368 85152'
WA_HELLO = ('https://wa.me/' + WA + '?text=Greetings%20AJ%20Associates!%20I%20am%20visiting%20your%20website%20and%20would%20like%20'
            'to%20consult%20regarding%20Tax%20%26%20Management%20Advisory.')

# services data
SLUGS = ['service-taxation', 'service-company-formation', 'service-financial-management',
         'service-corporate-secretarial', 'service-lending-capital', 'service-business-strategy',
         'service-staffing-support', 'service-ca-certification']

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
assert len(SERVICES) == 8

ARROW = '<svg class="i"><use href="#i-arrow"/></svg>'

# shared chrome
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

import json
import html as html_lib
ORG_ID = SITE + '/#org'
SOCIAL = ['https://linkedin.com/in/ajassociatesonline', 'https://twitter.com/ajass0ciates', 'https://facebook.com/ajassociatesonline', 'https://instagram.com/ajassociatesonline']
PAGE_NAMES = {'services.html': 'Services', 'packages.html': 'Packages', 'about.html': 'About us', 'collab.html': 'Collab with us', 'careers.html': 'Careers',
              'contact.html': 'Contact', 'faq.html': 'FAQs', 'resources.html': 'Resources', 'updates.html': 'Updates', 'starting-a-business.html': 'Starting a business', 'business-owners.html': 'For business owners', 'privacy.html': 'Privacy policy',
              'terms.html': 'Terms and conditions'}


def ld_script(graph):
    return '<script type="application/ld+json">\n' + json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False, separators=(',', ':')) + '\n</script>\n'


def org_graph():
    unesc = lambda t: re.sub(r'<[^>]+>', '', t).replace('&amp;', '&')
    org = {
        '@type': ['ProfessionalService', 'LocalBusiness'], '@id': ORG_ID, 'name': 'AJ Associates', 'url': SITE + '/',
        'logo': SITE + '/assets/icons/icon-512.png', 'image': SITE + '/assets/og-image.jpg',
        'description': 'Tax, audit and management consultancy in Kochi, Kerala: taxation, GST, accounts, audit, company formation and compliance.',
        'email': INFO, 'telephone': PHONE_TEL,
        'address': {'@type': 'PostalAddress', 'streetAddress': 'Second Floor, 10/1329 G, Bivera, Chullickal Road', 'addressLocality': 'Kochi', 'addressRegion': 'Kerala', 'postalCode': '682006', 'addressCountry': 'IN'},
        'openingHoursSpecification': [{'@type': 'OpeningHoursSpecification', 'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 'opens': '09:00', 'closes': '18:00'}],
        'areaServed': [{'@type': 'State', 'name': 'Kerala'}, {'@type': 'Country', 'name': 'India'}],
        'sameAs': SOCIAL,
        'hasOfferCatalog': {'@type': 'OfferCatalog', 'name': 'Services', 'itemListElement': [
            {'@type': 'Offer', 'itemOffered': {'@type': 'Service', 'name': unesc(s['title']), 'url': SITE + clean_path(s['file'])}} for s in SERVICES]},
    }
    if FIRM_IDS.get('GSTIN'):
        org['taxID'] = FIRM_IDS['GSTIN']
    site = {'@type': 'WebSite', '@id': SITE + '/#website', 'url': SITE + '/', 'name': 'AJ Associates', 'inLanguage': 'en-IN', 'publisher': {'@id': ORG_ID}}
    return [org, site]


def page_ld(filename):
    """Structured data: the firm details on home, breadcrumbs everywhere, and a Service block on service pages."""
    unesc = lambda t: re.sub(r'<[^>]+>', '', t).replace('&amp;', '&')
    if filename == 'index.html':
        return ld_script(org_graph())
    crumbs = [('Home', SITE + '/')]
    graph = []
    svc = next((s for s in SERVICES if s['file'] == filename), None)
    if svc:
        crumbs += [('Services', SITE + clean_path('services.html')), (unesc(svc['title']), SITE + clean_path(filename))]
        graph.append({'@type': 'Service', 'name': unesc(svc['title']), 'description': unesc(svc['lead']), 'url': SITE + clean_path(filename),
                      'provider': {'@id': ORG_ID}, 'areaServed': [{'@type': 'State', 'name': 'Kerala'}, {'@type': 'Country', 'name': 'India'}]})
    elif filename in PAGE_NAMES:
        crumbs.append((PAGE_NAMES[filename], SITE + clean_path(filename)))
    else:
        return ''
    graph.append({'@type': 'BreadcrumbList', 'itemListElement': [{'@type': 'ListItem', 'position': n + 1, 'name': nm, 'item': u} for n, (nm, u) in enumerate(crumbs)]})
    return ld_script(graph)

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
<meta name="theme-color" content="#f7f6f2">
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
<link rel="icon" href="assets/icons/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<link rel="manifest" href="assets/icons/site.webmanifest">

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
<script src="js/app.js?v={V}" defer fetchpriority="high"></script>
{extra}</head>
'''

def header(cur):
    beta_tag = '<sup class="beta-tag" title="This website is under development">beta</sup>' if BETA else ''
    """cur is the key of the current page (home, services, about...), used to mark the active menu item"""
    def cp(k):
        return ' aria-current="page"' if cur == k else ''
    mega_list = ''.join(
        f'<li><a href="{s["file"]}">{s["title"]}<svg class="i"><use href="#i-chevr"/></svg></a></li>'
        for s in SERVICES) + f'<li class="mega-all"><a href="services.html">See all services {ARROW}</a></li>'
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
              <p class="sub">What we can do for you</p>
              <p>Accounting, tax, company law, audit and loans. You can get all of it from us, whether you are just starting out or have been in business for years.</p>
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
          <a href="index.html#approach">How we work</a>
          <a href="index.html#reviews">Testimonials</a>
        </div>
      </div>
      <div class="dd">
        <a class="dd-t" href="resources.html"{' aria-current="page"' if cur in ('faq', 'resources', 'updates', 'careers', 'collab', 'starting', 'owners') else ''}>Know more <svg class="i"><use href="#i-chev"/></svg></a>
        <button class="dd-btn" type="button" aria-expanded="false" aria-label="Show Know more links"><svg class="i"><use href="#i-chev"/></svg></button>
        <div class="menu">
          <a href="starting-a-business.html">Starting a business</a>
          <a href="business-owners.html">For business owners</a>
          <a href="faq.html">FAQs</a>
          <a href="resources.html">Resources</a>
          <a href="updates.html">Updates</a>
          <a href="careers.html">Careers</a>
          <a href="collab.html">Collab with us</a>
        </div>
      </div>
      <a class="btn btn-solid" href="contact.html">Book an appointment</a>
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
        <p class="mission">We work with companies, small businesses and entrepreneurs, from the day they register to the accounts, tax, audit and funding that come after.</p>
      </div>
      <div>
        <h4>Explore</h4>
        <ul><li><a href="services.html">Services</a></li><li><a href="services.html#industries">Industries we serve</a></li><li><a href="packages.html">Packages</a></li><li><a href="starting-a-business.html">Starting a business</a></li><li><a href="business-owners.html">For business owners</a></li><li><a href="about.html">About us</a></li><li><a href="faq.html">FAQs</a></li><li><a href="resources.html">Resources</a></li><li><a href="updates.html">Updates</a></li><li><a href="collab.html">Collab with us</a></li><li><a href="careers.html">Careers</a></li><li><a href="contact.html">Contact</a></li></ul>
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
        <p style="margin:0 0 .8rem">Accountants, tax consultants and freshers: come and work with us.</p>
        <ul>
          <li><a href="mailto:careers@ajassociatesonline.com?subject=Career%20Application%20-%20AJ%20Associates">careers@ajassociatesonline.com</a></li>
        </ul>
      </div>
    </div>
    <p class="ftr-mark" aria-hidden="true">AJ Associates</p>
    <div class="ftr-bot">
      <span>© <span id="yr">2026</span> AJ Associates. All rights reserved.</span>
      <span class="ftr-legal"><a href="privacy.html">Privacy policy</a> · <a href="terms.html">Terms &amp; Conditions</a></span>
      {firm_line}
      <span>Kochi, Kerala · Mon – Sat, 9 AM – 6 PM</span>
    </div>
    {beta_note}
  </div>
</footer>

<div class="chat" id="chat">
  <ul class="chat-menu" id="chat-menu" aria-label="Contact options">
    <li><a href="{WA_HELLO}" target="_blank" rel="noopener"><span class="ic wa"><svg class="i"><use href="#i-wa"/></svg></span><span>WhatsApp<small>Chat with our team</small></span></a></li>
    <li><a href="{CHAT_MAIL}"><span class="ic mail"><svg class="i"><use href="#i-mail"/></svg></span><span>Email<small>{INFO}</small></span></a></li>
    <li><a href="tel:{PHONE_TEL}"><span class="ic call"><svg class="i"><use href="#i-phone"/></svg></span><span>Call<small>{PHONE_SHOW}</small></span></a></li>
  </ul>
  <button class="chat-btn" id="chat-btn" type="button" aria-expanded="false" aria-controls="chat-menu" aria-label="Chat with us"><svg class="i i-c"><use href="#i-chat"/></svg><svg class="i i-x"><use href="#i-x"/></svg></button>
</div>

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

# only shown when javascript is off
NOSCRIPT = ('<noscript><p class="noscript">Some parts of this site, such as the menu on phones, the booking calendar and the tax estimate, need JavaScript. '
            'Please switch it on, or reach us by <a href="tel:+916282406091">phone</a>, <a href="mailto:' + INFO + '">email</a> or <a href="contact.html">the contact page</a>. '
            'You can also go to <a href="services.html">Services</a>, <a href="packages.html">Packages</a> or <a href="faq.html">FAQs</a>.</p></noscript>')

def clean_path(filename):
    """Public address for a file: no .html, and service pages go under /services/"""
    if filename == 'index.html':
        return '/'
    n = filename[:-5]
    if n.startswith('service-'):
        return '/services/' + n[len('service-'):]
    return PAGES_DIR + '/' + n


def cleanurls(html):
    """Rewrite internal links to the clean addresses (/about, /services/taxation, /faq#gst-registration)"""
    known = {'/' + f: clean_path(f) for f in PAGES}
    def fix(m):
        path, tail = m.group(1), m.group(2) or ''
        return f'href="{known[path]}{tail}"' if path in known else m.group(0)
    return re.sub(r'href="(/[^"#?]*\.html)([#?][^"]*)?"', fix, html)


def fix_heading_levels(html):
    """Don't skip heading levels (h1 straight to h3), screen readers rely on them.
    Only the announced level changes (aria-level), the look stays the same."""
    prev = [0]
    def f(m):
        n, attrs = int(m.group(1)), m.group(2)
        eff = min(n, prev[0] + 1) if prev[0] else n
        prev[0] = eff
        return m.group(0) if eff == n or 'aria-level' in attrs else f'<h{n}{attrs} aria-level="{eff}">'
    return re.sub(r'<h([1-6])([^>]*)>', f, html)


def out_file(filename):
    """Where a page gets written. Service pages go in services/ and the other pages in pages/, so the project folder stays tidy.
    Home, the 404 page and the error page stay at the top, where Netlify expects them. The public addresses (/about, /services/taxation) don't change."""
    if filename.startswith('service-'):
        return 'services/' + filename[len('service-'):]
    if filename in ('index.html', '404.html'):
        return filename
    return 'pages/' + filename


TAG_RE = re.compile(r'<(/?)(header|footer|noscript|section|details)\b([^>]*)>|<a\b[^>]*\bhref="contact\.html"[^>]*>', re.I)
SEC_NAMES = {'home': 'hero', 'contact': 'form'}


def sec_ctx(attrs):
    d = re.search(r'\bdata-from="([^"]+)"', attrs)
    if d:
        return d.group(1)
    m = re.search(r'\bid="([^"]+)"', attrs)
    if m:
        return SEC_NAMES.get(m.group(1), m.group(1))
    cls = re.search(r'\bclass="([^"]*)"', attrs)
    toks = cls.group(1).split() if cls else []
    if 'slide' in toks:
        return 'hero-card'
    if 'page-hero' in toks or 'hero' in toks:
        return 'hero'
    if 'cta-band' in toks:
        return 'closing-banner'
    lab = re.search(r'aria-label="([^"]+)"', attrs)
    if lab:
        return re.sub(r'[^a-z0-9]+', '-', lab.group(1).lower()).strip('-')
    for t in toks:
        if t not in ('sec', 'wrap', 'after-slant', 'on-dark', 'gd', 'gd-alt'):
            return t
    return 'page'


def tag_contact_links(html, key):
    """Add ?from=page~place to every contact link except the one in the nav.
    The contact page hides it again and posts it with the form, so each enquiry says where it came from."""
    out, pos, zone, sec, det = [], 0, None, 'page', None
    for m in TAG_RE.finditer(html):
        if m.group(2):
            closing, name, attrs = m.group(1), m.group(2).lower(), m.group(3)
            if closing:
                if name in ('header', 'footer', 'noscript'):
                    zone = None
                continue
            if name == 'noscript':
                zone = 'nav'                      # skip the noscript notice, same as the nav
            elif name == 'header':
                zone = 'nav'
            elif name == 'footer':
                zone = 'footer'
            elif name == 'section':
                sec, det = sec_ctx(attrs), None
            elif name == 'details':
                idm = re.search(r'\bid="([^"]+)"', attrs)
                if idm:
                    det = idm.group(1)
        else:
            if zone == 'nav':
                continue
            own = re.search(r'\bdata-from="([^"]+)"', m.group(0))
            ctx = own.group(1) if own else ('footer' if zone == 'footer' else (det or sec))
            out.append(html[pos:m.start()])
            out.append(m.group(0).replace('href="contact.html"', f'href="contact.html?from={key}~{ctx}"', 1))
            pos = m.end()
    out.append(html[pos:])
    return ''.join(out)


def page(filename, cur, title, desc, body, extra_head=''):
    canonical = SITE + clean_path(filename)
    html = (head(title, desc, extra_head + SPLASH_JS + page_ld(filename), canonical) + '<body>\n' + SPLASH + '\n' + NOSCRIPT + '\n<a class="skip" href="#main">Skip to content</a>\n\n'
            + SPRITE + '\n\n' + header(cur) + '\n<main id="main">\n\n' + body.strip() + '\n\n</main>\n\n' + footer())
    key = 'home' if filename == 'index.html' else filename[:-5].replace('service-', '', 1)
    html = tag_contact_links(html, key)
    html = fix_heading_levels(cleanurls(absolutize(html)))     # pages can sit at /services/taxation, so links and file paths have to start from the root
    dest = os.path.join(ROOT, out_file(filename))
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, 'w', encoding='utf-8') as f:
        f.write(html)
    print('  wrote', out_file(filename), f'({len(html)//1024} KB)')

# helpers
ANCHORS = {'#contact': 'contact.html', '#packages': 'packages.html', '#services': 'services.html',
           '#team': 'about.html#team', '#partnership': 'collab.html', '#reviews': 'index.html#reviews',
           '#ask': 'index.html#ask', '#commitments': 'about.html#commitments', '#home': 'index.html'}

def fix_links(html, filename):
    """Turn the in-page anchors in the partials into real page links"""
    for a, t in ANCHORS.items():
        target_file, _, frag = t.partition('#')
        new = ('#' + frag if frag else t) if target_file == filename else t
        if target_file == filename and not frag:
            new = filename
        html = html.replace(f'href="{a}"', f'href="{new}"')
    return html

def h1ize(html):
    """First <h2> becomes the <h1> (looks the same), so every page has exactly one h1"""
    return re.sub(r'<h2([^>]*)>(.*?)</h2>', lambda m: f'<h1 class="h2"{m.group(1)}>{m.group(2)}</h1>', html, count=1, flags=re.S)

def opt_in(html, old_open, new_open):
    assert old_open in html, old_open
    return html.replace(old_open, new_open, 1)

CTA_HEAD = 'Tell us what you need, <em>and we’ll sort it out.</em>'

CTA = f'''<section class="network on-dark cta-band" aria-labelledby="cta-h">
  <div class="wrap cta-in">
    <div class="rv">
      <h2 id="cta-h">{CTA_HEAD}</h2>
    </div>
    <div class="cta-row rv">
      <a class="btn btn-brass" href="contact.html">Book an appointment {ARROW}</a>
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

# pages
IND_STRIP = f'''<div class="wrap ind-line" aria-labelledby="is-h">
    <div class="ind-line-in">
      <div class="rv">
        <h2 id="is-h">We work with <em>businesses of every kind.</em></h2>
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
    # each panel gets an Explore link to its own page
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
    body = '\n\n'.join([hero, part('band'), part('route'), part('ask'), services, approach, part('reviews'), CTA])
    page('index.html', 'home', 'AJ Associates | Tax, Audit &amp; Management Consultancy in Kochi, Kerala',
         'Tax, audit and management consultancy in Kochi, Kerala: GST, income tax, accounting, company formation, bank loan proposals and compliance.',
         fix_links(body, 'index.html'))

SVC_ART = {
    'service-taxation.html': '<path d="M100 40h90l30 30v130H100zM190 40v30h30M120 104h80M120 128h80M120 152h50"/><g class="ac"><circle cx="238" cy="172" r="11"/><circle cx="272" cy="204" r="11"/><path d="M276 160l-46 54"/></g>',
    'service-company-formation.html': '<path d="M20 200h280M70 200V80h100v120M90 104h20M130 104h20M90 136h20M130 136h20M112 200v-30h16v30"/><g class="ac"><path d="M196 120h92v64h-92zM210 140h46M210 156h32"/><circle cx="268" cy="162" r="9"/></g>',
    'service-financial-management.html': '<path d="M60 40v160h210M96 200v-50h28v50M146 200v-90h28v90M196 200v-130h28v130"/><path class="ac" d="M80 122l55-36 50 18 66-56M236 48h18v18"/>',
    'service-corporate-secretarial.html': '<path d="M70 200v-30h170v30zM88 170v-30h134v30zM106 140v-30h98v30zM90 185h20M108 155h20M126 125h20"/><g class="ac"><circle cx="262" cy="84" r="22"/><path d="M251 84l8 8 14-16"/></g>',
    'service-lending-capital.html': '<path d="M60 104l100-56 100 56zM90 116v68M134 116v68M186 116v68M230 116v68M70 184h180M56 204h208"/><circle class="ac" cx="160" cy="86" r="14"/>',
    'service-business-strategy.html': '<circle cx="160" cy="120" r="78"/><path d="M160 30v14M160 196v14M70 120h14M236 120h14"/><path class="ac" d="M160 66l22 54-22 54-22-54z"/><path d="M138 120h44"/>',
    'service-staffing-support.html': '<path d="M100 70h120v140H100zM142 86h36"/><circle cx="160" cy="130" r="20"/><path d="M122 192c0-26 76-26 76 0"/><path class="ac" d="M132 70l-18-42M188 70l18-42"/>',
    'service-ca-certification.html': '<path d="M96 40h96l32 32v128H96z"/><path d="M192 40v32h32"/><path d="M116 96h72M116 120h72M116 144h44"/><circle class="ac" cx="196" cy="172" r="20"/><path class="ac" d="M185 188l-7 28 18-9 18 9-7-28"/>',
}


QUIZ = '''<section class="sec structure" id="structure-quiz" aria-labelledby="sq-h">
  <div class="wrap sq-grid">
    <div class="rv">
      <p class="eyebrow">Choosing a structure</p>
      <h2 id="sq-h">Not sure which <em>structure suits you?</em></h2>
      <p>The right structure depends on a few things about you and your plans. Our team confirms it with you before anything is filed.</p>
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
    body = page_hero(['<a href="index.html">Home</a>', 'Services'], 'Most things your business needs, <em>handled by one team.</em>',
                     'Accounting, tax, company law, audit and loans. You can get all of it from us, whether you are just starting out or have been in business for years.',
                     f'<div class="cta-row"><a class="btn btn-brass" href="contact.html">Book an appointment {ARROW}</a><a class="btn btn-ghost" href="packages.html">Find your package</a></div>')
    body += '\n\n' + svc_index_section() + '\n\n' + part('industries') + '\n\n' + CTA
    page('services.html', 'services', 'Services | AJ Associates — Tax, Audit, Company Law &amp; Advisory, Kochi',
         'Taxation, company formation, audit, corporate secretarial, bank loan proposals, strategy, CA certificates and staffing for every industry, in Kochi, Kerala.',
         body)

def build_service_pages():
    for i, s in enumerate(SERVICES):
        points = ''.join(f'<li class="rv"><span class="k">{n+1:02d}</span><div><h3>{b}</h3><p>{t}</p></div></li>' for n, (b, t) in enumerate(s['items']))
        cur_attr = ' aria-current="page"'
        others = ''.join('<li><a href="' + o['file'] + '"' + (cur_attr if o is s else '') + '>' + o['title'] + '</a></li>' for o in SERVICES)
        ex = SVC_EXTRA.get(s['file'])
        extra = ''      # the guide is further down this page, no need to link it
        hero = page_hero(['<a href="index.html">Home</a>', '<a href="services.html">Services</a>', s['title']], s['title'], s['lead'],
                         f'<div class="cta-row"><a class="btn btn-brass" href="{s["wa"]}" target="_blank" rel="noopener">Enquire about this {ARROW}</a><a class="btn btn-ghost" href="contact.html">Book an appointment</a></div>')
        main = f'''<section class="sec after-slant" aria-label="What is included">
  <div class="wrap svc-page-grid">
    <div>
      <p class="eyebrow rv">What’s included</p>
      <ol class="svc-points" style="margin-top:2rem">{points}</ol>
      <div class="svc-links rv">
        {extra}
        <a class="tlink" href="packages.html">Wondering about the cost? See packages {ARROW}</a>
      </div>
    </div>
    <aside class="svc-other rv" aria-label="Other services">
      <h3>Other services</h3>
      <ul>{others}</ul>
      <a class="tlink side-ind" href="services.html#industries">Industries we serve {ARROW}</a>
    </aside>
  </div>
</section>'''
        page(s['file'], 'services', f'{s["title"]} | AJ Associates, Kochi', s['lead'].replace('&amp;', '&'), hero + '\n\n' + main + '\n\n' + (QUIZ + '\n\n' if s['file'] == 'service-company-formation.html' else '') + CTA)

def build_packages():
    body = h1ize(fix_links(part('packages'), 'packages.html'))
    body += '\n\n' + part('packages_more')
    page('packages.html', 'packages', 'Packages | AJ Associates — find the right plan for your business',
         'Choose your business type and turnover to see the tax, accounts and compliance work we would usually recommend. We agree the final work and the fee with you.', body)

ABOUT_IND = '''<section class="sec about-ind" aria-label="Industries we serve">
  <div class="wrap">
    <p class="ind-note rv">We serve every sector, from first-generation start-ups to established family enterprises. <a href="services.html#industries">See the industries we serve</a></p>
  </div>
</section>'''

def build_about():
    team = opt_in(part('team'), '<section class="sec team" id="team">', '<section class="sec team fit-me" id="team">')
    body = h1ize(fix_links(team, 'about.html')) + '\n\n' + fix_links(part('principles'), 'about.html') + '\n\n' + ABOUT_IND + '\n\n' + CTA
    page('about.html', 'about', 'About Us | AJ Associates — leadership and commitments',
         'Meet the team behind AJ Associates, and the three things we hold ourselves to: getting the details right, being easy to talk to, and telling you early.', body)

def build_collab():
    net = opt_in(part('network'), '<section class="network on-dark" id="partnership">', '<section class="network on-dark flat fit-me" id="partnership">')
    page('collab.html', 'collab', 'Collab with us | AJ Associates — referrals and collaborations',
         'Banks, fintech platforms, legal practitioners and corporate advisors: propose a referral or joint advisory arrangement with AJ Associates.',
         h1ize(fix_links(net, 'collab.html')))

def legal_body(html):
    """Give each legal heading an id and add an "On this page" list under the date"""
    heads = []
    def sub(m):
        own, title = m.group(1), m.group(2)             # some headings already have an id, keep it
        slug = own or re.sub(r'[^a-z0-9]+', '-', re.sub(r'<[^>]+>', '', title).lower()).strip('-')
        heads.append((slug, title))
        return f'<h2 id="{slug}">{title}</h2>'
    html = re.sub(r'<h2(?: id="([^"]+)")?>(.*?)</h2>', sub, html)
    toc = '<nav class="legal-toc" aria-label="On this page"><p>On this page</p><ol>' + ''.join(f'<li><a href="#{s}">{t}</a></li>' for s, t in heads) + '</ol></nav>'
    return re.sub(r'(<p class="upd">.*?</p>)', lambda m: m.group(1) + '\n    ' + toc, html, count=1)

def build_legal():
    crumbs = lambda t: ['<a href="index.html">Home</a>', t]
    page('privacy.html', 'legal', 'Privacy policy | AJ Associates',
         'How AJ Associates collects, uses and protects the personal information you share through this website.',
         page_hero(crumbs('Privacy policy'), 'Privacy <em>policy.</em>', 'How we collect, use and protect your personal information, and the rights available to you.') + '\n\n' + legal_body(part('privacy')))
    page('terms.html', 'legal', 'Terms and Conditions | AJ Associates',
         'The terms and conditions for using the AJ Associates website, including a disclaimer about the general information it contains.',
         page_hero(crumbs('Terms &amp; Conditions'), 'Terms &amp; <em>Conditions.</em>', 'The terms that govern use of this website, and the limits of the information on it.') + '\n\n' + legal_body(part('terms')))

# dated notes for the Updates page, newest first. Add new ones at the top.
IT_SRC = ('Income Tax Department e-filing portal', 'https://www.incometax.gov.in/iec/foportal/')
MCA_SRC = ('Ministry of Corporate Affairs', 'https://www.mca.gov.in/')
GST_SRC = ('GST Council', 'https://www.gstcouncil.gov.in/')
UPDATES = [
    {'date': '2026-09-29', 'tag': 'Income tax', 'src': IT_SRC,
     'title': 'Audit cases: tax audit report now due 21 October, and the return 21 November',
     'body': ['The CBDT has given more time to taxpayers whose accounts must be audited, for assessment year 2026-27. The tax audit report can now be filed by 21 October 2026 instead of 30 September. The income tax return for these cases is now due on 21 November 2026 instead of 31 October.',
              'This covers companies, other taxpayers whose accounts require an audit, and working partners of audited firms. Returns for other taxpayers keep their usual dates.']},
    {'date': '2026-10-02', 'tag': 'Income tax', 'src': IT_SRC,
     'title': 'One payment module for the old and new Income-tax Acts, and TDS corrections reopen',
     'body': ['The e-filing portal now has a single payment module for tax payable under the Income-tax Act, 1961 and the Income-tax Act, 2025. Correction statements for TDS and TCS returns can also be filed for tax year 2026-27.',
              'If you have a TDS return with errors, correcting it early avoids mismatches in your Form 26AS and your deductees’ returns.']},
    {'date': '2026-09-07', 'tag': 'GST', 'src': GST_SRC,
     'title': 'GST Council meeting moved to 7 October 2026',
     'body': ['The 57th GST Council meeting, planned for 12 September, has been rescheduled to 7 October 2026 in New Delhi, with the officers’ meeting on 5 and 6 October. Reports say the agenda includes simpler GST registration and more automated cancellation of registrations.',
              'Nothing the Council recommends takes effect until it is notified, so please wait for the notification before changing anything. We will note any change that affects you.']},
    {'date': '2026-08-31', 'tag': 'Companies', 'src': MCA_SRC,
     'title': 'The company filing amnesty (CCFS-2026) closed on 15 September',
     'body': ['The Companies Compliance Facilitation Scheme 2026 let companies regularise delayed annual filings, such as MGT-7 and AOC-4, with reduced additional fees. The Ministry extended its last date to 15 September 2026 by General Circular 04/2026.',
              'The window has now closed. If your company has annual filings pending, please file them without further delay, because the usual additional fees apply to late filings. We can check what is outstanding.']},
    {'date': '2026-08-16', 'tag': 'Income tax', 'src': IT_SRC,
     'title': 'Disclosure scheme for small taxpayers with foreign assets, open until 31 December',
     'body': ['The Foreign Assets of Small Taxpayers Disclosure Scheme, 2026 is a one-time chance to declare foreign assets or income that were not reported earlier. It opened on 16 August 2026, the declaration is made in Form 1 on the e-filing portal, and the last date is 31 December 2026.',
              'It has two routes, depending on the value of the assets and how they were acquired, each with its own payment. Whether it suits you depends on your facts, so please speak to us before you file.']},
    {'date': '2026-10-02', 'tag': 'Income tax',
     'title': 'Advance tax: the next instalment is due on 15 December',
     'body': ['If your tax for the year is expected to be more than ₹10,000 after TDS, you generally need to pay it in instalments during the year rather than all at the end. By 15 December, the total paid should come to 75% of your estimated tax for the year.',
              'Paying short attracts interest, so it is worth making an estimate now, while there is still time to adjust. We can help you work it out.']},
    {'date': '2026-10-02', 'tag': 'GST and TDS',
     'title': 'The monthly dates to keep in your diary',
     'body': ['For regular monthly GST filers, GSTR-1 is due on the 11th and GSTR-3B on the 20th of the following month. TDS deducted in a month is generally deposited by the 7th of the next month.',
              'Dates differ for quarterly filers and for some categories, and they can be extended by notification, so please check the current position before you rely on them.']},
    {'date': '2026-10-02', 'tag': 'GST',
     'title': 'Match your purchases before you file GSTR-3B',
     'body': ['Input tax credit can be claimed only on invoices that appear in your GSTR-2B. Before filing, compare it with your purchase records and follow up with suppliers whose invoices are missing.',
              'A few minutes of checking each month avoids mismatches, notices and credit that has to be reversed later.']},
    {'date': '2026-10-02', 'tag': 'Notices',
     'title': 'Received a tax notice? Read it, note the date, and ask for help early',
     'body': ['Every notice has a reply date, and the portal shows it. Do not ignore a notice, even one that looks routine, because unanswered notices can lead to orders being passed against you.',
              'Send us a copy as soon as it arrives. We will explain what it asks for and the time you have to respond.']},
]


def src_line(u):
    if not u.get('src'):
        return ''
    n, url = u['src']
    return f'<p class="upd-src">Source: <a href="{url}" target="_blank" rel="noopener">{n}</a></p>'


def build_updates():
    def fmt(d):
        y, m, dd = d.split('-')
        return f'{dd}-{m}-{y}'
    items = ''.join(
        f'''<article class="upd-item rv">
        <div class="upd-meta"><span class="upd-tag">{u['tag']}</span><time datetime="{u['date']}">{fmt(u['date'])}</time></div>
        <div class="upd-main"><h2>{u['title']}</h2>{''.join('<p>' + t + '</p>' for t in u['body'])}{src_line(u)}</div>
      </article>''' for u in UPDATES)
    body = f'''<section class="sec after-slant" aria-label="Updates">
  <div class="wrap upd-wrap">
    <p class="upd-note">General information, drawn from official announcements and checked on 2 October 2026. It is not advice on your own circumstances. Please read our <a href="terms.html">Terms &amp; Conditions</a>.</p>
    {items}
  </div>
</section>'''
    hero = page_hero(['<a href="index.html">Home</a>', 'Updates'], 'Short notes, <em>kept current.</em>',
                     'Deadlines and changes worth knowing about, each one dated.')
    cta = (CTA.replace(CTA_HEAD, 'We’ll take it <em>from here.</em>'))
    page('updates.html', 'resources', 'Updates | AJ Associates — deadlines and changes worth knowing',
         'Short, dated notes from AJ Associates on tax and GST deadlines and changes that matter to individuals and businesses in Kerala.',
         hero + '\n\n' + body + '\n\n' + cta)


# downloadable checklists (PDF)
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from checklists import GROUPS, ALL as CHECKLISTS


def chk_pdf(c):
    return f"AJ-Associates-{c['slug']}-checklist.pdf"


def checklists_section():
    """The "Gather these first" cards, built from checklists.py"""
    jump = ' '.join(f'<a href="#chk-{g["id"]}">{g["title"]}</a>' for g in GROUPS)
    groups = ''
    for g in GROUPS:
        cards = ''
        for c in g['lists']:
            lis = ''.join(f'<li><label><input type="checkbox"><span class="box" aria-hidden="true"></span><span class="lbl">{t}</span></label></li>' for t in c['items'])
            note = f'\n        <p class="chk-note">{c["note"]}</p>' if c.get('note') else ''
            cards += f'''
      <article class="chk-card rv" id="{c['slug']}">
        <span class="stamp">{c['tag']}</span>
        <h4>{c['title']}</h4>{note}
        <ul>{lis}</ul>
        <p class="chk-prog" aria-live="polite"><span class="bar"><i></i></span><span class="cnt">0 of {len(c['items'])} ready</span></p>
        <a class="tlink chk-dl" href="downloads/{chk_pdf(c)}" download>Download as PDF {ARROW}</a>
      </article>'''
        groups += f'''
    <div class="chk-group" id="chk-{g['id']}">
      <h3 class="chk-gh">{g['title']}</h3>
      <div class="chk-grid">{cards}
      </div>
    </div>'''
    return f'''<section class="sec res-chk" id="checklists" aria-labelledby="chk-h">
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow">Checklists</p>
      <h2 id="chk-h">Gather these <em>first.</em></h2>
      <p>The documents we usually ask for, so you can get ready before the first call. We confirm the exact list for your case.</p>
    </div>
    <nav class="chk-jump" aria-label="Checklist groups"><div class="chk-jump-in">{jump}</div></nav>
    <div class="chk-all">{groups}
    </div>
  </div>
</section>'''


def build_checklist_pdfs():
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas
        from reportlab.lib.utils import simpleSplit
    except ImportError:
        print('  (reportlab not installed: checklist PDFs left as they are)')
        return
    mm = 2.835
    out = os.path.join(ROOT, 'downloads')
    os.makedirs(out, exist_ok=True)
    keep = {chk_pdf(c) for c in CHECKLISTS}
    for f in os.listdir(out):
        if f.endswith('.pdf') and f not in keep:
            os.remove(os.path.join(out, f))          # checklist was removed, so drop its pdf
    clean = lambda t: html_lib.unescape(re.sub(r'<[^>]+>', '', t)).replace('\u2011', '-').replace('\u2019', "'").replace('\u2013', '-').replace('\u2014', '-')
    W, H = A4
    for c in CHECKLISTS:
        title = clean(c['title'])
        cv = canvas.Canvas(os.path.join(out, chk_pdf(c)), pagesize=A4)
        cv.setTitle(title + ' - checklist | AJ Associates')
        cv.setAuthor('AJ Associates')

        def footer_():
            cv.setStrokeColorRGB(.85, .82, .76)
            cv.setLineWidth(.6)
            cv.line(20 * mm, 34 * mm, W - 20 * mm, 34 * mm)
            cv.setFillColorRGB(.25, .29, .36)
            cv.setFont('Helvetica', 9)
            cv.drawString(20 * mm, 28 * mm, f'{INFO}   |   {PHONE_SHOW}   |   ajassociatesonline.com')
            cv.drawString(20 * mm, 22.5 * mm, 'General information only; not advice on your own circumstances. Prepared 2 October 2026.')

        cv.setFillColorRGB(.051, .169, .322)
        cv.rect(0, H - 34 * mm, W, 34 * mm, stroke=0, fill=1)
        cv.setFillColorRGB(1, 1, 1)
        cv.setFont('Helvetica-Bold', 17)
        cv.drawString(20 * mm, H - 17 * mm, 'AJ ASSOCIATES')
        cv.setFont('Helvetica', 9)
        cv.drawString(20 * mm, H - 24 * mm, 'Tax & Management Consultancy, Kochi, Kerala')
        y = H - 54 * mm
        cv.setFillColorRGB(.706, .533, .29)
        cv.setFont('Helvetica-Bold', 9)
        cv.drawString(20 * mm, y, 'DOCUMENT CHECKLIST')
        y -= 9 * mm
        cv.setFillColorRGB(.043, .082, .149)
        cv.setFont('Helvetica-Bold', 20)
        for ln in simpleSplit(title, 'Helvetica-Bold', 20, W - 40 * mm):
            cv.drawString(20 * mm, y, ln)
            y -= 8.5 * mm
        y -= 4 * mm
        cv.setFont('Helvetica', 10.5)
        cv.setFillColorRGB(.25, .29, .36)
        intro = 'The documents we usually ask for. We confirm the exact list for your case.'
        if c.get('note'):
            intro = clean(c['note']) + ' ' + intro
        for ln in simpleSplit(intro, 'Helvetica', 10.5, W - 40 * mm):
            cv.drawString(20 * mm, y, ln)
            y -= 5.4 * mm
        y -= 6 * mm
        for it in c['items']:
            lines = simpleSplit(clean(it), 'Helvetica', 12, W - 52 * mm)
            if y - len(lines) * 5.8 * mm < 40 * mm:       # no room left, finish this page and start a new one
                footer_()
                cv.showPage()
                y = H - 25 * mm
            cv.setStrokeColorRGB(.051, .169, .322)
            cv.setLineWidth(1.2)
            cv.rect(20 * mm, y - 1.2 * mm, 4.6 * mm, 4.6 * mm, stroke=1, fill=0)
            cv.setFillColorRGB(.043, .082, .149)
            cv.setFont('Helvetica', 12)
            for ln in lines:
                cv.drawString(29 * mm, y, ln)
                y -= 5.8 * mm
            y -= 3.6 * mm
        footer_()
        cv.showPage()
        cv.save()
        print('  wrote downloads/' + chk_pdf(c))

def guide_cta(heading, wa_text, label):
    return CTA.replace(CTA_HEAD, heading).replace(
        'href="' + WA_HELLO + '"', 'href="https://wa.me/' + WA + '?text=' + wa_text + '"').replace('Chat on WhatsApp', label)


def build_starting():
    hero = page_hero(['<a href="index.html">Home</a>', 'Starting a business'], 'Starting a business? <em>Start it properly.</em>',
                     'You don’t need to know what GST, income tax or bookkeeping involve before you talk to us. Here is the path most new businesses follow, and where we help.',
                     f'<div class="cta-row"><a class="btn btn-brass" href="contact.html">Book an appointment {ARROW}</a><a class="btn btn-ghost" href="packages.html">Find your package</a></div>')
    cta = guide_cta('Set it up <em>properly from day one.</em>', 'Hello%2C%20I%20am%20starting%20a%20business%20and%20need%20guidance.', 'Ask on WhatsApp')
    page('starting-a-business.html', 'starting', 'Starting a business in Kerala | AJ Associates, Kochi',
         'A step-by-step path for new businesses in Kerala: structure, registration, bank account, GST, invoices and returns, with help at every step.',
         hero + '\n\n' + part('starting') + '\n\n' + cta)


def build_owners():
    hero = page_hero(['<a href="index.html">Home</a>', 'For business owners'], 'For business owners. <em>Support all year, not just filings.</em>',
                     'Accounting, tax and compliance handled through the year: books kept up to date, returns filed on time and notices dealt with when they come.',
                     f'<div class="cta-row"><a class="btn btn-brass" href="contact.html">Book an appointment {ARROW}</a><a class="btn btn-ghost" href="packages.html">Find your package</a></div>')
    cta = guide_cta('Let’s look at <em>your business together.</em>', 'Hello%2C%20I%20run%20a%20business%20and%20would%20like%20to%20discuss%20ongoing%20support.', 'Chat on WhatsApp')
    page('business-owners.html', 'owners', 'For business owners | AJ Associates, Kochi',
         'Ongoing accounting, GST, tax and compliance for established businesses in Kerala, whether or not you already have an accountant.',
         hero + '\n\n' + part('owners') + '\n\n' + cta)


def build_careers():
    hero = page_hero(['<a href="index.html">Home</a>', 'Careers'], 'Build your practice <em>with us.</em>',
                     'We are looking for accountants, tax consultants and freshers who want to learn and grow in a working practice.')
    roles = '''<div class="roles">
      <div class="role rv"><h3>Accountants</h3><p>Bookkeeping, bank reconciliations, filings and help with audits, for many different kinds of clients.</p></div>
      <div class="role rv"><h3>Tax consultants</h3><p>Income tax, GST and TDS work, replying to notices, and appearing before the authorities with the team.</p></div>
      <div class="role rv"><h3>Freshers</h3><p>Learn the work by doing it: filings, audits and company law, with the team beside you.</p></div>
    </div>'''
    body = hero + f'''

<section class="sec after-slant" aria-label="Careers">
  <div class="wrap">
    <div class="sec-head rv">
      <p class="eyebrow">Who we look for</p>
      <h2>Roles we <em>hire for.</em></h2>
      <p>These are the kinds of people we take on at our Kochi office.</p>
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

'''
    page('careers.html', 'careers', 'Careers | AJ Associates — accountants, tax consultants and freshers',
         'Join AJ Associates in Kochi: opportunities for accountants, tax consultants and freshers.', body)

def build_faq():
    hero = page_hero(['<a href="index.html">Home</a>', 'FAQs'], 'Questions, <em>answered.</em>',
                     'Straight answers to what clients ask us most about tax, GST, companies and accounts. Can’t find yours? We’ll answer it personally.')
    cta = (CTA.replace(CTA_HEAD, 'We’ll answer it <em>personally.</em>'))
    page('faq.html', 'faq', 'FAQs | AJ Associates — tax, GST, company and accounts answers',
         'Answers to common questions about income tax returns, GST, notices, company formation, audit and working with AJ Associates in Kochi.',
         hero + '\n\n' + part('faq') + '\n\n' + cta)

def build_resources():
    hero = page_hero(['<a href="index.html">Home</a>', 'Resources'], 'Practical guides, <em>clearly explained.</em>',
                     'Deadlines, checklists and short notes on the questions we hear most. Free to use, and always dated.')
    cta = (CTA.replace(CTA_HEAD, 'We’ll take it <em>from here.</em>'))
    page('resources.html', 'resources', 'Resources | AJ Associates — deadlines, checklists and tax notes',
         'A live deadline calendar, document checklists and short, clearly explained notes on income tax, GST and compliance from AJ Associates, Kochi.',
         hero + '\n\n' + part('resources').replace('<!--CHECKLISTS-->', checklists_section()) + '\n\n' + cta)

def build_contact():
    body = h1ize(fix_links(opt_in(part('contact'), '<section class="sec contact" id="contact">', '<section class="sec contact fit-me" id="contact">'), 'contact.html'))
    import json
    body = body.replace('<!--HOLIDAYS-->', '<script type="application/json" id="holidays">' + json.dumps(HOLIDAYS, ensure_ascii=False) + '</script>')
    page('contact.html', 'contact', 'Contact & Book an Appointment | AJ Associates, Kochi',
         'Book an appointment with AJ Associates. Visit our office in Chullickal, Kochi, call +91 81368 85152 or message us on WhatsApp.', body)

def absolutize(html):
    """The 404 and error pages show up at any missing URL (like /a/b/c), so relative links would break.
    Make every relative href/src start from the root."""
    return re.sub(r'(href|src)="(?!https?:|mailto:|tel:|#|/|data:|javascript:)([^"]+)"', r'\1="/\2"', html)

def special_page(filename, title, desc, body):
    html = (head(title, desc, '', None, 'noindex, nofollow') + '<body>\n\n' + SPRITE + '\n\n' + header(None)
            + '\n<main id="main">\n\n' + body.strip() + '\n\n</main>\n\n' + footer())
    html = fix_heading_levels(cleanurls(absolutize(html)))
    dest = os.path.join(ROOT, out_file(filename))
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    with open(dest, 'w', encoding='utf-8') as f:
        f.write(html)
    print('  wrote', out_file(filename), f'({len(html)//1024} KB)')

def build_error_pages():
    nf = f'''<section class="notfound" aria-labelledby="nf-h">
  <div class="wrap">
    <p class="nf-n" aria-hidden="true">404</p>
    <p class="eyebrow">Page not found</p>
    <h1 class="h2" id="nf-h">This page has moved, or <em>never existed.</em></h1>
    <p class="lead">Sorry, we couldn’t find that page. You can go back home, look at our services, or talk to us.</p>
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
    <p class="lead">Something went wrong on our side. Please refresh the page. If it keeps happening, message us on WhatsApp.</p>
    <div class="cta-row">
      <button class="btn btn-solid" type="button" data-reload>Try again {ARROW}</button>
      <a class="btn btn-ghost" href="index.html">Back to home</a>
      <a class="btn btn-ghost" href="{WA_HELLO}" target="_blank" rel="noopener"><svg class="i"><use href="#i-wa"/></svg> Chat on WhatsApp</a>
    </div>
  </div>
</section>'''
    special_page('404.html', 'Page not found | AJ Associates', 'The page you were looking for could not be found.', nf)
    special_page('error.html', 'Something went wrong | AJ Associates', 'Something went wrong while loading this page. Please try again.', er)

PAGES = ['index.html', 'services.html'] + [s['file'] for s in SERVICES] + ['packages.html', 'about.html', 'collab.html', 'careers.html', 'contact.html', 'faq.html', 'resources.html', 'updates.html', 'starting-a-business.html', 'business-owners.html', 'privacy.html', 'terms.html']

def write_deploy_files():
    def w(name, text):
        os.makedirs(os.path.dirname(os.path.join(ROOT, name)) or ROOT, exist_ok=True)
        with open(os.path.join(ROOT, name), 'w', encoding='utf-8', newline='\n') as f:
            f.write(text)
        print('  wrote', name)
    # hash every inline script so the csp can stay strict
    import hashlib, base64, glob
    hashes = set()
    for fn in glob.glob(os.path.join(ROOT, '*.html')) + glob.glob(os.path.join(ROOT, 'services', '*.html')) + glob.glob(os.path.join(ROOT, 'pages', '*.html')):
        for code in re.findall(r'<script>(.*?)</script>', open(fn, encoding='utf-8').read(), flags=re.S):
            hashes.add("'sha256-" + base64.b64encode(hashlib.sha256(code.encode('utf-8')).digest()).decode() + "'")
    csp = ("default-src 'self'; script-src 'self' " + ' '.join(sorted(hashes)) + "; style-src 'self' 'unsafe-inline'; "
           "img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-src https://www.google.com https://maps.google.com; "
           "form-action 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'")
    w('.well-known/security.txt', f'Contact: mailto:{INFO}\nExpires: 2027-09-30T18:29:00.000Z\nPreferred-Languages: en\nCanonical: {SITE}/.well-known/security.txt\n')
    w('assets/icons/site.webmanifest', '{\n  "name": "AJ Associates",\n  "short_name": "AJ Associates",\n  "description": "Tax, audit and management consultancy in Kochi, Kerala",\n'
      '  "start_url": "/",\n  "display": "browser",\n  "theme_color": "#f7f6f2",\n  "background_color": "#f7f6f2",\n'
      '  "icons": [\n    {"src": "/assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png"},\n'
      '    {"src": "/assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"}\n  ]\n}\n')
    urls = ''.join(f'  <url><loc>{SITE}{clean_path(p)}</loc></url>\n' for p in PAGES)
    w('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + '</urlset>\n')
    w('robots.txt', f'User-agent: *\nAllow: /\nDisallow: /tools/\n\nSitemap: {SITE}/sitemap.xml\n')
    clean = ''.join(f'{clean_path(p):<40} /pages/{p:<34} 200\n' for p in PAGES if p != 'index.html' and not p.startswith('service-'))
    slash = ''.join(f'{clean_path(p)}/ {clean_path(p)} 301!\n' for p in PAGES if p != 'index.html')
    # old .html and old service addresses go to the clean ones
    slash += ''.join(f'/{p} {clean_path(p)} 301!\n' for p in PAGES if p != 'index.html')
    slash += ''.join(f'/{p[:-5]} {clean_path(p)} 301!\n{clean_path(p)}.html {clean_path(p)} 301!\n' for p in PAGES if p.startswith('service-'))
    # the files themselves live in /pages/, but only the clean address is public
    slash += ''.join(f'/pages/{p} {clean_path(p)} 301!\n' for p in PAGES if p != 'index.html' and not p.startswith('service-'))
    w('_redirects', f"""# one address only: ajassociatesonline.com
# (also make it the primary domain in Netlify, so the netlify.app address redirects here too)
http://www.ajassociatesonline.com/*   {SITE}/:splat   301!
https://www.ajassociatesonline.com/*  {SITE}/:splat   301!
http://ajassociatesonline.com/*       {SITE}/:splat   301!

# the accessibility page was folded into the terms
/accessibility       /terms   301!
/accessibility.html  /terms   301!
/accessibility/      /terms   301!

# home is just the domain, never /index.html
/index.html   /   301!

# the error page file sits in /pages/, and the old addresses of the icons and the manifest still work
/error               /pages/error.html   200
/error.html          /error              301!
/pages/error.html    /error              301!
/favicon-32.png      /assets/icons/favicon-32.png     301!
/icon-192.png        /assets/icons/icon-192.png       301!
/icon-512.png        /assets/icons/icon-512.png       301!
/site.webmanifest    /assets/icons/site.webmanifest   301!

# drop the trailing slash (/about/ to /about) so css and images still load
{slash}
# clean addresses work when typed or shared, and the address bar stays as typed
{clean}
# keep source folders and config private
/tools/*        /404.html   404!
/_legacy/*      /404.html   404!
/netlify.toml   /404.html   404!
/.gitignore     /404.html   404!
/_redirects     /404.html   404!

# anything else that doesn't exist falls through to /404.html
""")
    w('netlify.toml', f"""# Netlify settings. Static site, nothing to build.
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
    for fn in os.listdir(ROOT):                      # pages left at the top level by an older build
        if fn.endswith('.html') and fn not in ('index.html', '404.html'):
            os.remove(os.path.join(ROOT, fn))
    build_home(); build_services_index(); build_service_pages(); build_packages()
    build_about(); build_collab(); build_careers(); build_contact(); build_legal(); build_faq(); build_resources(); build_updates(); build_starting(); build_owners(); build_checklist_pdfs()
    build_error_pages(); write_deploy_files()
    print('Done.')
