/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ANZ NZ site-wide cleanup.
 * Removes non-authorable site chrome (navigation, footer, back-to-top button)
 * and tracking/embed elements. All selectors verified against
 * migration-work/cleaned.html for the "personal" template.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Tracking pixel iframe (doubleclick) — found at end of body in cleaned.html.
    // Removed before parsing so it cannot leak into any block cell.
    WebImporter.DOMUtils.remove(element, [
      'iframe',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome. Top-level grid-column ids verified in cleaned.html:
    //  - #...-primarynavigation : header/nav shell + skip links
    //  - #...-globalfooter      : global footer
    //  - #...-backtotop         : back-to-top button
    WebImporter.DOMUtils.remove(element, [
      '#personal-jcr-content-root-primarynavigation',
      '#personal-jcr-content-root-globalfooter',
      '#personal-jcr-content-root-backtotop',
      'header',
      'footer',
      'nav',
      '.accessibility-skip-link',
      '.back-to-top-wrapper',
      'noscript',
      'link',
    ]);
  }
}
