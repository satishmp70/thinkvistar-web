// Project estimator. Each option group is a WAI-ARIA radio group (role="radiogroup"
// with role="radio" buttons, roving tabindex and arrow-key support); results change a
// visually hidden live region so assistive technology hears a concise summary.
//
// Figures are indicative planning inputs. Uptime values are design targets and the
// security options describe engineering approach only; neither is a guarantee or a
// certification, and the page says so next to the results.
import { byId } from './lib/dom.js';

const ARCHITECTURES = {
  saas: {
    title: 'Multi-Tenant SaaS Engine',
    desc: 'Engineered with isolated tenant schemas, automated subscription billing, and an API designed for low-latency responses (target: under 100 ms).',
    baseWeeks: [4, 6],
    baseTech: ['React 18', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker'],
    scaleTech: {
      mvp: ['Vercel Edge', 'Supabase / Neon'],
      scale: ['TimescaleDB', 'Stripe Billing', 'AWS ECS'],
      enterprise: ['Kafka Stream', 'Kubernetes', 'Multi-Region DB', 'Datadog'],
    },
  },
  cms: {
    title: 'Headless CMS & Global Mesh',
    desc: 'API-first content infrastructure with multilingual publishing workflows and CDN edge delivery designed for low latency.',
    baseWeeks: [3, 5],
    baseTech: ['Next.js 14', 'TypeScript', 'Strapi v5', 'GraphQL', 'AWS S3', 'Tailwind CSS'],
    scaleTech: {
      mvp: ['Cloudflare CDN', 'Next.js ISR'],
      scale: ['Multi-Region Edge', 'Automated SEO Graph'],
      enterprise: ['Enterprise Content Mesh', 'Role Rollback', 'AWS CloudFront WAF'],
    },
  },
  modernization: {
    title: 'Legacy Modernization Program',
    desc: 'Monolith-to-microservices refactoring with staged data migration, rollback planning and cloud containerization.',
    baseWeeks: [6, 8],
    baseTech: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'GitHub Actions CI/CD'],
    scaleTech: {
      mvp: ['Docker Compose', 'Blue/Green Deploys'],
      scale: ['Kubernetes', 'API Gateway', 'Read Replicas'],
      enterprise: ['Service Mesh', 'Multi-Region HA', 'Observability Stack'],
    },
  },
  ai: {
    title: 'AI & Automation Platform',
    desc: 'Custom LLM pipelines, vector search, and intelligent document automation integrated into your stack.',
    baseWeeks: [5, 7],
    baseTech: ['TypeScript', 'Python FastAPI', 'Vector DB', 'Redis', 'Docker'],
    scaleTech: {
      mvp: ['OpenAI / Claude APIs', 'pgvector'],
      scale: ['Kafka Queues', 'GPU Inference Workers'],
      enterprise: ['Private Model Hosting', 'RAG Pipeline Mesh', 'Audit Logging'],
    },
  },
};

const SECURITY = {
  standard: { label: 'OWASP Top 10 hardening + TLS 1.3 baseline', weeks: 0 },
  soc2: { label: 'SOC 2 / GDPR-aligned controls (audit trails, key rotation). Certification or assessment is separate.', weeks: 1 },
  hipaa: { label: 'HIPAA / PCI-DSS-aligned engineering (field-level encryption). Compliance assessment and BAA scope are separate.', weeks: 2 },
};

const CLOUD = {
  'vercel-aws': 'Vercel Edge Network + AWS Lambda + Supabase / RDS',
  'aws-k8s': 'AWS / EKS Kubernetes Cluster + Private VPC Mesh + RDS',
  gcp: 'Google Cloud Run + BigQuery Event Pipelines + Cloud SQL',
};

const UPTIME_TARGET = {
  mvp: '99.9% uptime target',
  scale: '99.95% uptime target (high-availability design)',
  enterprise: '99.99% uptime target (mission-critical design)',
};

/** Option groups: container id -> [data attribute, state key]. */
const GROUPS = [
  ['estTypeOptions', 'data-type', 'type'],
  ['estScaleOptions', 'data-scale', 'scale'],
  ['estSecurityOptions', 'data-security', 'security'],
  ['estCloudOptions', 'data-cloud', 'cloud'],
  ['estTimelineOptions', 'data-timeline', 'timeline'],
];

function estimate(state) {
  const architecture = ARCHITECTURES[state.type] || ARCHITECTURES.saas;
  let [minWeeks, maxWeeks] = architecture.baseWeeks;
  if (state.scale === 'scale') { minWeeks += 2; maxWeeks += 3; }
  else if (state.scale === 'enterprise') { minWeeks += 4; maxWeeks += 6; }
  const security = SECURITY[state.security] || SECURITY.standard;
  minWeeks += security.weeks;
  maxWeeks += security.weeks;
  if (state.timeline === 'fasttrack') {
    minWeeks = Math.max(2, minWeeks - 2);
    maxWeeks = Math.max(4, maxWeeks - 3);
  }
  const stack = [...new Set([...architecture.baseTech, ...(architecture.scaleTech[state.scale] || [])])];
  return { architecture, security, minWeeks, maxWeeks, stack };
}

function render(state) {
  const result = estimate(state);
  const set = (id, text) => { const el = byId(id); if (el) el.textContent = text; };
  set('estOutputTitle', result.architecture.title);
  set('estOutputDesc', result.architecture.desc);
  set('estOutputStack', result.stack.join(', '));
  set('estOutputInfra', CLOUD[state.cloud] || CLOUD['vercel-aws']);
  set('estOutputSecurity', result.security.label);
  set('estOutputDuration', `${result.minWeeks} – ${result.maxWeeks} Weeks (${state.timeline === 'fasttrack' ? 'Accelerated Sprint' : 'Staged Delivery'})`);
  set('estOutputSla', UPTIME_TARGET[state.scale] || UPTIME_TARGET.mvp);
  const consult = byId('estConsultBtn');
  if (consult) consult.href = `/contact/?scope=${encodeURIComponent(result.architecture.title)}&scale=${encodeURIComponent(state.scale)}`;
  return result;
}

function bindRadioGroup(group, onSelect) {
  const radios = [...group.querySelectorAll('[role="radio"]')];
  const select = (radio, { focus = false } = {}) => {
    radios.forEach((other) => {
      const on = other === radio;
      other.classList.toggle('active', on);
      other.setAttribute('aria-checked', String(on));
      other.tabIndex = on ? 0 : -1;
    });
    if (focus) radio.focus();
    onSelect(radio);
  };
  radios.forEach((radio, index) => {
    radio.addEventListener('click', () => select(radio));
    radio.addEventListener('keydown', (event) => {
      const moves = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      let next = null;
      if (event.key in moves) next = radios[(index + moves[event.key] + radios.length) % radios.length];
      else if (event.key === 'Home') next = radios[0];
      else if (event.key === 'End') next = radios[radios.length - 1];
      if (!next) return;
      event.preventDefault();
      select(next, { focus: true });
    });
  });
}

export function initEstimator() {
  if (!byId('estOutputTitle')) return;
  const state = { type: 'saas', scale: 'mvp', security: 'standard', cloud: 'vercel-aws', timeline: 'standard' };
  const announcer = byId('estAnnouncer');
  let announceTimer;

  const announce = (result) => {
    if (!announcer) return;
    clearTimeout(announceTimer);
    announceTimer = setTimeout(() => {
      announcer.textContent = `Estimate updated: ${result.architecture.title}, ${result.minWeeks} to ${result.maxWeeks} weeks, ${UPTIME_TARGET[state.scale] || UPTIME_TARGET.mvp}.`;
    }, 400);
  };

  GROUPS.forEach(([id, attribute, key]) => {
    const group = byId(id);
    if (!group) return;
    const initial = group.querySelector('[aria-checked="true"]');
    if (initial) state[key] = initial.getAttribute(attribute);
    bindRadioGroup(group, (radio) => {
      state[key] = radio.getAttribute(attribute);
      announce(render(state));
    });
  });

  render(state);
}
