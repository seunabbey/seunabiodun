(() => {
  const root = document.documentElement;
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('primaryNav');
  const themeToggle = document.getElementById('themeToggle');
  const accentButtons = document.querySelectorAll('[data-accent-choice]');
  const backToTop = document.getElementById('backToTop');
  const year = document.getElementById('year');

  year.textContent = new Date().getFullYear();

  // Restore appearance preferences when available; the site still works without storage.
  try {
    const savedTheme = localStorage.getItem('seun-theme');
    const savedAccent = localStorage.getItem('seun-accent');
    if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
    if (['violet', 'cyan', 'amber', 'emerald'].includes(savedAccent)) root.dataset.accent = savedAccent;
  } catch (_) {}

  function syncAccentButtons() {
    accentButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.accentChoice === root.dataset.accent));
    });
  }
  syncAccentButtons();

  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('seun-theme', root.dataset.theme); } catch (_) {}
  });

  accentButtons.forEach(button => button.addEventListener('click', () => {
    root.dataset.accent = button.dataset.accentChoice;
    syncAccentButtons();
    try { localStorage.setItem('seun-accent', root.dataset.accent); } catch (_) {}
  }));

  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('is-open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }));

  function updateBackToTop() {
    backToTop.hidden = window.scrollY < 500;
  }
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Service links can preselect the matching enquiry.
  document.querySelectorAll('[data-service]').forEach(link => {
    link.addEventListener('click', () => {
      const select = document.getElementById('interest');
      if (select) select.value = link.dataset.service;
    });
  });
  document.querySelectorAll('[data-interest]').forEach(link => {
    link.addEventListener('click', () => {
      const select = document.getElementById('interest');
      if (select) select.value = link.dataset.interest;
    });
  });

  // Email-based contact form: no backend or third-party form service required.
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = encodeURIComponent(`Portfolio enquiry: ${data.get('interest')}`);
    const body = encodeURIComponent(
      `Hi Seun,\n\nMy name is ${data.get('name')}.\nEmail: ${data.get('email')}\nI'm interested in: ${data.get('interest')}\n\nProject details:\n${data.get('message')}\n\nSent from seunabbey.github.io`
    );
    document.getElementById('formNote').textContent = 'Your email app should open with the enquiry prepared. Please review and send it there.';
    window.location.href = `mailto:oluwaseunabiodun100@gmail.com?subject=${subject}&body=${body}`;
  });

  // Subtle reveal motion, with graceful fallback and reduced-motion support.
  const revealTargets = document.querySelectorAll('.section-kicker, .about-grid, .stat-card, .service-card, .project-row, .academy-copy, .process-steps > div, .contact-form');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealTargets.forEach(element => element.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(element => observer.observe(element));
  }
})();