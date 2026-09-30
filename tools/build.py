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
V = '16'   # bump to force browsers to re-download css/js after a change

def part(name):
    with open(os.path.join(PART, name + '.html'), encoding='utf-8') as f:
        return f.read()

SITE = 'https://ajassociatesonline.com'   # the ONE address the site lives at
WA = '916282406091'
INFO = 'info@ajassociatesonline.com'
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
{"@context":"https://schema.org","@type":"ProfessionalService","name":"AJ Associates","description":"Tax, audit and management consultancy","url":"https://ajassociatesonline.com","email":"info@ajassociatesonline.com","telephone":"+918136885152","address":{"@type":"PostalAddress","streetAddress":"Second Floor, 10/1329 G, Bivera, Chullickal Road","addressLocality":"Kochi","addressRegion":"Kerala","postalCode":"682006","addressCountry":"IN"},"openingHours":"Mo-Sa 09:30-18:30","aggregateRating":{"@type":"AggregateRating","ratingValue":"4.9","bestRating":"5"}}
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
{canon}{rb}<link rel="icon" href="assets/mark-dark.webp" type="image/webp">
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
      <span><b>AJ ASSOCIATES</b><small>Tax &amp; Management Consultancy</small></span>
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
      <a href="collab.html"{cp('collab')}>Collab with us</a>
      <a href="careers.html"{cp('careers')}>Careers</a>
      <a class="btn btn-solid" href="contact.html">Book a consultation</a>
    </nav>
  </div>
</header>
'''

def footer():
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
        <ul><li><a href="services.html">Services</a></li><li><a href="packages.html">Packages</a></li><li><a href="about.html">About us</a></li><li><a href="collab.html">Collab with us</a></li><li><a href="careers.html">Careers</a></li><li><a href="contact.html">Contact</a></li></ul>
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
        <p style="margin:0 0 .8rem">Accountants, tax consultants and article trainees — build your practice with us.</p>
        <ul>
          <li><a href="mailto:careers@ajassociatesonline.com?subject=Career%20Application%20-%20AJ%20Associates">careers@ajassociatesonline.com</a></li>
        </ul>
      </div>
    </div>
    <p class="ftr-mark" aria-hidden="true">AJ Associates</p>
    <div class="ftr-bot">
      <span>© <span id="yr">2026</span> AJ Associates. All rights reserved.</span>
      <span>Kochi, Kerala · Mon – Sat, 9:30 AM – 6:30 PM</span>
    </div>
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

def page(filename, cur, title, desc, body, extra_head=''):
    canonical = SITE + '/' if filename == 'index.html' else SITE + '/' + filename
    html = (head(title, desc, extra_head, canonical) + '<body>\n<a class="skip" href="#main">Skip to content</a>\n\n'
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
      <h2 id="cta-h">Talk to a partner about <em>your numbers.</em></h2>
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
def build_home():
    hero = opt_in(part('hero'), '<section class="hero" id="home">', '<section class="hero fit-me" id="home" data-cut-bottom data-no-gap>')
    services = SERVICES_SRC
    # each accordion panel gets an "Explore" link to its own page, next to the enquire button
    counter = iter(SERVICES)
    def repl(m):
        s = next(counter)
        return (f'<div class="pn-actions"><a class="btn btn-solid btn-sm" href="{s["file"]}">Explore this service {ARROW}</a>'
                f'<a class="btn btn-ghost btn-sm" href="{s["wa"]}" target="_blank" rel="noopener">Enquire</a></div>')
    services = re.sub(r'<a class="btn btn-solid btn-sm" href="https://wa\.me[^"]*"[^>]*>Enquire about this .*?</a>', repl, services, flags=re.S)
    approach = opt_in(part('approach'), '<section class="approach on-dark" aria-labelledby="ap-h">', '<section class="approach on-dark" id="approach" aria-labelledby="ap-h">')
    body = '\n\n'.join([hero, part('band'), part('ask'), services, approach, part('reviews'), CTA])
    page('index.html', 'home', 'AJ Associates | Tax, Audit &amp; Management Consultancy in Kochi, Kerala',
         'AJ Associates is a tax, audit and management consultancy in Kochi, Kerala — GST, Income Tax, accounting, company formation, bank loan proposals and corporate compliance, led by senior partners.',
         fix_links(body, 'index.html'), JSON_LD + '\n')

def build_services_index():
    cards = []
    for s in SERVICES:
        bullets = ''.join(f'<li>{b}</li>' for b, _ in s['items'][:3])
        cards.append(f'<a class="card rv" href="{s["file"]}"><span class="no">{s["no"]}</span><h3>{s["title"]}</h3><p>{s["lead"]}</p><ul>{bullets}</ul><span class="go">Explore this service {ARROW}</span></a>')
    body = page_hero(['<a href="index.html">Home</a>', 'Services'], 'Seven practices, <em>one desk.</em>',
                     'Integrated management consultancy across accounting, tax, legal, audit and compliance — built to support your business at every stage, in Kerala and across India.',
                     f'<div class="cta-row"><a class="btn btn-brass" href="contact.html">Book a consultation {ARROW}</a><a class="btn btn-ghost" href="packages.html">Find your package</a></div>')
    body += f'\n\n<section class="sec after-slant" aria-label="All services">\n  <div class="wrap">\n    <div class="svc-cards">' + '\n      '.join(cards) + '</div>\n  </div>\n</section>\n\n' + CTA
    page('services.html', 'services', 'Services | AJ Associates — Tax, Audit, Company Law &amp; Advisory, Kochi',
         'Taxation, company formation, financial management and audit, corporate secretarial, bank loan proposals, business strategy and outsourced staffing — all under one roof in Kochi, Kerala.',
         body)

def build_service_pages():
    for i, s in enumerate(SERVICES):
        points = ''.join(f'<li class="rv"><span class="k">{n+1:02d}</span><div><h3>{b}</h3><p>{t}</p></div></li>' for n, (b, t) in enumerate(s['items']))
        cur_attr = ' aria-current="page"'
        others = ''.join('<li><a href="' + o['file'] + '"' + (cur_attr if o is s else '') + '>' + o['title'] + '</a></li>' for o in SERVICES)
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
      </div>
    </div>
    <aside class="svc-other rv" aria-label="Other services">
      <h3>Other services</h3>
      <ul>{others}</ul>
      <div class="side-cta">
        <h4>Not sure what you need?</h4>
        <p>Tell us about your business and a senior partner will point you to the right service.</p>
        <a class="btn btn-brass btn-sm" href="contact.html">Book a consultation {ARROW}</a>
      </div>
    </aside>
  </div>
</section>'''
        page(s['file'], 'services', f'{s["title"]} | AJ Associates, Kochi', s['lead'].replace('&amp;', '&'), hero + '\n\n' + main + '\n\n' + CTA)

def build_packages():
    body = h1ize(fix_links(opt_in(part('packages'), '<section class="sec" id="packages">', '<section class="sec fit-me" id="packages">'), 'packages.html'))
    page('packages.html', 'packages', 'Packages | AJ Associates — find the right compliance scope',
         'Choose your business type and turnover to see the tax, accounts and compliance scope we would typically recommend — with a senior partner confirming the final scope and fee.', body)

def build_about():
    team = opt_in(part('team'), '<section class="sec team" id="team">', '<section class="sec team fit-me" id="team">')
    body = h1ize(fix_links(team, 'about.html')) + '\n\n' + fix_links(part('principles'), 'about.html') + '\n\n' + CTA
    page('about.html', 'about', 'About Us | AJ Associates — leadership and commitments',
         'Meet the partners behind AJ Associates and the three commitments we hold ourselves to: statutory precision, a dedicated advisory desk and proactive compliance.', body)

def build_collab():
    net = opt_in(part('network'), '<section class="network on-dark" id="partnership">', '<section class="network on-dark flat fit-me" id="partnership">')
    page('collab.html', 'collab', 'Collab with us | AJ Associates — referrals and collaborations',
         'Banks, fintech platforms, legal practitioners and corporate advisors: propose a referral or joint advisory arrangement with AJ Associates.',
         h1ize(fix_links(net, 'collab.html')))

def build_careers():
    hero = page_hero(['<a href="index.html">Home</a>', 'Careers'], 'Build your practice <em>with us.</em>',
                     'We welcome experienced accountants, tax consultants and article trainees looking for meaningful professional growth.')
    roles = '''<div class="roles">
      <div class="role rv"><h3>Accountants</h3><p>Bookkeeping, reconciliations, statutory filings and audit support across a varied client base.</p></div>
      <div class="role rv"><h3>Tax consultants</h3><p>Income Tax, GST and TDS work, notice responses and representation alongside the senior team.</p></div>
      <div class="role rv"><h3>Article trainees</h3><p>Learn the practice hands-on across filings, audits and company law.</p></div>
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
        <p>Email your CV to <a href="mailto:careers@ajassociatesonline.com?subject=Career%20Application%20-%20AJ%20Associates"><b>careers@ajassociatesonline.com</b></a>, or message our trainee desk on WhatsApp.</p>
      </div>
      <div class="cta-row">
        <a class="btn btn-solid" href="mailto:careers@ajassociatesonline.com?subject=Career%20Application%20-%20AJ%20Associates"><svg class="i"><use href="#i-mail"/></svg> Email your CV</a>
        <a class="btn btn-ghost" href="https://wa.me/{WA}?text=Hello,%20I%20am%20interested%20in%20an%20article%20trainee%20/%20accounting%20opportunity%20at%20AJ%20Associates." target="_blank" rel="noopener"><svg class="i"><use href="#i-wa"/></svg> Trainee desk</a>
      </div>
    </div>
  </div>
</section>

''' + CTA
    page('careers.html', 'careers', 'Careers | AJ Associates — accountants, tax consultants and trainees',
         'Join AJ Associates in Kochi: opportunities for accountants, tax consultants and article trainees.', body)

def build_contact():
    body = h1ize(fix_links(opt_in(part('contact'), '<section class="sec contact" id="contact">', '<section class="sec contact fit-me" id="contact">'), 'contact.html'))
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

PAGES = ['index.html', 'services.html'] + [s['file'] for s in SERVICES] + ['packages.html', 'about.html', 'collab.html', 'careers.html', 'contact.html']

def write_deploy_files():
    def w(name, text):
        with open(os.path.join(ROOT, name), 'w', encoding='utf-8', newline='\n') as f:
            f.write(text)
        print('  wrote', name)
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
    w('netlify.toml', """# Netlify settings for ajassociatesonline.com — static site, nothing to build.
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "SAMEORIGIN"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

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
    build_about(); build_collab(); build_careers(); build_contact()
    build_error_pages(); write_deploy_files()
    print('Done.')
