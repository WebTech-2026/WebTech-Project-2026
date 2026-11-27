const SESSION_KEY = 'readspace_session';

function setSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({
    id: user.id,
    username: user.username,
    role: user.role
  }));
}


function getSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    if (!session || !Number.isSafeInteger(Number(session.id)) ||
        Number(session.id) < 1 ||
        typeof session.username !== 'string' ||
        !['user', 'admin'].includes(session.role)) {
      return null;
    }
    return {
      id: Number(session.id),
      username: session.username,
      role: session.role
    };
  } catch {
    return null;
  }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function guardPage(role) {
  const session = getSession();

  if (!session) {                                   
    location.replace(PAGE_URLS.login);
    return null;
  }
  if (role && session.role !== role) {          
    location.replace(getHomePage(session.role));
    return null;
  }

  const main = document.querySelector('main');
  if (main) main.hidden = false;
  return session;
}


function requireLogin() {
  return guardPage(null);
}

function requireRole(role) {
  return guardPage(role);
}

function guardPageFromMarkup() {
  if (document.querySelector('main[data-redirect-if-logged-in]') && redirectIfLoggedIn()) {
    return;
  }
  const main = document.querySelector('main[data-required-role]');
  if (main) requireRole(main.dataset.requiredRole);
}

function redirectIfLoggedIn() {
  const session = getSession();
  if (!session) return false;
  location.replace(getHomePage(session.role));
  return true;
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map(function (byte) { return byte.toString(16).padStart(2, '0'); })
    .join('');
}

if (document.readyState === 'loading' || document.readyState === 'interactive') {
  document.addEventListener('DOMContentLoaded', guardPageFromMarkup, { once: true });
} else {
  guardPageFromMarkup();
}