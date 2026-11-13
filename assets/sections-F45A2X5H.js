import{a as i,b as l}from"./chunk-2275CZUU.js";import{a as s}from"./chunk-PM6H2N5Y.js";function u(t,e){let a=parseInt(t.dataset.limit,10);return Number.isFinite(a)&&a>0?e.slice(0,a):e}var d=(t,e)=>`delay-${t%e+1}`;function f(){let{hero:t}=i,e=(c,p)=>{let h=s(c);h&&(h.textContent=p)};e("heroBadge",t.badge),e("heroSubtext",t.subtext);let a=s("heroHeadline");if(a){let c=t.headline||"",p=c.lastIndexOf(".");if(p>0&&p<c.length-1)a.innerHTML=`${c.slice(0,p+1)} <span class="hero-gradient-text">${c.slice(p+1).trim()}</span>`;else{let h=c.trim().split(/\s+/),$=h.splice(-2).join(" ");a.innerHTML=h.length?`${h.join(" ")} <span class="hero-gradient-text">${$}</span>`:`<span class="hero-gradient-text">${$}</span>`}}let r=s("heroCtaPrimary");r&&(r.innerHTML=`${t.ctaPrimary.label} ${l("arrowRight")}`,r.setAttribute("href",t.ctaPrimary.href));let n=s("heroCtaSecondary");n&&(n.textContent=t.ctaSecondary.label,n.setAttribute("href",t.ctaSecondary.href));let o=s("heroPills");o&&t.trustPills&&(o.innerHTML=t.trustPills.map(c=>`<span class="hero-pill">${c}</span>`).join(""))}function g(){let t=s("capabilitiesContainer");if(!t||!i.company.capabilities)return;let e=[...i.company.capabilities,...i.company.capabilities];t.innerHTML=e.map(a=>`
    <div class="capability-item">
      <div class="capability-bullet"></div>
      <span>${a}</span>
    </div>`).join("")}function y(){let t=s("servicesContainer");if(!t||!i.services)return;let e=u(t,i.services);if(t.dataset.variant!=="detailed"){t.innerHTML=e.map((a,r)=>`
    <a href="${a.url||`/services/#${a.id}`}" class="card service-card service-card-link reveal ${d(r,4)}">
      <div class="icon-tile">${l(a.icon)}</div>
      <h3 class="service-title">${a.title}</h3>
      <p class="service-description">${a.description}</p>
      <span class="link-arrow">Learn more ${l("arrowRight")}</span>
    </a>`).join("")+(e.length%4?`
    <a href="/contact/" class="card service-card service-card-cta reveal">
      <h3 class="service-title">Not sure which fits?</h3>
      <p class="service-description">Tell us what you want to build. We'll recommend the right approach and a realistic timeline.</p>
      <span class="link-arrow">Book a consultation ${l("arrowRight")}</span>
    </a>`:"");return}t.innerHTML=e.map((a,r)=>`
    <div class="card service-card reveal ${d(r,3)}" id="${a.id}">
      <div class="icon-tile">${l(a.icon)}</div>
      <h3 class="service-title">${a.title}</h3>
      <p class="service-description">${a.description}</p>
      ${a.bestFor||a.timeline?`<div class="service-meta">${a.bestFor?`<div><strong>Best for:</strong> ${a.bestFor}</div>`:""}${a.timeline?`<div><strong>Typical timeline:</strong> ${a.timeline}</div>`:""}</div>`:""}
      ${a.deliverables?.length?`
        <div class="service-includes-label">What's included</div>
        <ul class="check-list">
          ${a.deliverables.map(n=>`<li>${l("check")}<span>${n}</span></li>`).join("")}
        </ul>`:""}
      ${a.url?`<a href="${a.url}" class="link-arrow service-page-link">${a.title} in detail ${l("arrowRight")}</a>`:""}
    </div>`).join("")}function b(){let t=s("industriesContainer"),e=i.industries;if(!t||!e)return;let a=u(t,e.list||[]);t.innerHTML=`
    <ul class="industry-chips">
      ${a.map(r=>`<li class="industry-chip">${r}</li>`).join("")}
      <li class="industry-chip">\u2026and any other industry</li>
    </ul>
    ${e.note?`<p class="industry-note">${e.note}</p>`:""}`}function C(){let t=s("clientsContainer"),e=i.clients;if(!t||!e?.items?.length)return;let a=o=>{let c=`
      <img src="${o.logo}" alt="${o.name} logo" class="client-logo" loading="lazy" width="48" height="48" decoding="async" />
      <span class="client-text">
        <span class="client-name">${o.name}</span>
        ${o.industry?`<span class="client-industry">${o.industry}</span>`:""}
      </span>`;return o.url?`<a href="${o.url}" target="_blank" rel="noopener noreferrer" class="client-card">${c}</a>`:`<div class="client-card">${c}</div>`};if(t.dataset.marquee!=="true"){t.innerHTML=e.items.map(a).join("");return}let r=Math.max(1,Math.ceil(8/e.items.length)),n=Array.from({length:r},()=>e.items).flat().map(a).join("");t.innerHTML=`<div class="clients-track">${n}${n}</div>`}function w(){let t=s("projectsContainer");if(!t)return;let e=t.dataset.featured==="true"?i.projects.filter(a=>a.featured):i.projects;e=u(t,e),t.innerHTML=e.map((a,r)=>`
    <a href="${a.caseStudyUrl||"#"}" class="card project-card reveal ${d(r,3)}" data-category="${a.category}">
      <div class="project-image-wrapper">
        <img src="${a.image}" alt="${a.title} \u2014 ${a.badge||a.category} solution architecture illustration" class="project-image" loading="lazy" width="640" height="400" />
        <span class="project-badge">${a.category}</span>
        ${a.isPlaceholder?'<span class="sample-tag">Sample blueprint</span>':""}
      </div>
      <div class="project-body">
        <div class="project-client-type">${a.clientType||""}</div>
        <h3 class="project-title">${a.title}</h3>
        <p class="project-description">${a.description}</p>
        <span class="link-arrow">${a.isPlaceholder?"View blueprint":"View case study"} ${l("arrowRight")}</span>
      </div>
    </a>`).join("")}function T(){let t=s("projectFilterContainer");if(!t)return;let e=i.projectCategories||["All","SaaS","CMS","Web App","Custom Software"];t.innerHTML=e.map(a=>`
    <button type="button" class="filter-btn ${a==="All"?"active":""}" data-category="${a}" aria-pressed="${a==="All"}">${a}</button>`).join("")}function j(){let t=s("whyUsContainer")||s("whyChooseUsContainer");!t||!i.whyChooseUs||(t.innerHTML=u(t,i.whyChooseUs).map((e,a)=>`
    <div class="card why-card reveal ${d(a,3)}">
      <div class="icon-tile">${l(e.icon)}</div>
      <div class="why-content">
        <h3>${e.title}</h3>
        <p>${e.description}</p>
      </div>
    </div>`).join(""))}function H(){let t=s("processContainer");!t||!i.process||(t.innerHTML=i.process.map((e,a)=>`
    <div class="card process-card reveal ${d(a,3)}">
      <div class="process-step-number">${e.step}</div>
      <div class="process-phase">${e.phase}</div>
      <h3 class="process-title">${e.title}</h3>
      <p class="process-summary">${e.summary}</p>
      <div class="process-deliverables-label">Deliverables</div>
      <ul class="process-deliverables">
        ${(e.deliverables||[]).map(r=>`<li class="process-deliverable-item">${r}</li>`).join("")}
      </ul>
    </div>`).join(""))}function m(t){return t.logo?`<img src="/images/tech/${t.logo}.svg" alt="" loading="lazy" width="20" height="20" />`:t.icon?l(t.icon):'<span class="tech-level-dot"></span>'}function L(){let t=s("techMarqueeTrack");if(!t||!i.marqueeTechnologies)return;let e=[...i.marqueeTechnologies,...i.marqueeTechnologies];t.innerHTML=e.map(a=>`
    <div class="tech-marquee-item">
      <span class="tech-marquee-icon">${m(a)}</span>
      <span class="tech-marquee-name">${a.name}</span>
      <span class="tech-marquee-cat">${a.category}</span>
    </div>`).join("")}function M(){let t=s("technologiesContainer");!t||!i.technologies||(t.innerHTML=i.technologies.map((e,a)=>`
    <div class="card tech-category-card reveal ${d(a,2)}">
      <h3 class="tech-cat-title">${e.category}</h3>
      <p class="tech-cat-desc">${e.description}</p>
      <div class="tech-pill-list">
        ${(e.skills||[]).map(r=>`
          <div class="tech-skill-pill">
            <span class="tech-skill-logo">${m(r)}</span>
            <span>${r.name}</span>
          </div>`).join("")}
      </div>
    </div>`).join(""))}function k(){let t=i.about;if(!t)return;let e=s("aboutHeadline"),a=s("aboutLead"),r=s("aboutParagraphs"),n=s("aboutHighlights");e&&(e.textContent=t.headline),a&&(a.textContent=t.lead),r&&(r.innerHTML=(t.paragraphs||[]).map(o=>`<p>${o}</p>`).join("")),n&&(n.innerHTML=(t.highlights||[]).map(o=>`
      <div class="about-highlight-card">
        <h3>${o.title}</h3>
        <p>${o.description}</p>
      </div>`).join(""))}function S(){let t=s("statsContainer");!t||!i.company.stats||(t.innerHTML=i.company.stats.map((e,a)=>`
    <div class="stat-card reveal ${d(a,4)}">
      <div class="stat-value">${e.value}</div>
      <div class="stat-label">${e.label}</div>
    </div>`).join(""))}function A(){let t=s("testimonialsSection"),e=s("testimonialsContainer");if(!(!t||!e||!i.testimonials)){if(!i.testimonials.showSection){t.style.display="none";return}t.style.display="block",e.innerHTML=(i.testimonials.items||[]).map((a,r)=>{let n=a.authorName.split(" ").map(o=>o[0]).filter(Boolean).slice(0,2).join("");return`
      <div class="card testimonial-card reveal ${d(r,3)}">
        <div class="star-rating">${Array(a.rating||5).fill(l("star")).join("")}</div>
        <div class="testimonial-quote">\u201C${a.quote}\u201D</div>
        <div class="testimonial-author">
          <div class="author-avatar">${n}</div>
          <div>
            <div class="author-name">${a.authorName}</div>
            <div class="author-role">${a.authorRole} \u2022 ${a.company}</div>
          </div>
        </div>
      </div>`}).join("")}}function x(){if(!s("ctaBannerSection")||!i.cta)return;let t=s("ctaHeadline"),e=s("ctaSubtext"),a=s("ctaButton");t&&(t.textContent=i.cta.headline),e&&(e.textContent=i.cta.subtext),a&&(a.innerHTML=`${i.cta.buttonText} ${l("arrowRight")}`,a.setAttribute("href",i.cta.buttonHref))}function P(){let t=s("contactChannelsContainer");if(!t||!i.contact)return;let e=i.contact.channels||{},a=i.company.contact||{},r=(a.whatsapp||"").replace(/[^0-9]/g,""),n=encodeURIComponent(i.company.shortName||"Thinkvistar");t.innerHTML=`
    <div class="contact-card">
      <div class="contact-icon-wrap">${l("email")}</div>
      <div class="contact-details">
        <h3>${e.email?.label||"Email Us"}</h3>
        <a href="mailto:${a.email}" class="contact-link">${a.email}</a>
        ${a.supportEmail?`<a href="mailto:${a.supportEmail}" class="contact-link">${a.supportEmail}</a>`:""}
        <div class="contact-hint">${e.email?.hint||"Direct consultation and RFP submissions"}</div>
      </div>
    </div>
    <div class="contact-card">
      <div class="contact-icon-wrap">${l("whatsapp")}</div>
      <div class="contact-details">
        <h3>${e.whatsapp?.label||"WhatsApp"}</h3>
        <a href="https://wa.me/${r}?text=Hi%20${n},%20I'd%20like%20to%20discuss%20a%20project%20inquiry." target="_blank" rel="noopener noreferrer" class="contact-link">
          ${a.phone||a.whatsapp}
        </a>
        <div class="contact-hint">${e.whatsapp?.hint||"Instant chat & project scoping"}</div>
      </div>
    </div>
    <div class="contact-card">
      <div class="contact-icon-wrap">${l("mapPin")}</div>
      <div class="contact-details">
        <h3>${e.location?.label||"Location"}</h3>
        <div class="contact-link" style="cursor: default;">${e.location?.value||a.address||a.location}</div>
        <div class="contact-hint">${e.location?.hint||"Available for global timezones"}</div>
      </div>
    </div>`}function q(){let t=s("teamContainer");!t||!i.team||(t.innerHTML=i.team.map(e=>{let a=e.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(),r=(e.profiles||[]).map(n=>`<a href="${n.url}" target="_blank" rel="noopener noreferrer" aria-label="${e.name} on ${n.label}">${n.label}</a>`).join("");return`
        <div class="card team-card">
          <div class="team-avatar" aria-hidden="true">${a}</div>
          <div class="team-body">
            <h3>${e.name}</h3>
            ${e.role?`<p class="team-role">${e.role}</p>`:""}
            ${e.bio?`<p class="team-bio">${e.bio}</p>`:""}
            <p class="team-phone">${e.phone}</p>
            <div class="team-actions">
              <a href="tel:+${e.whatsapp}" aria-label="Call ${e.name}">Call</a>
              <a href="https://wa.me/${e.whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ${e.name}">WhatsApp</a>
              ${r}
            </div>
          </div>
        </div>`}).join(""))}function v(t,e){let a=(n,o)=>{let c=s(n);c&&(c.textContent=o)};if(a(`${t}CompanyName`,i.company.shortName||i.company.name),a(`${t}FooterCopyright`,i.footer.copyright),!e)return;a(`${t}Title`,e.title),a(`${t}Subtitle`,e.subtitle),a(`${t}LastUpdated`,`Last Updated: ${e.lastUpdated}`);let r=s(`${t}SectionsContainer`);r&&e.sections&&(r.innerHTML=e.sections.map(n=>`
      <div class="legal-section">
        <h2>${n.title}</h2>
        ${n.content?`<p>${n.content}</p>`:""}
        ${Array.isArray(n.items)&&n.items.length?`<ul>${n.items.map(o=>`<li>${o}</li>`).join("")}</ul>`:""}
        ${n.note?`<p class="legal-note">${n.note}</p>`:""}
      </div>`).join(""))}function F(){f(),g(),y(),b(),C(),T(),w(),j(),H(),L(),M(),k(),q(),S(),A(),x(),P(),v("privacy",i.privacyPolicy),v("terms",i.termsAndConditions)}export{F as renderSections};
