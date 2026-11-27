const PAGE_URLS = {
  home: 'index.html',
  signup: '2-signup.html',
  login: '3-login.html',
  catalogue: '4-catalogue.html',
  borrowed: '6-my-borrowed-books.html',
  dashboard: '7-admin-dashboard.html',
  addBook: '8-add-edit-book.html'
};


const NAV_LINKS = {
  guest: [
    { text: 'Home', href: PAGE_URLS.home },
    { text: 'Log in', href: PAGE_URLS.login },
    { text: 'Sign up', href: PAGE_URLS.signup, button: true }
  ],
  user: [
    { text: 'Home', href: PAGE_URLS.home },
    { text: 'Catalogue', href: PAGE_URLS.catalogue },
    { text: 'My Borrowed Books', href: PAGE_URLS.borrowed }
  ],
  admin: [
    { text: 'Home', href: PAGE_URLS.home },
    { text: 'Book List', href: PAGE_URLS.dashboard },
    { text: 'Add Book', href: PAGE_URLS.addBook }
  ]
};


function getHomePage(role) {
  if (role === 'user') return PAGE_URLS.catalogue;
  if (role === 'admin') return PAGE_URLS.dashboard;
  return PAGE_URLS.home;
}

function createNavElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function buildNavbar() {
  const session = getSession();
  const role = session ? session.role : 'guest';
  const links = NAV_LINKS[role] || NAV_LINKS.guest;
  const currentPage = location.pathname.split('/').pop() || PAGE_URLS.home;


  let header = document.querySelector('header.navbar');
  if (!header) {
    header = createNavElement('header', 'navbar');
    document.body.prepend(header);
  }
  header.textContent = '';                       

  const container = createNavElement('div', 'container');

  const logo = createNavElement('div', 'logo');
  const logoLink = createNavElement('a', '', '📖 ReadSpace');
  logoLink.href = PAGE_URLS.home;
  logo.appendChild(logoLink);

  const nav = document.createElement('nav');
  const list = createNavElement('ul', 'nav-links');

  links.forEach(function (link) {
    const item = document.createElement('li');
    const anchor = createNavElement('a', link.button ? 'btn btn-primary' : '', link.text);
    anchor.href = link.href;
    if (link.href === currentPage && !link.button) anchor.classList.add('active');
    item.appendChild(anchor);
    list.appendChild(item);
  });

  if (session) {
    const userItem = document.createElement('li');
    userItem.appendChild(createNavElement('span', 'nav-user', '👤 ' + session.username));
    list.appendChild(userItem);

    const logoutItem = document.createElement('li');
    const logoutLink = createNavElement('a', 'btn btn-primary', 'Log out');
    logoutLink.href = PAGE_URLS.login;
    logoutLink.addEventListener('click', function (event) {
      event.preventDefault();
      clearSession();
      location.href = PAGE_URLS.login;
    });
    logoutItem.appendChild(logoutLink);
    list.appendChild(logoutItem);
  }

  nav.appendChild(list);
  container.appendChild(logo);
  container.appendChild(nav);
  header.appendChild(container);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', buildNavbar);
} else {
  buildNavbar();
}