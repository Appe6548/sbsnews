document.addEventListener('DOMContentLoaded', function() {
  const navLinks = document.querySelectorAll('.nav-items a');
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});
