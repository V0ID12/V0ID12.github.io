(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);

  /** Create an element. Text is set with textContent, so content is never parsed as HTML. */
  function el(tag, { className, text, attrs } = {}, children = []) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    for (const [key, value] of Object.entries(attrs || {})) node.setAttribute(key, value);
    node.append(...children);
    return node;
  }

  function externalLink(label, url) {
    return el('a', { text: label, attrs: { href: url, target: '_blank', rel: 'noopener noreferrer' } });
  }

  /* ---------- Render content from data.js ---------- */

  function renderText() {
    document.title = `${SITE.name} | ${SITE.role}`;
    const initials = SITE.name.split(/\s+/).map((word) => word[0]).join('').toUpperCase();
    const values = { ...SITE, initials };

    document.querySelectorAll('[data-bind]').forEach((node) => {
      node.textContent = values[node.dataset.bind] ?? '';
    });

    $('#about-text').append(...SITE.about.map((paragraph) => el('p', { text: paragraph })));
    let tagIndex = 0; // running count across all groups, so CSS can stagger the tags in order
    $('#skill-groups').append(...SITE.skills.map(({ group, items }) =>
      el('div', { className: 'skill-group' }, [
        el('h4', { className: 'skill-group__title', text: group }),
        el('ul', { className: 'tag-list' }, items.map((skill) =>
          el('li', { className: 'tag', text: skill, attrs: { style: `--t:${tagIndex++}` } }))),
      ])));
    $('#year').textContent = new Date().getFullYear();
  }

  function renderProjects() {
    const cards = SITE.projects.map((project) => {
      const links = [];
      if (project.live) links.push(externalLink('Live ↗', project.live));
      if (project.source) links.push(externalLink('Source ↗', project.source));

      return el('article', { className: 'project-card' }, [
        el('h3', { className: 'project-card__title', text: project.title }),
        el('p', { className: 'project-card__desc', text: project.description }),
        el('ul', { className: 'tag-list' }, project.tags.map((tag) => el('li', { className: 'tag', text: tag }))),
        ...(links.length ? [el('div', { className: 'project-card__links' }, links)] : []),
      ]);
    });
    $('#project-grid').append(...cards);
  }

  /** Turn a text grid from sprites.js into an SVG made of 1x1 squares. */
  function buildSprite(sprite) {
    const SVG_NS = 'http://www.w3.org/2000/svg'; // SVG elements need their namespace, unlike HTML ones
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${sprite.pixels[0].length} ${sprite.pixels.length}`);
    svg.setAttribute('class', 'sprite');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('shape-rendering', 'crispEdges'); // no smoothing between pixels

    const addPixel = (x, y, color, className) => {
      const rect = document.createElementNS(SVG_NS, 'rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', y);
      rect.setAttribute('width', 1);
      rect.setAttribute('height', 1);
      rect.style.fill = color; // a style, not an attribute, so CSS variables work
      if (className) rect.setAttribute('class', className);
      svg.append(rect);
    };

    sprite.pixels.forEach((row, y) => [...row].forEach((letter, x) => {
      if (letter === '.') return;
      // Eyes sit on top of a body-coloured pixel, so a blink shows the body, not a hole.
      if (letter === 'e') addPixel(x, y, sprite.colors[sprite.eyeBase]);
      const className = { e: 'sprite__eye', g: 'sprite__glow' }[letter];
      addPixel(x, y, sprite.colors[letter], className);
    }));
    return svg;
  }

  function renderSocialLinks() {
    const items = SITE.links.filter((link) => link.url).map((link) => {
      const sprite = SPRITES[link.sprite];
      if (!sprite) return el('li', {}, [externalLink(link.label, link.url)]);

      const anchor = externalLink('', link.url);
      anchor.className = 'character-link';
      anchor.append(
        el('span', { className: 'character-link__bubble', text: link.bubble, attrs: { 'aria-hidden': 'true' } }),
        buildSprite(sprite),
        el('span', { className: 'character-link__label', text: link.label }),
      );
      return el('li', {}, [anchor]);
    });
    $('#social-links').append(...items);
  }

  /* ---------- Theme toggle ---------- */

  function initThemeToggle() {
    const root = document.documentElement;
    const icon = $('#theme-toggle-icon');
    const showIcon = () => { icon.textContent = root.dataset.theme === 'dark' ? '☀' : '☾'; };

    showIcon();
    $('#theme-toggle').addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* private mode */ }
      showIcon();
    });
  }

  /* ---------- Contact form ---------- */

  /**
   * Decide whether the contact form is OK to send.
   *
   * @param {{name: string, email: string, message: string}} fields - already trimmed
   * @returns {Object} errors keyed by field name, e.g. { email: 'Enter a valid email.' }.
   *                   An empty object means the form is valid.
   */
  function validateContactForm(fields) {
    const errors = {};

    if (!fields.name) {
      errors.name = 'Please enter your name.';
    } else if (fields.name.length > 100) {
      errors.name = 'Please keep your name under 100 characters.';
    }

    // Deliberately loose: something@something.something. Stricter patterns reject real addresses.
    if (!fields.email) {
      errors.email = 'Please enter your email so I can reply.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      errors.email = 'Enter an email like name@example.com.';
    }

    if (!fields.message) {
      errors.message = 'Please write a message.';
    } else if (fields.message.length < 10) {
      errors.message = 'Please add a little more detail (at least 10 characters).';
    } else if (fields.message.length > 5000) {
      errors.message = 'Please keep your message under 5,000 characters.';
    }

    return errors;
  }

  function showErrors(form, errors) {
    for (const name of ['name', 'email', 'message']) {
      const input = form.elements[name];
      const message = errors[name] || '';
      $(`#${name}-error`).textContent = message;
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
    }
    const firstInvalid = ['name', 'email', 'message'].find((name) => errors[name]);
    if (firstInvalid) form.elements[firstInvalid].focus();
  }

  function initContactForm() {
    const form = $('#contact-form');
    const status = $('#form-status');
    const submit = $('#contact-submit');

    const setStatus = (state, text) => {
      status.dataset.state = state;
      status.textContent = text;
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setStatus('', '');

      const fields = {
        name: form.elements.name.value.trim(),
        email: form.elements.email.value.trim(),
        message: form.elements.message.value.trim(),
      };

      const errors = validateContactForm(fields);
      showErrors(form, errors);
      if (Object.keys(errors).length > 0) return;

      // A filled honeypot means a bot: pretend it worked and send nothing.
      if (form.elements.company.value) {
        setStatus('success', 'Thanks! Your message has been sent.');
        return;
      }

      if (SITE.formEndpoint.includes('YOUR_FORM_ID')) {
        setStatus('error', 'The form is not connected yet: set formEndpoint in js/data.js.');
        return;
      }

      submit.disabled = true;
      setStatus('', 'Sending…');
      try {
        const response = await fetch(SITE.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(fields),
        });
        if (!response.ok) throw new Error(`Form service responded with ${response.status}`);
        form.reset();
        setStatus('success', 'Thanks! Your message has been sent.');
      } catch (error) {
        console.error(error);
        setStatus('error', 'Something went wrong. Please try again in a moment.');
      } finally {
        submit.disabled = false;
      }
    });
  }

  /* ---------- Flair and animation ---------- */

  // Note: reduced-motion handling lives in styles.css, which swaps slides for fades.

  /** Type the hero roles out one character at a time, like game dialogue, cycling through them. */
  function initTypewriter() {
    const node = $('.hero__role');
    const roles = SITE.roles && SITE.roles.length ? SITE.roles : [SITE.role];

    // Screen readers get every role at once; the typed copy is visual only.
    const typed = el('span', { attrs: { 'aria-hidden': 'true' } });
    const cursor = el('span', { className: 'type-cursor', attrs: { 'aria-hidden': 'true' } });
    node.replaceChildren(el('span', { className: 'sr-only', text: roles.join(', ') }), typed, cursor);

    let roleIndex = 0;
    let shown = 0;
    let deleting = false;
    const tick = () => {
      const text = roles[roleIndex];
      shown += deleting ? -1 : 1;
      typed.textContent = text.slice(0, shown);

      let delay = deleting ? 35 : 70;
      if (!deleting && shown === text.length) {
        if (roles.length === 1) return;  // nothing to cycle to
        deleting = true;
        delay = 2200;                    // hold the finished role on screen
      } else if (deleting && shown === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 400;
      }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 1100);
  }

  /** Split the hero name into letters so CSS can drop them in one by one. */
  function initHeroName() {
    const heading = $('.hero__name');
    const words = heading.textContent.trim().split(/\s+/);
    let index = 0;

    const parts = words.flatMap((word) => [
      // Each word stays unbreakable; only the spaces between words can wrap.
      el('span', { className: 'word', attrs: { 'aria-hidden': 'true' } },
        [...word].map((char) => el('span', { className: 'char', text: char, attrs: { style: `--i:${index++}` } }))),
      ' ',
    ]);
    heading.replaceChildren(el('span', { className: 'sr-only', text: words.join(' ') }), ...parts);
  }

  /** Fill the segmented bar under the header as the page is scrolled. */
  function initScrollProgress() {
    const fill = $('#xp-fill');
    let queued = false;
    const update = () => {
      queued = false;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      fill.style.setProperty('--progress', scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };
    // Scroll events fire far more often than the screen repaints, so do at most one update per frame.
    window.addEventListener('scroll', () => {
      if (!queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /** Pop elements in the first time they scroll into view. */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const targets = document.querySelectorAll(
      '.section__title, .project-card, .about__text, .about__skills, .contact__intro, .contact-form'
    );
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });

    targets.forEach((target) => {
      // Cards in a grid get an index so CSS can stagger them one after another.
      const siblings = target.matches('.project-card') ? [...target.parentElement.children] : [];
      target.style.setProperty('--i', Math.max(0, siblings.indexOf(target)));
      target.classList.add('reveal');
      observer.observe(target);
    });
  }

  /** Highlight the nav link for the section currently in the middle of the screen. */
  function initScrollSpy() {
    if (!('IntersectionObserver' in window)) return;
    const links = document.querySelectorAll('.nav__links a');

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((link) => {
          const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
          if (isCurrent) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-45% 0px -50% 0px' }); // a thin band across the middle of the viewport

    document.querySelectorAll('main > section[id]').forEach((section) => observer.observe(section));
  }

  /** Scatter small twinkling squares behind the page. */
  function initStars(count = 40) {
    const stars = Array.from({ length: count }, () => {
      const star = el('span', { className: 'star' });
      const size = Math.random() < 0.3 ? 6 : 3;
      star.style.cssText =
        `left:${Math.random() * 100}%;top:${Math.random() * 100}%;` +
        `width:${size}px;height:${size}px;` +
        `animation-duration:${2 + Math.random() * 4}s;animation-delay:-${Math.random() * 6}s;`;
      return star;
    });
    // One extra element that streaks across the sky every so often.
    stars.push(el('span', { className: 'comet' }));
    document.body.prepend(el('div', { className: 'stars', attrs: { 'aria-hidden': 'true' } }, stars));
  }

  renderText();
  renderProjects();
  renderSocialLinks();
  initThemeToggle();
  initContactForm();
  initStars();
  initHeroName();
  initScrollProgress();
  initTypewriter();
  initScrollReveal();
  initScrollSpy();
})();
