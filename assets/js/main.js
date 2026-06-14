/* Binary Fusion — main.js (no libraries) */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Review aid: ?orbs=2x halves atmosphere loop durations */
  if (new URLSearchParams(location.search).get("orbs") === "2x") {
    document.documentElement.classList.add("orbs-2x");
  }

  /* Preview aid: ?hero=light shows the light hero variant for comparison */
  if (new URLSearchParams(location.search).get("hero") === "light") {
    var heroEl = document.querySelector(".hero--b");
    if (heroEl) heroEl.classList.add("hero--light");
  }

  /* Capsule nav: hairline + stronger fill after 80px */
  var capsule = document.querySelector(".capsule");
  if (capsule) {
    var onScroll = function () {
      capsule.classList.toggle("is-scrolled", window.scrollY > 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Services dropdown: click/touch toggle (hover handled by CSS) */
  document.querySelectorAll(".has-sub").forEach(function (item) {
    var btn = item.querySelector(".nav-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
        btn.focus();
      }
    });
  });
  document.addEventListener("click", function (e) {
    document.querySelectorAll(".has-sub.is-open").forEach(function (item) {
      if (!item.contains(e.target)) {
        item.classList.remove("is-open");
        var btn = item.querySelector(".nav-toggle");
        if (btn) btn.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* Mobile drawer */
  var menuBtn = document.querySelector(".menu-btn");
  var drawer = document.getElementById("drawer");
  if (menuBtn && drawer) {
    var setDrawer = function (open) {
      drawer.hidden = !open;
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
      if (open) {
        var first = drawer.querySelector("a, button");
        if (first) first.focus();
      }
    };
    menuBtn.addEventListener("click", function () {
      setDrawer(drawer.hidden);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !drawer.hidden) {
        setDrawer(false);
        menuBtn.focus();
      }
    });
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) setDrawer(false);
    });
  }

  /* Expanding service panels — one open at a time, rails toggle */
  document.querySelectorAll(".xpanels").forEach(function (group) {
    group.addEventListener("click", function (e) {
      var rail = e.target.closest(".xpanel__rail");
      if (!rail) return;
      var target = rail.closest(".xpanel");
      group.querySelectorAll(".xpanel").forEach(function (p) {
        var active = p === target;
        p.classList.toggle("is-active", active);
        var r = p.querySelector(".xpanel__rail");
        r.setAttribute("aria-expanded", active ? "true" : "false");
        r.tabIndex = active ? -1 : 0;
      });
    });
  });

  /* Scroll reveals — once, max 3 staggered children via .reveal-group */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* Process line draw — stroke-dashoffset mapped to scroll progress.
     No-JS / reduced-motion: CSS default leaves the line fully drawn. */
  var process = document.querySelector(".process");
  var draw = document.querySelector(".process-line .draw");
  if (process && draw && !reduceMotion) {
    var steps = process.querySelectorAll(".process-steps li");
    draw.style.strokeDashoffset = 100;
    var ticking = false;
    var update = function () {
      ticking = false;
      var rect = process.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.85 - rect.top) / (rect.height + vh * 0.35);
      p = Math.max(0, Math.min(1, p));
      draw.style.strokeDashoffset = 100 * (1 - p);
      steps.forEach(function (li, i) {
        li.classList.toggle("is-done", p >= (i + 0.5) / steps.length);
      });
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* ===== Hero 3D mark — mouse-controlled tilt (idle sway is CSS) ===== */
  var markTilt = document.querySelector(".bm3d-tilt");
  if (markTilt && !reduceMotion) {
    var stage = markTilt.closest(".brandstage") || markTilt.parentElement;
    stage.addEventListener("pointermove", function (e) {
      var r = markTilt.getBoundingClientRect();
      var nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);   // -1..1
      var ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      nx = Math.max(-1, Math.min(1, nx));
      ny = Math.max(-1, Math.min(1, ny));
      // CSS transition makes the move slow + swing-y; numbers = max tilt
      markTilt.style.transform =
        "rotateY(" + (nx * 20).toFixed(2) + "deg) rotateX(" +
        (-ny * 16).toFixed(2) + "deg) scale(1.05)";
      // cursor-follow light: bright glow tracks the cursor side,
      // soft depth shadow cast to the opposite side
      var gx = (nx * 26).toFixed(1), gy = (ny * 26).toFixed(1);
      var sx = (-nx * 14).toFixed(1), sy = (-ny * 14).toFixed(1);
      markTilt.style.filter =
        "drop-shadow(" + gx + "px " + gy + "px 38px rgba(0,177,255,0.75)) " +
        "drop-shadow(" + sx + "px " + sy + "px 16px rgba(2,18,40,0.55))";
    });
    stage.addEventListener("pointerleave", function () {
      markTilt.style.transform = "";   // eases back via CSS transition
      markTilt.style.filter = "";      // back to centered base glow
    });
  }
})();
