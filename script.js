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

  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const submitButton = form.querySelector('[type="submit"]');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const payload = Object.fromEntries(fields.entries());
    submitButton.disabled = true;
    formNote.textContent = 'Sending your enquiry…';

    fetch('https://formsubmit.co/ajax/oluwaseunabiodun100@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(async response => {
        const result = await response.json();
        if (!response.ok || !result.success || result.success === 'false') {
          throw new Error(result.message || 'The enquiry could not be sent. Please try again.');
        }
        form.reset();
        formNote.textContent = 'Thanks for reaching out. Your enquiry has been sent to Seun.';
      })
      .catch(error => {
        formNote.textContent = `We couldn’t send your enquiry. ${error.message} Please try again or email oluwaseunabiodun100@gmail.com directly.`;
      })
      .finally(() => {
        submitButton.disabled = false;
      });
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