/* AJ Associates — tiny, dependency-free enhancements. Site is fully usable without this file. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var WA = '916282406091';
  var lite = document.documentElement.classList.contains('lite');

  $('#yr').textContent = new Date().getFullYear();

  /* ---- mobile nav ---- */
  var burger = $('#burger'), nav = $('#nav');
  function closeNav() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeNav(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  /* ---- header shadow + WhatsApp float (one passive listener, rAF-throttled) ---- */
  var hdr = $('#hdr'), wa = $('#wa'), prog = $('#prog'), tick = false;
  function onScroll() {
    tick = false;
    var y = window.pageYOffset;
    hdr.classList.toggle('stuck', y > 8);
    wa.classList.toggle('show', y > 400);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
  }
  window.addEventListener('scroll', function () {
    if (!tick) { tick = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---- scroll-spy + reveal via IntersectionObserver ---- */
  if ('IntersectionObserver' in window) {
    var links = $$('.nav a[href^="#"]:not(.btn)');
    var spy = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    $$('main section[id]').forEach(function (s) { spy.observe(s); });

    if (!lite) {
      var rv = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      $$('.rv').forEach(function (el) { rv.observe(el); });
    }
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- package finder ---- */
  var PK = {
    individual: ['Individual & NRI Tax Filing', 'Personal tax scope', [
      'Income Tax Return (ITR-1 / 2 / 3) e-filing', 'Form 26AS & AIS data reconciliation',
      'Advance tax computation and quarterly estimates', 'Capital gains and investment exemption guidance',
      'Foreign income and NRI remittance advisory', 'Bank interest and dividend income review']],
    prop_s: ['Small Business Proprietorship Package', 'Starter scope', [
      'Annual Income Tax Return (ITR-3/4 presumptive) filing', 'Financial statements (P&L and balance sheet)',
      'Form 26AS / AIS reconciliation and TDS claiming', 'Advance tax computation and payment schedule advice',
      'MSME / Udyam registration and compliance support', 'Bank statement reconciliation and ledger review']],
    prop_g: ['Complete Proprietorship & GST Compliance', 'Growth scope', [
      'Monthly GST returns (GSTR-1, GSTR-3B) and GSTR-2B matching', 'Income Tax and tax audit compliance (Sec 44AB)',
      'Form 26AS / AIS reconciliation and ITC verification', 'Quarterly TDS computation, payment and e-filing',
      'Advance tax computation and quarterly tax planning', 'Bookkeeping and ledger supervision']],
    partnership: ['Partnership / LLP Governance Package', 'Corporate scope', [
      'LLP Form 11 and Form 8 annual MCA filings', 'Partner capital accounts and profit distribution',
      'Monthly GST filings and GSTR-2B input credit matching', 'Quarterly TDS computation, payment and e-filing',
      'Form 26AS / AIS reconciliation and advance tax advice', 'Tax audit and regulatory representation']],
    pvt_ltd: ['Pvt Ltd Corporate Compliance Retainer', 'Executive scope', [
      'MCA annual filings (AOC-4, MGT-7) and governance', 'Statutory audit supervision and board resolutions',
      'Form 26AS / AIS and ITC reconciliation', 'Monthly GST (GSTR-1, 3B) and quarterly TDS (26Q)',
      'Advance tax computation and corporate tax planning', 'Director KYC and corporate secretarial upkeep']]
  };
  var CHECK = '<svg class="i"><use href="#i-check"/></svg>';
  var form = $('#finder');
  function renderFinder() {
    var ent = form.elements.entity.value, to = form.elements.turnover.value;
    var key = ent === 'proprietorship' ? (to === 'under_20l' ? 'prop_s' : 'prop_g') : ent;
    var p = PK[key], tier = p[1], feats = p[2].slice();
    if (ent !== 'individual' && (to === '1cr_5cr' || to === 'above_5cr')) {
      tier = 'Enterprise scope'; feats.push('Bank CMA data and loan syndication support');
    }
    $('#r-name').textContent = p[0];
    $('#r-tier').textContent = tier;
    var ul = $('#r-list'); ul.textContent = '';
    feats.forEach(function (f) {
      var li = document.createElement('li'); li.innerHTML = CHECK;
      var s = document.createElement('span'); s.textContent = f; li.appendChild(s); ul.appendChild(li);
    });
    var label = function (n) { return form.querySelector('input[name="' + n + '"]:checked + span').textContent; };
    $('#r-wa').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(
      'Greetings AJ Associates! I used your scope finder — business: ' + label('entity') +
      ', turnover: ' + label('turnover') + '. I would like a quote for the "' + p[0] + '".');
  }
  form.addEventListener('change', renderFinder);
  renderFinder();

  /* ---- forms: real hand-off (WhatsApp / email), never a fake "submitted" ---- */
  function guard(f) {
    if (f.elements.website && f.elements.website.value) return false; // honeypot
    if (!f.checkValidity()) { f.reportValidity(); return false; }
    return true;
  }
  var cf = $('#cform');
  cf.addEventListener('submit', function (e) {
    e.preventDefault(); if (!guard(cf)) return;
    var f = cf.elements;
    var text = 'Greetings AJ Associates!\nName: ' + f.name.value.trim() + '\nMobile: ' + f.tel.value.trim() +
      (f.mail.value ? '\nEmail: ' + f.mail.value.trim() : '') + '\nService: ' + f.svc.value + '\n\n' + f.msg.value.trim();
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    $('.msg', cf).textContent = 'Opening WhatsApp with your details — just press send.';
  });
  var pf = $('#pform');
  pf.addEventListener('submit', function (e) {
    e.preventDefault(); if (!guard(pf)) return;
    var f = pf.elements;
    var body = 'Firm: ' + f.firm.value.trim() + '\nCategory: ' + f.cat.value + '\nEmail: ' + f.mail.value.trim() +
      '\nMobile: ' + f.tel.value.trim() + '\n\n' + f.note.value.trim();
    window.location.href = 'mailto:info@ajassociatesonline.com?subject=' +
      encodeURIComponent('Collaboration proposal — ' + f.firm.value.trim()) + '&body=' + encodeURIComponent(body);
    $('.msg', pf).textContent = 'Opening your email app. If nothing opens, write to info@ajassociatesonline.com.';
  });

  /* ---- map: load the heavy iframe only on request ---- */
  var mb = $('#map-load');
  if (mb) mb.addEventListener('click', function () {
    var i = document.createElement('iframe');
    i.title = 'AJ Associates office map'; i.loading = 'lazy'; i.referrerPolicy = 'no-referrer-when-downgrade';
    i.src = 'https://maps.google.com/maps?q=A+J+Associates,+10/1329+G,+Bivera,+Chullickal+Road,+Kochi,+Kerala&z=15&output=embed';
    $('#map').appendChild(i);
  });
})();
