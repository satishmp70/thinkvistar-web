// Builds /llms.txt (short, curated index) and /llms-full.txt (all key facts + every FAQ)
// for AI assistants and answer engines (ChatGPT, Claude, Gemini, Perplexity, Copilot).
// Everything is generated from the same data as the visible pages, so it cannot drift.
import { SITE } from './pages.mjs';
import { SERVICE_PAGES, serviceUrl } from './service-pages.mjs';

const plain = (s = '') => String(s).replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

function facts(data) {
  const c = data.company, a = SITE.address;
  return [
    `Thinkvistar (legal name ${c.legalName}; also written "Think Vistar" or "ThinkVistar") is a senior-led software development company in the Mumbai Metropolitan Region, India.`,
    `Services: ${SERVICE_PAGES.map((p) => p.keyword).join('; ')}.`,
    `Founded: ${c.yearFounded}. Address: ${a.streetAddress}, ${a.addressLocality}, ${a.district}, ${a.addressRegion} ${a.postalCode}, India.`,
    `Email: ${c.contact.email}. Phone/WhatsApp: ${c.contact.phone}. Website: ${SITE.origin}/`,
    'Works with clients across India and remotely with teams in the US, UK and Europe. Aims to reply to enquiries within one business day.',
    'Once the agreed payment is received, the bespoke source code, designs and database schemas built for a client become the client’s property; Thinkvistar keeps its pre-existing tools and libraries and licenses them to the client as part of the delivered work (see Terms).',
  ];
}

export function buildLlms(data, pages) {
  const indexable = pages.filter((p) => p.sitemap);
  const link = (p) => `- [${plain(p.title)}](${SITE.origin}${p.path}): ${plain(p.description)}`;
  const core = indexable.filter((p) => !p.path.startsWith('/services/') || p.path === '/services/');
  const services = indexable.filter((p) => p.path.startsWith('/services/') && p.path !== '/services/');

  const short = [
    `# ${SITE.name}`,
    '',
    `> ${facts(data)[0]}`,
    '',
    ...facts(data).slice(1).map((f) => f),
    '',
    '## Key pages',
    ...core.map(link),
    '',
    '## Services',
    ...services.map(link),
    '',
    '## More detail',
    `- [Full text version of this site's key facts and FAQs](${SITE.origin}/llms-full.txt)`,
    '',
  ].join('\n');

  const full = [
    `# ${SITE.name} — full reference`,
    '',
    ...facts(data).map((f) => f),
    '',
    ...indexable.flatMap((p) => [
      `## ${plain(p.title)}`,
      `URL: ${SITE.origin}${p.path}`,
      plain(p.description),
      ...(p.faq ? ['', ...p.faq.flatMap(([q, a]) => [`Q: ${plain(q)}`, `A: ${plain(a)}`, ''])] : ['']),
    ]),
  ].join('\n');

  return { short, full };
}
