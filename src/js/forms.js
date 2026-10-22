// Contact form: native HTML form that posts to /api/contact.php. With JavaScript
// this module adds inline validation (errors are linked to their fields with
// aria-describedby) and submits with fetch(); without it the browser posts the
// form natively, so enquiry data never travels in a URL.
import { byId } from './lib/dom.js';

const LETTER = /\p{L}/u;
const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

const collapse = (value) => value.replace(/\s{2,}/g, ' ');

/** Field rules. `sanitize` runs while typing; `validate` returns an error message or "". */
const RULES = {
  name: {
    sanitize: (v) => collapse(v.replace(/[^\p{L}\p{M}\s.'\-]/gu, '')),
    validate: (v) => {
      if (!v) return 'Please enter your full name.';
      if (v.replace(/[^\p{L}]/gu, '').length < 2) return 'Name must contain at least 2 letters.';
      return v.length > 60 ? 'Name is too long (max 60 characters).' : '';
    },
  },
  company: {
    sanitize: (v) => collapse(v.replace(/[^\p{L}\p{M}\p{N}\s.,'&()\-/]/gu, '')),
    validate: (v) => {
      if (!v) return 'Please enter your company or organization.';
      if (!LETTER.test(v)) return 'Company name must contain letters.';
      if (v.length < 2) return 'Company name is too short.';
      return v.length > 80 ? 'Company name is too long (max 80 characters).' : '';
    },
  },
  email: {
    sanitize: (v) => v.replace(/\s/g, ''),
    validate: (v) => {
      if (!v) return 'Please enter your work email.';
      if (!EMAIL.test(v)) return 'Please enter a valid email address (e.g. name@company.com).';
      return v.length > 120 ? 'Email address is too long.' : '';
    },
  },
  phone: {
    sanitize: (v) => collapse(v.replace(/[^\d\s+().\-]/g, '')),
    validate: (v) => {
      if (!v) return '';
      const digits = v.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) return 'Please enter a valid phone number (7–15 digits).';
      return v.indexOf('+') > 0 ? 'A "+" is only allowed at the start of the number.' : '';
    },
  },
  select: { validate: (v) => (v ? '' : 'Please select an option.') },
  message: {
    validate: (v) => {
      if (!v) return 'Please tell us a little about your project.';
      if (v.length < 20) return 'Please add a bit more detail (at least 20 characters).';
      return v.length > 2000 ? 'Project brief is too long (max 2000 characters).' : '';
    },
  },
};

const FIELDS = {
  clientName: RULES.name,
  clientCompany: RULES.company,
  clientEmail: RULES.email,
  clientPhone: RULES.phone,
  projectScope: RULES.select,
  projectOverview: RULES.message,
};

const SCOPE_BY_KEYWORD = [
  ['saas', 'Custom SaaS Platform Development'],
  ['cms', 'Headless CMS Architecture & Migration'],
  ['healthcare', 'Healthcare / FinTech Regulated System'],
  ['fintech', 'Healthcare / FinTech Regulated System'],
  ['ledger', 'High-Throughput Web Application'],
  ['api', 'High-Throughput Web Application'],
  ['modernization', 'Legacy Enterprise Modernization'],
  ['ai', 'Dedicated Senior Engineering Squad'],
];

const labelOf = (input) => document.querySelector(`label[for="${input.id}"]`)?.textContent.replace(/[*(].*$/, '').trim() || input.name;

/** Shows or clears one field's error and keeps aria-invalid / aria-describedby in sync. */
function setFieldError(input, message) {
  const errorId = `${input.id}Error`;
  let error = byId(errorId);
  if (!error) {
    error = document.createElement('span');
    error.className = 'form-error';
    error.id = errorId;
    error.setAttribute('aria-live', 'polite');
    input.insertAdjacentElement('afterend', error);
  }
  error.textContent = message || '';
  input.classList.toggle('is-invalid', Boolean(message));
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  const described = new Set((input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
  described.add(errorId); // stays associated even when the message is empty
  input.setAttribute('aria-describedby', [...described].join(' '));
}

function showStatus(statusEl, kind, content) {
  if (!statusEl) return;
  statusEl.className = `form-status ${kind}`;
  statusEl.style.display = 'block';
  statusEl.replaceChildren(content instanceof Node ? content : document.createTextNode(content));
}

function clearStatus(statusEl) {
  if (!statusEl) return;
  statusEl.className = 'form-status';
  statusEl.style.display = 'none';
  statusEl.replaceChildren();
}

/** Wires one input to its rule and returns a function that validates it now. */
function bindField(input, rule) {
  const check = () => {
    const message = rule.validate(input.value.trim());
    setFieldError(input, message);
    return !message;
  };
  input.addEventListener('input', () => {
    if (rule.sanitize) {
      const before = input.value;
      const after = rule.sanitize(before);
      if (after !== before) {
        const caret = Math.max(0, (input.selectionStart ?? before.length) - (before.length - after.length));
        input.value = after;
        try { input.setSelectionRange(caret, caret); } catch { /* not supported on this input type */ }
      }
    }
    if (input.classList.contains('is-invalid')) check();
  });
  input.addEventListener('blur', (event) => {
    if (event.relatedTarget?.matches?.('button[type="submit"]')) return; // the submit handler reports instead
    check();
  });
  if (input.tagName === 'SELECT') input.addEventListener('change', check);
  return check;
}

/** Plain-text table used for the mailto fallback body. */
function plainText(rows) {
  return rows.map(([label, value]) => `${label}: ${value || '—'}`).join('\n');
}

function mailtoLink(email, subject, rows) {
  const body = `New enquiry from the Thinkvistar website:\n\n${plainText(rows)}\n`;
  const link = document.createElement('a');
  link.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  link.textContent = `send it by email to ${email}`;
  return link;
}

async function submitEnquiry(form, statusEl, inputs) {
  const submit = form.querySelector('button[type="submit"]');
  const label = submit?.querySelector('span');
  const original = label?.textContent;
  if (submit) submit.disabled = true;
  if (label) label.textContent = 'Sending…';
  showStatus(statusEl, 'info', 'Sending your enquiry…');

  let serverMessage = '';
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    });
    const result = await response.json().catch(() => ({}));
    if (response.status === 422 && result.errors) {
      // The server applies the authoritative rules; show anything the browser let through.
      Object.entries(result.errors).forEach(([field, message]) => {
        if (inputs[field]) setFieldError(inputs[field], message);
      });
      showStatus(statusEl, 'error', result.message || 'Please correct the highlighted fields and try again.');
      form.querySelector('.is-invalid')?.focus();
      return;
    }
    if (!response.ok || result.success === false) {
      serverMessage = result.message || '';
      throw new Error(serverMessage || 'Submission failed');
    }
    form.reset();
    Object.values(inputs).forEach((input) => setFieldError(input, ''));
    showStatus(statusEl, 'success', result.message || 'Thank you — your enquiry has been sent. We usually respond within one business day.');
  } catch {
    const rows = [...Object.values(inputs)].map((input) => [labelOf(input), input.value.trim()]);
    const message = document.createElement('span');
    message.append(`${serverMessage || 'We could not send your enquiry automatically.'} You can try again, or `);
    message.append(mailtoLink('hello@thinkvistar.com', 'New Contact Form Enquiry', rows));
    message.append('.');
    showStatus(statusEl, 'error', message);
  } finally {
    if (submit) submit.disabled = false;
    if (label && original) label.textContent = original;
  }
}

export function initContactForm() {
  const form = byId('contactForm');
  if (!form) return;
  const statusEl = byId('formStatus');
  form.noValidate = true; // JavaScript shows the messages; without it native validation applies

  const scope = new URLSearchParams(window.location.search).get('scope')?.toLowerCase();
  const select = form.querySelector('#projectScope');
  if (scope && select) {
    const match = SCOPE_BY_KEYWORD.find(([keyword]) => scope.includes(keyword));
    if (match) select.value = match[1];
  }

  const inputs = {};
  const checks = Object.entries(FIELDS).map(([id, rule]) => {
    const input = form.querySelector(`#${id}`);
    if (!input) return () => true;
    inputs[id] = input;
    setFieldError(input, ''); // establishes aria-describedby on every field up front
    return bindField(input, rule);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const results = checks.map((check) => check());
    if (!results.every(Boolean)) {
      const invalid = [...form.querySelectorAll('.is-invalid')];
      showStatus(statusEl, 'error', `Please correct the highlighted fields: ${invalid.map(labelOf).join(', ')}.`);
      invalid[0]?.focus();
      return;
    }
    clearStatus(statusEl);
    submitEnquiry(form, statusEl, inputs);
  });
}
