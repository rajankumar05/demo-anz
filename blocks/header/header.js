// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

// Inline utility/CTA icons matching the ANZ header.
const ICONS = {
  location: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M5 4h3l2 5-2 1.5a11 11 0 0 0 5 5L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" stroke-width="2"/><line x1="15.5" y1="15.5" x2="20" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

/** Prepend an inline icon to a link/button, before its text. */
function prependIcon(el, svg) {
  const span = document.createElement('span');
  span.className = 'nav-icon';
  span.innerHTML = svg;
  el.prepend(span);
}

/**
 * Fetch the nav fragment. Metadata-independent dual-fetch:
 * /content first (localhost / aem up), then root (DA/EDS production).
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
}

/** Close every open megamenu panel. */
function closeAllPanels(navSections, exception = null) {
  navSections.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((li) => {
    if (li !== exception) li.setAttribute('aria-expanded', 'false');
  });
}

function closeOnEscape(navSections) {
  return (e) => {
    if (e.code === 'Escape') closeAllPanels(navSections);
  };
}

export default async function decorate(block) {
  const fragment = await fetchNav();
  block.textContent = '';
  if (!fragment) return;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Section roles: brand (logo), sections (megamenus), tools (utility + login).
  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Brand: strip button styling from the logo link.
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('a');
    if (brandLink) brandLink.className = 'nav-brand-link';
  }

  // Sections: each top-level <li> that holds a nested list is a megamenu trigger.
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // Mark the active top-level item from the current URL (defaults to the
    // first item — "Personal" — which the ANZ homepage highlights).
    const path = window.location.pathname;
    const topItems = [...navSections.querySelectorAll(':scope > ul > li')];
    let activeSet = false;
    topItems.forEach((li) => {
      const overview = li.querySelector(':scope > .nav-panel a, :scope a');
      const href = overview?.getAttribute('href') || '';
      try {
        const p = new URL(href, window.location).pathname;
        if (p !== '/' && path.startsWith(p)) { li.classList.add('nav-active'); activeSet = true; }
      } catch { /* ignore */ }
    });
    if (!activeSet && topItems[0]) topItems[0].classList.add('nav-active');

    navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) {
        navSection.classList.add('nav-drop');
        navSection.setAttribute('aria-expanded', 'false');
        // The first <p> is the trigger label.
        const label = navSection.querySelector(':scope > p');
        if (label) {
          label.setAttribute('role', 'button');
          label.setAttribute('tabindex', '0');
        }
        // Wrap everything after the label into a single panel container so the
        // whole megamenu can be positioned/animated as one block.
        const panel = document.createElement('div');
        panel.className = 'nav-panel';
        let sibling = label ? label.nextElementSibling : navSection.firstElementChild;
        while (sibling) {
          const next = sibling.nextElementSibling;
          panel.append(sibling);
          sibling = next;
        }
        navSection.append(panel);
        const toggle = (e) => {
          // only toggle from the label, not from links inside the panel
          if (e.target.closest('a')) return;
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          closeAllPanels(navSections, navSection);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          e.stopPropagation();
        };
        label?.addEventListener('click', toggle);
        label?.addEventListener('keydown', (e) => {
          if (e.code === 'Enter' || e.code === 'Space') {
            e.preventDefault();
            toggle(e);
          }
        });
      }
    });
  }

  // Tools: add icons to utility links, style Log in as a pill, add search + chevron.
  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const links = [...navTools.querySelectorAll('a')];
    links.forEach((a) => {
      const text = a.textContent.trim();
      if (/find anz/i.test(text)) prependIcon(a, ICONS.location);
      else if (/contact/i.test(text)) prependIcon(a, ICONS.phone);
    });
    const loginLink = links.find((a) => /log in/i.test(a.textContent));
    if (loginLink) {
      loginLink.classList.add('nav-login');
      prependIcon(loginLink, ICONS.lock);
      loginLink.closest('li')?.classList.add('nav-login-item');
    }
    // Search control (built in JS, not in the content fragment).
    const searchItem = document.createElement('li');
    searchItem.className = 'nav-search-item';
    const searchBtn = document.createElement('button');
    searchBtn.type = 'button';
    searchBtn.className = 'nav-search-toggle';
    searchBtn.setAttribute('aria-label', 'Open site search');
    searchBtn.setAttribute('aria-expanded', 'false');
    searchBtn.innerHTML = `<span class="nav-icon">${ICONS.search}</span><span>Search</span>`;
    const searchForm = document.createElement('form');
    searchForm.className = 'nav-search-form';
    searchForm.setAttribute('role', 'search');
    searchForm.action = 'https://www.anz.co.nz/search/';
    searchForm.hidden = true;
    searchForm.innerHTML = '<input type="search" name="q" aria-label="Search anz.co.nz" placeholder="Search"><button type="submit" aria-label="Submit search">Go</button>';
    searchBtn.addEventListener('click', () => {
      const open = searchBtn.getAttribute('aria-expanded') === 'true';
      searchBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
      searchForm.hidden = open;
      if (!open) searchForm.querySelector('input')?.focus();
    });
    searchItem.append(searchBtn, searchForm);
    // insert search before the login item
    const loginItem = navTools.querySelector('.nav-login-item');
    const toolsList = navTools.querySelector('ul');
    if (toolsList && loginItem) toolsList.insertBefore(searchItem, loginItem);
    else if (toolsList) toolsList.append(searchItem);

    // Circular chevron button (login menu toggle) after the Log in pill.
    if (loginItem && toolsList) {
      const chevItem = document.createElement('li');
      chevItem.className = 'nav-login-menu-item';
      const chevBtn = document.createElement('button');
      chevBtn.type = 'button';
      chevBtn.className = 'nav-login-menu';
      chevBtn.setAttribute('aria-label', 'Open login menu');
      chevBtn.setAttribute('aria-expanded', 'false');
      chevBtn.innerHTML = ICONS.chevron;
      chevBtn.addEventListener('click', () => {
        const open = chevBtn.getAttribute('aria-expanded') === 'true';
        chevBtn.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
      chevItem.append(chevBtn);
      loginItem.after(chevItem);
    }
  }

  // Hamburger for mobile.
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation menu">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    document.body.style.overflowY = expanded ? '' : 'hidden';
    hamburger.querySelector('button').setAttribute('aria-label', expanded ? 'Open navigation menu' : 'Close navigation menu');
    if (expanded && navSections) closeAllPanels(navSections);
  });
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // Close panels when clicking outside / on Escape.
  if (navSections) {
    document.addEventListener('click', (e) => {
      if (isDesktop.matches && !e.target.closest('.nav-drop')) closeAllPanels(navSections);
    });
    window.addEventListener('keydown', closeOnEscape(navSections));
  }

  // Reset state when crossing the desktop/mobile breakpoint.
  isDesktop.addEventListener('change', () => {
    nav.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
    if (navSections) closeAllPanels(navSections);
    hamburger.querySelector('button').setAttribute('aria-label', 'Open navigation menu');
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
