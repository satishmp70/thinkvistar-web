// Dedicated, indexable page per service (/services/<slug>/).
// Each page targets one search intent, so /services/ stays the overview and the
// service pages never compete with each other. Content here is the page copy;
// keep it factual — no invented clients, metrics or reviews.

const CHECK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

export const SERVICE_PAGES = [
  {
    id: 'custom-saas',
    slug: 'saas-development',
    buildTitle: 'SaaS products we build',
    keyword: 'SaaS development company',
    title: 'SaaS Development Company in India | Thinkvistar',
    description: 'SaaS product development from MVP to scale: multi-tenant architecture, subscription billing, dashboards and APIs. Senior engineers; you own the code.',
    h1: 'SaaS development company for founders and growing teams',
    lead: 'We design and build subscription software end to end — tenant isolation, user roles, billing, admin dashboards and the APIs your customers integrate with — so your first version can grow without a rewrite.',
    useCases: [
      ['SaaS MVPs', 'A focused first release with sign-up, onboarding, the core workflow and billing, ready for paying customers.'],
      ['Internal tool to product', 'Turn a tool your team already relies on into a multi-customer product with accounts, roles and plans.'],
      ['B2B platforms', 'Customer portals, partner dashboards and admin consoles with audit logs and granular permissions.'],
      ['Usage-based products', 'Metering, usage tiers and automated invoicing for APIs, data and infrastructure products.'],
      ['Scaling an existing SaaS', 'Performance, multi-region hosting, background jobs and a cleaner architecture for the next stage of growth.'],
      ['Integrations & public APIs', 'REST or GraphQL APIs, webhooks and connectors to the CRMs, ERPs and tools your customers use.'],
    ],
    included: ['Multi-tenant architecture with data isolation', 'Role-based access control (RBAC) and SSO', 'Stripe, Razorpay or Paddle subscription billing', 'Admin dashboard and usage analytics', 'REST / GraphQL APIs and webhooks', 'Automated tests and CI/CD pipeline', 'Cloud hosting, monitoring and backups', 'Documentation and full source-code handover'],
    steps: [
      ['Discovery', 'We map your users, pricing model and core workflow, and agree what belongs in the first release.'],
      ['Architecture', 'Tenant model, data schema, billing flow and infrastructure plan — written down before code starts.'],
      ['Build', 'Weekly demos on a staging site, so you see real progress and can change direction early.'],
      ['Launch & grow', 'Production launch, monitoring, a 30-day warranty and an optional support plan as customers arrive.'],
    ],
    tech: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe', 'Razorpay', 'AWS', 'Docker'],
    timeline: ['4–6 weeks', '6–9 weeks', '8–12 weeks'],
    faq: [
      ['How long does it take to build a SaaS MVP?', 'A focused MVP usually takes 4–6 weeks: sign-up and onboarding, the core workflow, basic roles and subscription billing. Larger platforms are delivered in phases. Our <a href="/estimator/">estimator</a> gives a timeline range for your scope.'],
      ['Should my SaaS be multi-tenant from day one?', 'Almost always, yes. Designing tenant isolation into the data model from the start is far cheaper than retrofitting it after you have customers. We choose between shared-schema and schema-per-tenant based on your compliance and scale needs.'],
      ['Which payment gateways do you integrate?', 'Stripe and Paddle for international customers, and Razorpay or Cashfree for Indian customers — including subscriptions, trials, coupons, GST invoices and failed-payment retries.'],
      ['Do I own the code?', 'Yes. Once the agreed payment is made, the source code, designs and database schemas built for you are yours, and we hand over repositories and documentation. See our <a href="/terms/">terms</a>.'],
    ],
    related: ['web-application-development', 'ai-automation', 'cloud-support-maintenance'],
  },
  {
    id: 'mobile-app-development',
    slug: 'mobile-app-development',
    buildTitle: 'Mobile apps we build',
    keyword: 'mobile app development company',
    title: 'Mobile App Development Company in Mumbai | Thinkvistar',
    description: 'iOS and Android app development with React Native and Flutter: customer apps, field-staff apps and companion apps, launched on both app stores.',
    h1: 'Mobile app development for iOS and Android',
    lead: 'We design and build mobile apps for iOS and Android from one well-tested codebase — backed by secure APIs, and taken all the way through App Store and Google Play review.',
    useCases: [
      ['Customer apps', 'Booking, ordering, loyalty and account apps that let your customers do business with you from their phone.'],
      ['Field-staff apps', 'Apps for technicians, caregivers, sales and delivery teams that keep working offline and sync when back online.'],
      ['Companion apps', 'A mobile app for your existing SaaS or web platform, sharing the same APIs and user accounts.'],
      ['Healthcare & home-care apps', 'Appointment booking, visit logs and patient communication with careful handling of personal data.'],
      ['Marketplace apps', 'Two-sided apps for buyers and sellers or clients and providers, with payments and ratings.'],
      ['App rescue', 'Taking over an existing app that is unstable, slow or stuck on outdated libraries, and getting it back on track.'],
    ],
    included: ['iOS and Android apps from one codebase (React Native or Flutter)', 'UI/UX design for both platforms', 'Secure backend APIs and admin panel', 'Push notifications and offline mode', 'Payments, maps, camera and device integrations', 'Crash reporting and analytics', 'App Store and Google Play submission', 'Source code, build pipeline and documentation'],
    steps: [
      ['Discovery', 'Users, key journeys and must-have features for the first release, plus which devices and OS versions to support.'],
      ['Design', 'Clickable prototypes you can try on your own phone before development starts.'],
      ['Build', 'Weekly test builds through TestFlight and Google Play internal testing.'],
      ['Launch', 'Store listings, review submission, production release and monitoring of crashes and reviews.'],
    ],
    tech: ['React Native', 'Flutter', 'TypeScript', 'Expo', 'Firebase', 'Node.js', 'PostgreSQL', 'Supabase', 'AWS'],
    timeline: ['6–10 weeks', '9–13 weeks', '12–16 weeks'],
    faq: [
      ['Should I build a native app or use React Native / Flutter?', 'For most business apps, a cross-platform framework (React Native or Flutter) gives you iOS and Android from one codebase at a lower cost, with near-native performance. We recommend fully native development only for apps with heavy graphics, advanced hardware access or platform-specific features.'],
      ['How long does it take to build a mobile app?', 'A focused first release on both stores usually takes 6–10 weeks, including design, development, testing and store review. Apps with complex integrations or offline sync take longer.'],
      ['Do you publish the app to the App Store and Google Play?', 'Yes. We prepare the store listings, screenshots and privacy disclosures, and handle submission and review. The apps are published under your own developer accounts, so you own them.'],
      ['Can you build an app for my existing website or platform?', 'Yes. We reuse your existing backend where possible, add the APIs the app needs, and keep user accounts shared between web and mobile.'],
    ],
    related: ['web-application-development', 'saas-development', 'cloud-support-maintenance'],
  },
  {
    id: 'web-app-development',
    slug: 'web-application-development',
    buildTitle: 'Web applications we build',
    keyword: 'web application development company',
    title: 'Web Application Development Company | Thinkvistar',
    description: 'Custom web application development: customer portals, booking systems, dashboards and internal tools — fast, accessible and built on React, Next.js and Node.js.',
    h1: 'Custom web application development',
    lead: 'We build fast, accessible web applications and progressive web apps — customer portals, booking systems, dashboards and internal tools — with performance treated as a requirement, not an afterthought.',
    useCases: [
      ['Customer portals', 'Self-service accounts where customers view orders, documents, invoices and support requests.'],
      ['Booking & scheduling', 'Appointment, resource and staff scheduling with reminders, payments and calendar sync.'],
      ['Dashboards & reporting', 'Live operational dashboards that replace spreadsheets and manual reports.'],
      ['Internal tools', 'Admin panels and workflow tools that remove repetitive manual work for your team.'],
      ['Progressive web apps', 'Installable web apps that work offline — often a faster, cheaper alternative to a native app.'],
      ['Workflow automation', 'Approvals, notifications and integrations between the systems you already use.'],
    ],
    included: ['UX design and clickable prototypes', 'Responsive, accessible front end (WCAG 2.1 AA)', 'Secure authentication and user roles', 'Backend APIs and database design', 'Integrations: payments, email, SMS, WhatsApp, CRMs', 'Core Web Vitals performance budgets', 'Automated tests and CI/CD', 'Hosting setup, monitoring and handover'],
    steps: [
      ['Discovery', 'Workflows, users and data mapped into a written specification with milestones.'],
      ['Design', 'Wireframes and prototypes that validate the flows before development.'],
      ['Build', 'Iterative development with weekly demos on a staging site.'],
      ['Launch', 'Load and security checks, production deployment and a 30-day warranty.'],
    ],
    tech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Python', 'PostgreSQL', 'Redis', 'Vercel', 'AWS'],
    timeline: ['4–8 weeks', '6–10 weeks', '9–13 weeks'],
    faq: [
      ['What is the difference between a website and a web application?', 'A website mainly presents information. A web application lets users do things — log in, book, pay, manage data or run a workflow — and needs a backend, a database and user accounts.'],
      ['How much does a custom web application cost?', 'It depends on the number of user roles and features, integrations and data migration. We give a written estimate with milestones after a short discovery call. Read <a href="/services/#pricing">how our pricing works</a>.'],
      ['Can you integrate with our existing systems?', 'Yes. We regularly integrate payment gateways, ERPs, CRMs, accounting software and messaging services (SMS, email, WhatsApp) through their APIs.'],
      ['Will the application be fast on mobile?', 'Yes. We set performance budgets for Core Web Vitals and test on mid-range phones and slow networks, not only on fast office connections.'],
    ],
    related: ['saas-development', 'mobile-app-development', 'headless-cms-development'],
  },
  {
    id: 'headless-cms',
    slug: 'headless-cms-development',
    buildTitle: 'Headless CMS projects we deliver',
    keyword: 'headless CMS development',
    title: 'Headless CMS Development & Migration | Thinkvistar',
    description: 'Headless CMS development and WordPress migration with Strapi, Sanity or Contentful and a fast Next.js front end — editor-friendly, multilingual and SEO-safe.',
    h1: 'Headless CMS development and migration',
    lead: 'We move marketing sites and content-heavy platforms to a headless CMS such as Strapi, Sanity or Contentful, with a fast Next.js front end and editor-friendly workflows — so your team publishes without developers and pages load quickly.',
    useCases: [
      ['Marketing websites', 'Fast company websites your marketing team can update themselves, with reusable page blocks.'],
      ['WordPress migration', 'Moving off a slow or plugin-heavy WordPress site without losing content or search rankings.'],
      ['Multilingual sites', 'Localised content, per-language URLs and translation workflows for regional teams.'],
      ['Multi-site brands', 'One content hub feeding several websites, apps or regional sites with shared components.'],
      ['Content for apps', 'A single content API that serves your website, mobile app and other channels.'],
      ['Documentation & knowledge bases', 'Structured, searchable content with versioning and review workflows.'],
    ],
    included: ['Content modelling and CMS setup', 'Next.js front end with reusable page blocks', 'Live preview and editorial workflows', 'Roles and approvals for editors', 'Multilingual content and localised URLs', 'Content migration and 301 redirect map', 'Technical SEO: sitemaps, schema, metadata', 'Editor training and documentation'],
    steps: [
      ['Content audit', 'Inventory of existing pages, content types and URLs that must keep their rankings.'],
      ['Content model', 'Structured schemas and page blocks designed around how your editors work.'],
      ['Build', 'Front-end templates, CMS configuration, previews and integrations.'],
      ['Migrate & launch', 'Scripted content migration, redirects, SEO checks and editor training.'],
    ],
    tech: ['Strapi', 'Sanity', 'Contentful', 'Next.js', 'TypeScript', 'GraphQL', 'Vercel', 'Cloudflare'],
    timeline: ['3–5 weeks', '5–8 weeks', '7–11 weeks'],
    faq: [
      ['What is a headless CMS?', 'A headless CMS stores and manages content but does not control how it is displayed. The content is delivered through an API to a separate front end — usually faster, more secure and easier to reuse across a website and apps than a traditional CMS.'],
      ['Will we lose Google rankings if we migrate from WordPress?', 'Not if the migration is planned properly. We keep URLs where possible, map every changed URL with a 301 redirect, carry over titles and meta descriptions, and check indexing after launch.'],
      ['Strapi, Sanity or Contentful — which should we choose?', 'Strapi is open source and can be self-hosted, which keeps running costs low. Sanity and Contentful are hosted services with excellent editing experiences but monthly fees that grow with usage. We recommend one after understanding your team, budget and hosting preferences.'],
      ['Can our marketing team edit pages without developers?', 'Yes. We build reusable page blocks so editors can create and rearrange pages, with live preview before publishing.'],
    ],
    related: ['web-application-development', 'saas-development', 'cloud-support-maintenance'],
  },
  {
    id: 'ai-automation',
    slug: 'ai-automation',
    buildTitle: 'AI automation we deliver',
    keyword: 'AI automation services',
    title: 'AI Automation & LLM Integration Services | Thinkvistar',
    description: 'AI automation for businesses: document extraction, AI assistants on your own data and workflow automation with OpenAI and Claude — with human review.',
    h1: 'AI automation and LLM integration',
    lead: 'We connect large language models and automation to your real workflows — document extraction, assistants grounded in your own data, and event-driven pipelines that remove repetitive manual work — with human review where accuracy matters.',
    useCases: [
      ['Document extraction', 'Pull structured data from invoices, forms, reports and emails into your systems automatically.'],
      ['Support assistants', 'Assistants that answer customer or staff questions from your own documents, with sources.'],
      ['Sales & operations copilots', 'Draft replies, summarise calls and prepare reports inside the tools your team already uses.'],
      ['Workflow automation', 'Event-driven pipelines that route, classify and process requests without manual copying.'],
      ['Search over your knowledge', 'Semantic search across policies, manuals and past tickets using vector search.'],
      ['AI features in your product', 'Add summarisation, classification or chat to your SaaS or web application.'],
    ],
    included: ['Use-case assessment and ROI estimate', 'LLM integration (OpenAI, Claude, Gemini or open models)', 'Retrieval over your data with vector search', 'Document and email processing pipelines', 'Human-in-the-loop review screens', 'Evaluation, logging and cost monitoring', 'Data privacy and access controls', 'Documentation and team handover'],
    steps: [
      ['Assess', 'Pick one workflow with clear, measurable value and check the data it needs.'],
      ['Prototype', 'A working prototype on your real documents, measured for accuracy.'],
      ['Productionise', 'Integration with your systems, review screens, monitoring and cost controls.'],
      ['Expand', 'Roll out to more workflows once the first one is proven in production.'],
    ],
    tech: ['Python', 'FastAPI', 'OpenAI API', 'Claude API', 'pgvector', 'PostgreSQL', 'Redis', 'Kafka', 'AWS'],
    timeline: ['5–7 weeks', '7–10 weeks', '9–13 weeks'],
    faq: [
      ['Is our data safe when using AI models?', 'We use enterprise API terms where providers do not train on your data, restrict what is sent to the model, and keep documents in your own infrastructure. For sensitive data we can use self-hosted open models.'],
      ['How accurate is AI document extraction?', 'It depends on document quality and variety. We measure accuracy on your real documents during the prototype, and add human review for low-confidence results so errors are caught before they reach your systems.'],
      ['Which AI models do you work with?', 'Hosted models such as OpenAI GPT, Anthropic Claude and Google Gemini through their APIs, and open models when data must stay on your servers. We choose based on accuracy, cost and privacy requirements.'],
      ['Where should a small business start with AI automation?', 'Start with one repetitive, document-heavy task where time spent is easy to measure — such as processing invoices or answering common questions — prove it works, then expand.'],
    ],
    related: ['saas-development', 'web-application-development', 'legacy-application-modernization'],
  },
  {
    id: 'legacy-modernization',
    slug: 'legacy-application-modernization',
    buildTitle: 'Systems we modernise',
    keyword: 'legacy application modernization',
    title: 'Legacy Application Modernization Services | Thinkvistar',
    description: 'Modernise legacy PHP, .NET or desktop systems in stages — stabilise, migrate data and move to a modern cloud architecture without a risky big-bang rewrite.',
    h1: 'Legacy application modernization, in safe stages',
    lead: 'We modernise ageing applications step by step: assess the current system, stabilise it, then migrate modules and data to a modern, containerised architecture — keeping your business running throughout instead of a risky big-bang rewrite.',
    useCases: [
      ['Old PHP applications', 'Upgrading outdated PHP versions and frameworks, or moving modules to a modern stack.'],
      ['.NET and desktop systems', 'Moving desktop or on-premise .NET software to secure web applications.'],
      ['Monolith to services', 'Splitting a hard-to-change monolith into well-defined services where it pays off.'],
      ['Database migration', 'Moving data to PostgreSQL or the cloud with validation and zero data loss.'],
      ['Cloud migration', 'Moving from ageing servers to containers on AWS or other cloud providers.'],
      ['Stabilisation', 'Fixing the most painful bugs, security gaps and performance issues first.'],
    ],
    included: ['Code, infrastructure and security assessment', 'Prioritised modernisation roadmap', 'Automated tests around critical behaviour', 'Incremental module migration (strangler pattern)', 'Data migration with validation', 'Containerisation and CI/CD', 'Zero-downtime cutover plan', 'Documentation for your team'],
    steps: [
      ['Assess', 'Review code, data, infrastructure and risks; document what must not break.'],
      ['Stabilise', 'Add tests and monitoring, fix critical issues and security gaps.'],
      ['Migrate', 'Replace one module at a time behind the scenes, with data migrated and verified.'],
      ['Retire', 'Switch traffic over, decommission old components and hand over runbooks.'],
    ],
    tech: ['Node.js', 'TypeScript', 'Python', 'Go', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'GitHub Actions'],
    timeline: ['6–8 weeks', '8–11 weeks', '10–14 weeks'],
    faq: [
      ['Should we rewrite our system from scratch?', 'Usually not. Full rewrites are slow and risky because the old system keeps changing and hidden business rules get lost. Replacing it module by module lets you get value early and reduce risk.'],
      ['Will our business be interrupted during modernisation?', 'We plan for zero downtime: the old and new systems run side by side, traffic moves over gradually, and every step has a rollback plan.'],
      ['Can you work with code nobody on our team understands?', 'Yes. We start by documenting how the system behaves, add tests around critical workflows and only then change it.'],
      ['How long does legacy modernisation take?', 'The first modernised module typically takes 6–8 weeks. Larger programmes run in phases, prioritised by business value and risk.'],
    ],
    related: ['cloud-support-maintenance', 'web-application-development', 'saas-development'],
  },
  {
    id: 'maintenance-support',
    slug: 'cloud-support-maintenance',
    buildTitle: 'What our support covers',
    keyword: 'software maintenance and support services',
    title: 'Software Maintenance & Cloud Support Services | Thinkvistar',
    description: 'Software maintenance and cloud support with agreed response times: monitoring, security patching, backups, DevOps and ongoing improvements.',
    h1: 'Software maintenance and cloud support',
    lead: 'After launch we keep your software healthy: uptime monitoring and alerting, security patching, backups and disaster-recovery drills, cloud cost reviews and a steady stream of improvements — under a support plan with agreed response times.',
    useCases: [
      ['Post-launch support', 'Bug fixes, small improvements and help for your team after go-live.'],
      ['Taking over an existing app', 'Support for software built by another team or freelancer, starting with a health check.'],
      ['DevOps without a DevOps team', 'CI/CD, containers, environments and deployments managed for you.'],
      ['Security & updates', 'Regular dependency updates, patching and vulnerability fixes.'],
      ['Cloud cost reviews', 'Right-sizing servers and services so you do not overpay for hosting.'],
      ['Reliability', 'Monitoring, alerting, backups and tested disaster recovery.'],
    ],
    included: ['Uptime monitoring and alerting', 'Agreed response times (SLA)', 'Security patching and dependency updates', 'Automated backups and restore tests', 'Docker and Kubernetes operations', 'Cloud cost reviews', 'Monthly report on health and changes', 'Hours for improvements and new features'],
    steps: [
      ['Onboard', 'Access, documentation and a health check of code, infrastructure and security.'],
      ['Stabilise', 'Fix urgent risks: backups, monitoring, outdated dependencies.'],
      ['Operate', 'Ongoing monitoring, patching and support within agreed response times.'],
      ['Improve', 'Planned improvements and features using your monthly hours.'],
    ],
    tech: ['AWS', 'Docker', 'Kubernetes', 'Cloudflare', 'Vercel', 'GitHub Actions', 'PostgreSQL', 'Linux'],
    timeline: ['1–2 weeks onboarding', 'Monthly plans', 'Custom SLAs'],
    timelineHeads: ['Onboarding', 'Engagement', 'Enterprise'],
    faq: [
      ['What does a software maintenance plan include?', 'Monitoring and alerting, security patching, dependency updates, backups, bug fixes within agreed response times, and a set number of hours each month for improvements.'],
      ['Can you support software built by another company?', 'Yes. We start with a health check of the code and infrastructure, document the risks we find, and fix the urgent ones before regular support begins.'],
      ['What response times do you offer?', 'Response times are agreed in your support plan based on how critical the system is — faster for production outages, slower for minor requests.'],
      ['Is support included after a new project launches?', 'Every project includes a 30-day warranty for reproducible defects. After that you can move to a monthly support plan.'],
    ],
    related: ['legacy-application-modernization', 'saas-development', 'web-application-development'],
  },
];

export const serviceUrl = (slug) => `/services/${slug}/`;
const bySlug = Object.fromEntries(SERVICE_PAGES.map((s) => [s.slug, s]));

export function serviceBody(s, data) {
  const svc = data.services.find((x) => x.id === s.id) || {};
  const heads = s.timelineHeads || ['Focused first version', 'Growth-scale platform', 'Enterprise scale'];
  const related = s.related.map((slug) => bySlug[slug]).filter(Boolean);
  const relName = (r) => (data.services.find((x) => x.id === r.id) || {}).title || r.h1;
  return `  <section class="page-hero">
    <div class="container">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <a href="/services/">Services</a>
        <span aria-hidden="true">/</span>
        <span class="current" aria-current="page">${svc.title || s.h1}</span>
      </nav>
      <div class="hero-badge">${(svc.title || '').toUpperCase()}</div>
      <h1 class="page-title">${s.h1}</h1>
      <p class="page-subtitle">${s.lead}</p>
      <div class="hero-cta-group service-hero-cta">
        <a href="/contact/" class="btn btn-primary btn-md">Book a Consultation</a>
        <a href="/estimator/" class="btn btn-secondary btn-md">Estimate your timeline</a>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">WHAT WE BUILD</div>
        <h2 class="section-title">${s.buildTitle}</h2>
        ${svc.bestFor ? `<p class="section-subtitle">Best for: ${svc.bestFor.charAt(0).toLowerCase() + svc.bestFor.slice(1)}.</p>` : ''}
      </div>
      <div class="info-grid cols-3">
        ${s.useCases.map(([t, d]) => `<div class="card"><h3>${t}</h3><p>${d}</p></div>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="service-detail-grid">
        <div>
          <div class="section-badge">WHAT'S INCLUDED</div>
          <h2 class="section-title section-title-left">Everything you need to launch</h2>
          <p class="service-detail-lead">Delivered end to end by senior engineers, with weekly demos and written updates. You own the code once the project is paid in full.</p>
        </div>
        <ul class="check-list service-included">
          ${s.included.map((i) => `<li>${CHECK}<span>${i}</span></li>`).join('\n          ')}
        </ul>
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">HOW WE DELIVER</div>
        <h2 class="section-title">From first call to launch</h2>
      </div>
      <ol class="service-steps">
        ${s.steps.map(([t, d], i) => `<li class="card"><span class="process-step-number">${String(i + 1).padStart(2, '0')}</span><h3>${t}</h3><p>${d}</p></li>`).join('\n        ')}
      </ol>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="service-detail-grid">
        <div>
          <div class="section-badge">TECHNOLOGY</div>
          <h2 class="section-title section-title-left">Tools we use</h2>
          <p class="service-detail-lead">Mature, well-supported technology your team can hire for and maintain. See our full <a href="/tech-stack/">technology stack</a>.</p>
          <ul class="service-tech">${s.tech.map((t) => `<li>${t}</li>`).join('')}</ul>
        </div>
        <div>
          <div class="section-badge">TIMELINE</div>
          <h2 class="section-title section-title-left">Typical timeline</h2>
          <div class="table-wrap">
            <table class="data-table">
              <caption class="sr-only">Typical timeline for ${svc.title || s.h1}</caption>
              <tbody>
                ${heads.map((h, i) => `<tr><th scope="row">${h}</th><td>${s.timeline[i]}</td></tr>`).join('\n                ')}
              </tbody>
            </table>
          </div>
          <p class="service-detail-lead">Starting ranges; your exact plan depends on scope and integrations. Try the <a href="/estimator/">project estimator</a> or read <a href="/services/#pricing">how pricing works</a>.</p>
        </div>
      </div>
    </div>
  </section>

  <!--FAQ-->

  <section class="section section-alt">
    <div class="container">
      <div class="section-header text-center">
        <div class="section-badge">RELATED SERVICES</div>
        <h2 class="section-title">Often combined with</h2>
      </div>
      <div class="info-grid cols-3">
        ${related.map((r) => `<a class="card related-service" href="${serviceUrl(r.slug)}"><h3>${relName(r)}</h3><p>${r.description}</p><span class="link-arrow">Learn more &rarr;</span></a>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section-cta">
    <div class="container">
      <div class="cta-card reveal">
        <div class="cta-inner">
          <div class="cta-content">
            <div class="section-badge">LET'S TALK</div>
            <h2 class="cta-headline" id="ctaHeadline">Planning a ${(svc.title || 'software').replace(/^(Custom|High-Performance) /, '').toLowerCase()} project?</h2>
            <p class="cta-subtext" id="ctaSubtext">Tell us what you're building. An engineer replies within 24 hours with questions and a time to talk.</p>
          </div>
          <div class="cta-action">
            <a href="/contact/" class="btn btn-white btn-md" id="ctaButton">Book a Consultation</a>
          </div>
        </div>
      </div>
    </div>
  </section>
`;
}
