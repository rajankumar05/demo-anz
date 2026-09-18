/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsQuicklinksParser from './parsers/cards-quicklinks.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsAlertParser from './parsers/columns-alert.js';
import columnsPromoBrandParser from './parsers/columns-promo-brand.js';
import columnsPromoDarkParser from './parsers/columns-promo-dark.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/anz-cleanup.js';
import sectionsTransformer from './transformers/anz-sections.js';
import dmImagesTransformer from './transformers/anz-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-quicklinks': cardsQuicklinksParser,
  'cards-product': cardsProductParser,
  'cards-feature': cardsFeatureParser,
  'columns-alert': columnsAlertParser,
  'columns-promo-brand': columnsPromoBrandParser,
  'columns-promo-dark': columnsPromoDarkParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'personal',
  description: 'ANZ NZ Personal banking homepage',
  urls: ['https://www.anz.co.nz/personal/'],
  blocks: [
    { name: 'hero-banner', instances: ['#personal-jcr-content-root-responsivegrid-experiencefragment'] },
    { name: 'cards-quicklinks', instances: ['#personal-jcr-content-root-responsivegrid-experiencefragment_219570146'] },
    { name: 'cards-product', instances: ['#personal-jcr-content-root-responsivegrid-experiencefragment_855547714'] },
    { name: 'columns-alert', instances: ['#personal-jcr-content-root-responsivegrid-experiencefragment_c'] },
    { name: 'cards-feature', instances: ['#personal-jcr-content-root-responsivegrid-threecolumncontainer'] },
    { name: 'columns-promo-brand', instances: ['#personal-jcr-content-root-responsivegrid-onecolumncontainer_867074127'] },
    { name: 'columns-promo-dark', instances: ['#personal-jcr-content-root-responsivegrid-onecolumncontainer_399269547'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero - Moving to New Zealand', selector: ['#personal-jcr-content-root-responsivegrid-experiencefragment'], style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 'section-2', name: 'Quick links strip', selector: ['#personal-jcr-content-root-responsivegrid-experiencefragment_219570146'], style: null, blocks: ['cards-quicklinks'], defaultContent: [] },
    { id: 'section-3', name: 'Bank accounts - product summary', selector: ['#personal-jcr-content-root-responsivegrid-experiencefragment_855547714'], style: null, blocks: ['cards-product'], defaultContent: ['#personal-jcr-content-root-responsivegrid-experiencefragment_855547714'] },
    { id: 'section-4', name: 'Scams alert callout', selector: ['#personal-jcr-content-root-responsivegrid-experiencefragment_c'], style: 'grey', blocks: ['columns-alert'], defaultContent: [] },
    { id: 'section-5', name: 'Financial wellbeing - heading', selector: ['#personal-jcr-content-root-responsivegrid-columncontainer_1514060277'], style: null, blocks: [], defaultContent: ['#personal-jcr-content-root-responsivegrid-columncontainer_1514060277'] },
    { id: 'section-6', name: 'Financial wellbeing - three feature cards', selector: ['#personal-jcr-content-root-responsivegrid-threecolumncontainer'], style: null, blocks: ['cards-feature'], defaultContent: [] },
    { id: 'section-7', name: 'Personalise ANZ Visa Debit (MyPhoto) promo', selector: ['#personal-jcr-content-root-responsivegrid-onecolumncontainer_867074127'], style: null, blocks: ['columns-promo-brand'], defaultContent: [] },
    { id: 'section-8', name: 'How we make banking easier promo', selector: ['#personal-jcr-content-root-responsivegrid-onecolumncontainer_399269547'], style: null, blocks: ['columns-promo-dark'], defaultContent: [] },
    { id: 'section-9', name: 'Important information (disclaimer)', selector: ['#personal-jcr-content-root-responsivegrid-columncontainer_copy'], style: null, blocks: [], defaultContent: ['#personal-jcr-content-root-responsivegrid-columncontainer_copy'] },
  ],
};

// TRANSFORMER REGISTRY - cleanup + DM images, then section breaks/metadata last
const transformers = [
  cleanupTransformer,
  dmImagesTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 * @param {string} hookName - 'beforeTransform' or 'afterTransform'
 * @param {Element} element - The DOM element to transform
 * @param {Object} payload - { document, url, html, params }
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 * @param {Document} document - The DOM document
 * @param {Object} template - The embedded PAGE_TEMPLATE object
 * @returns {Array} Array of block instances found on the page
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced by an earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata + DM images)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (map root URL to /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
