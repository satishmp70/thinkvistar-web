// Blueprint / case-study detail page. The blueprint is chosen with ?id=<project id>, so
// it cannot be pre-rendered; the page is marked noindex. This is the only route that
// loads the project data at runtime.
import data from '../site-data.json';
import { byId, onReady } from './lib/dom.js';
import { icon } from './lib/icons.js';

function renderNotFound(container) {
  document.title = `Case Study Not Found — ${data.company.name}`;
  container.innerHTML = `
    <div class="not-found">
      <h2>Case Study Not Found</h2>
      <p>The requested case study could not be located.</p>
      <a href="/projects/" class="btn btn-primary">Return to Projects</a>
    </div>`;
}

function renderProject(container, project) {
  document.title = `${project.title} — ${project.isPlaceholder ? 'Solution Blueprint' : 'Case Study'} | ${data.company.name}`;
  const study = project.caseStudy || {};
  const results = study.results || [];
  const features = study.keyFeatures || [];
  const roadmap = study.developmentProcess || [];
  const technologies = project.technologies || [];
  const liveUrl = /^https?:\/\//.test(project.url || '') ? project.url : '';

  container.innerHTML = `
    <div class="case-study-header">
      <div class="case-study-meta">
        <span class="project-badge">${project.category}</span>
        ${project.isPlaceholder ? '<span class="sample-tag">SAMPLE BLUEPRINT</span>' : ''}
        <small>${project.clientType || ''}</small>
        ${liveUrl ? `<a href="${liveUrl}" target="_blank" rel="noopener noreferrer" class="link-arrow">Visit live site ${icon('externalLink')}</a>` : ''}
      </div>
      <h1 class="page-title">${project.title}</h1>
      <p class="case-study-lead">${study.headline || project.description}</p>
      ${project.isPlaceholder ? '<p class="notice"><strong>Illustrative blueprint.</strong> This is a worked example of how we approach this type of project, not a record of a specific client engagement. Metrics shown are design targets.</p>' : ''}
    </div>

    <img src="${project.image}" alt="${project.title} — solution architecture illustration" class="case-study-hero-img" width="640" height="400" />

    ${results.length ? `
      <div class="case-study-section">
        <h3 class="case-study-section-title">${icon('target')} ${project.isPlaceholder ? 'Design Targets' : 'Measurable Production Impact'}</h3>
        <div class="metrics-grid">
          ${results.map((result) => `
            <div class="metric-card">
              <div class="metric-value">${result.metric}</div>
              <div class="metric-label">${result.label}</div>
            </div>`).join('')}
        </div>
      </div>` : ''}

    ${study.overview ? `
      <div class="case-study-section">
        <h3 class="case-study-section-title">${icon('layers')} Overview</h3>
        <p>${study.overview}</p>
      </div>` : ''}

    <div class="case-study-section challenge-solution">
      <div class="cs-block challenge">
        <h3>Technical Challenge &amp; Constraints</h3>
        <p>${study.challenge || 'High-throughput scaling and complex enterprise state requirements.'}</p>
      </div>
      <div class="cs-block solution">
        <h3>Architectural Solution</h3>
        <p>${study.solution || 'Engineered modular microservices with distributed caching and multi-tenant security isolation.'}</p>
      </div>
    </div>

    ${features.length ? `
      <div class="case-study-section">
        <h3 class="case-study-section-title">${icon('check')} Key Engineering Features</h3>
        <ul class="feature-list boxed">
          ${features.map((feature) => `<li>${icon('check')}<span>${feature}</span></li>`).join('')}
        </ul>
      </div>` : ''}

    ${roadmap.length ? `
      <div class="case-study-section">
        <h3 class="case-study-section-title">${icon('layers')} Delivery Roadmap</h3>
        <ul class="roadmap-list">
          ${roadmap.map((step) => `<li><strong>${step.phase}</strong><span>${step.detail}</span></li>`).join('')}
        </ul>
      </div>` : ''}

    <div class="case-study-section">
      <h3 class="case-study-section-title">${icon('cpu')} Technology Foundation</h3>
      <div class="tag-list">
        ${technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join('')}
      </div>
      ${study.architectureNotes ? `<p class="arch-note">${study.architectureNotes}</p>` : ''}
    </div>

    <div class="cta-card">
      <div class="cta-inner">
        <div class="cta-content">
          <h2 class="cta-headline">Need an architecture like this?</h2>
          <p class="cta-subtext">Let's discuss how we can adapt this blueprint for your organization.</p>
        </div>
        <div class="cta-action">
          ${liveUrl ? `<a href="${liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-lg">Visit live site ${icon('externalLink')}</a>` : ''}
          <a href="/contact/" class="btn btn-white btn-lg">Book a Consultation</a>
        </div>
      </div>
    </div>`;
}

onReady(() => {
  const name = byId('csCompanyName');
  const copyright = byId('csFooterCopyright');
  if (name) name.textContent = data.company.shortName || data.company.name;
  if (copyright) copyright.textContent = data.footer.copyright;

  const container = byId('caseStudyContainer');
  if (!container) return;
  const id = new URLSearchParams(window.location.search).get('id');
  const project = data.projects.find((candidate) => candidate.id === id);
  if (project) renderProject(container, project);
  else renderNotFound(container);
});
