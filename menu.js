// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuIcon = document.querySelector('.menu-icon');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.navbar a');

  // Toggle menu when hamburger is clicked
  if (menuIcon) {
    menuIcon.addEventListener('click', function() {
      menuIcon.classList.toggle('active');
      navbar.classList.toggle('active');
      document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close menu when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        menuIcon.classList.remove('active');
        navbar.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (window.innerWidth <= 768) {
      if (!navbar.contains(event.target) && !menuIcon.contains(event.target)) {
        menuIcon.classList.remove('active');
        navbar.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });
});