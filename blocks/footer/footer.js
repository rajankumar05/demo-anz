// Inline social glyphs keyed by network — the source uses icon-font glyphs
// (no downloadable src), so we render matching inline SVGs.
const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.2.8 24 1.77 24h20.45c.98 0 1.78-.8 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9 3.72 3.72 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32Zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.24 3.6L9.6 15.6Z"/></svg>',
};

function socialNetwork(href) {
  if (/facebook/i.test(href)) return 'facebook';
  if (/linkedin/i.test(href)) return 'linkedin';
  if (/instagram/i.test(href)) return 'instagram';
  if (/youtube/i.test(href)) return 'youtube';
  return null;
}

/**
 * loads and decorates the footer.
 * Metadata-independent dual-fetch: the site-root path (/footer.plain.html)
 * resolves on BOTH aem up (localhost) and DA/EDS production, so it is tried
 * first to avoid a console 404; /content is a legacy fallback.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  let resp = await fetch('/footer.plain.html');
  if (!resp.ok) resp = await fetch('/content/footer.plain.html');
  block.textContent = '';
  if (!resp.ok) return;

  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;

  // Section roles: first div = "here to help" band, second = about/legal band.
  const sections = [...footer.children];
  sections[0]?.classList.add('footer-help');
  sections[1]?.classList.add('footer-about');

  // Group the help band's h3+link pairs into columns.
  const help = footer.querySelector('.footer-help');
  if (help) {
    const heading = help.querySelector('h2');
    const cols = document.createElement('div');
    cols.className = 'footer-help-columns';
    let current = null;
    [...help.children].forEach((el) => {
      if (el === heading) return;
      if (el.tagName === 'H3') {
        current = document.createElement('div');
        current.className = 'footer-help-col';
        current.append(el);
        cols.append(current);
      } else if (current) {
        current.append(el);
      }
    });
    help.append(cols);
  }

  // About band: tag the link list, social list, legal list.
  const about = footer.querySelector('.footer-about');
  if (about) {
    const lists = [...about.querySelectorAll(':scope > ul')];
    lists[0]?.classList.add('footer-about-links');
    lists[1]?.classList.add('footer-social');
    lists[2]?.classList.add('footer-legal');

    // Replace social link text with inline icons.
    const social = about.querySelector('.footer-social');
    if (social) {
      social.querySelectorAll('a').forEach((a) => {
        const net = socialNetwork(a.getAttribute('href') || '');
        if (net && SOCIAL_ICONS[net]) {
          a.setAttribute('aria-label', a.textContent.trim());
          a.innerHTML = SOCIAL_ICONS[net];
        }
      });
    }

    // Mark the copyright paragraph.
    const paras = [...about.querySelectorAll(':scope > p')];
    paras.forEach((p) => {
      if (/all rights reserved/i.test(p.textContent)) p.classList.add('footer-copyright');
      else if (/about anz/i.test(p.textContent)) p.classList.add('footer-about-heading');
    });
  }

  block.append(footer);
}
