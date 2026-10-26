/* ==========================================================================
   Parth Solanki | Portfolio interactions (vanilla JavaScript)
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- 1. Config & helpers ---------- */

  const CONTACT_EMAIL = 'iparthsolanki29@gmail.com';

  const EMAILJS_CONFIG = {
    publicKey: 'oyd39EWAG26dd3DvU',
    serviceId: 'service_xlmvfqe',
    templateId: 'template_v31kfho'
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) =>
    Array.from(scope.querySelectorAll(selector));

  const reducedMotionQuery = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  );

  const finePointer = window.matchMedia(
    '(hover: hover) and (pointer: fine)'
  );

  const motionOK = () => !reducedMotionQuery.matches;

  const clamp = (value, min, max) =>
    Math.min(max, Math.max(min, value));

  const toastEl = $('#toast');
  let toastTimer = 0;

  const showToast = (message, duration = 3600) => {
    if (!toastEl) return;

    toastEl.textContent = message;
    toastEl.classList.add('is-visible');

    window.clearTimeout(toastTimer);

    toastTimer = window.setTimeout(() => {
      toastEl.classList.remove('is-visible');
    }, duration);
  };

  /* ---------- Footer year ---------- */

  const yearEl = $('#year');

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------- 2. Header, scroll progress and back to top ---------- */

  const header = $('#siteHeader');
  const progress = $('#scrollProgress');
  const toTop = $('#toTop');

  if (toTop) {
    toTop.hidden = false;
  }

  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    if (header) {
      header.classList.toggle('is-scrolled', y > 8);
    }

    if (progress) {
      progress.style.transform =
        `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    }

    if (toTop) {
      toTop.classList.toggle('is-visible', y > 600);
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: motionOK() ? 'smooth' : 'auto'
      });

      const home = $('#home');

      if (home) {
        home.setAttribute('tabindex', '-1');
        home.focus({ preventScroll: true });
      }
    });
  }

  /* ---------- 3. Mobile navigation ---------- */

  const navToggle = $('#navToggle');
  const navMenu = $('#primaryNav');

  const mobileQuery = window.matchMedia('(max-width: 960px)');

  const setMenu = (open) => {
    if (!navMenu || !navToggle) return;

    navMenu.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));

    navToggle.setAttribute(
      'aria-label',
      open ? 'Close menu' : 'Open menu'
    );
  };

  const syncMenuAccessibility = () => {
    if (!navMenu || !navToggle) return;

    if (mobileQuery.matches) {
      navMenu.toggleAttribute(
        'inert',
        !navMenu.classList.contains('is-open')
      );
    } else {
      navMenu.removeAttribute('inert');
      setMenu(false);
    }
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      setMenu(!navMenu.classList.contains('is-open'));
      syncMenuAccessibility();
    });

    navMenu.addEventListener('click', (event) => {
      if (event.target.closest('a') && mobileQuery.matches) {
        setMenu(false);
        syncMenuAccessibility();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        navMenu.classList.contains('is-open')
      ) {
        setMenu(false);
        syncMenuAccessibility();
        navToggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (
        navMenu.classList.contains('is-open') &&
        !event.target.closest('.site-header')
      ) {
        setMenu(false);
        syncMenuAccessibility();
      }
    });

    mobileQuery.addEventListener('change', syncMenuAccessibility);
    syncMenuAccessibility();
  }

  /* ---------- 4. Scroll reveal and active navigation ---------- */

  $$('.chips').forEach((list) => {
    $$('li', list).forEach((chip, i) => {
      chip.style.setProperty('--c', i);
    });
  });

  const hasIO = 'IntersectionObserver' in window;

  const observeOnce = (elements, className, options) => {
    if (!hasIO || !motionOK()) {
      elements.forEach((el) => el.classList.add(className));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(className);
          obs.unobserve(entry.target);
        }
      });
    }, options);

    elements.forEach((el) => observer.observe(el));
  };

  observeOnce(
    $$('.reveal'),
    'is-visible',
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  observeOnce(
    $$('.timeline'),
    'is-drawn',
    { threshold: 0.15 }
  );

  const navLinks = $$('.nav__link');

  const sections = navLinks
    .map((link) => $(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;

      link.classList.toggle('is-active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  if (hasIO) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, {
      rootMargin: '-45% 0px -50% 0px',
      threshold: 0
    });

    sections.forEach((section) => spy.observe(section));
  }

  /* ---------- 5. Profile image fallback ---------- */

  const portrait = $('#portrait');
  const profileImg = $('#profileImg');

  if (portrait && profileImg) {
    const showFallback = () => {
      portrait.classList.add('is-fallback');
    };

    profileImg.addEventListener('error', showFallback);

    if (profileImg.complete && profileImg.naturalWidth === 0) {
      showFallback();
    }
  }

  /* ---------- 6a. Hero headline animation ---------- */

  const heroTitle = $('#hero-title');

  if (heroTitle && motionOK()) {
    const label = heroTitle.textContent.replace(/\s+/g, ' ').trim();

    let wordIndex = 0;

    const splitNode = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const fragment = document.createDocumentFragment();

          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;

            if (/^\s+$/.test(part)) {
              fragment.appendChild(document.createTextNode(' '));
              return;
            }

            const word = document.createElement('span');
            const inner = document.createElement('span');

            word.className = 'word';
            word.style.setProperty('--w', wordIndex++);

            inner.className = 'word__inner';
            inner.textContent = part;

            word.appendChild(inner);
            fragment.appendChild(word);
          });

          node.replaceChild(fragment, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          splitNode(child);
        }
      });
    };

    splitNode(heroTitle);

    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true');

    while (heroTitle.firstChild) {
      visual.appendChild(heroTitle.firstChild);
    }

    const readable = document.createElement('span');

    readable.className = 'sr-only';
    readable.textContent = label;

    heroTitle.append(visual, readable);
    heroTitle.classList.add('is-split');
  }

  /* ---------- 6b. Typed role line ---------- */

  const typedEl = $('#typed');

  if (typedEl && motionOK()) {
    const phrases = [
      'Machine Learning',
      'Deep Learning & NLP',
      'RAG & Agentic AI',
      'FastAPI deployments'
    ];

    let phraseIndex = 0;
    let charCount = phrases[0].length;
    let deleting = true;

    const tick = () => {
      const phrase = phrases[phraseIndex];

      if (!deleting) {
        charCount += 1;
        typedEl.textContent = phrase.slice(0, charCount);

        if (charCount === phrase.length) {
          deleting = true;
          window.setTimeout(tick, 1800);
        } else {
          window.setTimeout(tick, 65);
        }

        return;
      }

      charCount -= 1;
      typedEl.textContent = phrase.slice(0, charCount);

      if (charCount === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        window.setTimeout(tick, 320);
      } else {
        window.setTimeout(tick, 32);
      }
    };

    window.setTimeout(tick, 2600);
  }

  /* ---------- 6c. Neural network canvas ---------- */

  const initNeuralCanvas = () => {
    const canvas = $('#neuralCanvas');
    const hero = $('#home');

    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // New palette:
    // Midnight Fern #4C4E49
    // Khaki         #8F8861
    // Sleepwalk     #191919

    const RGB = {
      node: '76, 78, 73',
      accent: '143, 136, 97',
      wine: '25, 25, 25'
    };

    const pointer = {
      x: 0,
      y: 0,
      active: false
    };

    let width = 0;
    let height = 0;
    let nodes = [];
    let pulses = [];
    let rafId = 0;
    let inView = true;

    const linkDistance = () => width < 640 ? 105 : 150;

    const build = () => {
      const rect = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = clamp(
        Math.round((width * height) / 17000),
        22,
        85
      );

      nodes = Array.from({ length: count }, () => {
        const roll = Math.random();

        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.36,
          vy: (Math.random() - 0.5) * 0.36,
          r: 1.2 + Math.random() * 2.1,
          tone: roll < 0.2
            ? 'accent'
            : roll < 0.27
              ? 'wine'
              : 'node',
          phase: Math.random() * Math.PI * 2
        };
      });

      pulses = [];
    };

    const draw = (time, animate) => {
      ctx.clearRect(0, 0, width, height);

      const link = linkDistance();
      const linkSq = link * link;
      const candidates = [];

      if (animate) {
        for (const n of nodes) {
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < -10) n.x = width + 10;
          else if (n.x > width + 10) n.x = -10;

          if (n.y < -10) n.y = height + 10;
          else if (n.y > height + 10) n.y = -10;

          if (pointer.active) {
            const dx = pointer.x - n.x;
            const dy = pointer.y - n.y;
            const d = Math.hypot(dx, dy);

            if (d < 200 && d > 1) {
              n.x += (dx / d) * 0.35;
              n.y += (dy / d) * 0.35;
            }
          }
        }
      }

      ctx.lineWidth = 1;

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];

        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dSq = dx * dx + dy * dy;

          if (dSq < linkSq) {
            const strength = 1 - Math.sqrt(dSq) / link;

            ctx.strokeStyle =
              `rgba(${RGB.node}, ${strength * 0.26})`;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();

            if (candidates.length < 60) {
              candidates.push([a, b]);
            }
          }
        }

        if (pointer.active) {
          const dx = a.x - pointer.x;
          const dy = a.y - pointer.y;
          const d = Math.hypot(dx, dy);

          if (d < 190) {
            ctx.strokeStyle =
              `rgba(${RGB.accent}, ${(1 - d / 190) * 0.55})`;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      if (animate) {
        if (
          candidates.length &&
          pulses.length < 9 &&
          Math.random() < 0.05
        ) {
          const [a, b] =
            candidates[Math.floor(Math.random() * candidates.length)];

          pulses.push({ a, b, t: 0 });
        }

        pulses = pulses.filter((p) =>
          p.t < 1 &&
          Math.hypot(
            p.a.x - p.b.x,
            p.a.y - p.b.y
          ) < link * 1.25
        );

        for (const p of pulses) {
          p.t += 0.018;

          const x = p.a.x + (p.b.x - p.a.x) * p.t;
          const y = p.a.y + (p.b.y - p.a.y) * p.t;

          const glow = ctx.createRadialGradient(
            x, y, 0,
            x, y, 9
          );

          glow.addColorStop(0, `rgba(${RGB.accent}, 0.9)`);
          glow.addColorStop(1, `rgba(${RGB.accent}, 0)`);

          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, 9, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const n of nodes) {
        const pulse = 1 + 0.25 * Math.sin(time * 0.002 + n.phase);
        const radius = n.r * (animate ? pulse : 1);

        if (n.tone !== 'node') {
          ctx.fillStyle = `rgba(${RGB[n.tone]}, 0.14)`;
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(${RGB[n.tone]
          }, ${n.tone === 'node' ? 0.55 : 0.85})`;

        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (time) => {
      draw(time, true);
      rafId = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (
        !rafId &&
        inView &&
        !document.hidden &&
        motionOK()
      ) {
        rafId = window.requestAnimationFrame(loop);
      }
    };

    const stop = () => {
      window.cancelAnimationFrame(rafId);
      rafId = 0;
    };

    build();
    draw(0, false);

    if (motionOK()) {
      if (hasIO) {
        new IntersectionObserver((entries) => {
          inView = entries[0].isIntersecting;

          if (inView) start();
          else stop();
        }, { threshold: 0 }).observe(hero);
      }

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop();
        else start();
      });

      hero.addEventListener('pointermove', (event) => {
        const rect = hero.getBoundingClientRect();

        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
        pointer.active = event.pointerType !== 'touch';
      });

      hero.addEventListener('pointerleave', () => {
        pointer.active = false;
      });

      start();
    }

    let resizeTimer = 0;

    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);

      resizeTimer = window.setTimeout(() => {
        build();

        if (!motionOK()) {
          draw(0, false);
        }
      }, 180);
    });
  };

  initNeuralCanvas();

  /* ---------- 7. Pointer effects ---------- */

  document.addEventListener('pointermove', (event) => {
    const card = event.target.closest &&
      event.target.closest('[data-spotlight]');

    if (!card) return;

    const rect = card.getBoundingClientRect();

    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }, { passive: true });

  if (finePointer.matches && motionOK()) {
    const hero = $('#home');

    if (hero) {
      let parallaxFrame = 0;

      hero.addEventListener('pointermove', (event) => {
        if (parallaxFrame) return;

        parallaxFrame = window.requestAnimationFrame(() => {
          const rect = hero.getBoundingClientRect();

          hero.style.setProperty(
            '--px',
            ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3)
          );

          hero.style.setProperty(
            '--py',
            ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3)
          );

          parallaxFrame = 0;
        });
      });

      hero.addEventListener('pointerleave', () => {
        hero.style.setProperty('--px', 0);
        hero.style.setProperty('--py', 0);
      });
    }

    $$('[data-tilt]').forEach((el) => {
      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        el.style.transform =
          `perspective(900px) rotateX(${(-y * 9).toFixed(2)}deg) ` +
          `rotateY(${(x * 11).toFixed(2)}deg)`;
      });

      el.addEventListener('pointerleave', () => {
        el.style.transform = '';
      });
    });

    $$('[data-magnetic]').forEach((el) => {
      el.addEventListener('pointermove', (event) => {
        const rect = el.getBoundingClientRect();

        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);

        el.style.setProperty(
          '--bx',
          `${clamp(dx * 0.22, -10, 10).toFixed(1)}px`
        );

        el.style.setProperty(
          '--by',
          `${clamp(dy * 0.28, -8, 8).toFixed(1)}px`
        );
      });

      el.addEventListener('pointerleave', () => {
        el.style.removeProperty('--bx');
        el.style.removeProperty('--by');
      });
    });
  }

  /* ---------- 8. Count-up numbers ---------- */

  const parseCount = (el) => {
    const raw = el.textContent.trim();

    const match = raw.match(/^(\d[\d,]*)(\.(\d+))?(%?)$/);

    if (!match) return null;

    return {
      value: parseFloat(
        match[1].replace(/,/g, '') + (match[2] || '')
      ),
      decimals: match[3] ? match[3].length : 0,
      suffix: match[4],
      grouped: match[1].includes(','),
      final: raw
    };
  };

  const formatCount = (value, info) =>
    value.toLocaleString('en-US', {
      minimumFractionDigits: info.decimals,
      maximumFractionDigits: info.decimals,
      useGrouping: info.grouped
    }) + info.suffix;

  const animateCount = (el, info, delay = 0) => {
    const duration = 1600;

    window.setTimeout(() => {
      const startTime = performance.now();

      const step = (now) => {
        const t = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);

        el.textContent = t < 1
          ? formatCount(info.value * eased, info)
          : info.final;

        if (t < 1) {
          window.requestAnimationFrame(step);
        }
      };

      window.requestAnimationFrame(step);
    }, delay);
  };

  if (hasIO && motionOK()) {
    const counters = $$('.stats dd, .metrics strong')
      .map((el) => ({ el, info: parseCount(el) }))
      .filter((item) => item.info);

    counters.forEach(({ el, info }) => {
      el.textContent = formatCount(0, info);
    });

    const countObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const item = counters.find((c) => c.el === entry.target);

        if (item) {
          animateCount(
            item.el,
            item.info,
            item.el.closest('.stats') ? 900 : 250
          );
        }

        obs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(({ el }) => countObserver.observe(el));
  }

  /* ---------- 9. Resume download ---------- */

  $$('.js-resume').forEach((link) => {
    link.addEventListener('click', async (event) => {
      if (window.location.protocol === 'file:') return;

      event.preventDefault();

      const url = link.getAttribute('href');
      const fileName =
        link.getAttribute('download') || 'Resume.pdf';

      try {
        const response = await fetch(url, { cache: 'no-cache' });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        const temp = document.createElement('a');

        temp.href = objectUrl;
        temp.download = fileName;

        document.body.appendChild(temp);
        temp.click();
        temp.remove();

        window.setTimeout(() => {
          URL.revokeObjectURL(objectUrl);
        }, 5000);

        showToast('Resume downloaded. Thank you for your interest!');
      } catch (error) {
        console.error('Resume download error:', error);

        showToast('Opening the resume in a new tab…');
        window.open(url, '_blank', 'noopener');
      }
    });
  });

  /* ---------- 10. Contact form using EmailJS ---------- */

  const form = $('#contactForm');
  const note = $('#formNote');

  if (form && note) {
    const defaultNote = note.textContent.trim();
    const submitButton = $('button[type="submit"]', form);

    const originalButtonHTML = submitButton
      ? submitButton.innerHTML
      : '';

    const COOLDOWN_MS = 30000;

    const readLastSent = () => {
      try {
        return Number(
          window.localStorage.getItem('contactLastSent')
        ) || 0;
      } catch (error) {
        return 0;
      }
    };

    const writeLastSent = () => {
      try {
        window.localStorage.setItem(
          'contactLastSent',
          String(Date.now())
        );
      } catch (error) {
        // Local storage may be unavailable.
      }
    };

    const setNote = (text, state) => {
      note.textContent = text;

      note.classList.toggle('is-error', state === 'error');
      note.classList.toggle('is-success', state === 'success');
    };

    if (window.emailjs && typeof window.emailjs.init === 'function') {
      window.emailjs.init({
        publicKey: EMAILJS_CONFIG.publicKey
      });
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const fields = $$(
        'input:not([type="hidden"]):not([name="botcheck"]), textarea',
        form
      );

      let firstInvalid = null;

      fields.forEach((field) => {
        const isRequired = field.hasAttribute('required');

        const valid = field.checkValidity() &&
          (!isRequired || field.value.trim() !== '');

        field.classList.toggle('is-invalid', !valid);
        field.setAttribute('aria-invalid', String(!valid));

        if (!valid && !firstInvalid) {
          firstInvalid = field;
        }
      });

      if (firstInvalid) {
        setNote(
          'Please fill in your name, a valid email address and a message.',
          'error'
        );

        firstInvalid.focus();
        return;
      }

      // Hidden honeypot field to reduce spam.
      if (form.elements.botcheck && form.elements.botcheck.value) {
        setNote('Thanks! Your message has been sent.', 'success');
        form.reset();
        return;
      }

      const waitMs = COOLDOWN_MS - (Date.now() - readLastSent());

      if (waitMs > 0) {
        setNote(
          `Please wait ${Math.ceil(waitMs / 1000)} seconds before sending another message.`,
          'error'
        );
        return;
      }

      if (
        !window.emailjs ||
        typeof window.emailjs.sendForm !== 'function'
      ) {
        setNote(
          `The email service could not load. Please email me directly at ${CONTACT_EMAIL}.`,
          'error'
        );
        return;
      }

      // Additional information included with the message.
      if (form.elements.sent_at) {
        form.elements.sent_at.value =
          new Date().toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'medium',
            timeStyle: 'short'
          }) + ' IST';
      }

      if (form.elements.page_url) {
        form.elements.page_url.value = window.location.href;
      }

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending message...';
      }

      setNote('Sending your message...');

      try {
        await window.emailjs.sendForm(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          form,
          {
            publicKey: EMAILJS_CONFIG.publicKey
          }
        );

        writeLastSent();

        setNote(
          "Thanks! Your message has been sent. I'll reply to your email soon.",
          'success'
        );

        showToast('Message sent successfully.');

        form.reset();

        $$('input, textarea', form).forEach((field) => {
          field.classList.remove('is-invalid');
          field.setAttribute('aria-invalid', 'false');
        });
      } catch (error) {
        console.error('EmailJS contact form error:', error);

        setNote(
          `Sorry, your message could not be sent. Please email me directly at ${CONTACT_EMAIL}.`,
          'error'
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonHTML;
        }
      }
    });

    form.addEventListener('input', (event) => {
      const field = event.target;

      if (
        field.classList.contains('is-invalid') &&
        field.checkValidity() &&
        field.value.trim() !== ''
      ) {
        field.classList.remove('is-invalid');
        field.setAttribute('aria-invalid', 'false');
      }

      if (
        (
          note.classList.contains('is-error') ||
          note.classList.contains('is-success')
        ) &&
        !$('.is-invalid', form)
      ) {
        setNote(defaultNote);
      }
    });
  }
})();