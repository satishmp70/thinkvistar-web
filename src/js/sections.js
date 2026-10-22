// Fills the content containers in the page templates from site-data.json.
//
// This runs while the build pre-renders each page in headless Chrome (build.mjs then
// saves the resulting HTML), so visitors receive finished markup and do not download
// the site data or run this code. It also runs as a fallback when a page was built
// with `--no-prerender`. The header, navigation and footer are NOT rendered here:
// layout.mjs owns that markup.
import data from '../site-data.json';
import { byId } from './lib/dom.js';
import { icon } from './lib/icons.js';

/** Applies an optional data-limit="N" attribute from the container. */
function limited(container, list) {
  const limit = parseInt(container.dataset.limit, 10);
  return Number.isFinite(limit) && limit > 0 ? list.slice(0, limit) : list;
}

const delay = (index, modulo) => `delay-${(index % modulo) + 1}`;

// ------------------------------------------------------------------ hero
function renderHero() {
  const { hero } = data;
  const set = (id, text) => { const el = byId(id); if (el) el.textContent = text; };
  set('heroBadge', hero.badge);
  set('heroSubtext', hero.subtext);

  const headline = byId('heroHeadline');
  if (headline) {
    const text = hero.headline || '';
    const lastStop = text.lastIndexOf('.');
    if (lastStop > 0 && lastStop < text.length - 1) {
      headline.innerHTML = `${text.slice(0, lastStop + 1)} <span class="hero-gradient-text">${text.slice(lastStop + 1).trim()}</span>`;
    } else {
      const words = text.trim().split(/\s+/);
      const tail = words.splice(-2).join(' ');
      headline.innerHTML = words.length ? `${words.join(' ')} <span class="hero-gradient-text">${tail}</span>` : `<span class="hero-gradient-text">${tail}</span>`;
    }
  }

  const primary = byId('heroCtaPrimary');
  if (primary) {
    primary.innerHTML = `${hero.ctaPrimary.label} ${icon('arrowRight')}`;
    primary.setAttribute('href', hero.ctaPrimary.href);
  }
  const secondary = byId('heroCtaSecondary');
  if (secondary) {
    secondary.textContent = hero.ctaSecondary.label;
    secondary.setAttribute('href', hero.ctaSecondary.href);
  }
  const pills = byId('heroPills');
  if (pills && hero.trustPills) pills.innerHTML = hero.trustPills.map((pill) => `<span class="hero-pill">${pill}</span>`).join('');
}

function renderCapabilities() {
  const container = byId('capabilitiesContainer');
  if (!container || !data.company.capabilities) return;
  const items = [...data.company.capabilities, ...data.company.capabilities]; // doubled for the seamless marquee
  container.innerHTML = items.map((item) => `
    <div class="capability-item">
      <div class="capability-bullet"></div>
      <span>${item}</span>
    </div>`).join('');
}

// ------------------------------------------------------------------ services
function renderServices() {
  const container = byId('servicesContainer');
  if (!container || !data.services) return;
  const services = limited(container, data.services);

  if (container.dataset.variant !== 'detailed') {
    // Compact grid (home): each card links to its service page, plus a closing
    // "not sure" card so the grid always fills complete rows.
    container.innerHTML = services.map((service, index) => `
    <a href="${service.url || `/services/#${service.id}`}" class="card service-card service-card-link reveal ${delay(index, 4)}">
      <div class="icon-tile">${icon(service.icon)}</div>
      <h3 class="service-title">${service.title}</h3>
      <p class="service-description">${service.description}</p>
      <span class="link-arrow">Learn more ${icon('arrowRight')}</span>
    </a>`).join('') + (services.length % 4 ? `
    <a href="/contact/" class="card service-card service-card-cta reveal">
      <h3 class="service-title">Not sure which fits?</h3>
      <p class="service-description">Tell us what you want to build. We'll recommend the right approach and a realistic timeline.</p>
      <span class="link-arrow">Book a consultation ${icon('arrowRight')}</span>
    </a>` : '');
    return;
  }

  container.innerHTML = services.map((service, index) => `
    <div class="card service-card reveal ${delay(index, 3)}" id="${service.id}">
      <div class="icon-tile">${icon(service.icon)}</div>
      <h3 class="service-title">${service.title}</h3>
      <p class="service-description">${service.description}</p>
      ${service.bestFor || service.timeline ? `<div class="service-meta">${service.bestFor ? `<div><strong>Best for:</strong> ${service.bestFor}</div>` : ''}${service.timeline ? `<div><strong>Typical timeline:</strong> ${service.timeline}</div>` : ''}</div>` : ''}
      ${service.deliverables?.length ? `
        <div class="service-includes-label">What's included</div>
        <ul class="check-list">
          ${service.deliverables.map((item) => `<li>${icon('check')}<span>${item}</span></li>`).join('')}
        </ul>` : ''}
      ${service.url ? `<a href="${service.url}" class="link-arrow service-page-link">${service.title} in detail ${icon('arrowRight')}</a>` : ''}
    </div>`).join('');
}

function renderIndustries() {
  const container = byId('industriesContainer');
  const industries = data.industries;
  if (!container || !industries) return;
  const list = limited(container, industries.list || []);
  container.innerHTML = `
    <ul class="industry-chips">
      ${list.map((name) => `<li class="industry-chip">${name}</li>`).join('')}
      <li class="industry-chip">…and any other industry</li>
    </ul>
    ${industries.note ? `<p class="industry-note">${industries.note}</p>` : ''}`;
}

function renderClients() {
  const container = byId('clientsContainer');
  const clients = data.clients;
  if (!container || !clients?.items?.length) return;
  const card = (client) => {
    const inner = `
      <img src="${client.logo}" alt="${client.name} logo" class="client-logo" loading="lazy" width="48" height="48" decoding="async" />
      <span class="client-text">
        <span class="client-name">${client.name}</span>
        ${client.industry ? `<span class="client-industry">${client.industry}</span>` : ''}
      </span>`;
    return client.url
      ? `<a href="${client.url}" target="_blank" rel="noopener noreferrer" class="client-card">${inner}</a>`
      : `<div class="client-card">${inner}</div>`;
  };
  if (container.dataset.marquee !== 'true') {
    container.innerHTML = clients.items.map(card).join('');
    return;
  }
  const repeats = Math.max(1, Math.ceil(8 / clients.items.length));
  const track = Array.from({ length: repeats }, () => clients.items).flat().map(card).join('');
  container.innerHTML = `<div class="clients-track">${track}${track}</div>`;
}

// ------------------------------------------------------------------ projects
/** All matching projects are rendered; the category filter then only toggles `hidden` (no data needed at runtime). */
function renderProjects() {
  const container = byId('projectsContainer');
  if (!container) return;
  let projects = container.dataset.featured === 'true' ? data.projects.filter((p) => p.featured) : data.projects;
  projects = limited(container, projects);
  container.innerHTML = projects.map((project, index) => `
    <a href="${project.caseStudyUrl || '#'}" class="card project-card reveal ${delay(index, 3)}" data-category="${project.category}">
      <div class="project-image-wrapper">
        <img src="${project.image}" alt="${project.title} — ${project.badge || project.category} solution architecture illustration" class="project-image" loading="lazy" width="640" height="400" />
        <span class="project-badge">${project.category}</span>
        ${project.isPlaceholder ? '<span class="sample-tag">Sample blueprint</span>' : ''}
      </div>
      <div class="project-body">
        <div class="project-client-type">${project.clientType || ''}</div>
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <span class="link-arrow">${project.isPlaceholder ? 'View blueprint' : 'View case study'} ${icon('arrowRight')}</span>
      </div>
    </a>`).join('');
}

function renderProjectFilters() {
  const container = byId('projectFilterContainer');
  if (!container) return;
  const categories = data.projectCategories || ['All', 'SaaS', 'CMS', 'Web App', 'Custom Software'];
  container.innerHTML = categories.map((category) => `
    <button type="button" class="filter-btn ${category === 'All' ? 'active' : ''}" data-category="${category}" aria-pressed="${category === 'All'}">${category}</button>`).join('');
}

// ------------------------------------------------------------------ company story
function renderWhyChooseUs() {
  const container = byId('whyUsContainer') || byId('whyChooseUsContainer');
  if (!container || !data.whyChooseUs) return;
  container.innerHTML = limited(container, data.whyChooseUs).map((item, index) => `
    <div class="card why-card reveal ${delay(index, 3)}">
      <div class="icon-tile">${icon(item.icon)}</div>
      <div class="why-content">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    </div>`).join('');
}

function renderProcess() {
  const container = byId('processContainer');
  if (!container || !data.process) return;
  container.innerHTML = data.process.map((step, index) => `
    <div class="card process-card reveal ${delay(index, 3)}">
      <div class="process-step-number">${step.step}</div>
      <div class="process-phase">${step.phase}</div>
      <h3 class="process-title">${step.title}</h3>
      <p class="process-summary">${step.summary}</p>
      <div class="process-deliverables-label">Deliverables</div>
      <ul class="process-deliverables">
        ${(step.deliverables || []).map((item) => `<li class="process-deliverable-item">${item}</li>`).join('')}
      </ul>
    </div>`).join('');
}

function techIcon(tech) {
  if (tech.logo) return `<img src="/images/tech/${tech.logo}.svg" alt="" loading="lazy" width="20" height="20" />`;
  if (tech.icon) return icon(tech.icon);
  return '<span class="tech-level-dot"></span>';
}

function renderTechMarquee() {
  const track = byId('techMarqueeTrack');
  if (!track || !data.marqueeTechnologies) return;
  const items = [...data.marqueeTechnologies, ...data.marqueeTechnologies]; // doubled for the seamless marquee
  track.innerHTML = items.map((tech) => `
    <div class="tech-marquee-item">
      <span class="tech-marquee-icon">${techIcon(tech)}</span>
      <span class="tech-marquee-name">${tech.name}</span>
      <span class="tech-marquee-cat">${tech.category}</span>
    </div>`).join('');
}

function renderTechnologies() {
  const container = byId('technologiesContainer');
  if (!container || !data.technologies) return;
  container.innerHTML = data.technologies.map((category, index) => `
    <div class="card tech-category-card reveal ${delay(index, 2)}">
      <h3 class="tech-cat-title">${category.category}</h3>
      <p class="tech-cat-desc">${category.description}</p>
      <div class="tech-pill-list">
        ${(category.skills || []).map((skill) => `
          <div class="tech-skill-pill">
            <span class="tech-skill-logo">${techIcon(skill)}</span>
            <span>${skill.name}</span>
          </div>`).join('')}
      </div>
    </div>`).join('');
}

function renderAbout() {
  const about = data.about;
  if (!about) return;
  const headline = byId('aboutHeadline');
  const lead = byId('aboutLead');
  const paragraphs = byId('aboutParagraphs');
  const highlights = byId('aboutHighlights');
  if (headline) headline.textContent = about.headline;
  if (lead) lead.textContent = about.lead;
  if (paragraphs) paragraphs.innerHTML = (about.paragraphs || []).map((text) => `<p>${text}</p>`).join('');
  if (highlights) {
    highlights.innerHTML = (about.highlights || []).map((item) => `
      <div class="about-highlight-card">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>`).join('');
  }
}

function renderStats() {
  const container = byId('statsContainer');
  if (!container || !data.company.stats) return;
  container.innerHTML = data.company.stats.map((stat, index) => `
    <div class="stat-card reveal ${delay(index, 4)}">
      <div class="stat-value">${stat.value}</div>
      <div class="stat-label">${stat.label}</div>
    </div>`).join('');
}

function renderTestimonials() {
  const section = byId('testimonialsSection');
  const container = byId('testimonialsContainer');
  if (!section || !container || !data.testimonials) return;
  if (!data.testimonials.showSection) {
    section.style.display = 'none';
    return;
  }
  section.style.display = 'block';
  container.innerHTML = (data.testimonials.items || []).map((item, index) => {
    const initials = item.authorName.split(' ').map((part) => part[0]).filter(Boolean).slice(0, 2).join('');
    return `
      <div class="card testimonial-card reveal ${delay(index, 3)}">
        <div class="star-rating">${Array(item.rating || 5).fill(icon('star')).join('')}</div>
        <div class="testimonial-quote">“${item.quote}”</div>
        <div class="testimonial-author">
          <div class="author-avatar">${initials}</div>
          <div>
            <div class="author-name">${item.authorName}</div>
            <div class="author-role">${item.authorRole} • ${item.company}</div>
          </div>
        </div>
      </div>`;
  }).join('');
}

function renderCallToAction() {
  if (!byId('ctaBannerSection') || !data.cta) return;
  const headline = byId('ctaHeadline');
  const subtext = byId('ctaSubtext');
  const button = byId('ctaButton');
  if (headline) headline.textContent = data.cta.headline;
  if (subtext) subtext.textContent = data.cta.subtext;
  if (button) {
    button.innerHTML = `${data.cta.buttonText} ${icon('arrowRight')}`;
    button.setAttribute('href', data.cta.buttonHref);
  }
}

function renderContactChannels() {
  const container = byId('contactChannelsContainer');
  if (!container || !data.contact) return;
  const channels = data.contact.channels || {};
  const contact = data.company.contact || {};
  const whatsappNumber = (contact.whatsapp || '').replace(/[^0-9]/g, '');
  const shortName = encodeURIComponent(data.company.shortName || 'Thinkvistar');
  container.innerHTML = `
    <div class="contact-card">
      <div class="contact-icon-wrap">${icon('email')}</div>
      <div class="contact-details">
        <h3>${channels.email?.label || 'Email Us'}</h3>
        <a href="mailto:${contact.email}" class="contact-link">${contact.email}</a>
        ${contact.supportEmail ? `<a href="mailto:${contact.supportEmail}" class="contact-link">${contact.supportEmail}</a>` : ''}
        <div class="contact-hint">${channels.email?.hint || 'Direct consultation and RFP submissions'}</div>
      </div>
    </div>
    <div class="contact-card">
      <div class="contact-icon-wrap">${icon('whatsapp')}</div>
      <div class="contact-details">
        <h3>${channels.whatsapp?.label || 'WhatsApp'}</h3>
        <a href="https://wa.me/${whatsappNumber}?text=Hi%20${shortName},%20I'd%20like%20to%20discuss%20a%20project%20inquiry." target="_blank" rel="noopener noreferrer" class="contact-link">
          ${contact.phone || contact.whatsapp}
        </a>
        <div class="contact-hint">${channels.whatsapp?.hint || 'Instant chat & project scoping'}</div>
      </div>
    </div>
    <div class="contact-card">
      <div class="contact-icon-wrap">${icon('mapPin')}</div>
      <div class="contact-details">
        <h3>${channels.location?.label || 'Location'}</h3>
        <div class="contact-link" style="cursor: default;">${channels.location?.value || contact.address || contact.location}</div>
        <div class="contact-hint">${channels.location?.hint || 'Available for global timezones'}</div>
      </div>
    </div>`;
}

// ------------------------------------------------------------------ team
/** Team cards. `role`, `bio` and `profiles` are optional: they are shown only when the owner has supplied them. */
function renderTeam() {
  const container = byId('teamContainer');
  if (!container || !data.team) return;
  container.innerHTML = data.team.map((member) => {
    const initials = member.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
    const profiles = (member.profiles || []).map((p) => `<a href="${p.url}" target="_blank" rel="noopener noreferrer" aria-label="${member.name} on ${p.label}">${p.label}</a>`).join('');
    return `
        <div class="card team-card">
          <div class="team-avatar" aria-hidden="true">${initials}</div>
          <div class="team-body">
            <h3>${member.name}</h3>
            ${member.role ? `<p class="team-role">${member.role}</p>` : ''}
            ${member.bio ? `<p class="team-bio">${member.bio}</p>` : ''}
            <p class="team-phone">${member.phone}</p>
            <div class="team-actions">
              <a href="tel:+${member.whatsapp}" aria-label="Call ${member.name}">Call</a>
              <a href="https://wa.me/${member.whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ${member.name}">WhatsApp</a>
              ${profiles}
            </div>
          </div>
        </div>`;
  }).join('');
}

// ------------------------------------------------------------------ legal pages
function renderLegalPage(prefix, document_) {
  const set = (id, text) => { const el = byId(id); if (el) el.textContent = text; };
  set(`${prefix}CompanyName`, data.company.shortName || data.company.name);
  set(`${prefix}FooterCopyright`, data.footer.copyright);
  if (!document_) return;
  set(`${prefix}Title`, document_.title);
  set(`${prefix}Subtitle`, document_.subtitle);
  set(`${prefix}LastUpdated`, `Last Updated: ${document_.lastUpdated}`);
  const sections = byId(`${prefix}SectionsContainer`);
  if (sections && document_.sections) {
    sections.innerHTML = document_.sections.map((section) => `
      <div class="legal-section">
        <h2>${section.title}</h2>
        ${section.content ? `<p>${section.content}</p>` : ''}
        ${Array.isArray(section.items) && section.items.length ? `<ul>${section.items.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
        ${section.note ? `<p class="legal-note">${section.note}</p>` : ''}
      </div>`).join('');
  }
}

export function renderSections() {
  renderHero();
  renderCapabilities();
  renderServices();
  renderIndustries();
  renderClients();
  renderProjectFilters();
  renderProjects();
  renderWhyChooseUs();
  renderProcess();
  renderTechMarquee();
  renderTechnologies();
  renderAbout();
  renderTeam();
  renderStats();
  renderTestimonials();
  renderCallToAction();
  renderContactChannels();
  renderLegalPage('privacy', data.privacyPolicy);
  renderLegalPage('terms', data.termsAndConditions);
}
