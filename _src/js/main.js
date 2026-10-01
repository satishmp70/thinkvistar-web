import { g as te } from "./dataLoader-DErINc11.js";
import { g as u } from "./icons-B18VjFVw.js";
const ne = /[^\p{L}\p{M}\s.'\-]/gu,
  ae = /[^\p{L}\p{M}\p{N}\s.,'&()\-/]/gu,
  ie = /[^\d\s+().\-]/g,
  oe = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/,
  f = {
    name: {
      sanitize: (e) => e.replace(ne, "").replace(/\s{2,}/g, " "),
      validate: (e) =>
        e
          ? e.replace(/[^\p{L}]/gu, "").length < 2
            ? "Name must contain at least 2 letters."
            : e.length > 60
              ? "Name is too long (max 60 characters)."
              : ""
          : "Please enter your full name.",
    },
    company: {
      sanitize: (e) => e.replace(ae, "").replace(/\s{2,}/g, " "),
      validate: (e) =>
        e
          ? new RegExp("\\p{L}", "u").test(e)
            ? e.length < 2
              ? "Company name is too short."
              : e.length > 80
                ? "Company name is too long (max 80 characters)."
                : ""
            : "Company name must contain letters."
          : "Please enter your company or organization.",
    },
    email: {
      sanitize: (e) => e.replace(/\s/g, ""),
      validate: (e) =>
        e
          ? oe.test(e)
            ? e.length > 120
              ? "Email address is too long."
              : ""
            : "Please enter a valid email address (e.g. name@company.com)."
          : "Please enter your work email.",
    },
    phone: {
      sanitize: (e) => e.replace(ie, "").replace(/\s{2,}/g, " "),
      validate: (e) => {
        if (!e) return "Please enter your mobile number.";
        const t = e.replace(/\D/g, "");
        return t.length < 7 || t.length > 15
          ? "Please enter a valid phone number (7–15 digits)."
          : e.indexOf("+") > 0
            ? 'A "+" is only allowed at the start of the number.'
            : "";
      },
    },
    select: { validate: (e) => (e ? "" : "Please select an option.") },
    message: {
      validate: (e) =>
        e
          ? e.length < 20
            ? "Please add a bit more detail (at least 20 characters)."
            : e.length > 2e3
              ? "Project brief is too long (max 2000 characters)."
              : ""
          : "Please tell us a little about your project.",
    },
  };
function U(e, t) {
  if (!e) return;
  let n = document.getElementById(`${e.id}Error`);
  (!n &&
    e.parentElement &&
    ((n = document.createElement("span")),
    (n.className = "form-error"),
    (n.id = `${e.id}Error`),
    e.insertAdjacentElement("afterend", n)),
    n && (n.textContent = t || ""),
    e.classList.toggle("is-invalid", !!t),
    e.setAttribute("aria-invalid", t ? "true" : "false"));
}
function S(e, t, n) {
  e &&
    ((e.className = `form-status ${t}`),
    (e.style.display = "block"),
    (e.innerHTML = n));
}
function Q(e) {
  e &&
    ((e.className = "form-status"),
    (e.style.display = "none"),
    (e.innerHTML = ""));
}
function se(e, t) {
  if (!e || !t) return () => !0;
  const n = () => {
    const a = e.value.trim(),
      i = t.validate(a);
    return (U(e, i), !i);
  };
  return (
    t.sanitize
      ? e.addEventListener("input", () => {
          const a = e.value,
            i = t.sanitize(a);
          if (i !== a) {
            const r = Math.max(
              0,
              (e.selectionStart ?? a.length) - (a.length - i.length),
            );
            e.value = i;
            try {
              e.setSelectionRange(r, r);
            } catch {}
          }
          e.classList.contains("is-invalid") && n();
        })
      : e.addEventListener("input", () => {
          e.classList.contains("is-invalid") && n();
        }),
    e.addEventListener("blur", (a) => {
      var i, r;
      if (
        !(
          (r = (i = a.relatedTarget) == null ? void 0 : i.matches) != null &&
          r.call(i, 'button[type="submit"]')
        )
      ) {
        if (t.optional && !e.value.trim()) {
          U(e, "");
          return;
        }
        n();
      }
    }),
    e.tagName === "SELECT" && e.addEventListener("change", n),
    n
  );
}
function V(e, t) {
  const n = Object.entries(t).map(([a, i]) => se(e.querySelector(`#${a}`), i));
  return () => {
    const i = n.map((r) => r()).every(Boolean);
    if (!i) {
      const r = e.querySelector(".is-invalid");
      r && r.focus();
    }
    return i;
  };
}
const re = "/api/contact.php";
function ce(e) {
  const t = Math.max(...e.map(([i]) => i.length)),
    n = `+${"-".repeat(t + 2)}+${"-".repeat(60)}+`,
    a = e.map(([i, r]) =>
      (String(r || "—").match(/.{1,58}(\s|$)/g) || ["—"]).map(
        (c, m) =>
          `| ${(m === 0 ? i : "").padEnd(t)} | ${c.trim().padEnd(58)} |`,
      ).join(`
`),
    );
  return [
    n,
    `| ${"FIELD".padEnd(t)} | ${"DETAILS".padEnd(58)} |`,
    n,
    a.join(`
${n}
`),
    n,
  ].join(`
`);
}
function le(e, t, n, a) {
  const i = `New enquiry from the Thinkvistar website:

${ce(n)}
`,
    r = `mailto:${e}?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(i)}`;
  (S(
    a,
    "success",
    `Opening your email client… If it does not open automatically, <a href="${r}">click here to send directly</a>.`,
  ),
    setTimeout(() => {
      window.location.href = r;
    }, 500));
}
async function K({ companyData: e, rows: t, source: n, statusEl: a, form: i }) {
  var k, L;
  const r = (e == null ? void 0 : e.contact) || {},
    s = r.email || "hello@thinkvistar.com",
    c = ((k = r.form) == null ? void 0 : k.endpoint) || re,
    m =
      ((L = r.form) == null ? void 0 : L.subject) || "New Contact Form Enquiry",
    l = i == null ? void 0 : i.querySelector('button[type="submit"]'),
    v = l == null ? void 0 : l.textContent;
  (l && ((l.disabled = !0), (l.textContent = "Sending…")),
    S(a, "info", "Sending your enquiry…"));
  const E = new FormData(i);
  E.append("_source", n || document.title);
  try {
    const b = await fetch(c, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: E,
      }),
      d = await b.json().catch(() => ({}));
    if (!b.ok || d.success === !1)
      throw new Error(d.message || "Submission failed");
    (i == null || i.reset(),
      S(
        a,
        "success",
        d.message ||
          `Thank you — your enquiry has been sent to ${s}. We usually respond within one business day.`,
      ));
  } catch {
    (S(
      a,
      "error",
      "We could not send your enquiry automatically. Opening your email client instead…",
    ),
      setTimeout(() => le(s, m, t, a), 1200));
  } finally {
    l && ((l.disabled = !1), (l.textContent = v));
  }
}
const h = (e, t) => {
  var n;
  return (
    ((n = e.querySelector(`#${t}`)) == null ? void 0 : n.value.trim()) || ""
  );
};
function de(e) {
  const t = document.getElementById("projectInquiryForm"),
    n = document.getElementById("formStatusMessage");
  if (!t) return;
  const a = V(t, {
    clientName: f.name,
    clientCompany: f.company,
    clientEmail: f.email,
    clientPhone: f.phone,
    projectType: f.select,
    projectDetails: f.message,
  });
  t.addEventListener("submit", (i) => {
    if ((i.preventDefault(), !a())) {
      S(n, "error", "Please correct the highlighted fields and try again.");
      return;
    }
    Q(n);
    const r = h(t, "clientName"),
      s = h(t, "clientCompany"),
      c = h(t, "clientEmail"),
      m = h(t, "projectType"),
      l = [
        ["Name", r],
        ["Company", s],
        ["Work Email", c],
        ["Mobile", h(t, "clientPhone")],
        ["Project Scope", m || "Not specified"],
        ["Target Timeline", h(t, "projectBudget") || "Flexible"],
        ["Project Brief", h(t, "projectDetails")],
        ["Submitted From", "Homepage enquiry widget"],
        ["Submitted On", new Date().toLocaleString("en-IN")],
      ];
    K({
      companyData: e,
      rows: l,
      source: "Homepage enquiry widget",
      statusEl: n,
      form: t,
    });
  });
}
function ue(e) {
  const t = document.getElementById("contactForm"),
    n = document.getElementById("formStatus");
  if (!t) return;
  const i = new URLSearchParams(window.location.search).get("scope");
  if (i) {
    const s = t.querySelector("#projectScope");
    if (s) {
      const c = i.toLowerCase(),
        l = [
          ["saas", "Custom SaaS Platform Development"],
          ["cms", "Headless CMS Architecture & Migration"],
          ["healthcare", "Healthcare / FinTech Regulated System"],
          ["fintech", "Healthcare / FinTech Regulated System"],
          ["ledger", "High-Throughput Web Application"],
          ["api", "High-Throughput Web Application"],
          ["modernization", "Legacy Enterprise Modernization"],
          ["ai", "Dedicated Senior Engineering Squad"],
        ].find(([v]) => c.includes(v));
      l && (s.value = l[1]);
    }
  }
  const r = V(t, {
    clientName: f.name,
    clientCompany: f.company,
    clientEmail: f.email,
    clientPhone: f.phone,
    projectScope: f.select,
    projectOverview: f.message,
  });
  t.addEventListener("submit", (s) => {
    if ((s.preventDefault(), !r())) {
      S(n, "error", "Please correct the highlighted fields and resubmit.");
      return;
    }
    Q(n);
    const c = h(t, "clientName"),
      m = h(t, "clientCompany"),
      l = h(t, "clientEmail"),
      v = [
        ["Name", c],
        ["Company", m],
        ["Work Email", l],
        ["Mobile", h(t, "clientPhone")],
        ["Engagement Scope", h(t, "projectScope") || "Not specified"],
        ["Target Timeline", h(t, "projectTimeline") || "Flexible"],
        ["Project Overview", h(t, "projectOverview")],
        ["Submitted From", "Contact page form"],
        ["Submitted On", new Date().toLocaleString("en-IN")],
      ];
    K({
      companyData: e,
      rows: v,
      source: "Contact page form",
      statusEl: n,
      form: t,
    });
  });
}
function me(e) {
  (de(e), ue(e));
}
function pe() {
  const e = document.querySelectorAll("#estTypeOptions .est-option-btn");
  document.querySelectorAll("#estScaleOptions .est-option-btn");
  const t = document.querySelectorAll(
      '#estFeatureChecks input[type="checkbox"]',
    ),
    n = document.getElementById("estSummaryTitle"),
    a = document.getElementById("estDeliveryTime"),
    i = document.getElementById("estSlaTier"),
    r = document.getElementById("estTechStack"),
    s = document.getElementById("estPrefillBtn"),
    c = document.getElementById("estOutputTitle"),
    m = document.getElementById("estOutputDesc"),
    l = document.getElementById("estOutputStack"),
    v = document.getElementById("estOutputInfra"),
    E = document.getElementById("estOutputSecurity"),
    k = document.getElementById("estOutputDuration"),
    L = document.getElementById("estOutputSla");
  if (!e.length || (!n && !c)) return;
  const b = !!c;
  let d = {
    type: "saas",
    scale: "mvp",
    security: "standard",
    cloud: "vercel-aws",
    timeline: "standard",
    features: ["auth", "billing", "realtime"],
  };
  const H = {
      saas: {
        title: "Multi-Tenant SaaS Engine",
        desc: "Engineered with isolated tenant schemas, automated subscription billing, and sub-100ms API response times.",
        baseWeeks: [4, 6],
        baseTech: [
          "React 18",
          "TypeScript",
          "Node.js",
          "PostgreSQL",
          "Redis",
          "Docker",
        ],
        scaleTech: {
          mvp: ["Vercel Edge", "Supabase / Neon"],
          scale: ["TimescaleDB", "Stripe Billing", "AWS ECS"],
          enterprise: [
            "Kafka Stream",
            "Kubernetes",
            "Multi-Region DB",
            "Datadog",
          ],
        },
      },
      cms: {
        title: "Headless CMS & Global Mesh",
        desc: "API-first content infrastructure with multilingual publishing workflows and sub-40ms global edge delivery.",
        baseWeeks: [3, 5],
        baseTech: [
          "Next.js 14",
          "TypeScript",
          "Strapi v5",
          "GraphQL",
          "AWS S3",
          "Tailwind CSS",
        ],
        scaleTech: {
          mvp: ["Cloudflare CDN", "Next.js ISR"],
          scale: ["Multi-Region Edge", "Automated SEO Graph"],
          enterprise: [
            "Enterprise Content Mesh",
            "Role Rollback",
            "AWS CloudFront WAF",
          ],
        },
      },
      custom: {
        title: "Custom Operational System",
        desc: "Purpose-built business software with workflow automation, dispatch logic, and operational dashboards.",
        baseWeeks: [5, 7],
        baseTech: [
          "Vue 3 / React",
          "Python FastAPI",
          "PostgreSQL",
          "Redis",
          "Docker",
        ],
        scaleTech: {
          mvp: ["Docker Compose", "Leaflet GIS"],
          scale: ["Celery Workers", "WebSocket Fleet Live", "PostGIS"],
          enterprise: [
            "Microservice Cluster",
            "Zero-Downtime HA",
            "Air-Gapped Option",
          ],
        },
      },
      modernization: {
        title: "Legacy Modernization Program",
        desc: "Monolith-to-microservices refactoring with zero-downtime data migration and cloud containerization.",
        baseWeeks: [6, 8],
        baseTech: [
          "TypeScript",
          "Node.js",
          "PostgreSQL",
          "Docker",
          "GitHub Actions CI/CD",
        ],
        scaleTech: {
          mvp: ["Docker Compose", "Blue/Green Deploys"],
          scale: ["Kubernetes", "API Gateway", "Read Replicas"],
          enterprise: [
            "Service Mesh",
            "Multi-Region HA",
            "Observability Stack",
          ],
        },
      },
      ai: {
        title: "AI & Automation Platform",
        desc: "Custom LLM pipelines, vector search, and intelligent document automation integrated into your stack.",
        baseWeeks: [5, 7],
        baseTech: [
          "TypeScript",
          "Python FastAPI",
          "Vector DB",
          "Redis",
          "Docker",
        ],
        scaleTech: {
          mvp: ["OpenAI / Claude APIs", "pgvector"],
          scale: ["Kafka Queues", "GPU Inference Workers"],
          enterprise: [
            "Private Model Hosting",
            "RAG Pipeline Mesh",
            "Audit Logging",
          ],
        },
      },
      api: {
        title: "High-Throughput Ledger API",
        desc: "Event-driven microservices engineered for high-concurrency transactions and immutable audit trails.",
        baseWeeks: [4, 6],
        baseTech: [
          "Go (Golang)",
          "TypeScript",
          "PostgreSQL",
          "Apache Kafka",
          "Redis",
        ],
        scaleTech: {
          mvp: ["Docker", "REST + WebSockets"],
          scale: ["gRPC Microservices", "Read Replicas", "TimescaleDB"],
          enterprise: [
            "Kubernetes Cluster",
            "Double-Entry Cryptographic Proof",
            "Multi-AZ HA",
          ],
        },
      },
    },
    I = {
      standard: { label: "Standard OWASP Top 10 Hardened + TLS 1.3", weeks: 0 },
      soc2: {
        label: "SOC 2 & GDPR Ready (Audit Trails, Key Rotation)",
        weeks: 1,
      },
      hipaa: {
        label: "HIPAA / PCI-DSS Level 1 (E2E Encryption & BAA)",
        weeks: 2,
      },
    },
    D = {
      "vercel-aws": "Vercel Edge Network + AWS Lambda + Supabase / RDS",
      "aws-k8s": "AWS / EKS Kubernetes Cluster + Private VPC Mesh + RDS",
      gcp: "Google Cloud Run + BigQuery Event Pipelines + Cloud SQL",
    },
    R = {
      mvp: "99.9% Uptime",
      scale: "99.95% High-Availability SLA",
      enterprise: "99.99% Mission-Critical SLA",
    },
    O = {
      mvp: "99.9% Production Uptime",
      scale: "99.95% Production Uptime",
      enterprise: "99.99% Mission-Critical Uptime",
    },
    J = {
      mvp: "Early Growth",
      scale: "Scaling Enterprise",
      enterprise: "High Concurrency",
    };
  function j() {
    var q, W, N;
    const g = H[d.type] || H.saas;
    let [p, y] = g.baseWeeks;
    (d.scale === "scale"
      ? ((p += 2), (y += 3))
      : d.scale === "enterprise" && ((p += 4), (y += 6)),
      d.features.length > 3 && ((p += 1), (y += 2)),
      b &&
        ((p += ((q = I[d.security]) == null ? void 0 : q.weeks) || 0),
        (y += ((W = I[d.security]) == null ? void 0 : W.weeks) || 0),
        d.timeline === "fasttrack" &&
          ((p = Math.max(2, p - 2)), (y = Math.max(4, y - 3)))));
    const P = g.scaleTech[d.scale] || [],
      $ = Array.from(new Set([...g.baseTech, ...P]));
    if (b)
      ((c.textContent = g.title),
        m && (m.textContent = g.desc),
        l && (l.textContent = $.join(", ")),
        v && (v.textContent = D[d.cloud] || D["vercel-aws"]),
        E &&
          (E.textContent =
            ((N = I[d.security]) == null ? void 0 : N.label) ||
            I.standard.label),
        k &&
          (k.textContent = `${p} – ${y} Weeks (${d.timeline === "fasttrack" ? "Accelerated Sprint" : "Staged Delivery"})`),
        L && (L.textContent = O[d.scale] || O.mvp));
    else {
      const x = R[d.scale] || R.mvp;
      ((n.textContent = `${g.title} (${J[d.scale] || d.scale.toUpperCase()})`),
        a && (a.textContent = `${p} - ${y} Weeks (Staged)`),
        i && (i.textContent = x),
        r &&
          (r.innerHTML = $.map(
            (w) => `<span class="tech-tag">${w}</span>`,
          ).join("")));
    }
    s &&
      (s.onclick = (x) => {
        x.preventDefault();
        const w = document.getElementById("contact");
        w && w.scrollIntoView({ behavior: "smooth" });
        const F = document.getElementById("projectType"),
          z = document.getElementById("projectDetails");
        if (F) {
          const ee = {
            saas: "Custom SaaS Development",
            cms: "Headless CMS Architecture",
            custom: "Legacy System Modernization",
            modernization: "Legacy System Modernization",
            ai: "AI & Automation Integration",
            api: "High-Performance Web App",
          };
          F.value = ee[d.type] || "Custom SaaS Development";
        }
        z &&
          (z.value = `Hello Thinkvistar Team,

We would like to book a technical consultation for building a ${g.title} with the following target specifications:
- Concurrency / Scale: ${d.scale.toUpperCase()}
- Selected Capabilities: ${d.features.join(", ")}
- Recommended Stack: ${$.join(", ")}
- Estimated Timeline: ${p}-${y} Weeks

Please let us know your availability for an initial architecture discussion.`);
      });
    const T = document.getElementById("estConsultBtn");
    T &&
      (T.href = `/contact/?scope=${encodeURIComponent(g.title)}&scale=${encodeURIComponent(d.scale)}`);
  }
  function C(g, p, y) {
    const M = document.querySelectorAll(`${g} .est-option-btn`);
    M.forEach((P) => {
      P.addEventListener("click", ($) => {
        (M.forEach((T) => T.classList.remove("active")),
          $.currentTarget.classList.add("active"),
          (d[y] = $.currentTarget.getAttribute(p)),
          j());
      });
    });
  }
  (C("#estTypeOptions", "data-type", "type"),
    C("#estScaleOptions", "data-scale", "scale"),
    C("#estSecurityOptions", "data-security", "security"),
    C("#estCloudOptions", "data-cloud", "cloud"),
    C("#estTimelineOptions", "data-timeline", "timeline"),
    t.forEach((g) => {
      g.addEventListener("change", () => {
        ((d.features = Array.from(t)
          .filter((p) => p.checked)
          .map((p) => p.getAttribute("data-feature"))),
          j());
      });
    }),
    j());
}
let o = null,
  B = null;
function he(e = document) {
  B && e.querySelectorAll(".reveal:not(.active)").forEach((t) => B.observe(t));
}
function A(e, t) {
  const n = parseInt(e.dataset.limit, 10);
  return Number.isFinite(n) && n > 0 ? t.slice(0, n) : t;
}
function ge(e) {
  return e.dataset.variant === "detailed";
}
async function _() {
  if (((o = await te()), !o)) {
    console.error("Failed to load site data.");
    return;
  }
  (fe(),
    Z(),
    be(),
    $e(),
    Se(),
    ye(),
    ve(),
    Ee(),
    Y("All"),
    ke(),
    Le(),
    Ce(),
    Ie(),
    Te(),
    we(),
    Be(),
    Ae(),
    je(),
    Me(),
    pe(),
    me(o.company),
    Pe(),
    xe());
}
function G(e) {
  const t = window.location.pathname.replace(/\/index\.html$/, "/"),
    n = t.endsWith("/") ? t : t + "/",
    a = window.location.hash;
  if (e.includes("#")) {
    const r = e.split("#"),
      s = r[0] ? (r[0].endsWith("/") ? r[0] : r[0] + "/") : "/",
      c = "#" + r[1];
    return n === s && a === c;
  }
  const i = e.endsWith("/") ? e : e + "/";
  return i === "/"
    ? (n === "/" || n === "") && (!a || a === "#home")
    : n === i || n.startsWith(i);
}
function fe() {
  const e = o.company || {},
    t = e.contact || {},
    n = document.getElementById("topBarEmail"),
    a = document.getElementById("topBarPhone"),
    i = document.getElementById("topBarLocation"),
    r = document.getElementById("topBarSocials");
  if (
    (n &&
      t.email &&
      ((n.href = `mailto:${t.email}`),
      (n.querySelector("span").textContent = t.email)),
    a &&
      t.phone &&
      ((a.href = `tel:${(t.whatsapp || t.phone).replace(/[^0-9+]/g, "")}`),
      (a.querySelector("span").textContent = t.phone)),
    i &&
      t.location &&
      (i.querySelector("span").textContent = t.location.split("(")[0].trim()),
    r && e.socialLinks)
  ) {
    const s = e.socialLinks;
    r.innerHTML = [
      s.linkedin
        ? `<a href="${s.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${u("linkedin")}</a>`
        : "",
      s.x
        ? `<a href="${s.x}" target="_blank" rel="noopener noreferrer" aria-label="X">${u("x")}</a>`
        : "",
      s.facebook
        ? `<a href="${s.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">${u("facebook")}</a>`
        : "",
      s.instagram
        ? `<a href="${s.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram">${u("instagram")}</a>`
        : "",
    ].join("");
  }
}
function Z() {
  const e = document.getElementById("navbarBrand"),
    t = document.getElementById("navbarLinks"),
    n = document.getElementById("mobileNavLinks"),
    a = document.getElementById("navbarCta");
  if (e) {
    const i = o.navigation.brand.logo || "/images/logo/thinkvistar-logo.png";
    ((e.innerHTML = `<img src="${i}" alt="${o.company.name}" class="brand-logo-img" width="480" height="126" />`),
      e.setAttribute("href", "/"),
      e.setAttribute("aria-label", `${o.company.name} Home`));
  }
  (t &&
    o.navigation.links &&
    (t.innerHTML = o.navigation.links
      .map((i) => {
        const r = G(i.href);
        return `<li><a href="${i.href}" class="nav-link ${r ? "active" : ""}">${i.label}</a></li>`;
      })
      .join("")),
    n &&
      o.navigation.links &&
      (n.innerHTML = o.navigation.links
        .map((i) => {
          const r = G(i.href);
          return `<li><a href="${i.href}" class="mobile-nav-link ${r ? "active" : ""}">${i.label}</a></li>`;
        })
        .join("")),
    a &&
      o.navigation.ctaButton &&
      ((a.textContent = o.navigation.ctaButton.label),
      a.setAttribute("href", o.navigation.ctaButton.href)));
}
function ye() {
  const e = document.getElementById("industriesContainer"),
    t = o.industries;
  if (!e || !t) return;
  const n = A(e, t.list || []);
  e.innerHTML = `
    <ul class="industry-chips">
      ${n.map((a) => `<li class="industry-chip">${a}</li>`).join("")}
      <li class="industry-chip">…and any other industry</li>
    </ul>
    ${t.note ? `<p class="industry-note">${t.note}</p>` : ""}
  `;
}
function ve() {
  var r;
  const e = document.getElementById("clientsContainer"),
    t = o.clients;
  if (!e || !((r = t == null ? void 0 : t.items) != null && r.length)) return;
  const n = (s) => {
    const c = `
      <img src="${s.logo}" alt="${s.name} logo" class="client-logo" loading="lazy" width="48" height="48" decoding="async" />
      <span class="client-text">
        <span class="client-name">${s.name}</span>
        ${s.industry ? `<span class="client-industry">${s.industry}</span>` : ""}
      </span>`;
    return s.url
      ? `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="client-card">${c}</a>`
      : `<div class="client-card">${c}</div>`;
  };
  if (e.dataset.marquee !== "true") {
    e.innerHTML = t.items.map(n).join("");
    return;
  }
  const a = Math.max(1, Math.ceil(8 / t.items.length)),
    i = Array.from({ length: a }, () => t.items)
      .flat()
      .map(n)
      .join("");
  e.innerHTML = `<div class="clients-track">${i}${i}</div>`;
}
function be() {
  const e = document.getElementById("heroBadge"),
    t = document.getElementById("heroHeadline"),
    n = document.getElementById("heroSubtext"),
    a = document.getElementById("heroCtaPrimary"),
    i = document.getElementById("heroCtaSecondary"),
    r = document.getElementById("heroPills");
  if ((e && (e.textContent = o.hero.badge), t)) {
    const s = o.hero.headline || "",
      c = s.lastIndexOf(".");
    if (c > 0 && c < s.length - 1)
      t.innerHTML = `${s.slice(0, c + 1)} <span class="hero-gradient-text">${s.slice(c + 1).trim()}</span>`;
    else {
      const m = s.trim().split(/\s+/),
        l = m.splice(-2).join(" ");
      t.innerHTML = m.length
        ? `${m.join(" ")} <span class="hero-gradient-text">${l}</span>`
        : `<span class="hero-gradient-text">${l}</span>`;
    }
  }
  (n && (n.textContent = o.hero.subtext),
    a &&
      ((a.innerHTML = `${o.hero.ctaPrimary.label} ${u("arrowRight")}`),
      a.setAttribute("href", o.hero.ctaPrimary.href)),
    i &&
      ((i.textContent = o.hero.ctaSecondary.label),
      i.setAttribute("href", o.hero.ctaSecondary.href)),
    r &&
      o.hero.trustPills &&
      (r.innerHTML = o.hero.trustPills
        .map(
          (s) => `
      <span class="hero-pill">${s}</span>
    `,
        )
        .join("")));
}
function $e() {
  const e = document.getElementById("capabilitiesContainer");
  if (!e || !o.company.capabilities) return;
  const t = [...o.company.capabilities, ...o.company.capabilities];
  e.innerHTML = t
    .map(
      (n) => `
    <div class="capability-item">
      <div class="capability-bullet"></div>
      <span>${n}</span>
    </div>
  `,
    )
    .join("");
}
function Se() {
  const e = document.getElementById("servicesContainer");
  if (!e || !o.services) return;
  const t = ge(e),
    n = A(e, o.services);
  if (!t) {
    // Compact grid (home): each card is one link to its service page, plus a
    // closing "not sure" card so the grid always fills complete rows.
    e.innerHTML =
      n
        .map(
          (a, i) => `
    <a href="${a.url || `/services/#${a.id}`}" class="card service-card service-card-link reveal delay-${(i % 4) + 1}">
      <div class="icon-tile">${u(a.icon)}</div>
      <h3 class="service-title">${a.title}</h3>
      <p class="service-description">${a.description}</p>
      <span class="link-arrow">Learn more ${u("arrowRight")}</span>
    </a>
  `,
        )
        .join("") +
      (n.length % 4
        ? `
    <a href="/contact/" class="card service-card service-card-cta reveal">
      <h3 class="service-title">Not sure which fits?</h3>
      <p class="service-description">Tell us what you want to build. We'll recommend the right approach and a realistic timeline.</p>
      <span class="link-arrow">Book a consultation ${u("arrowRight")}</span>
    </a>`
        : "");
    return;
  }
  e.innerHTML = n
    .map((a, i) => {
      var r;
      return `
    <div class="card service-card reveal delay-${(i % 3) + 1}" id="${a.id}">
      <div class="icon-tile">${u(a.icon)}</div>
      <h3 class="service-title">${a.title}</h3>
      <p class="service-description">${a.description}</p>
      ${
        a.bestFor || a.timeline
          ? `<div class="service-meta">${a.bestFor ? `<div><strong>Best for:</strong> ${a.bestFor}</div>` : ""}${a.timeline ? `<div><strong>Typical timeline:</strong> ${a.timeline}</div>` : ""}</div>`
          : ""
      }
      ${
        (r = a.deliverables) != null && r.length
          ? `
        <div class="service-includes-label">What's included</div>
        <ul class="check-list">
          ${a.deliverables.map((s) => `<li>${u("check")}<span>${s}</span></li>`).join("")}
        </ul>`
          : ""
      }
      ${a.url ? `<a href="${a.url}" class="link-arrow service-page-link">${a.title} in detail ${u("arrowRight")}</a>` : ""}
    </div>
  `;
    })
    .join("");
}
function Ee() {
  const e = document.getElementById("projectFilterContainer");
  if (!e) return;
  const t = o.projectCategories || [
    "All",
    "SaaS",
    "CMS",
    "Web App",
    "Custom Software",
  ];
  ((e.innerHTML = t
    .map(
      (n) => `
    <button class="filter-btn ${n === "All" ? "active" : ""}" data-category="${n}">${n}</button>
  `,
    )
    .join("")),
    e.querySelectorAll(".filter-btn").forEach((n) => {
      n.addEventListener("click", (a) => {
        const i = a.currentTarget.getAttribute("data-category");
        (e
          .querySelectorAll(".filter-btn")
          .forEach((r) => r.classList.remove("active")),
          a.currentTarget.classList.add("active"),
          Y(i));
      });
    }));
}
function Y(e = "All") {
  const t = document.getElementById("projectsContainer");
  if (!t) return;
  let n =
    t.dataset.featured === "true"
      ? o.projects.filter((a) => a.featured)
      : o.projects;
  (e !== "All" &&
    (n = n.filter((a) => a.category.toLowerCase() === e.toLowerCase())),
    (n = A(t, n)),
    (t.innerHTML = n
      .map(
        (a, i) => `
    <a href="${a.caseStudyUrl || "#"}" class="card project-card reveal delay-${(i % 3) + 1}">
      <div class="project-image-wrapper">
        <img src="${a.image}" alt="${a.title} — ${a.badge || a.category} solution architecture illustration" class="project-image" loading="lazy" width="640" height="400" />
        <span class="project-badge">${a.category}</span>
        ${a.isPlaceholder ? '<span class="sample-tag">Sample blueprint</span>' : ""}
      </div>

      <div class="project-body">
        <div class="project-client-type">${a.clientType || ""}</div>
        <h3 class="project-title">${a.title}</h3>
        <p class="project-description">${a.description}</p>
        <span class="link-arrow">${a.isPlaceholder ? "View blueprint" : "View case study"} ${u("arrowRight")}</span>
      </div>
    </a>
  `,
      )
      .join("")),
    he(t));
}
function ke() {
  const e =
    document.getElementById("whyUsContainer") ||
    document.getElementById("whyChooseUsContainer");
  !e ||
    !o.whyChooseUs ||
    (e.innerHTML = A(e, o.whyChooseUs)
      .map(
        (t, n) => `
    <div class="card why-card reveal delay-${(n % 3) + 1}">
      <div class="icon-tile">${u(t.icon)}</div>
      <div class="why-content">
        <h3>${t.title}</h3>
        <p>${t.description}</p>
      </div>
    </div>
  `,
      )
      .join(""));
}
function Le() {
  const e = document.getElementById("processContainer");
  !e ||
    !o.process ||
    (e.innerHTML = o.process
      .map(
        (t, n) => `
    <div class="card process-card reveal delay-${(n % 3) + 1}">
      <div class="process-step-number">${t.step}</div>
      <div class="process-phase">${t.phase}</div>
      <h3 class="process-title">${t.title}</h3>
      <p class="process-summary">${t.summary}</p>

      <div class="process-deliverables-label">Deliverables</div>
      <ul class="process-deliverables">
        ${(t.deliverables || [])
          .map(
            (a) => `
          <li class="process-deliverable-item">${a}</li>
        `,
          )
          .join("")}
      </ul>
    </div>
  `,
      )
      .join(""));
}
function X(e) {
  return e.logo
    ? `<img src="/images/tech/${e.logo}.svg" alt="" loading="lazy" width="20" height="20" />`
    : e.icon
      ? u(e.icon)
      : '<span class="tech-level-dot"></span>';
}
function Ce() {
  const e = document.getElementById("techMarqueeTrack");
  if (!e || !o.marqueeTechnologies) return;
  const t = o.marqueeTechnologies,
    n = [...t, ...t];
  e.innerHTML = n
    .map(
      (a) => `
    <div class="tech-marquee-item">
      <span class="tech-marquee-icon">${X(a)}</span>
      <span class="tech-marquee-name">${a.name}</span>
      <span class="tech-marquee-cat">${a.category}</span>
    </div>
  `,
    )
    .join("");
}
function Ie() {
  const e = document.getElementById("technologiesContainer");
  !e ||
    !o.technologies ||
    (e.innerHTML = o.technologies
      .map(
        (t, n) => `
    <div class="card tech-category-card reveal delay-${(n % 2) + 1}">
      <h3 class="tech-cat-title">${t.category}</h3>
      <p class="tech-cat-desc">${t.description}</p>
      <div class="tech-pill-list">
        ${(t.skills || [])
          .map(
            (a) => `
          <div class="tech-skill-pill">
            <span class="tech-skill-logo">${X(a)}</span>
            <span>${a.name}</span>
          </div>
        `,
          )
          .join("")}
      </div>
    </div>
  `,
      )
      .join(""));
}
function Te() {
  const e = document.getElementById("aboutHeadline"),
    t = document.getElementById("aboutLead"),
    n = document.getElementById("aboutParagraphs"),
    a = document.getElementById("aboutHighlights");
  o.about &&
    (e && (e.textContent = o.about.headline),
    t && (t.textContent = o.about.lead),
    n &&
      (n.innerHTML = (o.about.paragraphs || [])
        .map((i) => `<p>${i}</p>`)
        .join("")),
    a &&
      (a.innerHTML = (o.about.highlights || [])
        .map(
          (i) => `
      <div class="about-highlight-card">
        <h3>${i.title}</h3>
        <p>${i.description}</p>
      </div>
    `,
        )
        .join("")));
}
function we() {
  const e = document.getElementById("statsContainer");
  !e ||
    !o.company.stats ||
    (e.innerHTML = o.company.stats
      .map(
        (t, n) => `
    <div class="stat-card reveal delay-${(n % 4) + 1}">
      <div class="stat-value">${t.value}</div>
      <div class="stat-label">${t.label}</div>
    </div>
  `,
      )
      .join(""));
}
function Be() {
  const e = document.getElementById("testimonialsSection"),
    t = document.getElementById("testimonialsContainer");
  if (!(!e || !t || !o.testimonials)) {
    if (!o.testimonials.showSection) {
      e.style.display = "none";
      return;
    }
    ((e.style.display = "block"),
      (t.innerHTML = (o.testimonials.items || [])
        .map((n, a) => {
          const i = n.authorName
            .split(" ")
            .map((r) => r[0])
            .filter(Boolean)
            .slice(0, 2)
            .join("");
          return `
      <div class="card testimonial-card reveal delay-${(a % 3) + 1}">
        <div class="star-rating">
          ${Array(n.rating || 5)
            .fill(u("star"))
            .join("")}
        </div>
        <div class="testimonial-quote">“${n.quote}”</div>
        <div class="testimonial-author">
          <div class="author-avatar">${i}</div>
          <div>
            <div class="author-name">${n.authorName}</div>
            <div class="author-role">${n.authorRole} • ${n.company}</div>
          </div>
        </div>
      </div>
    `;
        })
        .join("")));
  }
}
function Ae() {
  if (!document.getElementById("ctaBannerSection")) return;
  const e = document.getElementById("ctaHeadline"),
    t = document.getElementById("ctaSubtext"),
    n = document.getElementById("ctaButton");
  o.cta &&
    (e && (e.textContent = o.cta.headline),
    t && (t.textContent = o.cta.subtext),
    n &&
      ((n.innerHTML = `${o.cta.buttonText} ${u("arrowRight")}`),
      n.setAttribute("href", o.cta.buttonHref)));
}
function je() {
  var a, i, r, s, c, m, l;
  const e = document.getElementById("contactChannelsContainer");
  if (!e || !o.contact) return;
  const t = o.contact.channels || {},
    n = o.company.contact || {};
  e.innerHTML = `
    <!-- Email Channel -->
    <div class="contact-card">
      <div class="contact-icon-wrap">${u("email")}</div>
      <div class="contact-details">
        <h3>${((a = t.email) == null ? void 0 : a.label) || "Email Us"}</h3>
        <a href="mailto:${n.email}" class="contact-link">${n.email}</a>
        ${n.supportEmail ? `<a href="mailto:${n.supportEmail}" class="contact-link">${n.supportEmail}</a>` : ""}
        <div class="contact-hint">${((i = t.email) == null ? void 0 : i.hint) || "Direct consultation and RFP submissions"}</div>
      </div>
    </div>

    <!-- WhatsApp Channel -->
    <div class="contact-card">
      <div class="contact-icon-wrap">${u("whatsapp")}</div>
      <div class="contact-details">
        <h3>${((r = t.whatsapp) == null ? void 0 : r.label) || "WhatsApp"}</h3>
        <a href="https://wa.me/${(n.whatsapp || "").replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(((s = o.company) == null ? void 0 : s.shortName) || "Thinkvistar")},%20I'd%20like%20to%20discuss%20a%20project%20inquiry." target="_blank" rel="noopener noreferrer" class="contact-link">
          ${n.phone || n.whatsapp}
        </a>
        <div class="contact-hint">${((c = t.whatsapp) == null ? void 0 : c.hint) || "Instant chat & project scoping"}</div>
      </div>
    </div>

    <!-- Location Channel -->
    <div class="contact-card">
      <div class="contact-icon-wrap">${u("mapPin")}</div>
      <div class="contact-details">
        <h3>${((m = t.location) == null ? void 0 : m.label) || "Location"}</h3>
        <div class="contact-link" style="cursor: default;">${((t.location && t.location.value) || n.address || n.location)}</div>
        <div class="contact-hint">${((l = t.location) == null ? void 0 : l.hint) || "Available for global timezones"}</div>
      </div>
    </div>
  `;
}
function Me() {
  const e = document.getElementById("footerBrandName"),
    t = document.getElementById("footerBio"),
    n = document.getElementById("footerQuickLinks"),
    a = document.getElementById("footerServicesLinks"),
    i = document.getElementById("footerLegalLinks"),
    r =
      document.getElementById("footerSocialLinks") ||
      document.getElementById("footerSocials"),
    s = document.getElementById("footerCopyright");
  if (
    (e && (e.textContent = o.company.name),
    t && (t.textContent = o.footer.about),
    n &&
      o.footer.quickLinks &&
      (n.innerHTML = o.footer.quickLinks
        .map(
          (c) => `
      <li><a href="${c.href}" class="footer-link">${c.label}</a></li>
    `,
        )
        .join("")),
    a &&
      o.services &&
      (a.innerHTML = o.services
        .map(
          (c) => `
      <li><a href="${c.url || `/services/#${c.id}`}" class="footer-link">${c.title}</a></li>
    `,
        )
        .join("")),
    i &&
      o.footer.legalLinks &&
      (i.innerHTML = o.footer.legalLinks
        .map(
          (c) => `
      <li><a href="${c.href}" class="footer-link">${c.label}</a></li>
    `,
        )
        .join("")),
    r && o.company.socialLinks)
  ) {
    const c = o.company.socialLinks;
    r.innerHTML = `
      ${c.linkedin ? `<a href="${c.linkedin}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="LinkedIn">${u("linkedin")}</a>` : ""}
      ${c.x ? `<a href="${c.x}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="X">${u("x")}</a>` : ""}
      ${c.facebook ? `<a href="${c.facebook}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Facebook">${u("facebook")}</a>` : ""}
      ${c.instagram ? `<a href="${c.instagram}" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Instagram">${u("instagram")}</a>` : ""}
    `;
  }
  if (s) {
    const c = new Date().getFullYear();
    s.textContent = `© ${c} ${o.company.legalName || o.company.name}. All rights reserved.`;
  }
}
function Pe() {
  const e = document.querySelector(".site-header"),
    t = document.getElementById("hamburgerBtn"),
    n = document.getElementById("mobileNavDrawer"),
    a = () =>
      e == null ? void 0 : e.classList.toggle("scrolled", window.scrollY > 10);
  if ((window.addEventListener("scroll", a, { passive: !0 }), a(), t && n)) {
    const i = (s) => {
      (n.classList.toggle("open", s),
        n.setAttribute("aria-hidden", s ? "false" : "true"),
        t.setAttribute("aria-expanded", s ? "true" : "false"),
        t.setAttribute(
          "aria-label",
          s ? "Close navigation menu" : "Open navigation menu",
        ),
        (t.innerHTML = u(s ? "close" : "hamburger")),
        document.body.classList.toggle("no-scroll", s));
    };
    (i(!1),
      t.addEventListener("click", () => {
        i(!n.classList.contains("open"));
      }),
      n.addEventListener("click", (s) => {
        s.target.closest("a") && i(!1);
      }),
      document.addEventListener("keydown", (s) => {
        s.key === "Escape" && n.classList.contains("open") && i(!1);
      }),
      window
        .matchMedia("(min-width: 1024px)")
        .addEventListener("change", (s) => {
          s.matches && i(!1);
        }));
  }
  window.addEventListener("hashchange", Z);
}
function xe() {
  const e = document.querySelectorAll(".reveal");
  e.length &&
    ((B = new IntersectionObserver(
      (t, n) => {
        t.forEach((a) => {
          a.isIntersecting &&
            (a.target.classList.add("active"), n.unobserve(a.target));
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    )),
    e.forEach((t) => B.observe(t)));
}
document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", _)
  : _();
// ---------------------------------------------------------------- motion
// Runtime-only polish. Skipped while the build pre-renders the HTML
// (navigator.webdriver) so the saved markup stays clean, and when the visitor
// prefers reduced motion.
function motion() {
  if (navigator.webdriver) return;
  const bar = document.createElement("div");
  bar.className = "scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.prepend(bar);
  const progress = () => {
    const h = document.documentElement;
    bar.style.transform = `scaleX(${h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)})`;
  };
  addEventListener("scroll", progress, { passive: true });
  progress();

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Staggered fade-up for content that isn't already animated by main.js.
  const io = new IntersectionObserver(
    (entries, obs) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("active");
          obs.unobserve(en.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );
  const targets = [
    "main .section-header", "main .info-grid > *", ".cost-factors > li", ".service-steps > li",
    ".faq-item", ".service-included > li", ".about-highlight-card", ".table-wrap", ".industry-chip",
    ".service-detail-grid > *", ".contact-card", ".about-story-col", ".notice", ".project-filters",
  ];
  document.querySelectorAll(targets.join(",")).forEach((el) => {
    if (el.classList.contains("reveal")) return;
    const i = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.classList.add("reveal");
    el.style.transitionDelay = `${Math.min(i, 8) * 70}ms`;
    io.observe(el);
  });

  // Count up the numeric part of stat values ("24 hrs", "100%", "30 days").
  const countIo = new IntersectionObserver(
    (entries, obs) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        obs.unobserve(en.target);
        const el = en.target, m = el.textContent.trim().match(/^(\d+)(.*)$/);
        if (!m) return;
        const end = +m[1], rest = m[2], t0 = performance.now(), dur = 1400;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * e) + rest;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    { threshold: 0.6 },
  );
  document.querySelectorAll(".stat-value").forEach((el) => countIo.observe(el));

  if (!matchMedia("(hover: hover)").matches) return;

  // Soft spotlight that follows the cursor across cards.
  document.addEventListener(
    "pointermove",
    (ev) => {
      const card = ev.target.closest && ev.target.closest(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${ev.clientX - r.left}px`);
      card.style.setProperty("--my", `${ev.clientY - r.top}px`);
    },
    { passive: true },
  );

  // Gentle 3D tilt of the hero mockup.
  const hero = document.querySelector(".hero-section"), frame = document.querySelector(".hero-visual-frame");
  if (hero && frame) {
    hero.addEventListener("pointermove", (ev) => {
      const r = hero.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5, y = (ev.clientY - r.top) / r.height - 0.5;
      frame.style.transform = `rotateY(${-8 + x * 10}deg) rotateX(${4 - y * 8}deg)`;
    });
    hero.addEventListener("pointerleave", () => (frame.style.transform = ""));
  }
}
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", motion) : motion();
