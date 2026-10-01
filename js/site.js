/* BENRAM · homepage sketch.
   The signature: the 43 botanicals of Ben's logo swirl as a vortex around the age question, then each one spirals home and
   the bottle closes around the name, docks into the hero and keeps breathing. Around it: header (MV:hd2 + MV:b65 + drawer),
   the recurring drawn botanical (MV:g86), the category corridor (C12), the shelf (C4), the sentence that inks itself
   (MV:g48), the house of brands with the picture that changes (MV:g05), and the reveal base layer. */
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var still = function () { return reduced || doc.classList.contains("a11y-still"); };
  if (window.gsap) gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
  document.querySelectorAll("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });

  function inView(el, f, frac) {
    function chk() { var r = el.getBoundingClientRect(); if (r.top < innerHeight * (frac || .88) && r.bottom > 0) { off(); f(); } }
    function off() { removeEventListener("scroll", chk); removeEventListener("resize", chk); }
    addEventListener("scroll", chk, { passive: true }); addEventListener("resize", chk);
    requestAnimationFrame(chk); setTimeout(chk, 300);
  }

  /* ---------- header: headroom ---------- */
  var hd = document.getElementById("hd");
  (function headroom() {
    var last = scrollY, raf = 0;
    function upd() {
      raf = 0;
      var y = scrollY, d = y - last, top = hd.offsetHeight + 24;
      hd.classList.toggle("is-scrolled", y > 8);
      var hold = hd.classList.contains("menu-open") || !!hd.querySelector(":focus-visible");
      if (y <= top || hold) { hd.classList.remove("is-hidden"); last = y; return; }
      if (Math.abs(d) < 6) return;
      hd.classList.toggle("is-hidden", d > 0);
      last = y;
    }
    addEventListener("scroll", function () { if (!raf) raf = requestAnimationFrame(upd); }, { passive: true });
    hd.addEventListener("focusin", upd); upd();
  })();

  /* ---------- mega menu (MV:b65): hover intent, click, keyboard ---------- */
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var megas = [].slice.call(document.querySelectorAll(".mega"));
  function setMega(li, v, focusFirst) {
    var trig = li.querySelector(".nav-trig"), links = li.querySelectorAll(".mg a");
    if (v) megas.forEach(function (o) { if (o !== li) setMega(o, false); });
    var was = li.classList.contains("open");
    li.classList.toggle("open", v); trig.setAttribute("aria-expanded", String(v));
    links.forEach(function (a) { a.tabIndex = v ? 0 : -1; });
    hd.classList.toggle("menu-open", megas.some(function (o) { return o.classList.contains("open"); }));
    if (v && !was) li.querySelectorAll('[data-draw-on="menu"] svg').forEach(function (s) { pen(s, .9); });
    if (v && focusFirst && links[0]) setTimeout(function () { links[0].focus(); }, 60);
  }
  megas.forEach(function (li) {
    var trig = li.querySelector(".nav-trig"), tOpen, tClose;
    setMega(li, false);
    trig.addEventListener("click", function () { setMega(li, !li.classList.contains("open")); });
    if (fine) {
      li.addEventListener("mouseenter", function () { clearTimeout(tClose); tOpen = setTimeout(function () { setMega(li, true); }, 80); });
      li.addEventListener("mouseleave", function () { clearTimeout(tOpen); tClose = setTimeout(function () { setMega(li, false); }, 180); });
    }
    trig.addEventListener("keydown", function (e) { if (e.key === "ArrowDown") { e.preventDefault(); setMega(li, true, true); } });
    li.addEventListener("keydown", function (e) { if (e.key === "Escape" && li.classList.contains("open")) { setMega(li, false); trig.focus(); } });
    li.addEventListener("focusout", function (e) { if (!li.contains(e.relatedTarget)) setMega(li, false); });
    li.querySelectorAll(".mg a").forEach(function (a) { a.addEventListener("click", function () { setMega(li, false); }); });
  });
  document.addEventListener("click", function (e) { megas.forEach(function (li) { if (!li.contains(e.target)) setMega(li, false); }); });

  /* ---------- mobile drawer ---------- */
  (function drawer() {
    var root = document.getElementById("md"), burger = hd.querySelector(".burger");
    var panel = root.querySelector(".md-panel"), last = null;
    root.querySelectorAll(".md-item").forEach(function (el, i) { el.style.setProperty("--i", i); });
    panel.inert = true;
    function toggleSub(btn, force) {
      var sub = btn.nextElementSibling, open = force !== undefined ? force : !sub.classList.contains("open");
      sub.classList.toggle("open", open); btn.setAttribute("aria-expanded", String(open));
      sub.querySelectorAll("a").forEach(function (a) { a.tabIndex = open ? 0 : -1; });
    }
    function set(open) {
      root.classList.toggle("open", open); panel.inert = !open;
      burger.setAttribute("aria-expanded", String(open)); hd.classList.toggle("menu-open", open);
      doc.classList.toggle("md-open", open);
      doc.style.scrollbarGutter = open ? "stable" : ""; doc.style.overflow = open ? "hidden" : "";
      if (open) { last = document.activeElement; setTimeout(function () { root.querySelector(".md-close").focus(); }, 180); }
      else { root.querySelectorAll(".md-acc").forEach(function (b) { toggleSub(b, false); }); (last && last !== document.body && last.offsetParent ? last : burger).focus(); }
    }
    root.querySelectorAll(".md-acc").forEach(function (b) { toggleSub(b, false); b.addEventListener("click", function () { toggleSub(b); }); });
    burger.addEventListener("click", function () { set(!root.classList.contains("open")); });
    root.querySelector(".md-close").addEventListener("click", function () { set(false); });
    root.querySelector(".md-scrim").addEventListener("click", function () { set(false); });
    root.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { set(false); }); });
    addEventListener("keydown", function (e) {
      if (!root.classList.contains("open")) return;
      if (e.key === "Escape") { set(false); return; }
      if (e.key !== "Tab") return;
      var f = [].slice.call(panel.querySelectorAll("a,button")).filter(function (x) { return x.tabIndex !== -1 && x.offsetParent !== null; });
      var i = f.indexOf(document.activeElement);
      var n = e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i === f.length - 1 ? 0 : i + 1);
      e.preventDefault(); f[n].focus();
    });
  })();

  /* ==========================================================================
     THE LOGO: injected once, every botanical measured before anything moves
     ========================================================================== */
  var bottle = document.getElementById("bottle");
  bottle.insertAdjacentHTML("afterbegin", window.BENRAM_LOGO || "");
  var svg = bottle.querySelector("svg"); svg.setAttribute("aria-hidden", "true"); svg.removeAttribute("role");
  var els = [].slice.call(svg.querySelectorAll(".el")), wm = svg.querySelector(".wm");
  var BOX = els.map(function (el) { var b = el.getBBox(); return { x: b.x, y: b.y, w: b.width, h: b.height, cx: b.x + b.width / 2, cy: b.y + b.height / 2 }; });
  var C = { x: 385.4, y: 733.5 };

  /* ---------- the drawn botanical: a copy of one logo element, traced by a pen, then inked (on MV:g86) ---------- */
  var slots = [].slice.call(document.querySelectorAll("[data-draw]"));
  function strokeFor(s) { var bw = +s.dataset.bw, w = s.getBoundingClientRect().width || 1; s.style.setProperty("--sw", (bw / w * 1.15).toFixed(3) + "px"); }
  slots.forEach(function (slot) {
    var i = +slot.dataset.draw, b = BOX[i], pad = Math.max(b.w, b.h) * .04;
    var s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    s.setAttribute("class", "draw"); s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false");
    s.setAttribute("viewBox", [b.x - pad, b.y - pad, b.w + pad * 2, b.h + pad * 2].map(function (v) { return v.toFixed(1); }).join(" "));
    var g = els[i].cloneNode(true); g.removeAttribute("transform"); g.removeAttribute("style"); g.setAttribute("class", "el");
    s.appendChild(g); slot.appendChild(s);
    s.dataset.bw = b.w + pad * 2;
    if (!still()) { s.classList.add("is-pen"); gsap.set(s.querySelectorAll("path,polygon,circle"), { drawSVG: "0%" }); }
  });
  var drawSvgs = slots.map(function (s) { return s.querySelector("svg"); });
  function sizeStrokes() { drawSvgs.forEach(function (s) { strokeFor(s); }); }
  sizeStrokes(); addEventListener("resize", sizeStrokes);
  function pen(s, speed) {
    if (still()) { s.classList.remove("is-pen"); gsap.set(s.querySelectorAll("path,polygon,circle"), { drawSVG: "100%" }); return; }
    var parts = s.querySelectorAll("path,polygon,circle");
    gsap.killTweensOf(parts); s.classList.add("is-pen"); strokeFor(s);
    gsap.fromTo(parts, { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.9 * (speed || 1), ease: "power2.inOut",
      stagger: { amount: Math.min(1.1, parts.length * .03) * (speed || 1) },
      onComplete: function () { s.classList.remove("is-pen"); } });
  }
  slots.forEach(function (slot, k) {
    if (slot.dataset.drawOn) return;   // menu and route slots are drawn by their own owners
    // drawn when it is really seen: an observer clips by the corridor too, so a card off to the side waits for its turn
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); setTimeout(function () { pen(drawSvgs[k]); }, 120); } }, { threshold: .45 });
      io.observe(slot);
    } else inView(slot, function () { pen(drawSvgs[k]); }, .82);
    var card = slot.closest(".cat");
    if (card && fine) card.addEventListener("mouseenter", function () { if (!drawSvgs[k].classList.contains("is-pen")) pen(drawSvgs[k], .6); });
  });

  /* ==========================================================================
     THE SIGNATURE: vortex → bottle → hero
     ========================================================================== */
  var hero = document.getElementById("hero"), intro = document.getElementById("intro");
  var age = document.getElementById("age"), ageNo = document.getElementById("age-no"), skipBtn = intro.querySelector("[data-skip]");
  hero.querySelectorAll(".rv").forEach(function (el, i) { el.style.setProperty("--i", i); });
  var params = new URLSearchParams(location.search);
  if (params.has("intro")) { try { localStorage.removeItem("benram-18"); sessionStorage.removeItem("benram-seen"); } catch (e) {} }
  var adult = false, seen = false;
  try { adult = localStorage.getItem("benram-18") === "1"; seen = sessionStorage.getItem("benram-seen") === "1"; } catch (e) {}
  // the QA gates open the page in headless Chrome, which no visitor uses: they test the page behind the gate.
  // The gate itself is filmed with ?intro (_tools/film-intro.mjs).
  if (/HeadlessChrome/.test(navigator.userAgent) && !params.has("intro")) { adult = true; seen = true; }
  var shut = [hd, document.getElementById("main"), document.querySelector(".ft"), document.querySelector(".fabs")];
  function lockPage(v) { shut.forEach(function (x) { if (x) x.inert = v; }); }

  var E = els.map(function (el, i) {
    var b = BOX[i], h = ((i * .618034) % 1) * 2 - 1;                 // level in the funnel, -1 top .. 1 bottom
    return { el: el, b: b, h: h, a0: i * 2.39996, w: .55 + ((i * .37) % 1) * .5, rot0: ((i * 97) % 360) - 180,
      rotW: (((i * 13) % 7) - 3) * 9, s: (innerWidth < 768 ? .85 : 1) + ((i * .41) % 1) * (innerWidth < 768 ? .5 : .75), p: 0 };
  });
  var V = { t: 0, appear: 0, R1: 900, Hs: 500, spin: 1, running: false, done: false };
  function measureVortex(sc) {
    var r = bottle.getBoundingClientRect(), k = (r.height / 1466.98) || .5;
    V.R1 = Math.min(innerWidth * .4, innerHeight * .52, 640) / k;
    V.Hs = innerHeight * .3 / k;
  }
  function paintVortex() {
    for (var i = 0; i < E.length; i++) {
      var e = E[i], p = e.p, q = 1 - p, a = e.a0 + V.t * e.w * V.spin;
      var r = (V.R1 * (.3 + .7 * (1 - e.h) / 2)) * (1 - p * .6);
      var z = Math.sin(a), depth = .72 + .5 * (z + 1) / 2;
      var vx = C.x + r * Math.cos(a), vy = C.y + e.h * V.Hs + r * .3 * z;
      var X = vx * q + e.b.cx * p, Y = vy * q + e.b.cy * p;
      var sc = e.s * depth * q + p, rot = (e.rot0 + V.t * e.rotW) * q;
      e.el.setAttribute("transform", "translate(" + X.toFixed(1) + " " + Y.toFixed(1) + ") rotate(" + rot.toFixed(1) + ") scale(" + sc.toFixed(3) + ") translate(" + (-e.b.cx).toFixed(1) + " " + (-e.b.cy).toFixed(1) + ")");
      e.el.style.opacity = (V.appear * ((.45 + .55 * (z + 1) / 2) * q + p)).toFixed(3);
    }
  }
  function tick(time, dt) { V.t += (dt || 16) / 1000; paintVortex(); }
  function startSwirl() {
    V.running = true; measureVortex();
    gsap.set(wm, { opacity: 0 });
    gsap.ticker.add(tick);
    gsap.to(V, { appear: 1, duration: 1.2, ease: "power2.out" });
  }
  function centreBottle() {
    var r = bottle.getBoundingClientRect(), sc = Math.min(innerWidth < 768 ? 1.9 : 1.15, innerHeight * .78 / r.height);
    gsap.set(bottle, { x: innerWidth / 2 - (r.left + r.width / 2), y: innerHeight / 2 - (r.top + r.height / 2), scale: sc });
  }
  function wordmarkIn(d) {
    var letters = wm.querySelectorAll("path"), line = wm.querySelectorAll("polygon,circle");
    gsap.set(wm, { opacity: 1 });
    gsap.fromTo(letters, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .6, ease: "power2.out", stagger: .025, delay: d || 0 });
    gsap.fromTo(line, { scaleX: 0, transformOrigin: "50% 50%" }, { scaleX: 1, duration: .8, ease: "power3.out", delay: (d || 0) + .15 });
  }
  function land() {                                                    // bottle closed: dock into the hero, open the page
    intro.classList.remove("is-flying"); skipBtn.hidden = true;
    if (intro.contains(document.activeElement) || document.activeElement === document.body) document.getElementById("main").focus({ preventScroll: true });
    gsap.ticker.remove(tick); V.running = false; V.done = true;
    E.forEach(function (e) { e.el.removeAttribute("transform"); e.el.style.opacity = ""; });
    doc.classList.add("intro-out");
    gsap.to(bottle, { x: 0, y: 0, scale: 1, duration: 1.15, ease: "power3.inOut", onComplete: finish });
    setTimeout(function () { hero.classList.add("is-in"); }, 380);
  }
  function finish() {
    gsap.set(bottle, { clearProps: "transform" });
    doc.classList.remove("is-intro", "intro-out"); lockPage(false);
    try { sessionStorage.setItem("benram-seen", "1"); } catch (e) {}
    hero.classList.add("is-in"); breathe();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  var converging = null;
  function converge(fast) {
    intro.classList.add("is-flying"); skipBtn.hidden = false;
    var tl = gsap.timeline({ onComplete: land });
    tl.to(V, { spin: fast ? 1.6 : 2.2, duration: .5, ease: "power2.in" }, 0);
    tl.to(E, { p: 1, duration: fast ? 1.2 : 1.5, ease: "power3.inOut", stagger: { each: fast ? .016 : .022, from: "random" } }, fast ? .1 : .2);
    tl.add(function () { wordmarkIn(0); }, ">-0.35");
    tl.to({}, { duration: .45 });
    converging = tl;
  }
  function skip() {
    if (!V.running && !converging) return;
    if (converging) converging.kill();
    E.forEach(function (e) { e.p = 1; }); paintVortex();
    gsap.set(wm, { opacity: 1 }); gsap.set(wm.querySelectorAll("path,polygon,circle"), { clearProps: "all" });
    land();
  }
  skipBtn.addEventListener("click", skip);
  addEventListener("keydown", function (e) {
    if (e.key === "Escape" && intro.classList.contains("is-flying")) skip();
    if (e.key !== "Tab" || !doc.classList.contains("is-intro")) return;          // the gate is a modal: Tab cycles inside it
    var f = [].slice.call(intro.querySelectorAll("button")).filter(function (x) { return !x.hidden && !x.closest("[hidden]") && !x.closest(".gone"); });
    if (!f.length) return; var i = f.indexOf(document.activeElement);
    e.preventDefault(); f[e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i + 1) % f.length].focus();
  });

  function staticIntro() {                                              // reduced motion: the question on a still page
    age.hidden = false; setTimeout(function () { age.querySelector("[data-age=yes]").focus(); }, 60);
  }
  function openPageStill() {
    doc.classList.add("intro-out");
    setTimeout(function () { doc.classList.remove("is-intro", "intro-out"); lockPage(false); hero.classList.add("is-in"); if (window.ScrollTrigger) ScrollTrigger.refresh(); }, 350);
    try { sessionStorage.setItem("benram-seen", "1"); } catch (e) {}
  }
  age.querySelector("[data-age=yes]").addEventListener("click", function () {
    try { localStorage.setItem("benram-18", "1"); } catch (e) {}
    age.classList.add("gone"); age.setAttribute("aria-hidden", "true");
    if (still()) { openPageStill(); return; }
    setTimeout(function () { age.hidden = true; }, 420);
    converge(false);
  });
  age.querySelector("[data-age=no]").addEventListener("click", function () {
    age.hidden = true; ageNo.hidden = false; if (V.running) gsap.to(V, { spin: .35, duration: 1.2 });
  });

  if (seen && adult) {                                                   // same visit, back on the home page: no intro
    hero.classList.add("is-in"); gsap.set(wm, { opacity: 1 }); breathe();
  } else {
    doc.classList.add("is-intro"); lockPage(true);
    if (still()) { staticIntro(); }
    else {
      centreBottle(); startSwirl();
      if (adult) { age.hidden = true; setTimeout(function () { converge(true); }, 900); }
      else setTimeout(function () { age.querySelector("[data-age=yes]").focus({ preventScroll: true }); }, 400);
    }
  }
  addEventListener("resize", function () { if (V.running) { gsap.set(bottle, { clearProps: "transform" }); centreBottle(); measureVortex(); } });

  /* ---------- after landing: the bottle breathes, and leans away from the cursor like leaves in a draught ---------- */
  function breathe() {
    if (still()) return;
    var ptr = null, live = true, t0 = performance.now();
    var W = E.map(function (e, i) { return { px: e.b.cx, py: e.b.y + e.b.h, amp: .5 + (i % 5) * .18, ph: i * 1.7, ox: 0, oy: 0, ro: 0 }; });
    svg.addEventListener("pointermove", function (ev) {
      var m = svg.getScreenCTM(); if (!m) return; var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY; pt = pt.matrixTransform(m.inverse());
      ptr = { x: pt.x, y: pt.y };
    });
    hero.addEventListener("pointerleave", function () { ptr = null; });
    new IntersectionObserver(function (es) { live = es[0].isIntersecting; }).observe(hero);
    gsap.ticker.add(function () {
      if (!live || doc.classList.contains("a11y-still")) return;
      var t = (performance.now() - t0) / 1000;
      for (var i = 0; i < E.length; i++) {
        var e = E[i], w = W[i], tx = 0, ty = 0, tr = 0;
        if (ptr) {
          var dx = e.b.cx - ptr.x, dy = e.b.cy - ptr.y, d = Math.sqrt(dx * dx + dy * dy), f = Math.max(0, 1 - d / 190);
          if (f > 0) { tx = dx / (d || 1) * 7 * f; ty = dy / (d || 1) * 5 * f; tr = (dx > 0 ? 1 : -1) * 5 * f; }
        }
        w.ox += (tx - w.ox) * .08; w.oy += (ty - w.oy) * .08; w.ro += (tr - w.ro) * .08;
        var sway = Math.sin(t * .7 + w.ph) * w.amp;
        e.el.setAttribute("transform", "translate(" + w.ox.toFixed(2) + " " + w.oy.toFixed(2) + ") rotate(" + (sway + w.ro).toFixed(2) + " " + w.px.toFixed(1) + " " + w.py.toFixed(1) + ")");
      }
    });
  }

  /* ---------- the corridor (C12): drag with the mouse, buttons, native swipe on touch ---------- */
  (function corridor() {
    var c = document.querySelector("[data-corridor]"), prev = document.querySelector('[data-cor="-1"]'), next = document.querySelector('[data-cor="1"]');
    function step() { var card = c.querySelector(".cat"); return card ? (card.offsetWidth + 16) * 2 : 400; }
    function upd() { var max = c.scrollWidth - c.clientWidth, x = Math.abs(c.scrollLeft); prev.disabled = x < 4; next.disabled = x > max - 4; }
    prev.addEventListener("click", function () { c.scrollBy({ left: step(), behavior: reduced ? "auto" : "smooth" }); });
    next.addEventListener("click", function () { c.scrollBy({ left: -step(), behavior: reduced ? "auto" : "smooth" }); });
    c.addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
    var drag = null;
    c.addEventListener("pointerdown", function (e) { if (e.pointerType !== "mouse" || e.button !== 0) return; drag = { x: e.clientX, s: c.scrollLeft, moved: false }; });
    addEventListener("pointermove", function (e) {
      if (!drag) return; var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 5) { drag.moved = true; c.classList.add("is-drag"); }
      if (drag.moved) c.scrollLeft = drag.s - dx;
    });
    addEventListener("pointerup", function () { if (!drag) return; setTimeout(function () { c.classList.remove("is-drag"); }, 0); drag = null; });
  })();

  /* ---------- the shelf (C4) ---------- */
  (function shelf() {
    var grid = document.querySelector("[data-grid]"), cart = document.querySelector("[data-cart]"), count = cart.querySelector(".count"), n = 0;
    var money = function (v) { return v.toLocaleString("he-IL", { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + " ₪"; };
    grid.innerHTML = window.BENRAM_SHELF.map(function (p, i) {
      var per = (p.price / p.ml * 100).toFixed(2), facts = p.ml + ' מ"ל · ' + p.abv + "% אלכוהול" + (p.kosher ? " · כשר" : "");
      return '<article class="card reveal" style="--i:' + (i % 4) + '">' +
        '<a class="card-a" href="#picks" aria-label="' + p.name + ", " + money(p.price) + '">' +
        '<div class="card-img"><img src="images/stock/' + p.img + '.webp" alt="" width="800" height="1000" loading="lazy">' + (p.tag ? '<span class="card-tag">' + p.tag + "</span>" : "") + "</div>" +
        '<span class="card-origin">' + p.origin + "</span><h3>" + p.name + '</h3><span class="card-facts">' + facts + "</span></a>" +
        '<span class="card-price"><b>' + money(p.price) + "</b><small>" + money(+per) + ' ל-100 מ"ל</small></span>' +
        '<button class="card-add" type="button" aria-label="הוספה לסל: ' + p.name + '"><svg class="ic" aria-hidden="true"><use href="#i-bag"/></svg><span>הוספה לסל</span></button></article>';
    }).join("");
    grid.addEventListener("click", function (e) {
      var b = e.target.closest(".card-add"); if (!b) return;
      var on = !b.classList.contains("is-added"); b.classList.toggle("is-added", on);
      b.lastChild.textContent = on ? "בסל" : "הוספה לסל"; n += on ? 1 : -1;
      count.hidden = n < 1; count.textContent = n; cart.setAttribute("aria-label", "סל הקניות, " + n + " פריטים");
    });
  })();

  /* ---------- the sentence inks itself, word by word (MV:g48) ---------- */
  (function ink() {
    var h = document.querySelector("[data-ink]"); if (!h) return;
    var words = h.textContent.trim().split(/\s+/);
    h.setAttribute("aria-label", h.textContent.trim());
    h.innerHTML = words.map(function (w) { return '<span class="w" aria-hidden="true"><span class="wi">' + w + "</span></span>"; }).join(" ");
    var spans = [].slice.call(h.querySelectorAll(".w")), inner = h.querySelectorAll(".wi");
    var mono = h.closest(".mono"), art = mono.querySelector(".mono-art");
    if (still() || !window.ScrollTrigger) { mono.classList.add("static"); return; }
    // the words rise out of their own line, one after another, and ink as they land (scrubbed with the scroll)
    gsap.timeline({ scrollTrigger: { trigger: h, start: "top 100%", end: "top 62%", scrub: .4,
        onUpdate: function (st) { var k = Math.round(st.progress * spans.length); spans.forEach(function (s, i) { s.classList.toggle("on", i < k); }); } } })
      .fromTo(inner, { yPercent: 110, rotate: 5 }, { yPercent: 0, rotate: 0, ease: "power3.out", stagger: .18, duration: 1, immediateRender: false });   // hidden only once the line is on its way in, below the fold
    // the leaf: drifts up and turns with the scroll, and sways by itself once it has been drawn
    gsap.fromTo(art, { y: 40, rotate: -10 }, { y: -30, rotate: 6, ease: "none", scrollTrigger: { trigger: mono, start: "top bottom", end: "bottom top", scrub: true } });
    var leaf = art.querySelector(".draw");
    if (leaf) gsap.to(leaf, { rotate: 4, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2.4 });
  })();

  /* ---------- house of brands: the route (MV:g45). The path is built from the real dot positions, so it always passes
     through every stop at every width; each stop lights up, and its botanical draws itself, when the line reaches it ---------- */
  (function route() {
    var root = document.querySelector(".route"); if (!root) return;
    var svg = root.querySelector(".route-svg"), path = root.querySelector(".route-line");
    var stops = [].slice.call(root.querySelectorAll(".stop")), dots = stops.map(function (s) { return s.querySelector(".stop-dot"); });
    var arts = stops.map(function (s) { return s.querySelector(".draw"); }), lit = stops.map(function () { return false; });
    var vertical = false;   // phone: the route runs down the page, so its tip follows the reading line, not the section's end
    function build() {
      var R = root.getBoundingClientRect(), P = dots.map(function (d) { var r = d.getBoundingClientRect(); return [r.left + r.width / 2 - R.left, r.top + r.height / 2 - R.top]; });
      svg.setAttribute("viewBox", "0 0 " + Math.round(R.width) + " " + Math.round(R.height));
      vertical = Math.abs(P[1][0] - P[0][0]) < 4; var d = "M" + P[0][0].toFixed(1) + "," + P[0][1].toFixed(1);
      for (var i = 1; i < P.length; i++) {
        var a = P[i - 1], b = P[i], w = (i % 2 ? 1 : -1);
        if (vertical) { var my = (b[1] - a[1]) / 2; d += " C" + (a[0] + 14 * w) + "," + (a[1] + my * .6) + " " + (b[0] + 14 * w) + "," + (b[1] - my * .6) + " " + b[0] + "," + b[1]; }
        else { var mx = (b[0] - a[0]) / 2; d += " C" + (a[0] + mx * .7) + "," + (a[1] - 46 * w) + " " + (b[0] - mx * .7) + "," + (b[1] + 46 * w) + " " + b[0] + "," + b[1]; }
      }
      path.setAttribute("d", d);
    }
    function light(i, on) {
      if (lit[i] === on) return; lit[i] = on; stops[i].classList.toggle("is-lit", on);
      if (on && arts[i]) pen(arts[i], .8);
    }
    build(); addEventListener("resize", build); addEventListener("load", build);
    if (still() || !window.ScrollTrigger) { stops.forEach(function (s, i) { light(i, true); }); gsap.set(path, { drawSVG: "100%" }); return; }
    gsap.set(path, { drawSVG: "0%" });
    ScrollTrigger.create({ trigger: root, start: function () { return vertical ? "top 78%" : "top 72%"; }, end: function () { return vertical ? "bottom 82%" : "bottom 60%"; }, scrub: .5, invalidateOnRefresh: true,
      onRefresh: build,
      onUpdate: function (st) {
        gsap.set(path, { drawSVG: (st.progress * 100).toFixed(2) + "%" });
        stops.forEach(function (s, i) { light(i, st.progress >= (i / (stops.length - 1)) * .98 - .01); });
      } });
  })();

  /* ---------- bar tools: the logo leaves the bottle. Each mark already sits on its tool; the flight starts it at the exact
     place and size of the same botanical inside the small logo, so the logo really loses that piece as it flies ---------- */
  (function pour() {
    var root = document.querySelector(".pour"), src = root && root.querySelector(".pour-src"); if (!src) return;
    src.innerHTML = window.BENRAM_LOGO || "";
    var mini = src.querySelector("svg"); mini.setAttribute("aria-hidden", "true"); mini.setAttribute("focusable", "false"); mini.removeAttribute("role"); mini.removeAttribute("aria-label");
    var VBW = 770.78;
    var marks = [].slice.call(root.querySelectorAll(".pour-mark")).map(function (m) {
      var d = m.querySelector(".draw"), vb = d.getAttribute("viewBox").split(" ").map(Number);
      m.style.aspectRatio = vb[2] + " / " + vb[3];
      d.classList.remove("is-pen"); gsap.set(d.querySelectorAll("path,polygon,circle"), { drawSVG: "100%" });   // it flies inked, like the logo it left
      return { m: m, d: d, vb: vb, home: mini.querySelector('.el[data-el="' + m.dataset.draw + '"]'), landed: true };
    });
    // layout offsets inside .pour (offsetTop ignores transforms, so a mid-flight refresh still measures the landing spot)
    function at(el) { var x = 0, y = 0; while (el && el !== root) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; } return { x: x, y: y }; }
    function from(k) {
      var M = marks[k], s = at(src), t = at(M.m), q = src.offsetWidth / VBW;
      return { x: s.x + M.vb[0] * q - t.x, y: s.y + M.vb[1] * q - t.y, scale: M.vb[2] * q / (M.m.offsetWidth || 1) };
    }
    if (still() || !window.ScrollTrigger) return;   // reduced motion: the botanicals are already on the tools
    var LAND = 1, GAP = .22, tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 72%", end: "bottom 78%", scrub: .6, invalidateOnRefresh: true,
      onUpdate: function () {
        marks.forEach(function (M, k) {
          var on = tl.time() >= k * GAP + LAND * .96;
          if (on !== M.landed) { M.landed = on; if (on) pen(M.d, .5); }   // it lands, and the pen goes over it once, like an engraving
        });
      } } });
    marks.forEach(function (M, k) {
      var t0 = k * GAP, spin = [-28, 22, -16][k];
      tl.fromTo(M.m, { autoAlpha: 0 }, { autoAlpha: 1, duration: .03, ease: "none" }, t0)
        .to(M.home, { opacity: 0, duration: .03, ease: "none" }, t0)
        // x and y on different curves: the piece lifts out of the bottle first, then falls onto the tool
        .fromTo(M.m, { x: function () { return from(k).x; } }, { x: 0, duration: LAND, ease: "power1.inOut" }, t0)
        .fromTo(M.m, { y: function () { return from(k).y; } }, { y: 0, duration: LAND, ease: "power2.in" }, t0)
        .fromTo(M.m, { scale: function () { return from(k).scale; } }, { scale: 1, duration: LAND, ease: "power1.inOut" }, t0)
        .to(M.m, { keyframes: { rotation: [0, spin, 0], easeEach: "sine.inOut" }, duration: LAND, ease: "none" }, t0);
    });
    marks.forEach(function (M) { M.landed = false; });
    if (fine) root.querySelectorAll(".pour-tool").forEach(function (li, k) {
      li.addEventListener("mouseenter", function () { if (marks[k].landed && !marks[k].d.classList.contains("is-pen")) pen(marks[k].d, .5); });
    });
  })();

  /* ---------- reveal base layer ---------- */
  (function revealAll() {
    var els = document.querySelectorAll(".reveal:not(.is-in)");
    if (reduced || !("IntersectionObserver" in window)) { els.forEach(function (el) { el.classList.add("is-in"); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("is-in"); io.unobserve(x.target); } }); }, { threshold: .12 });
    els.forEach(function (el) { io.observe(el); });
    document.addEventListener("focusin", function (e) { var r = e.target.closest && e.target.closest(".reveal"); if (r) r.classList.add("is-in"); });
  })();

  /* ---------- newsletter ---------- */
  (function () {
    var f = document.querySelector(".ft-form"), i = f.querySelector("input"), m = f.querySelector(".ft-msg");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value.trim())) { m.className = "ft-msg err"; m.textContent = "נראה שחסר משהו בכתובת. אפשר לבדוק שוב?"; i.setAttribute("aria-invalid", "true"); i.focus(); return; }
      i.removeAttribute("aria-invalid"); m.className = "ft-msg"; m.textContent = "נרשמתם. הבקבוקים החדשים יגיעו אליכם למייל."; f.reset();
    });
  })();
})();
