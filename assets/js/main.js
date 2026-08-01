/* Abeka SDA Church — shared site behavior */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initYear();
    initMobileNav();
    initModals();
    initCountdown();
    initDailyVerse();
    initRevealOnScroll();
    initLightbox();
    initGalleryFilters();
    initSermonFilters();
  });

  /* Footer year */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* Mobile nav toggle + dropdown */
  function initMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");
    var MOBILE_BREAKPOINT = 980;

    function closeMenu() {
      if (!links || !toggle) return;
      links.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }

    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("is-open");
        toggle.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.classList.toggle("nav-open", open);
      });

      // Tapping a real (non-dropdown) link closes the menu before navigating.
      links.querySelectorAll(":scope > li > a:not([aria-haspopup])").forEach(function (a) {
        a.addEventListener("click", closeMenu);
      });

      // If the viewport is resized/rotated past the mobile breakpoint while
      // the menu is open, clear the open state so it doesn't get stuck.
      window.addEventListener("resize", function () {
        if (window.innerWidth > MOBILE_BREAKPOINT) closeMenu();
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMenu();
      });
    }

    document.querySelectorAll(".nav-links .dropdown > a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
          e.preventDefault();
          a.parentElement.classList.toggle("is-open");
        }
      });
    });
  }

  /* Prayer / Give modals (any trigger with data-open-modal="prayerModal|donationModal") */
  function initModals() {
    var openers = document.querySelectorAll("[data-open-modal]");
    var closers = document.querySelectorAll("[data-close-modal], .modal-close");
    openers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-open-modal");
        var modal = document.getElementById(id);
        if (modal) modal.classList.add("is-open");
      });
    });
    closers.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var modal = btn.closest(".modal-overlay");
        if (modal) modal.classList.remove("is-open");
      });
    });
    document.querySelectorAll(".modal-overlay").forEach(function (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal) modal.classList.remove("is-open");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal-overlay.is-open").forEach(function (m) {
          m.classList.remove("is-open");
        });
      }
    });

    // Donation amount buttons
    document.querySelectorAll(".amount-options").forEach(function (group) {
      var input = group.querySelector('input[type="number"]');
      group.querySelectorAll(".amount-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
          group.querySelectorAll(".amount-btn").forEach(function (b) { b.classList.remove("active"); });
          btn.classList.add("active");
          if (input) input.value = btn.dataset.amount;
        });
      });
    });
  }

  /* Next-service countdown (Saturday 9:30 AM) */
  function initCountdown() {
    var el = document.getElementById("countdown-timer");
    if (!el) return;
    var daysEl = document.getElementById("cd-days");
    var hoursEl = document.getElementById("cd-hours");
    var minsEl = document.getElementById("cd-minutes");
    var secsEl = document.getElementById("cd-seconds");
    var msgEl = document.getElementById("cd-message");

    function tick() {
      var now = new Date();
      var next = new Date();
      next.setHours(9, 30, 0, 0);

      var inServiceWindow = false;
      if (now.getDay() === 6) {
        if (now < next) {
          // before service, same day
        } else if (now.getHours() >= 18) {
          next.setDate(now.getDate() + 7);
        } else {
          inServiceWindow = true;
        }
      } else {
        var until = (6 - now.getDay() + 7) % 7;
        next.setDate(now.getDate() + until);
      }

      if (inServiceWindow) {
        if (msgEl) {
          el.style.display = "none";
          msgEl.style.display = "block";
        } else {
          // No dedicated "service in progress" element on this page —
          // show a static all-zero countdown instead of freezing on stale digits.
          if (daysEl) daysEl.textContent = "00";
          if (hoursEl) hoursEl.textContent = "00";
          if (minsEl) minsEl.textContent = "00";
          if (secsEl) secsEl.textContent = "00";
          el.style.display = "flex";
        }
        return;
      }

      var diff = Math.max(0, next - now);
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);

      if (daysEl) daysEl.textContent = String(d).padStart(2, "0");
      if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
      if (minsEl) minsEl.textContent = String(m).padStart(2, "0");
      if (secsEl) secsEl.textContent = String(s).padStart(2, "0");
      el.style.display = "flex";
      if (msgEl) msgEl.style.display = "none";
    }
    tick();
    setInterval(tick, 1000);
  }

  /* Daily verse rotation */
  function initDailyVerse() {
    var textEl = document.getElementById("verse-text");
    var refEl = document.getElementById("verse-reference");
    if (!textEl || !refEl) return;

    var verses = [
      { text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", ref: "John 3:16" },
      { text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", ref: "Proverbs 3:5-6" },
      { text: "I can do all this through him who gives me strength.", ref: "Philippians 4:13" },
      { text: "The LORD is my shepherd, I lack nothing.", ref: "Psalm 23:1" },
      { text: "For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11" },
      { text: "But those who hope in the LORD will renew their strength. They will soar on wings like eagles.", ref: "Isaiah 40:31" },
      { text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", ref: "Philippians 4:6" },
      { text: "Jesus Christ is the same yesterday and today and forever.", ref: "Hebrews 13:8" }
    ];

    var today = new Date();
    var start = new Date(today.getFullYear(), 0, 0);
    var dayOfYear = Math.floor((today - start) / 86400000);
    var v = verses[dayOfYear % verses.length];
    textEl.textContent = '\u201C' + v.text + '\u201D';
    refEl.textContent = v.ref;

    var shareBtn = document.getElementById("share-verse");
    var saveBtn = document.getElementById("save-verse");

    if (shareBtn) {
      shareBtn.addEventListener("click", function () {
        var shareText = "Today's Bible Verse: \u201C" + v.text + "\u201D \u2014 " + v.ref;
        if (navigator.share) {
          navigator.share({ title: "Daily Bible Verse", text: shareText }).catch(function () {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(shareText).then(function () { showToast("Verse copied to clipboard!"); });
        }
      });
    }
    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        try {
          var saved = JSON.parse(localStorage.getItem("savedVerses") || "[]");
          if (!saved.some(function (s) { return s.ref === v.ref; })) {
            saved.push(v);
            localStorage.setItem("savedVerses", JSON.stringify(saved));
          }
          showToast("Verse saved!");
        } catch (e) { showToast("Verse saved!"); }
      });
    }
  }

  function showToast(message) {
    var toast = document.querySelector(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 2600);
  }

  /* Scroll-reveal */
  function initRevealOnScroll() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in-view"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Gallery lightbox */
  function initLightbox() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item img"));
    if (!items.length) return;
    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    var img = lightbox.querySelector("img");
    var closeBtn = lightbox.querySelector(".lightbox-close");
    var prevBtn = lightbox.querySelector(".lightbox-nav.prev");
    var nextBtn = lightbox.querySelector(".lightbox-nav.next");
    var current = 0;

    function open(index) {
      current = index;
      img.src = items[current].src;
      img.alt = items[current].alt || "";
      lightbox.classList.add("is-open");
    }
    function close() { lightbox.classList.remove("is-open"); }
    function show(delta) {
      current = (current + delta + items.length) % items.length;
      img.src = items[current].src;
      img.alt = items[current].alt || "";
    }

    items.forEach(function (im, idx) {
      im.addEventListener("click", function () { open(idx); });
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (prevBtn) prevBtn.addEventListener("click", function () { show(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { show(1); });
    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) close(); });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") show(1);
      if (e.key === "ArrowLeft") show(-1);
    });
  }

  /* Gallery category filters */
  function initGalleryFilters() {
    var buttons = document.querySelectorAll(".gallery-filters button");
    var items = document.querySelectorAll(".gallery-item");
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var filter = btn.dataset.filter;
        items.forEach(function (item) {
          var match = filter === "all" || item.dataset.category === filter;
          item.style.display = match ? "" : "none";
        });
      });
    });
  }

  /* Sermon quarter/speaker filters */
  function initSermonFilters() {
    var quarterSel = document.getElementById("filter-quarter");
    var speakerSel = document.getElementById("filter-speaker");
    var items = document.querySelectorAll(".sermon-item");
    if (!items.length || (!quarterSel && !speakerSel)) return;

    function apply() {
      var q = quarterSel ? quarterSel.value : "all";
      var s = speakerSel ? speakerSel.value : "all";
      items.forEach(function (item) {
        var okQ = q === "all" || item.dataset.quarter === q;
        var okS = s === "all" || item.dataset.speakerType === s;
        item.style.display = okQ && okS ? "" : "none";
      });
    }
    if (quarterSel) quarterSel.addEventListener("change", apply);
    if (speakerSel) speakerSel.addEventListener("change", apply);
  }
})();
