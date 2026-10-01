// Shared page shell: <head> SEO tags, structured data, header, footer.
import { SITE, organizationNode } from './pages.mjs';

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const ICON = {
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>',
  menu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
};

const LOGO = `<img src="${SITE.logo}" alt="${SITE.name}" class="brand-logo-img" width="480" height="126" />`;
// White-text variant for the dark footer, so the logo needs no white box behind it.
const LOGO_LIGHT = LOGO.replace('thinkvistar-logo.webp', 'thinkvistar-logo-light.webp').replace('loading="lazy" ', '');

function jsonLd(page, data) {
  const url = SITE.origin + page.path;
  const graph = [organizationNode(data)];
  if (page.path === '/') {
    graph.push({ '@type': 'WebSite', '@id': `${SITE.origin}/#website`, url: `${SITE.origin}/`, name: SITE.name,
      publisher: { '@id': SITE.orgId }, inLanguage: 'en' });
  }
  const crumbs = page.breadcrumb || [];
  graph.push({
    '@type': page.pageType || 'WebPage', '@id': `${url}#webpage`, url, name: page.title, description: page.description,
    isPartOf: { '@id': `${SITE.origin}/#website` }, about: { '@id': SITE.orgId }, inLanguage: 'en',
    primaryImageOfPage: { '@type': 'ImageObject', url: SITE.origin + SITE.ogImage },
    ...(crumbs.length ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  });
  if (crumbs.length) {
    graph.push({ '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
      itemListElement: [['Home', '/'], ...crumbs].map(([name, p], i) =>
        ({ '@type': 'ListItem', position: i + 1, name, item: SITE.origin + p })) });
  }
  if (page.faq?.length) {
    graph.push({ '@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: page.faq.map(([q, a]) => ({
      '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) });
  }
  for (const node of page.schema?.(data) || []) graph.push(node);
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
}

// Visible FAQ block; the same list feeds FAQPage structured data so they never drift apart.
export function faqSection(faq, { title = 'Frequently asked questions', subtitle = '', alt = false } = {}) {
  return `<section class="section${alt ? ' section-alt' : ''}" id="faq">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">FAQ</div>
        <h2 class="section-title">${title}</h2>
        ${subtitle ? `<p class="section-subtitle">${subtitle}</p>` : ''}
      </div>
      <div class="faq-list">
        ${faq.map(([q, a]) => `<details class="faq-item"><summary>${q}</summary><div class="faq-answer"><p>${a}</p></div></details>`).join('\n        ')}
      </div>
    </div>
  </section>`;
}

export function renderPage(page, body, { assets, data }) {
  const url = SITE.origin + page.path;
  const c = data.company, contact = c.contact, addr = SITE.address;
  const robots = page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1';
  const nav = data.navigation.links.map((l) => `<li><a href="${l.href}" class="nav-link">${l.label}</a></li>`).join('');
  const navMobile = data.navigation.links.map((l) => `<li><a href="${l.href}" class="mobile-nav-link">${l.label}</a></li>`).join('');
  const footLinks = (list) => list.map((l) => `<li><a href="${l.href}" class="footer-link">${l.label}</a></li>`).join('');
  const scripts = page.scripts || ['main'];
  const html = body.replace('<!--FAQ-->', page.faq ? faqSection(page.faq, page.faqOptions) : '');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <script>document.documentElement.classList.add('js')</script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}" />
  <meta name="robots" content="${robots}" />
  ${page.noindex ? '' : `<link rel="canonical" href="${url}" />`}
  <meta name="theme-color" content="#1a56db" />
  ${SITE.verification.google ? `<meta name="google-site-verification" content="${esc(SITE.verification.google)}" />` : ''}
  ${SITE.verification.bing ? `<meta name="msvalidate.01" content="${esc(SITE.verification.bing)}" />` : ''}
  <meta name="geo.region" content="IN-MH" />
  <meta name="geo.placename" content="Nalasopara West, Mumbai Metropolitan Region" />
  <link rel="icon" href="/favicon.ico?v=2" sizes="16x16 32x32 48x48" />
  <link rel="icon" type="image/png" sizes="96x96" href="/favicon.png?v=2" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=2" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${SITE.name}" />
  <meta property="og:locale" content="en_IN" />
  <meta property="og:title" content="${esc(page.ogTitle || page.title)}" />
  <meta property="og:description" content="${esc(page.ogDescription || page.description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${SITE.origin}${SITE.ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${SITE.name} — software development company" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@thinkvistar" />
  <meta name="twitter:title" content="${esc(page.ogTitle || page.title)}" />
  <meta name="twitter:description" content="${esc(page.ogDescription || page.description)}" />
  <meta name="twitter:image" content="${SITE.origin}${SITE.ogImage}" />

  <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/jakarta-latin.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="stylesheet" href="/assets/${assets.css}" />
  <link rel="modulepreload" href="/assets/${assets.data}" />
  <link rel="modulepreload" href="/assets/${assets.icons}" />
${scripts.map((s) => `  <script type="module" src="/assets/${assets[s]}"></script>`).join('\n')}
  <script type="application/ld+json">${jsonLd(page, data)}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>

  <div class="top-bar">
    <div class="container top-bar-inner">
      <div class="top-bar-left">
        <a href="mailto:${contact.email}" id="topBarEmail">${ICON.mail}<span>${contact.email}</span></a>
        <a href="tel:${contact.whatsapp}" id="topBarPhone">${ICON.phone}<span>${contact.phone}</span></a>
      </div>
      <div class="top-bar-right">
        <span id="topBarLocation">${ICON.pin}<span>${contact.location}</span></span>
        <div class="top-bar-socials" id="topBarSocials"></div>
      </div>
    </div>
  </div>

  <header class="site-header">
    <div class="container nav-container">
      <a href="/" class="brand-logo" id="navbarBrand" aria-label="${SITE.name} Home">${LOGO}</a>
      <nav aria-label="Main navigation">
        <ul class="nav-links" id="navbarLinks">${nav}</ul>
      </nav>
      <div class="nav-actions">
        <a href="/contact/" class="btn btn-primary btn-md" id="navbarCta">${data.navigation.ctaButton.label}</a>
        <button class="hamburger-btn" id="hamburgerBtn" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobileNavDrawer">${ICON.menu}</button>
      </div>
    </div>
  </header>

  <div class="mobile-nav-drawer" id="mobileNavDrawer" aria-hidden="true">
    <div class="mobile-nav-content">
      <ul class="mobile-nav-links" id="mobileNavLinks">${navMobile}</ul>
      <div class="mobile-nav-actions">
        <a href="/contact/" class="btn btn-primary btn-block">${data.navigation.ctaButton.label}</a>
      </div>
    </div>
  </div>

  <main id="main">
${html.trimEnd()}
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand-col">
          <a href="/" class="footer-logo" aria-label="${SITE.name} Home">${LOGO_LIGHT}</a>
          <p class="footer-bio" id="footerBio">${data.footer.about}</p>
          <address class="footer-address">
            <strong>${c.legalName}</strong><br />
            ${addr.streetAddress}, ${addr.addressLocality},<br />
            ${addr.district}, ${addr.addressRegion} ${addr.postalCode}, India<br />
            <a href="tel:${contact.whatsapp}">${contact.phone}</a> · <a href="mailto:${contact.email}">${contact.email}</a>
          </address>
          <div class="social-links-row" id="footerSocialLinks"></div>
        </div>
        <div class="footer-col">
          <h2 class="footer-col-title">Company</h2>
          <ul class="footer-links" id="footerQuickLinks">${footLinks(data.footer.quickLinks)}</ul>
        </div>
        <div class="footer-col">
          <h2 class="footer-col-title">Services</h2>
          <ul class="footer-links" id="footerServicesLinks">${footLinks(data.services.map((s) => ({ href: s.url || `/services/#${s.id}`, label: s.title })))}</ul>
        </div>
        <div class="footer-col">
          <h2 class="footer-col-title">Contact &amp; Legal</h2>
          <ul class="footer-links" id="footerContactLinks">${footLinks([
            { href: '/contact/', label: 'Book a consultation' },
            { href: `mailto:${contact.email}`, label: 'Email us' },
            { href: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`, label: 'Chat on WhatsApp' },
            { href: `tel:${contact.whatsapp}`, label: 'Call us' },
          ])}</ul>
          <ul class="footer-links footer-links-legal" id="footerLegalLinks">${footLinks(data.footer.legalLinks)}</ul>
        </div>
      </div>
      <div class="footer-bottom">
        <div id="footerCopyright">${data.footer.copyright}</div>
        <div class="footer-badge"><a href="/software-development-company-mumbai/">Software development company in Mumbai</a> · Working with teams worldwide</div>
      </div>
    </div>
  </footer>
</body>
</html>
`;
}
