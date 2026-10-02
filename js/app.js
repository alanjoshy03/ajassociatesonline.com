/* AJ Associates — tiny, dependency-free enhancements. Every page is fully usable without this file.
   Each feature looks for its own elements, so one script serves all pages. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var WA = '916282406091';
  var lite = document.documentElement.classList.contains('lite');

  /* ---- first-visit loading screen: lifts once the page has loaded (shown for at least ~2s, never more than 4.5s after it appears) ---- */
  var root = document.documentElement, sp = $('#splash');
  if (sp && root.classList.contains('splash')) {
    var spDone = false, spStart = performance.now();   // count the 2 seconds from when the screen is up, not from when the request began
    var spHide = function () {
      if (spDone) return; spDone = true;
      setTimeout(function () {
        sp.classList.add('go');
        setTimeout(function () { root.classList.remove('splash'); sp.parentNode && sp.parentNode.removeChild(sp); }, 700);
      }, Math.max(0, 2000 - (performance.now() - spStart)));
    };
    if (document.readyState === 'complete') spHide(); else window.addEventListener('load', spHide);
    setTimeout(spHide, 4500);
  }

  /* ---- content protection: no selecting, copying, dragging or right-click menu (typing in form fields is untouched) ---- */
  var inField = function (t) { return t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]'); };
  ['selectstart', 'dragstart', 'copy', 'cut', 'contextmenu'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (!inField(e.target)) e.preventDefault(); });
  });

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  $$('[data-reload]').forEach(function (b) { b.addEventListener('click', function () { window.location.reload(); }); });

  /* ---- navigation: mobile menu, dropdowns, services mega-menu ---- */
  var burger = $('#burger'), nav = $('#nav');
  function closeNav() {
    nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false');
    document.documentElement.classList.remove('nav-open');
    $$('.dd.open', nav).forEach(function (d) { d.classList.remove('open'); });
  }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
    document.documentElement.classList.toggle('nav-open', open);      // the page behind the open menu does not scroll
  });
  window.addEventListener('resize', function () { if (window.innerWidth > 1059 && document.documentElement.classList.contains('nav-open')) closeNav(); });
  nav.addEventListener('click', function (e) {
    var b = e.target.closest('.dd-btn');
    if (b) {                                                   // phone: expand / collapse a group
      var dd = b.parentNode, open = dd.classList.toggle('open');
      b.setAttribute('aria-expanded', open);
      return;
    }
    var head = e.target.closest('.dd-t');
    if (head && window.matchMedia('(max-width:1059px)').matches) {   // phone: the whole row expands its list
      e.preventDefault();
      var g = head.parentNode, o = g.classList.toggle('open');
      var gb = $('.dd-btn', g); if (gb) gb.setAttribute('aria-expanded', o);
      return;
    }
    if (e.target.closest('a')) closeNav();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });

  $$('.mega').forEach(function (m) {                            // hovering / focusing a service previews it
    var items = $$('.mega-list li:not(.mega-all) a', m), panels = $$('.mp', m);
    function show(i) {
      items.forEach(function (a, k) { a.classList.toggle('on', k === i); });
      panels.forEach(function (p, k) { p.classList.toggle('on', k === i); });
    }
    items.forEach(function (a, i) {
      a.addEventListener('mouseenter', function () { show(i); });
      a.addEventListener('focus', function () { show(i); });
    });
    var seeAll = $('.mega-all a', m);                           // "See all services": its own highlight replaces the row highlight
    if (seeAll) ['mouseenter', 'focus'].forEach(function (ev) { seeAll.addEventListener(ev, function () { items.forEach(function (x) { x.classList.remove('on'); }); }); });
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
      var tax = function (t) {           // new regime, tax year 2026-27 (rates unchanged from 2025-26 after Budget 2026): 12L rebate with marginal relief, 4% cess
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

  /* ---- Home services: all collapsed on phones ---- */
  if (window.matchMedia('(max-width:899px)').matches) $$('.acc details[open]').forEach(function (d) { d.removeAttribute('open'); });

  /* ---- services index: hover/focus previews on desktop, tap-to-open rows on phones ---- */
  var sx = $('.sx-list');
  if (sx) {
    var sxRows = $$('.sx-row', sx), sxItems = $$('.sx-item', sx), sxDesk = window.matchMedia('(min-width:900px)');
    var sxOpen = function (n) {
      sxItems.forEach(function (li, k) { var on = k === n; li.classList.toggle('on', on); sxRows[k].setAttribute('aria-expanded', on ? 'true' : 'false'); });
    };
    sxRows.forEach(function (r, i) {
      r.addEventListener('mouseenter', function () { if (sxDesk.matches) sxOpen(i); });
      r.addEventListener('focus', function () { if (sxDesk.matches) sxOpen(i); });
      r.addEventListener('click', function (e) {
        if (sxDesk.matches) return;                       // on desktop the row is a normal link
        e.preventDefault();
        sxToggle(i);
      });
    });

    /* phones: rows open and close smoothly, the tapped row stays under the finger while others collapse,
       and once open the page glides just far enough to show the whole answer */
    var sxBusy = false, sxDur = 360, sxEase = 'cubic-bezier(.4, 0, .2, 1)';
    var sxStill = lite || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
    var sxToggle = function (i) {
      var li = sxItems[i], row = sxRows[i], wasOn = li.classList.contains('on');
      var startTop = row.getBoundingClientRect().top;
      if (sxStill || !li.animate) {
        sxOpen(wasOn ? -1 : i);
        window.scrollBy({ top: row.getBoundingClientRect().top - startTop, left: 0, behavior: 'instant' });
        return;
      }
      if (sxBusy) return;
      sxBusy = true;
      var done = 0, total = 0, following = true;
      var finish = function () { if (++done < total) return; following = false; sxBusy = false; sxReveal(li, row, wasOn); };
      var run = function (item, opening) {
        var panel = $('.sx-panel', item); total++;
        item.classList.add('on', 'sx-anim');
        var full = panel.offsetHeight;
        var a = panel.animate(opening ? [{ height: '0px' }, { height: full + 'px' }] : [{ height: full + 'px' }, { height: '0px' }], { duration: sxDur, easing: sxEase });
        a.onfinish = a.oncancel = function () { item.classList.remove('sx-anim'); if (!opening) item.classList.remove('on'); finish(); };
      };
      sxItems.forEach(function (x, k) {
        var on = x.classList.contains('on');
        sxRows[k].setAttribute('aria-expanded', k === i && !wasOn ? 'true' : 'false');
        if (k === i) { run(x, !wasOn); } else if (on) { run(x, false); }
      });
      var t0 = performance.now();
      (function follow() {                               // keep the tapped row where it was while rows above shrink
        var d = row.getBoundingClientRect().top - startTop;
        if (Math.abs(d) > .5) window.scrollBy({ top: d, left: 0, behavior: 'instant' });
        if (following) requestAnimationFrame(follow);
      })();
    };
    var sxReveal = function (li, row, wasOn) {
      if (wasOn) return;
      var hdrH = ($('#hdr') ? $('#hdr').offsetHeight : 56) + 14;
      var rr = row.getBoundingClientRect(), pr = $('.sx-panel', li).getBoundingClientRect(), y = window.pageYOffset, to = y;
      if (rr.top < hdrH) to = y + rr.top - hdrH;                                        // row is tucked under the header
      else if (pr.bottom > window.innerHeight - 14) to = y + Math.min(pr.bottom - (window.innerHeight - 14), rr.top - hdrH);   // answer runs off the bottom
      if (Math.abs(to - y) > 2) window.scrollTo({ top: to, behavior: 'smooth' });
    };
  }

  /* ---- business-structure quiz ---- */
  var sq = $('#sq');
  if (sq) {
    var SQ = [
      { q: 'How many people will own the business?', o: [['Just me', 'solo'], ['Two or more of us', 'multi']] },
      { q: 'Will you bring in outside investors, or give shares to them?', o: [['Yes, that is the plan', 'inv'], ['Maybe later', 'maybe'], ['No', 'no']] },
      { q: 'Do you want your personal assets kept apart from business debts?', o: [['Yes, limited liability matters to me', 'lim'], ['Not a big concern', 'nolim']] },
      { q: 'What turnover do you expect in the first year?', o: [['Under \u20b920 lakh', 'low'], ['\u20b920 lakh to \u20b92 crore', 'mid'], ['Above \u20b92 crore', 'high']] },
      { q: 'What matters more to you right now?', o: [['Lowest cost and least paperwork', 'cheap'], ['Credibility with banks and customers', 'cred']] }
    ];
    var SR = {
      prop: { n: 'Sole proprietorship', why: 'You are starting alone, and keeping cost and paperwork low matters most. It is the quickest way to begin trading.', c: 'Lowest', l: 'Unlimited', g: 'Simple to start, but your personal assets are exposed to business debts. You can convert to a company later.' },
      opc: { n: 'One Person Company', why: 'You are a single founder who wants limited liability and a proper company identity without needing a partner.', c: 'Medium', l: 'Limited', g: 'It has eligibility conditions, such as a single resident owner and a nominee. A private limited company is the alternative if you plan to grow.' },
      part: { n: 'Partnership firm', why: 'Two or more of you want to start quickly at low cost, and limited liability is not a concern.', c: 'Low', l: 'Unlimited', g: 'A well-drafted partnership deed is essential. Partners are personally liable, so many move to an LLP as they grow.' },
      llp: { n: 'Limited Liability Partnership', why: 'You are two or more people who want limited liability with lighter compliance than a company, and no outside equity investors.', c: 'Medium', l: 'Limited', g: 'Popular for professional and service businesses. It cannot issue shares, so it is harder to raise venture investment.' },
      pvt: { n: 'Private Limited Company', why: 'You want investor-readiness and credibility with banks and customers, with limited liability, and you accept more compliance for it.', c: 'Higher', l: 'Limited', g: 'The standard structure for raising outside funding and issuing shares. It needs annual filings and an audit.' }
    };
    var sa = [], sp = 0;
    var sqPick = function () {
      if (sa[1] === 'inv') return SR.pvt;
      var grow = sa[3] === 'high' || sa[4] === 'cred' || sa[1] === 'maybe';
      if (sa[0] === 'solo') return sa[2] === 'lim' ? (grow ? SR.pvt : SR.opc) : SR.prop;
      return sa[2] === 'lim' ? (grow ? SR.pvt : SR.llp) : SR.part;
    };
    var sqTop = function (label, pct) {
      return '<div class="sq-top"><b>Find your structure</b><span>' + label + '</span></div><div class="sq-bar"><i style="width:' + pct + '%"></i></div>';
    };
    var sqAsk = function () {
      var s = SQ[sp], h = sqTop('Step ' + (sp + 1) + ' of ' + SQ.length, sp / SQ.length * 100) + '<p class="sq-q">' + s.q + '</p>';
      s.o.forEach(function (o, i) { h += '<button type="button" class="sq-opt" data-i="' + i + '">' + o[0] + '</button>'; });
      if (sp > 0) h += '<button type="button" class="sq-back" data-back>Back</button>';
      sq.innerHTML = h;
    };
    var sqResult = function () {
      var r = sqPick();
      var wa = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Greetings AJ Associates! The structure quiz suggested a ' + r.n + ' for my business. I would like to discuss it.');
      sq.innerHTML = sqTop('Your result', 100) + '<div class="sq-res"><p class="sq-lbl">Based on your answers, the closest fit is</p><h3>' + r.n + '</h3><p>' + r.why + '</p>' +
        '<div class="sq-kv"><div>Compliance<b>' + r.c + '</b></div><div>Liability<b>' + r.l + '</b></div><div>Setup<b>We handle it</b></div></div>' +
        '<p><b>Good to know:</b> ' + r.g + '</p><div class="sq-act"><a class="btn btn-solid btn-sm" href="' + wa + '" target="_blank" rel="noopener">Discuss this with our team</a>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-restart>Start over</button></div>' +
        '<p class="sq-fine">Indicative guidance only. The right structure also depends on your tax position, licences and plans, so our team confirms it before anything is filed.</p></div>';
    };
    sq.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      if (b.hasAttribute('data-restart')) { sa = []; sp = 0; sqAsk(); return; }
      if (b.hasAttribute('data-back')) { sp--; sqAsk(); return; }
      if (b.hasAttribute('data-i')) { sa[sp] = SQ[sp].o[+b.getAttribute('data-i')][1]; sp++; if (sp >= SQ.length) sqResult(); else sqAsk(); }
    });
    sqAsk();
  }

  /* ---- FAQs: search, category tabs, deep links and "was this helpful?" ---- */
  var faq = $('.faq-list');
  if (faq) {
    var fItems = $$('details', faq), fCats = $$('.faq-cat', faq), fTabs = $$('.faq-tabs button'), fIn = $('#faq-q'), fEmpty = $('.faq-empty'), fCat = 'All';
    var fApply = function () {
      var q = fIn.value.trim().toLowerCase(), shown = 0;
      fItems.forEach(function (d) {
        var inCat = fCat === 'All' || d.parentNode.getAttribute('data-cat') === fCat;
        var inText = !q || d.textContent.toLowerCase().indexOf(q) > -1;
        d.hidden = !(inCat && inText); if (!d.hidden) shown++;
      });
      fCats.forEach(function (c) { c.hidden = !$$('details:not([hidden])', c).length; });
      if (fEmpty) fEmpty.hidden = shown > 0;
    };
    var fSetTab = function (name) {
      fCat = name;
      fTabs.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cat').replace('&amp;', '&') === name ? 'true' : 'false'); });
    };
    fTabs.forEach(function (b) { b.addEventListener('click', function () { fSetTab(b.getAttribute('data-cat').replace('&amp;', '&')); fApply(); }); });
    if (fIn) fIn.addEventListener('input', fApply);
    var fOpenHash = function () {
      var d = location.hash.length > 1 ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null;
      if (d && d.tagName === 'DETAILS') {
        fSetTab('All'); if (fIn) fIn.value = ''; fApply(); d.open = true;
        setTimeout(function () { d.scrollIntoView({ block: 'start' }); }, 60);
      }
    };
    window.addEventListener('hashchange', fOpenHash);
    fOpenHash();
    faq.addEventListener('click', function (e) {
      var b = e.target.closest('[data-fb]'); if (!b) return;
      var box = b.closest('.faq-a'), msg = $('.faq-fbmsg', box);
      msg.textContent = b.getAttribute('data-fb') === 'yes' ? 'Glad that helped.' : 'Sorry about that. Message us on WhatsApp or use the contact page and we will answer it personally.';
      $('.faq-fb', box).hidden = true;
    });
  }

  /* ---- resources: live deadline calendar, worked out from the visitor's date ---- */
  var calEl = $('#cal');
  if (calEl) {
    var CAL = {
      m: [[0, 7, 'TDS / TCS deposit'], [0, 11, 'GSTR-1, monthly filers'], [0, 15, 'PF and ESI contributions'], [0, 20, 'GSTR-3B, monthly filers']],
      q: [[6, 15, 'Advance tax, first instalment'], [9, 15, 'Advance tax, second instalment'], [12, 15, 'Advance tax, third instalment'], [3, 15, 'Advance tax, final instalment'],
          [7, 31, 'TDS / TCS return, April to June'], [10, 31, 'TDS / TCS return, July to September'], [1, 31, 'TDS / TCS return, October to December'], [5, 31, 'TDS / TCS return, January to March']],
      a: [[7, 31, 'Income tax return, non-audit cases'], [9, 30, 'Tax audit report'], [10, 31, 'Income tax return, audit cases'], [12, 31, 'GSTR-9, annual GST return']]
    };
    var MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var nextOf = function (e, k) {
      var y = now.getFullYear(), d;
      if (k === 'm') { d = new Date(y, now.getMonth(), e[1]); if (d < now) d = new Date(y, now.getMonth() + 1, e[1]); }
      else { d = new Date(y, e[0] - 1, e[1]); if (d < now) d = new Date(y + 1, e[0] - 1, e[1]); }
      return d;
    };
    var calDraw = function (k) {
      var rows = CAL[k].map(function (e) { var d = nextOf(e, k); return { d: d, t: e[2], n: Math.round((d - now) / 864e5) }; })
        .sort(function (a, b) { return a.d - b.d; }).slice(0, 4);
      $('#cal-list').innerHTML = rows.map(function (x, i) {
        var lab = x.n === 0 ? 'Due today' : x.n === 1 ? 'Tomorrow' : x.n <= 30 ? 'In ' + x.n + ' days' : MN[x.d.getMonth()] + ' ' + x.d.getFullYear();
        return '<li class="cal-row' + (i === 0 ? ' next' : x.n <= 7 ? ' soon' : '') + '"><span class="cal-d">' + x.d.getDate() + '<small>' + MN[x.d.getMonth()] + '</small></span><span class="cal-t">' + x.t + '</span><span class="cal-p">' + (i === 0 ? 'Next \u00b7 ' : '') + lab + '</span></li>';
      }).join('');
    };
    $$('.cal-tabs button', calEl).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('.cal-tabs button', calEl).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        calDraw(b.getAttribute('data-k'));
      });
    });
    calDraw('m');
  }

  /* ---- resources: tick off a checklist as you gather the documents ---- */
  $$('.chk-card').forEach(function (card) {
    var boxes = $$('input[type="checkbox"]', card), cnt = $('.cnt', card), fill = $('.bar i', card);
    var upd = function () {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      cnt.textContent = n === boxes.length ? 'All set. You are ready for the first call.' : n + ' of ' + boxes.length + ' ready';
      fill.style.width = (n / boxes.length * 100) + '%';
      card.classList.toggle('done', n === boxes.length);
    };
    boxes.forEach(function (b) { b.addEventListener('change', upd); });

  });

  /* ---- resources: show the first checklist cards, and the rest on "See all" ---- */
  var chkAll = $('.chk-all');
  if (chkAll) {
    var chkCards = $$('.chk-card', chkAll), chkTotal = chkCards.length;
    var chkBtn = document.createElement('button');
    chkBtn.type = 'button'; chkBtn.className = 'chk-seeall'; chkBtn.setAttribute('aria-expanded', 'false'); chkBtn.setAttribute('aria-controls', 'chk-all');
    var chkResetGroups = null;
    var chkWide = function () { return window.matchMedia('(min-width:900px)').matches; };
    var chkFit = function () {
      if (chkAll.classList.contains('open')) { chkAll.style.maxHeight = ''; return; }
      var n = chkWide() ? 2 : 1, last = chkCards[n - 1], top = chkAll.getBoundingClientRect().top;
      chkAll.style.maxHeight = (last.getBoundingClientRect().bottom - top - 24) + 'px';
    };
    var chkSet = function (open) {
      chkAll.classList.toggle('open', open);
      chkWrap.classList.toggle('open', open);
      chkBtn.setAttribute('aria-expanded', open);
      chkBtn.textContent = open ? 'Show fewer' : 'See all Checklists';
      $$('.chk-gh', chkAll).forEach(function (h) { if (open) h.removeAttribute('inert'); else h.setAttribute('inert', ''); });
      if (!open && chkResetGroups) chkResetGroups();
      var n = chkWide() ? 2 : 1;
      chkCards.forEach(function (c, i) { if (i >= n) { if (open) c.removeAttribute('inert'); else c.setAttribute('inert', ''); } });
      chkFit();
    };
    chkAll.id = 'chk-all';
    var chkWrap = document.createElement('div');                  // holds the list, the feathered fade and the button
    chkWrap.className = 'chk-wrap fold';
    chkAll.parentNode.insertBefore(chkWrap, chkAll);
    chkWrap.appendChild(chkAll); chkWrap.appendChild(chkBtn);
    chkAll.classList.add('fold');
    /* each group is a collapsible row, like the services list on phones: the first stays open, the rest open on tap */
    var chkGroups = $$('.chk-group', chkAll);
    var setGroup = function (g, open) {
      g.classList.toggle('shut', !open);
      var t = $('.chk-gt', g); if (t) t.setAttribute('aria-expanded', open);
      chkFit();
    };
    chkResetGroups = function () { chkGroups.forEach(function (g, i) { setGroup(g, i === 0); }); };
    chkGroups.forEach(function (g, i) {
      var h = $('.chk-gh', g), body = $('.chk-grid', g), n = $$('.chk-card', g).length;
      var t = document.createElement('button');
      t.type = 'button'; t.className = 'chk-gt'; t.setAttribute('aria-expanded', i === 0 ? 'true' : 'false');
      t.innerHTML = '<span class="t">' + h.textContent + '</span><span class="c">' + n + (n === 1 ? ' checklist' : ' checklists') + '</span><span class="pm" aria-hidden="true"></span>';
      body.id = g.id + '-body'; t.setAttribute('aria-controls', body.id);
      h.textContent = ''; h.appendChild(t);
      g.classList.toggle('shut', i !== 0);
      t.addEventListener('click', function () { setGroup(g, g.classList.contains('shut')); });
    });
    var chkHash = function () { return location.hash.length > 1 && !!document.getElementById(decodeURIComponent(location.hash.slice(1))) && chkAll.contains(document.getElementById(decodeURIComponent(location.hash.slice(1)))); };
    chkSet(chkHash());
    if (chkHash()) { var tg0 = document.getElementById(decodeURIComponent(location.hash.slice(1))), gg0 = tg0 && tg0.closest('.chk-group'); if (gg0) setGroup(gg0, true); }
    chkBtn.addEventListener('click', function () {
      var open = !chkAll.classList.contains('open');
      chkSet(open);
      if (!open) { var r = chkAll.getBoundingClientRect(); if (r.top < 0) chkAll.scrollIntoView({ block: 'start' }); }
    });
    document.addEventListener('click', function (e) {              // links to a checklist or group (jump row, other pages) open the lot first
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var t = a.getAttribute('href').length > 1 && document.getElementById(a.getAttribute('href').slice(1));
      if (t && chkAll.contains(t)) { if (!chkAll.classList.contains('open')) chkSet(true); var gg = t.closest('.chk-group'); if (gg) setGroup(gg, true); }
    });
    var chkRt; window.addEventListener('resize', function () { clearTimeout(chkRt); chkRt = setTimeout(chkFit, 150); });
    if (window.ResizeObserver) new ResizeObserver(function () { if (!chkAll.classList.contains('open')) chkFit(); }).observe(chkCards[0]);
  }

  /* ---- resources: arrows for the pinned-notes board ---- */
  var nbRail = $('.nb-rail');
  if (nbRail) {
    var nbStill = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    $$('.nb-arrows button').forEach(function (b) {
      b.addEventListener('click', function () {
        var card = $('.pin', nbRail);
        nbRail.scrollBy({ left: (+b.getAttribute('data-dir')) * (card.offsetWidth + 29), behavior: nbStill ? 'auto' : 'smooth' });
      });
    });
  }

  /* ---- dropdowns: the real <select> stays (for the form data, and as the fallback); a styled list replaces its pop-up ---- */
  $$('.f select').forEach(function (sel, n) {
    var wrap = document.createElement('div'); wrap.className = 'cs cs-on';
    sel.parentNode.insertBefore(wrap, sel); wrap.appendChild(sel);
    sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'cs-btn';
    btn.setAttribute('aria-haspopup', 'listbox'); btn.setAttribute('aria-expanded', 'false');
    var list = document.createElement('ul'); list.className = 'cs-list'; list.setAttribute('role', 'listbox'); list.hidden = true;
    list.id = (sel.id || 'cs' + n) + '-list'; btn.setAttribute('aria-controls', list.id);
    var label = sel.id ? $('label[for="' + sel.id + '"]') : null;
    if (label) { if (!label.id) label.id = sel.id + '-lbl'; btn.setAttribute('aria-labelledby', label.id); }
    var items = [];
    $$('option', sel).forEach(function (o, i) {
      var li = document.createElement('li'); li.setAttribute('role', 'option'); li.className = 'cs-opt'; li.id = list.id + '-' + i;
      li.setAttribute('data-i', i); if (!o.value) li.setAttribute('data-empty', ''); li.textContent = o.textContent;
      list.appendChild(li); items.push(li);
    });
    wrap.appendChild(btn); wrap.appendChild(list);
    var active = 0;
    var sync = function () {
      var o = sel.options[sel.selectedIndex];
      btn.textContent = o ? o.textContent : ''; btn.classList.toggle('cs-ph', !sel.value);
      items.forEach(function (li, i) { li.setAttribute('aria-selected', i === sel.selectedIndex ? 'true' : 'false'); });
    };
    var setActive = function (i, still) {
      active = Math.max(0, Math.min(items.length - 1, i));
      items.forEach(function (li, k) { li.classList.toggle('cs-act', k === active); });
      btn.setAttribute('aria-activedescendant', items[active].id);
      if (!still) items[active].scrollIntoView({ block: 'nearest' });
    };
    var open = function () {
      if (!list.hidden) return;
      list.hidden = false; btn.setAttribute('aria-expanded', 'true'); wrap.classList.add('open');
      var r = btn.getBoundingClientRect(), h = list.offsetHeight;
      wrap.classList.toggle('cs-up', window.innerHeight - r.bottom < h + 12 && r.top > h + 12);
      setActive(Math.max(0, sel.selectedIndex));
    };
    var close = function () {
      if (list.hidden) return;
      list.hidden = true; btn.setAttribute('aria-expanded', 'false'); btn.removeAttribute('aria-activedescendant'); wrap.classList.remove('open');
    };
    var choose = function (i) {
      sel.selectedIndex = i; sel.dispatchEvent(new Event('change', { bubbles: true })); wrap.classList.remove('cs-invalid'); close(); btn.focus();
    };
    btn.addEventListener('click', function () { if (list.hidden) open(); else close(); });
    list.addEventListener('mousedown', function (e) { e.preventDefault(); });
    list.addEventListener('click', function (e) { var li = e.target.closest('.cs-opt'); if (li) choose(+li.getAttribute('data-i')); });
    list.addEventListener('mousemove', function (e) { var li = e.target.closest('.cs-opt'); if (li) setActive(+li.getAttribute('data-i'), true); });
    btn.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); if (list.hidden) open(); else setActive(active + (k === 'ArrowDown' ? 1 : -1)); }
      else if (k === 'Enter' || k === ' ') { e.preventDefault(); if (list.hidden) open(); else choose(active); }
      else if (k === 'Escape') { if (!list.hidden) { e.preventDefault(); close(); } }
      else if (k === 'Home' && !list.hidden) { e.preventDefault(); setActive(0); }
      else if (k === 'End' && !list.hidden) { e.preventDefault(); setActive(items.length - 1); }
      else if (k === 'Tab') { close(); }
      else if (k.length === 1 && !e.ctrlKey && !e.metaKey) {
        var c = k.toLowerCase();
        for (var s = 1; s <= items.length; s++) {
          var idx = (active + s) % items.length;
          if (items[idx].textContent.trim().toLowerCase().indexOf(c) === 0) { if (list.hidden) open(); setActive(idx); break; }
        }
      }
    });
    btn.addEventListener('blur', close);
    document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) close(); });
    if (label) label.addEventListener('click', function (e) { e.preventDefault(); btn.focus(); });
    sel.addEventListener('invalid', function () { wrap.classList.add('cs-invalid'); });
    sel.addEventListener('change', sync);
    if (sel.form) sel.form.addEventListener('reset', function () { setTimeout(sync, 0); });
    sync();
  });

  /* ---- printing: open every answer first, put them back afterwards ---- */
  window.addEventListener('beforeprint', function () { $$('details').forEach(function (d) { d.setAttribute('data-was', d.open ? '1' : '0'); d.open = true; }); });
  window.addEventListener('afterprint', function () { $$('details[data-was]').forEach(function (d) { d.open = d.getAttribute('data-was') === '1'; d.removeAttribute('data-was'); }); });

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
        var pt = s.id === 'contact' ? 22 : PT, pb = s.id === 'contact' ? 26 : PB;   // the form page needs every pixel it can get
        s.style.zoom = 1; s.style.minHeight = '0px'; s.style.paddingTop = '0px'; s.style.paddingBottom = '0px';
        var nat = s.getBoundingClientRect().height;                             // content-only height
        var budget = avail - pt - pb - topCut - botCut - slant * 0.85;
        var top = s.id === 'home' ? 0.84 : (s.id === 'contact' ? 1.05 : 1);   // the form page may grow a touch on large screens                                   // the home hero reads oversized on big screens at 1:1
        var z = Math.max(0.55, Math.min(top, budget / nat * 0.985));
        s.style.setProperty('--z', z.toFixed(3));
        s.style.zoom = z.toFixed(3);
        s.style.paddingTop = ((pt + topCut) / z + slant) + 'px';
        s.style.paddingBottom = ((pb + botCut + gap) / z) + 'px';
        s.style.minHeight = ((avail + gap) / z) + 'px';
      });
    };
    var fitTimer = 0;
    var queueFit = function () { clearTimeout(fitTimer); fitTimer = setTimeout(fitAll, 60); };
    window.addEventListener('resize', queueFit);
    window.addEventListener('aj-refit', queueFit);
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
    form.addEventListener('submit', function (e) { e.preventDefault(); });   // (an inline handler would be blocked by the content security policy)
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

  /* ---- forms: sent to the host's form handling (stored there, then forwarded to our inbox) ---- */
  var guard = function (f) {
    if (f.elements.website && f.elements.website.value) return false; // honeypot
    if (!f.checkValidity()) { f.reportValidity(); return false; }
    return true;
  };
  var sendForm = function (form, okMsg, key) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); if (!guard(form)) return;
      var btn = $('button[type="submit"]', form), msg = $('.msg', form);
      btn.disabled = true; msg.textContent = 'Sending\u2026';
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
        .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); msg.textContent = okMsg; })
        .catch(function () { msg.textContent = 'Sorry, that did not go through. Please try again, or write to info@ajassociatesonline.com.'; })
        .then(function () { btn.disabled = false; });
    });
    if (new RegExp('[?&]sent=' + (key || '1') + '(&|$)').test(location.search)) $('.msg', form).textContent = okMsg;
  };
  var cf = $('#cform'), pf = $('#pform');
  if (cf) sendForm(cf, 'Thank you. Your enquiry has reached our team, and we usually reply within one working day.');
  if (pf) sendForm(pf, 'Thank you. Your proposal has reached our team, and we will be in touch.');

  /* ---- contact: enquiry / booking tabs, and the booking form's date rules (no Sundays) ---- */
  var bf = $('#bform'), fTabs2 = $$('.f-tabs button');
  if (bf) {
    sendForm(bf, 'Thank you. We have your request and will confirm your slot by phone, email or WhatsApp.', 'book');
    var dt = bf.elements.date, pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var iso = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
    var t0 = new Date(), t1 = new Date(t0.getFullYear(), t0.getMonth(), t0.getDate() + 1), t2 = new Date(t0.getFullYear(), t0.getMonth(), t0.getDate() + 60);
    dt.min = iso(t1); dt.max = iso(t2);
    var hol = {};
    try { hol = JSON.parse(($('#holidays') || {}).textContent || '{}'); } catch (err) { hol = {}; }
    var chkDay = function () {
      var d = dt.value ? new Date(dt.value + 'T00:00:00') : null, msg = '';
      if (d && d.getDay() === 0) msg = 'We are closed on Sundays. Please choose Monday to Saturday.';
      else if (d && hol[dt.value]) msg = 'We are closed on ' + hol[dt.value] + '. Please choose another day.';
      dt.setCustomValidity(msg);
      return msg;
    };
    dt.addEventListener('input', chkDay);
    dt.addEventListener('change', function () { if (chkDay()) dt.reportValidity(); });
    var clNext = $('#cl-next'), todayIso = iso(t0);
    var upcoming = Object.keys(hol).filter(function (k) { return k >= todayIso; }).sort()[0];
    if (clNext && upcoming) {
      var ud = new Date(upcoming + 'T00:00:00');
      clNext.textContent = 'Next closure: ' + hol[upcoming] + ', ' + ud.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) + '.';
      clNext.hidden = false;
    }
    /* ---- date picker: the real date input stays underneath (value and validation); a styled calendar replaces the system pop-up ---- */
    var dpWrap = document.createElement('div'); dpWrap.className = 'dp dp-on';
    dt.parentNode.insertBefore(dpWrap, dt); dpWrap.appendChild(dt); dt.tabIndex = -1; dt.setAttribute('aria-hidden', 'true');
    var dpBtn = document.createElement('button'); dpBtn.type = 'button'; dpBtn.className = 'dp-btn';
    dpBtn.setAttribute('aria-haspopup', 'dialog'); dpBtn.setAttribute('aria-expanded', 'false');
    var dpLab = $('label[for="' + dt.id + '"]', bf);
    if (dpLab) { if (!dpLab.id) dpLab.id = dt.id + '-lbl'; dpBtn.setAttribute('aria-labelledby', dpLab.id); dpLab.addEventListener('click', function (e) { e.preventDefault(); dpBtn.focus(); }); }
    var pop = document.createElement('div'); pop.className = 'dp-pop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Choose a date'); pop.hidden = true;
    dpWrap.appendChild(dpBtn); dpWrap.appendChild(pop);
    var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var DOW = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    var parseIso = function (s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); };
    var okDay = function (s) { return s >= dt.min && s <= dt.max && parseIso(s).getDay() !== 0 && !hol[s]; };
    var fmtDmy = function (s) { var p = s.split('-'); return p[2] + '-' + p[1] + '-' + p[0]; };
    var view = new Date(parseIso(dt.min).getFullYear(), parseIso(dt.min).getMonth(), 1), focusIso = '';
    var chevL = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>', chevR = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';
    var dpSync = function () { dpBtn.textContent = dt.value ? fmtDmy(dt.value) : 'Choose a date'; dpBtn.classList.toggle('dp-ph', !dt.value); };
    var render = function () {
      var y = view.getFullYear(), m = view.getMonth(), lead = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
      var prevOk = iso(new Date(y, m, 0)) >= dt.min, nextOk = iso(new Date(y, m + 1, 1)) <= dt.max;
      var h = '<div class="dp-head"><button type="button" class="dp-nav" data-nav="-1" aria-label="Previous month"' + (prevOk ? '' : ' disabled') + '>' + chevL + '</button>' +
        '<span class="dp-title">' + MONTHS[m] + ' ' + y + '</span>' +
        '<button type="button" class="dp-nav" data-nav="1" aria-label="Next month"' + (nextOk ? '' : ' disabled') + '>' + chevR + '</button></div>' +
        '<div class="dp-dow">' + DOW.map(function (d) { return '<span>' + d + '</span>'; }).join('') + '</div><div class="dp-grid">';
      for (var i = 0; i < lead; i++) h += '<span></span>';
      for (var d = 1; d <= days; d++) {
        var dd = new Date(y, m, d), s = iso(dd), ok = okDay(s);
        h += '<button type="button" class="dp-day' + (s === dt.value ? ' sel' : '') + (s === todayIso ? ' today' : '') + (hol[s] ? ' hol' : '') + '" data-iso="' + s + '"' +
          (ok ? '' : ' disabled') + (hol[s] ? ' title="Closed: ' + hol[s] + '"' : '') +
          ' aria-label="' + dd.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) + (hol[s] ? ', closed for ' + hol[s] : '') + '"' +
          ' tabindex="' + (s === focusIso ? 0 : -1) + '">' + d + '</button>';
      }
      h += '</div><p class="dp-foot">Closed on Sundays and public holidays.</p><div class="dp-act"><button type="button" class="dp-clear">Clear</button></div>';
      pop.innerHTML = h;
    };
    var focusDay = function () { var b = $('.dp-day[tabindex="0"]', pop) || $('.dp-day:not(:disabled)', pop); if (b) b.focus(); };
    var firstOk = function () { var b = $('.dp-day:not(:disabled)', pop); return b ? b.getAttribute('data-iso') : ''; };
    var openPop = function () {
      if (!pop.hidden) return;
      var base = dt.value ? parseIso(dt.value) : parseIso(dt.min);
      view = new Date(base.getFullYear(), base.getMonth(), 1); focusIso = dt.value && okDay(dt.value) ? dt.value : '';
      render(); if (!focusIso) { focusIso = firstOk(); render(); }
      pop.hidden = false; dpBtn.setAttribute('aria-expanded', 'true'); dpWrap.classList.add('open');
      var r = dpBtn.getBoundingClientRect(), h = pop.offsetHeight, w = pop.offsetWidth;
      dpWrap.classList.toggle('dp-up', window.innerHeight - r.bottom < h + 12 && r.top > h + 12);
      dpWrap.classList.toggle('dp-right', r.left + w > window.innerWidth - 8);
      focusDay();
    };
    var closePop = function (back) {
      if (pop.hidden) return;
      pop.hidden = true; dpBtn.setAttribute('aria-expanded', 'false'); dpWrap.classList.remove('open');
      if (back) dpBtn.focus();
    };
    var setValue = function (s) {
      dt.value = s; dt.dispatchEvent(new Event('input', { bubbles: true })); dt.dispatchEvent(new Event('change', { bubbles: true }));
      dpWrap.classList.remove('dp-invalid'); dpSync();
    };
    dpBtn.addEventListener('click', function () { if (pop.hidden) openPop(); else closePop(false); });
    dpBtn.addEventListener('keydown', function (e) { if (e.key === 'ArrowDown') { e.preventDefault(); openPop(); } });
    pop.addEventListener('click', function (e) {
      var day = e.target.closest('.dp-day'), nav = e.target.closest('.dp-nav');
      if (day && !day.disabled) { setValue(day.getAttribute('data-iso')); closePop(true); }
      else if (nav && !nav.disabled) {
        view = new Date(view.getFullYear(), view.getMonth() + (+nav.getAttribute('data-nav')), 1); focusIso = '';
        render(); focusIso = firstOk(); render();
        var again = $('.dp-nav[data-nav="' + nav.getAttribute('data-nav') + '"]', pop); if (again && !again.disabled) again.focus(); else focusDay();
      }
      else if (e.target.closest('.dp-clear')) { setValue(''); closePop(true); }
    });
    pop.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'Escape') { e.preventDefault(); closePop(true); return; }
      var day = e.target.closest && e.target.closest('.dp-day'); if (!day) return;
      var step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[k];
      if (step === undefined && k !== 'PageUp' && k !== 'PageDown') return;
      e.preventDefault();
      var cur = parseIso(day.getAttribute('data-iso')), target = null, n, t;
      if (step !== undefined) {
        for (n = 1; n <= 70; n++) { t = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + step * n); if (okDay(iso(t))) { target = t; break; } if (iso(t) > dt.max || iso(t) < dt.min) break; }
      } else {
        t = new Date(cur.getFullYear(), cur.getMonth() + (k === 'PageUp' ? -1 : 1), cur.getDate());
        for (n = 0; n <= 31; n++) { var c2 = new Date(t.getFullYear(), t.getMonth(), t.getDate() + n); if (okDay(iso(c2))) { target = c2; break; } }
      }
      if (!target) return;
      view = new Date(target.getFullYear(), target.getMonth(), 1); focusIso = iso(target); render(); focusDay();
    });
    pop.addEventListener('focusout', function (e) { if (e.relatedTarget && !dpWrap.contains(e.relatedTarget)) closePop(false); });
    document.addEventListener('click', function (e) { if (!dpWrap.contains(e.target)) closePop(false); });
    dt.addEventListener('invalid', function () { dpWrap.classList.add('dp-invalid'); });
    dt.addEventListener('change', dpSync);
    bf.addEventListener('reset', function () { setTimeout(dpSync, 0); });
    dpSync();

    if (fTabs2.length) {
      var panes = { enquire: $('#pane-enquire'), book: $('#pane-book') };
      var showPane = function (k) {
        fTabs2.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-pane') === k ? 'true' : 'false'); });
        Object.keys(panes).forEach(function (x) { panes[x].hidden = x !== k; });
        window.dispatchEvent(new Event('aj-refit'));   // the two tabs differ in height, so the fit-to-screen size is worked out again
      };
      fTabs2.forEach(function (b) { b.addEventListener('click', function () { showPane(b.getAttribute('data-pane')); }); });
      showPane(/[?&]sent=book/.test(location.search) ? 'book' : 'enquire');   // always opens on the enquiry tab
    }
  }
})();
