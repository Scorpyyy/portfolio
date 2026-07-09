/* =====================================================
   [Your Name] — Portfolio interactions & animations
   ===================================================== */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  if (hasGSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =====================================================
     PRELOADER
     ===================================================== */
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preload-fill');
  const countEl = document.getElementById('preload-count');

  function runPreloader(done) {
    if (prefersReduced || !fill) {
      if (preloader) preloader.style.display = 'none';
      done();
      return;
    }
    let p = 0;
    const timer = setInterval(function () {
      p += Math.max(1, Math.round((100 - p) * 0.12));
      if (p >= 100) { p = 100; clearInterval(timer); }
      fill.style.width = p + '%';
      countEl.textContent = p;
      if (p === 100) {
        setTimeout(function () {
          preloader.style.transition = 'opacity .6s, visibility .6s';
          preloader.style.opacity = '0';
          preloader.style.visibility = 'hidden';
          setTimeout(function () { preloader.style.display = 'none'; }, 600);
          done();
        }, 250);
      }
    }, 90);
  }

  /* =====================================================
     NAV: scroll state + mobile menu
     ===================================================== */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 20);
  }, { passive: true });

  function toggleMenu(open) {
    const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('is-open');
    mobileMenu.classList.toggle('is-open', isOpen);
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () { toggleMenu(); });
  if (mobileMenu) mobileMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { toggleMenu(false); });
  });

  /* =====================================================
     HERO title char-stagger reveal (custom split, no paid plugin)
     ===================================================== */
  function splitToChars(el) {
    const text = el.textContent;
    el.textContent = '';
    const frag = document.createDocumentFragment();
    for (const ch of text) {
      const span = document.createElement('span');
      span.className = 'char';
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';
      span.textContent = ch;
      frag.appendChild(span);
    }
    el.appendChild(frag);
    return el.querySelectorAll('.char');
  }

  function animateHero() {
    const glitches = document.querySelectorAll('.hero__title .glitch');
    if (!hasGSAP || prefersReduced) {
      document.querySelectorAll('.reveal').forEach(function (r) { r.classList.add('is-in'); });
      return;
    }
    let allChars = [];
    glitches.forEach(function (g) { allChars = allChars.concat(Array.from(splitToChars(g))); });

    const tl = gsap.timeline();
    tl.from(allChars, {
      opacity: 0, yPercent: 120, rotateX: -70, duration: 0.7,
      stagger: 0.03, ease: 'expo.out'
    });

    // reveal hero .reveal blocks after title
    const heroReveals = document.querySelectorAll('.hero .reveal');
    tl.to(heroReveals, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' }, '-=0.3');
  }

  /* Periodic glitch flicker on hero title */
  function startGlitchLoop() {
    if (prefersReduced) return;
    const glitches = document.querySelectorAll('.hero__title .glitch');
    setInterval(function () {
      const g = glitches[Math.floor(Math.random() * glitches.length)];
      if (!g) return;
      g.classList.add('is-glitching');
      setTimeout(function () { g.classList.remove('is-glitching'); }, 300);
    }, 2600);
  }

  /* =====================================================
     SCROLL REVEALS (non-hero)
     ===================================================== */
  function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal:not(.hero .reveal)');
    if (prefersReduced) {
      reveals.forEach(function (r) { r.classList.add('is-in'); });
      return;
    }
    if (hasGSAP && window.ScrollTrigger) {
      reveals.forEach(function (el) {
        ScrollTrigger.create({
          trigger: el, start: 'top 88%',
          onEnter: function () { el.classList.add('is-in'); },
          once: true
        });
      });
    } else {
      // IntersectionObserver fallback
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { threshold: 0.15 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* =====================================================
     COUNT-UP STATS
     ===================================================== */
  function initCounters() {
    const nums = document.querySelectorAll('.stat__num');
    nums.forEach(function (el) {
      const target = parseInt(el.dataset.count, 10) || 0;
      if (prefersReduced) { el.textContent = target; return; }
      const run = function () {
        const obj = { v: 0 };
        if (hasGSAP) {
          gsap.to(obj, { v: target, duration: 1.6, ease: 'power2.out', onUpdate: function () { el.textContent = Math.round(obj.v); } });
        } else {
          el.textContent = target;
        }
      };
      if (hasGSAP && window.ScrollTrigger) {
        ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: run });
      } else { run(); }
    });
  }

  /* =====================================================
     PARALLAX accents
     ===================================================== */
  function initParallax() {
    if (prefersReduced || !hasGSAP || !window.ScrollTrigger) return;
    gsap.utils.toArray('.parallax').forEach(function (el) {
      const speed = parseFloat(el.dataset.speed) || 1;
      gsap.to(el, {
        yPercent: speed * -6, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
      });
    });
  }

  /* =====================================================
     MAGNETIC buttons
     ===================================================== */
  function initMagnetic() {
    if (prefersReduced || !hasGSAP) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    document.querySelectorAll('.magnetic').forEach(function (el) {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1,0.4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1,0.4)' });
      el.addEventListener('mousemove', function (e) {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.3);
      });
      el.addEventListener('mouseleave', function () { xTo(0); yTo(0); });
    });
  }

  /* =====================================================
     CURSOR GLOW
     ===================================================== */
  function initCursor() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || prefersReduced) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) { glow.style.display = 'none'; return; }
    let x = window.innerWidth / 2, y = window.innerHeight / 2, cx = x, cy = y;
    window.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; }, { passive: true });
    (function loop() {
      cx += (x - cx) * 0.12; cy += (y - cy) * 0.12;
      glow.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      requestAnimationFrame(loop);
    })();
  }

  /* =====================================================
     WORK FILTER
     ===================================================== */
  function initFilters() {
    const filters = document.querySelectorAll('.filter');
    const cards = document.querySelectorAll('#workGrid .card');
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filters.forEach(function (f) { f.classList.remove('is-active'); });
        btn.classList.add('is-active');
        const cat = btn.dataset.filter;
        cards.forEach(function (card) {
          const match = cat === 'all' || card.dataset.cat === cat;
          if (match) {
            card.classList.remove('is-hidden');
            if (hasGSAP && !prefersReduced) {
              gsap.fromTo(card, { opacity: 0, y: 20, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
            }
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  /* =====================================================
     CONTACT FORM
     ---------------------------------------------------------------
     To receive messages straight to your inbox, create a free form at
     https://formspree.io and paste its endpoint below, e.g.
       var FORM_ENDPOINT = 'https://formspree.io/f/abcdwxyz';
     If left empty, the form opens the visitor's email app addressed to
     you instead (works with zero setup).
     ===================================================== */
  var FORM_ENDPOINT = '';
  var CONTACT_EMAIL = 'yassminachatt4@gmail.com';

  function initForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const note = document.getElementById('formNote');
    const btn = document.getElementById('submitBtn');
    const label = btn.querySelector('.btn__label');

    const setError = function (name, msg) {
      const field = form.querySelector('[name="' + name + '"]').closest('.field');
      const errEl = form.querySelector('.field__error[data-for="' + name + '"]');
      field.classList.toggle('is-invalid', !!msg);
      if (errEl) errEl.textContent = msg || '';
    };

    const setStatus = function (msg, type) {
      note.textContent = msg;
      note.className = 'contact__note' + (type ? ' is-' + type : '');
    };

    ['name', 'email', 'message'].forEach(function (n) {
      const input = form.querySelector('[name="' + n + '"]');
      input.addEventListener('blur', function () { validateField(n); });
    });

    function validateField(n) {
      const val = form.querySelector('[name="' + n + '"]').value.trim();
      if (!val) { setError(n, 'This field is required.'); return false; }
      if (n === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setError(n, 'Enter a valid email.'); return false; }
      setError(n, '');
      return true;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const ok = ['name', 'email', 'message'].map(validateField).every(Boolean);
      if (!ok) {
        const firstInvalid = form.querySelector('.field.is-invalid input, .field.is-invalid textarea');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const data = {
        name: form.querySelector('[name="name"]').value.trim(),
        email: form.querySelector('[name="email"]').value.trim(),
        message: form.querySelector('[name="message"]').value.trim()
      };

      // No backend configured → open the visitor's email app addressed to you.
      if (!FORM_ENDPOINT) {
        const subject = encodeURIComponent('Portfolio enquiry from ' + data.name);
        const body = encodeURIComponent(data.message + '\n\n— ' + data.name + ' (' + data.email + ')');
        window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
        setStatus('Opening your email app… if nothing happens, email me directly at ' + CONTACT_EMAIL + '.', 'success');
        return;
      }

      // Backend configured (Formspree) → send via fetch, stay on page.
      btn.disabled = true; label.textContent = 'Sending…'; setStatus('', '');
      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      }).then(function (res) {
        if (res.ok) {
          setStatus("Thanks! Your message has been sent — I'll get back to you soon.", 'success');
          form.reset();
        } else {
          setStatus('Something went wrong. Please email me directly at ' + CONTACT_EMAIL + '.', 'error');
        }
      }).catch(function () {
        setStatus('Network error. Please email me directly at ' + CONTACT_EMAIL + '.', 'error');
      }).finally(function () {
        btn.disabled = false; label.textContent = 'Send Message';
      });
    });
  }

  /* =====================================================
     COPY TO CLIPBOARD (Discord handle etc.)
     ===================================================== */
  function initCopy() {
    document.querySelectorAll('.social-copy').forEach(function (btn) {
      var tip = btn.querySelector('.social-copy__tip');
      var original = tip ? tip.textContent : '';
      btn.addEventListener('click', function () {
        var val = btn.dataset.copy || '';
        // best-effort copy (don't block UI feedback on it)
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(val).catch(function () {});
          } else {
            var ta = document.createElement('textarea');
            ta.value = val; ta.style.position = 'fixed'; ta.style.opacity = '0';
            document.body.appendChild(ta); ta.select();
            document.execCommand('copy'); document.body.removeChild(ta);
          }
        } catch (e) {}
        // immediate visual confirmation
        if (tip) {
          tip.textContent = 'Copied ✓';
          btn.classList.add('is-copied');
          setTimeout(function () { tip.textContent = original; btn.classList.remove('is-copied'); }, 1600);
        }
      });
    });
  }

  /* =====================================================
     BOOT
     ===================================================== */
  function boot() {
    initScrollReveals();
    initCounters();
    initParallax();
    initMagnetic();
    initCursor();
    initFilters();
    initForm();
    initCopy();
    startGlitchLoop();
  }

  window.addEventListener('load', function () {
    runPreloader(function () { animateHero(); });
    boot();
  });
})();
