/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-personal.js
  var import_personal_exports = {};
  __export(import_personal_exports, {
    default: () => import_personal_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document: document2 }) {
    const heading = element.querySelector(".hero-banner-title, h1, h2");
    const descEl = element.querySelector(".hero-banner-description, .hero-banner-heading-body-section p");
    const ctaLink = element.querySelector('.hero-banner-actions a, a.btn, a[class*="btn--variation-primary"]');
    const img = element.querySelector(".hero-banner-image img, picture img, img");
    if (!heading && !descEl && !ctaLink) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (img) {
      const picture = img.closest("picture");
      cells.push([picture || img]);
    }
    const contentCell = [];
    if (heading) {
      const h = document2.createElement("h1");
      h.textContent = heading.textContent.trim();
      contentCell.push(h);
    }
    if (descEl) {
      const paras = descEl.querySelectorAll("p");
      if (paras.length) {
        paras.forEach((p) => {
          const np = document2.createElement("p");
          np.textContent = p.textContent.trim();
          if (np.textContent) contentCell.push(np);
        });
      } else {
        const np = document2.createElement("p");
        np.textContent = descEl.textContent.trim();
        if (np.textContent) contentCell.push(np);
      }
    }
    if (ctaLink && ctaLink.getAttribute("href")) {
      const a = document2.createElement("a");
      a.setAttribute("href", ctaLink.getAttribute("href"));
      a.textContent = ctaLink.textContent.trim();
      const p = document2.createElement("p");
      p.append(a);
      contentCell.push(p);
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-quicklinks.js
  function parse2(element, { document: document2 }) {
    const items = element.querySelectorAll(".quick-links-item");
    if (!items.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    items.forEach((item) => {
      const link = item.querySelector("a.quick-links-link, a");
      const img = item.querySelector("picture img, img");
      const labelEl = item.querySelector(".link-text");
      const href = link && link.getAttribute("href");
      const label = (labelEl ? labelEl.textContent : link ? link.textContent : "").trim();
      if (!href && !img) return;
      const imgCell = img ? img.closest("picture") || img : "";
      let textCell = "";
      if (href) {
        const a = document2.createElement("a");
        a.setAttribute("href", href);
        a.textContent = label || href;
        textCell = a;
      } else if (label) {
        const p = document2.createElement("p");
        p.textContent = label;
        textCell = p;
      }
      cells.push([imgCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-quicklinks", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse3(element, { document: document2 }) {
    const cards = element.querySelectorAll(".navigation-card");
    if (!cards.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cards.forEach((card) => {
      const heading = card.querySelector("h2, h3, h4");
      const desc = card.querySelector(".navigation-card-content .rt-content, .navigation-card-content p");
      const cta = card.querySelector(".navigation-card-actions a, a.btn, a");
      const cell = [];
      if (heading) {
        const h = document2.createElement("h3");
        h.textContent = heading.textContent.trim();
        cell.push(h);
      }
      if (desc) {
        const paras = desc.querySelectorAll("p");
        if (paras.length) {
          paras.forEach((p) => {
            const np = document2.createElement("p");
            np.textContent = p.textContent.trim();
            if (np.textContent) cell.push(np);
          });
        } else {
          const np = document2.createElement("p");
          np.textContent = desc.textContent.trim();
          if (np.textContent) cell.push(np);
        }
      }
      if (cta && cta.getAttribute("href")) {
        const a = document2.createElement("a");
        a.setAttribute("href", cta.getAttribute("href"));
        a.textContent = cta.textContent.trim();
        const p = document2.createElement("p");
        p.append(a);
        cell.push(p);
      }
      if (cell.length) cells.push([cell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse4(element, { document: document2 }) {
    const cards = element.querySelectorAll(".navigation-card");
    if (!cards.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    function resolveImage(scope) {
      const rawImg = scope.querySelector(".navigation-card-image img, figure img, picture img, img");
      let src = "";
      if (rawImg) {
        src = rawImg.getAttribute("src") || rawImg.getAttribute("data-src") || "";
      }
      if (!src) {
        const source = scope.querySelector("picture source[srcset], source[srcset]");
        if (source) src = (source.getAttribute("srcset") || "").split(",")[0].trim().split(" ")[0];
      }
      if (!src) return "";
      const img = document2.createElement("img");
      img.src = src;
      img.alt = rawImg ? rawImg.getAttribute("alt") || "" : "";
      return img;
    }
    const cells = [];
    cards.forEach((card) => {
      const heading = card.querySelector("h2, h3, h4");
      const desc = card.querySelector(".navigation-card-content .rt-content, .navigation-card-content p");
      const cta = card.querySelector(".navigation-card-actions a, a.btn, a");
      const imgCell = resolveImage(card);
      const textCell = [];
      if (heading) {
        const h = document2.createElement("h3");
        h.textContent = heading.textContent.trim();
        textCell.push(h);
      }
      if (desc) {
        const paras = desc.querySelectorAll("p");
        if (paras.length) {
          paras.forEach((p) => {
            const np = document2.createElement("p");
            np.textContent = p.textContent.trim();
            if (np.textContent) textCell.push(np);
          });
        } else {
          const np = document2.createElement("p");
          np.textContent = desc.textContent.trim();
          if (np.textContent) textCell.push(np);
        }
      }
      if (cta && cta.getAttribute("href")) {
        const a = document2.createElement("a");
        a.setAttribute("href", cta.getAttribute("href"));
        a.textContent = cta.textContent.trim();
        const p = document2.createElement("p");
        p.append(a);
        textCell.push(p);
      }
      if (imgCell || textCell.length) cells.push([imgCell, textCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-alert.js
  function parse5(element, { document: document2 }) {
    const callout = element.querySelector(".callout, section");
    const scope = callout || element;
    const iconImg = scope.querySelector(".callout-image img, .callout-left-wrap img, picture img, img");
    const heading = scope.querySelector("h2, h3, .callout h2");
    const bodyPara = scope.querySelector(".rt-content p, p");
    if (!heading && !bodyPara) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const iconCell = iconImg ? iconImg.closest("picture") || iconImg : "";
    const textCell = [];
    if (heading) {
      const h = document2.createElement("h2");
      h.textContent = heading.textContent.trim();
      textCell.push(h);
    }
    if (bodyPara) {
      const p = bodyPara.cloneNode(true);
      textCell.push(p);
    }
    const cells = [];
    cells.push([iconCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-alert", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo-brand.js
  function parse6(element, { document: document2 }) {
    const tile = element.querySelector(".promotion-tile, section");
    const scope = tile || element;
    const heading = scope.querySelector(".promotion-tile-title, h2, h3");
    const bodyContainer = scope.querySelector(".promotion-tile-content .rt-content, .promotion-tile-content");
    const cta = scope.querySelector(".promotion-tile-actions a, a.btn, a");
    const img = scope.querySelector(".promotion-tile-image img, picture img, img");
    if (!heading && !bodyContainer && !img) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const textCell = [];
    if (heading) {
      const h = document2.createElement("h2");
      h.textContent = heading.textContent.trim();
      textCell.push(h);
    }
    if (bodyContainer) {
      const paras = bodyContainer.querySelectorAll("p");
      paras.forEach((p) => {
        const np = document2.createElement("p");
        np.textContent = p.textContent.trim();
        if (np.textContent) textCell.push(np);
      });
    }
    if (cta && cta.getAttribute("href")) {
      const a = document2.createElement("a");
      a.setAttribute("href", cta.getAttribute("href"));
      a.textContent = cta.textContent.trim();
      const p = document2.createElement("p");
      p.append(a);
      textCell.push(p);
    }
    const imgCell = img ? img.closest("picture") || img : "";
    const cells = [];
    cells.push([textCell, imgCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-promo-brand", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-promo-dark.js
  function parse7(element, { document: document2 }) {
    const tile = element.querySelector(".promotion-tile, section");
    const scope = tile || element;
    const img = scope.querySelector(".promotion-tile-image img, picture img, img");
    const heading = scope.querySelector(".promotion-tile-title, h2, h3");
    const bodyContainer = scope.querySelector(".promotion-tile-content .rt-content, .promotion-tile-content");
    const cta = scope.querySelector(".promotion-tile-actions a, a.btn, a");
    if (!heading && !bodyContainer && !img) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const imgCell = img ? img.closest("picture") || img : "";
    const textCell = [];
    if (heading) {
      const h = document2.createElement("h2");
      h.textContent = heading.textContent.trim();
      textCell.push(h);
    }
    if (bodyContainer) {
      const paras = bodyContainer.querySelectorAll("p");
      paras.forEach((p) => {
        const np = document2.createElement("p");
        np.textContent = p.textContent.trim();
        if (np.textContent) textCell.push(np);
      });
    }
    if (cta && cta.getAttribute("href")) {
      const a = document2.createElement("a");
      a.setAttribute("href", cta.getAttribute("href"));
      a.textContent = cta.textContent.trim();
      const p = document2.createElement("p");
      p.append(a);
      textCell.push(p);
    }
    const cells = [];
    cells.push([imgCell, textCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-promo-dark", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/anz-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "iframe"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#personal-jcr-content-root-primarynavigation",
        "#personal-jcr-content-root-globalfooter",
        "#personal-jcr-content-root-backtotop",
        "header",
        "footer",
        "nav",
        ".accessibility-skip-link",
        ".back-to-top-wrapper",
        "noscript",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/anz-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function querySection(root, selectors) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function transform2(hookName, element, payload) {
    const sections = payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = querySection(element, section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || querySection(element, section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/transformers/anz-dm-images.js
  function detectDynamicMediaUrl(urlStr) {
    let u;
    try {
      u = new URL(urlStr, "https://x/");
    } catch (e) {
      return false;
    }
    if (u.pathname.startsWith("/is/image/")) {
      return "scene7";
    }
    if (/^delivery-p\d+-e\d+\.adobeaemcloud\.com$/.test(u.hostname) && u.pathname.startsWith("/adobe/assets/urn:")) {
      return "dm-openapi";
    }
    return false;
  }
  var LINKED_DM_INLINE_WRAPPER_TAGS = /* @__PURE__ */ new Set(["PICTURE"]);
  var LINKED_DM_WRAPPER_SIBLING_TAGS = /* @__PURE__ */ new Set(["SOURCE"]);
  function findLinkedDmCarrier(img) {
    if (!img || !img.parentElement) return null;
    let node = img;
    let parent = img.parentElement;
    while (parent && LINKED_DM_INLINE_WRAPPER_TAGS.has(parent.tagName)) {
      let foundNode = false;
      for (const child of parent.children) {
        if (child === node) {
          foundNode = true;
        } else if (!LINKED_DM_WRAPPER_SIBLING_TAGS.has(child.tagName)) {
          return null;
        }
      }
      if (!foundNode) return null;
      node = parent;
      parent = parent.parentElement;
    }
    if (!parent || parent.tagName !== "A") return null;
    if (parent.children.length !== 1 || parent.children[0] !== node) return null;
    if (parent.textContent.trim() !== "") return null;
    return parent;
  }
  var EMPTY_ALT_SENTINEL = "Image without alt text";
  function altToLinkText(alt) {
    return alt || EMPTY_ALT_SENTINEL;
  }
  function transform3(hookName, element, payload) {
    if (hookName !== "afterTransform") return;
    const doc = element.ownerDocument;
    element.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      if (!detectDynamicMediaUrl(src)) return;
      const alt = img.getAttribute("alt") || "";
      const linkedAnchor = findLinkedDmCarrier(img);
      if (linkedAnchor) {
        linkedAnchor.setAttribute("title", src);
        linkedAnchor.textContent = altToLinkText(alt);
        return;
      }
      const parent = img.parentElement;
      if (parent && parent.tagName === "A") {
        console.warn("DM image inside mixed-content anchor, skipped:", src);
        return;
      }
      const a = doc.createElement("a");
      a.href = src;
      a.textContent = altToLinkText(alt);
      img.replaceWith(a);
    });
  }

  // tools/importer/import-personal.js
  var parsers = {
    "hero-banner": parse,
    "cards-quicklinks": parse2,
    "cards-product": parse3,
    "cards-feature": parse4,
    "columns-alert": parse5,
    "columns-promo-brand": parse6,
    "columns-promo-dark": parse7
  };
  var PAGE_TEMPLATE = {
    name: "personal",
    description: "ANZ NZ Personal banking homepage",
    urls: ["https://www.anz.co.nz/personal/"],
    blocks: [
      { name: "hero-banner", instances: ["#personal-jcr-content-root-responsivegrid-experiencefragment"] },
      { name: "cards-quicklinks", instances: ["#personal-jcr-content-root-responsivegrid-experiencefragment_219570146"] },
      { name: "cards-product", instances: ["#personal-jcr-content-root-responsivegrid-experiencefragment_855547714"] },
      { name: "columns-alert", instances: ["#personal-jcr-content-root-responsivegrid-experiencefragment_c"] },
      { name: "cards-feature", instances: ["#personal-jcr-content-root-responsivegrid-threecolumncontainer"] },
      { name: "columns-promo-brand", instances: ["#personal-jcr-content-root-responsivegrid-onecolumncontainer_867074127"] },
      { name: "columns-promo-dark", instances: ["#personal-jcr-content-root-responsivegrid-onecolumncontainer_399269547"] }
    ],
    sections: [
      { id: "section-1", name: "Hero - Moving to New Zealand", selector: ["#personal-jcr-content-root-responsivegrid-experiencefragment"], style: null, blocks: ["hero-banner"], defaultContent: [] },
      { id: "section-2", name: "Quick links strip", selector: ["#personal-jcr-content-root-responsivegrid-experiencefragment_219570146"], style: null, blocks: ["cards-quicklinks"], defaultContent: [] },
      { id: "section-3", name: "Bank accounts - product summary", selector: ["#personal-jcr-content-root-responsivegrid-experiencefragment_855547714"], style: null, blocks: ["cards-product"], defaultContent: ["#personal-jcr-content-root-responsivegrid-experiencefragment_855547714"] },
      { id: "section-4", name: "Scams alert callout", selector: ["#personal-jcr-content-root-responsivegrid-experiencefragment_c"], style: "grey", blocks: ["columns-alert"], defaultContent: [] },
      { id: "section-5", name: "Financial wellbeing - heading", selector: ["#personal-jcr-content-root-responsivegrid-columncontainer_1514060277"], style: null, blocks: [], defaultContent: ["#personal-jcr-content-root-responsivegrid-columncontainer_1514060277"] },
      { id: "section-6", name: "Financial wellbeing - three feature cards", selector: ["#personal-jcr-content-root-responsivegrid-threecolumncontainer"], style: null, blocks: ["cards-feature"], defaultContent: [] },
      { id: "section-7", name: "Personalise ANZ Visa Debit (MyPhoto) promo", selector: ["#personal-jcr-content-root-responsivegrid-onecolumncontainer_867074127"], style: null, blocks: ["columns-promo-brand"], defaultContent: [] },
      { id: "section-8", name: "How we make banking easier promo", selector: ["#personal-jcr-content-root-responsivegrid-onecolumncontainer_399269547"], style: null, blocks: ["columns-promo-dark"], defaultContent: [] },
      { id: "section-9", name: "Important information (disclaimer)", selector: ["#personal-jcr-content-root-responsivegrid-columncontainer_copy"], style: null, blocks: [], defaultContent: ["#personal-jcr-content-root-responsivegrid-columncontainer_copy"] }
    ]
  };
  var transformers = [
    transform,
    transform3,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_personal_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_personal_exports);
})();
