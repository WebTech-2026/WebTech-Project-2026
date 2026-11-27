const HERO_BUTTONS = {
  guest: [
    { text: 'Create an account', href: PAGE_URLS.signup, style: 'btn-primary' },
    { text: 'Log in', href: PAGE_URLS.login, style: 'btn-outline' }
  ],
  user: [
    { text: 'Browse books', href: PAGE_URLS.catalogue, style: 'btn-primary' },
    { text: 'My borrowed books', href: PAGE_URLS.borrowed, style: 'btn-outline' }
  ],
  admin: [
    { text: 'Go to dashboard', href: PAGE_URLS.dashboard, style: 'btn-primary' },
    { text: 'Add a book', href: PAGE_URLS.addBook, style: 'btn-outline' }
  ]
};

function renderHeroButtons(role) {
  const container = document.getElementById('hero-actions');
  if (!container) return;
  container.textContent = '';
  HERO_BUTTONS[role].forEach(function (button) {
    const link = document.createElement('a');
    link.className = 'btn ' + button.style;
    link.href = button.href;
    link.textContent = button.text;
    container.appendChild(link);
  });
}

function renderFeatureCards(role) {
  document.querySelectorAll('.feature-card').forEach(function (card) {
    const allowedRoles = (card.dataset.roles || '').split(' ');
    card.hidden = !allowedRoles.includes(role);
  });
}

function renderHome() {
  const session = getSession();
  const role = session ? session.role : 'guest';

  renderHeroButtons(role);
  renderFeatureCards(role);

  const callToAction = document.getElementById('cta-section');
  if (callToAction) callToAction.hidden = role !== 'guest';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderHome);
} else {
  renderHome();
}