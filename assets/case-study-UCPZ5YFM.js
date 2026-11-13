import{a as i,b as a}from"./chunk-2275CZUU.js";import{a as d,b as h}from"./chunk-PM6H2N5Y.js";function p(n){document.title=`Case Study Not Found \u2014 ${i.company.name}`,n.innerHTML=`
    <div class="not-found">
      <h2>Case Study Not Found</h2>
      <p>The requested case study could not be located.</p>
      <a href="/projects/" class="btn btn-primary">Return to Projects</a>
    </div>`}function v(n,e){document.title=`${e.title} \u2014 ${e.isPlaceholder?"Solution Blueprint":"Case Study"} | ${i.company.name}`;let s=e.caseStudy||{},l=s.results||[],c=s.keyFeatures||[],o=s.developmentProcess||[],u=e.technologies||[],r=/^https?:\/\//.test(e.url||"")?e.url:"";n.innerHTML=`
    <div class="case-study-header">
      <div class="case-study-meta">
        <span class="project-badge">${e.category}</span>
        ${e.isPlaceholder?'<span class="sample-tag">SAMPLE BLUEPRINT</span>':""}
        <small>${e.clientType||""}</small>
        ${r?`<a href="${r}" target="_blank" rel="noopener noreferrer" class="link-arrow">Visit live site ${a("externalLink")}</a>`:""}
      </div>
      <h1 class="page-title">${e.title}</h1>
      <p class="case-study-lead">${s.headline||e.description}</p>
      ${e.isPlaceholder?'<p class="notice"><strong>Illustrative blueprint.</strong> This is a worked example of how we approach this type of project, not a record of a specific client engagement. Metrics shown are design targets.</p>':""}
    </div>

    <img src="${e.image}" alt="${e.title} \u2014 solution architecture illustration" class="case-study-hero-img" width="640" height="400" />

    ${l.length?`
      <div class="case-study-section">
        <h3 class="case-study-section-title">${a("target")} ${e.isPlaceholder?"Design Targets":"Measurable Production Impact"}</h3>
        <div class="metrics-grid">
          ${l.map(t=>`
            <div class="metric-card">
              <div class="metric-value">${t.metric}</div>
              <div class="metric-label">${t.label}</div>
            </div>`).join("")}
        </div>
      </div>`:""}

    ${s.overview?`
      <div class="case-study-section">
        <h3 class="case-study-section-title">${a("layers")} Overview</h3>
        <p>${s.overview}</p>
      </div>`:""}

    <div class="case-study-section challenge-solution">
      <div class="cs-block challenge">
        <h3>Technical Challenge &amp; Constraints</h3>
        <p>${s.challenge||"High-throughput scaling and complex enterprise state requirements."}</p>
      </div>
      <div class="cs-block solution">
        <h3>Architectural Solution</h3>
        <p>${s.solution||"Engineered modular microservices with distributed caching and multi-tenant security isolation."}</p>
      </div>
    </div>

    ${c.length?`
      <div class="case-study-section">
        <h3 class="case-study-section-title">${a("check")} Key Engineering Features</h3>
        <ul class="feature-list boxed">
          ${c.map(t=>`<li>${a("check")}<span>${t}</span></li>`).join("")}
        </ul>
      </div>`:""}

    ${o.length?`
      <div class="case-study-section">
        <h3 class="case-study-section-title">${a("layers")} Delivery Roadmap</h3>
        <ul class="roadmap-list">
          ${o.map(t=>`<li><strong>${t.phase}</strong><span>${t.detail}</span></li>`).join("")}
        </ul>
      </div>`:""}

    <div class="case-study-section">
      <h3 class="case-study-section-title">${a("cpu")} Technology Foundation</h3>
      <div class="tag-list">
        ${u.map(t=>`<span class="tech-tag">${t}</span>`).join("")}
      </div>
      ${s.architectureNotes?`<p class="arch-note">${s.architectureNotes}</p>`:""}
    </div>

    <div class="cta-card">
      <div class="cta-inner">
        <div class="cta-content">
          <h2 class="cta-headline">Need an architecture like this?</h2>
          <p class="cta-subtext">Let's discuss how we can adapt this blueprint for your organization.</p>
        </div>
        <div class="cta-action">
          ${r?`<a href="${r}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-lg">Visit live site ${a("externalLink")}</a>`:""}
          <a href="/contact/" class="btn btn-white btn-lg">Book a Consultation</a>
        </div>
      </div>
    </div>`}h(()=>{let n=d("csCompanyName"),e=d("csFooterCopyright");n&&(n.textContent=i.company.shortName||i.company.name),e&&(e.textContent=i.footer.copyright);let s=d("caseStudyContainer");if(!s)return;let l=new URLSearchParams(window.location.search).get("id"),c=i.projects.find(o=>o.id===l);c?v(s,c):p(s)});
