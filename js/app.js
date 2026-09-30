/* AJ Associates — tiny, dependency-free enhancements. Every page is fully usable without this file.
   Each feature looks for its own elements, so one script serves all pages. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var WA = '916282406091';
  var lite = document.documentElement.classList.contains('lite');

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  $$('[data-reload]').forEach(function (b) { b.addEventListener('click', function () { window.location.reload(); }); });

  /* ---- navigation: mobile menu, dropdowns, services mega-menu ---- */
  var burger = $('#burger'), nav = $('#nav');
  function closeNav() {
    nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
    $$('.dd.open', nav).forEach(function (d) { d.classList.remove('open'); });
  }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    var b = e.target.closest('.dd-btn');
    if (b) {                                                   // phone: expand / collapse a group
      var dd = b.parentNode, open = dd.classList.toggle('open');
      b.setAttribute('aria-expanded', open);
      return;
    }
    if (e.target.closest('a')) closeNav();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  $$('.mega').forEach(function (m) {                            // hovering / focusing a service previews it
    var items = $$('.mega-list a', m), panels = $$('.mp', m);
    function show(i) {
      items.forEach(function (a, k) { a.classList.toggle('on', k === i); });
      panels.forEach(function (p, k) { p.classList.toggle('on', k === i); });
    }
    items.forEach(function (a, i) {
      a.addEventListener('mouseenter', function () { show(i); });
      a.addEventListener('focus', function () { show(i); });
    });
    show(0);
  });

  /* ---- header shadow + WhatsApp float + progress line (one passive listener, rAF-throttled) ---- */
  var hdr = $('#hdr'), chat = $('#chat'), prog = $('#prog'), tick = false;
  function onScroll() {
    tick = false;
    var y = window.pageYOffset;
    hdr.classList.toggle('stuck', y > 8);
    if (chat) chat.classList.toggle('show', y > 400);
    if (prog) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
  }
  window.addEventListener('scroll', function () {
    if (!tick) { tick = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---- chat launcher: WhatsApp / Email / Call ---- */
  var cbtn = $('#chat-btn');
  if (chat && cbtn) {
    var setChat = function (open) { chat.classList.toggle('open', open); cbtn.setAttribute('aria-expanded', open); };
    cbtn.addEventListener('click', function () { setChat(!chat.classList.contains('open')); });
    document.addEventListener('click', function (e) { if (!chat.contains(e.target)) setChat(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setChat(false); });
    $$('.chat-menu a').forEach(function (a) { a.addEventListener('click', function () { setChat(false); }); });
  }

  /* ---- hero box slides: calendar / tax estimate / first 30 days ---- */
  var led = $('.ledger');
  if (led && $('.slide', led)) {
    var slides = $$('.slide', led), dotSets = $$('.dots', led), stamp = $('.stamp', led), cur = 0, timer = 0, stopped = false;
    var show = function (n) {
      cur = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) {
        var on = i === cur;
        s.classList.toggle('on', on); s.setAttribute('aria-hidden', on ? 'false' : 'true');
        if ('inert' in s) s.inert = !on;
      });
      dotSets.forEach(function (g) {
        $$('button', g).forEach(function (b, i) { if (i === cur) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      });
      if (stamp) stamp.textContent = slides[cur].getAttribute('data-stamp') || '';
    };
    dotSets.forEach(function (g) {
      $$('button', g).forEach(function (b, i) { b.addEventListener('click', function () { stopped = true; clearInterval(timer); show(i); }); });
    });
    $$('.arw', led).forEach(function (b) {
      b.addEventListener('click', function () { stopped = true; clearInterval(timer); show(cur + (+b.getAttribute('data-dir'))); });
    });
    var start = slides.findIndex(function (s) { return s.classList.contains('on'); });
    show(start < 0 ? 0 : start);
    var still = document.documentElement.classList.contains('lite') || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    var play = function () { clearInterval(timer); if (!stopped && !still) timer = setInterval(function () { show(cur + 1); }, 8000); };
    ['mouseenter', 'focusin', 'touchstart'].forEach(function (ev) { led.addEventListener(ev, function () { clearInterval(timer); }, { passive: true }); });
    led.addEventListener('mouseleave', play);
    play();

    var rg = $('#est-rg');
    if (rg) {
      var inr = function (n) { return '\u20b9' + Math.round(n).toLocaleString('en-IN'); };
      var tax = function (t) {           // new regime, FY 2025-26: 12L rebate with marginal relief, 4% cess
        var left = t, r = 0, i, x;
        for (i = 0; i < 6 && left > 0; i++) { x = Math.min(left, 400000); r += x * i * 0.05; left -= x; }
        if (left > 0) r += left * 0.3;
        r = t <= 1200000 ? 0 : Math.min(r, t - 1200000);
        return r * 1.04;
      };
      var calc = function () {
        var v = +rg.value, t = Math.max(0, v - 75000), x = tax(t);
        $('#est-inc').textContent = inr(v); $('#est-ti').textContent = inr(t);
        $('#est-tx').textContent = inr(x); $('#est-td').textContent = inr(x / 12);
      };
      rg.addEventListener('input', function () { stopped = true; clearInterval(timer); calc(); });
      calc();
    }
  }

  /* ---- reveal on scroll ---- */
  if ('IntersectionObserver' in window && !lite) {
    var rv = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rv.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    $$('.rv').forEach(function (el) { rv.observe(el); });
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- fit-to-screen: the page's main section shrinks proportionally so it fills one screen ----
     Sections opt in with class "fit-me" (id home / packages / team / partnership / contact).
     Whitespace is part of the budget: PT/PB of padding inside the screen, the height of any slanted
     edge that overlaps the section (data-cut-top / data-cut-bottom / data-slant), plus a GAP below
     the fold that separates it from whatever follows. ---- */
  var FIT = $$('.fit-me');
  if (FIT.length) {
    var fitMq = window.matchMedia('(min-width:900px) and (min-aspect-ratio:6/5)');
    var canZoom = 'zoom' in document.documentElement.style;
    var PT = 48, PB = 36, GAP = 72;
    var fitAll = function () {
      var avail = window.innerHeight - hdr.offsetHeight;
      var cut = Math.min(68, Math.max(22, window.innerWidth * 0.042));         // = --cut in px
      FIT.forEach(function (s) {
        if (!fitMq.matches || !canZoom) {
          s.classList.remove('fit');
          s.style.zoom = ''; s.style.minHeight = ''; s.style.paddingTop = ''; s.style.paddingBottom = ''; s.style.removeProperty('--z');
          return;
        }
        s.classList.add('fit');
        var topCut = s.hasAttribute('data-cut-top') ? cut : 0;                  // a slanted edge above overlaps us
        var botCut = s.hasAttribute('data-cut-bottom') ? cut : 0;               // the stats band overlaps our bottom
        var slant = s.hasAttribute('data-slant') ? cut : 0;                     // our own slanted top edge (scales with zoom)
        var gap = s.hasAttribute('data-no-gap') ? 0 : GAP;
        s.style.zoom = 1; s.style.minHeight = '0px'; s.style.paddingTop = '0px'; s.style.paddingBottom = '0px';
        var nat = s.getBoundingClientRect().height;                             // content-only height
        var budget = avail - PT - PB - topCut - botCut - slant * 0.85;
        var top = s.id === 'home' ? 0.84 : 1;                                   // the home hero reads oversized on big screens at 1:1
        var z = Math.max(0.55, Math.min(top, budget / nat * 0.985));
        s.style.setProperty('--z', z.toFixed(3));
        s.style.zoom = z.toFixed(3);
        s.style.paddingTop = ((PT + topCut) / z + slant) + 'px';
        s.style.paddingBottom = ((PB + botCut + gap) / z) + 'px';
        s.style.minHeight = ((avail + gap) / z) + 'px';
      });
    };
    var fitTimer = 0;
    var queueFit = function () { clearTimeout(fitTimer); fitTimer = setTimeout(fitAll, 60); };
    window.addEventListener('resize', queueFit);
    if (fitMq.addEventListener) fitMq.addEventListener('change', queueFit);
    window.addEventListener('load', fitAll);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
    fitAll();
  }

  /* ---- services accordion: opening one closes the open one above it, which would shove the page
          upward. Do the correction in one synchronous step (toggle, measure how far the clicked
          header moved, scroll back by that much) so nothing flashes. ---- */
  $$('.acc summary').forEach(function (sm) {
    sm.addEventListener('click', function (e) {
      e.preventDefault();
      var d = sm.parentNode, before = sm.getBoundingClientRect().top;
      if (d.open) { d.open = false; }
      else { $$('.acc details[open]').forEach(function (o) { o.open = false; }); d.open = true; }
      var delta = sm.getBoundingClientRect().top - before;
      if (Math.abs(delta) > 0.5) window.scrollBy({ top: delta, left: 0, behavior: 'instant' });
    });
  });

  /* ---- package finder ---- */
  var form = $('#finder');
  if (form) {
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
    var renderFinder = function () {
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
        'Greetings AJ Associates! I used the Packages section — business: ' + label('entity') +
        ', turnover: ' + label('turnover') + '. I would like a quote for the "' + p[0] + '".');
    };
    form.addEventListener('change', renderFinder);
    renderFinder();
  }

  /* ---- forms: real hand-off (WhatsApp / email), never a fake "submitted" ---- */
  var guard = function (f) {
    if (f.elements.website && f.elements.website.value) return false; // honeypot
    if (!f.checkValidity()) { f.reportValidity(); return false; }
    return true;
  };
  var cf = $('#cform');
  if (cf) cf.addEventListener('submit', function (e) {
    e.preventDefault(); if (!guard(cf)) return;
    var f = cf.elements;
    var text = 'Greetings AJ Associates!\nName: ' + f.name.value.trim() + '\nMobile: ' + f.tel.value.trim() +
      (f.mail.value ? '\nEmail: ' + f.mail.value.trim() : '') + '\nService: ' + f.svc.value + '\n\n' + f.msg.value.trim();
    window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    $('.msg', cf).textContent = 'Opening WhatsApp with your details — just press send.';
  });
  var pf = $('#pform');
  if (pf) pf.addEventListener('submit', function (e) {
    e.preventDefault(); if (!guard(pf)) return;
    var f = pf.elements;
    var body = 'Firm: ' + f.firm.value.trim() + '\nCategory: ' + f.cat.value + '\nEmail: ' + f.mail.value.trim() +
      '\nMobile: ' + f.tel.value.trim() + '\n\n' + f.note.value.trim();
    window.location.href = 'mailto:info@ajassociatesonline.com?subject=' +
      encodeURIComponent('Collaboration proposal — ' + f.firm.value.trim()) + '&body=' + encodeURIComponent(body);
    $('.msg', pf).textContent = 'Opening your email app. If nothing opens, write to info@ajassociatesonline.com.';
  });
})();
