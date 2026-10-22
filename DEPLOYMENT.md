# Deployment Guide

GitHub Actions builds the site from `src/` + `static/`, runs the SEO and link checks, adds PHPMailer
(`vendor/`) and publishes the finished files to the **`deploy`** branch. Hostinger pulls that branch into
`public_html`. The server needs no Node, no Composer and no source code.

## One-time switch (in this order, no downtime)

1. Push this work to a branch other than `main` (for example `restructure`).
2. GitHub → Actions → **build-and-deploy** → *Run workflow* on that branch. It creates the `deploy` branch.
3. Create `/home/uXXXX/.env` on the server from `.env.example` (outside `public_html`). Use a NEW mailbox password.
4. Hostinger hPanel → Git → set the branch to `deploy` (directory `public_html`) and deploy.
5. Check https://thinkvistar.com/ and send one test enquiry from `/contact/`.
6. Only now merge the branch into `main`. From then on every push to `main` redeploys automatically.

If a step fails, point Hostinger back at the old branch; nothing is lost.

## Form endpoint settings (`.env`, outside `public_html`)

- `ALLOWED_ORIGINS`: complete origins allowed to post the form (scheme + host [+ port]), compared exactly. Default: `https://thinkvistar.com` and `https://www.thinkvistar.com`. A staging site must be listed explicitly. Requests without an `Origin` header (older clients, scripts) are still accepted; the field allowlist and rate limit are the abuse controls.
- `RATE_LIMIT_DIR`: private writable folder for counters. Default: `.thinkvistar-ratelimit` in the hosting home directory, then the system temp folder. If none is writable the form returns HTTP 503 and logs the cause instead of running unlimited.
- `TRUST_PROXY_HEADERS`: see Troubleshooting.

The server must run PHP 8.1 or newer.

## Local PHP test (optional)

```bash
cd src && npm ci && npm run build        # creates dist/
cd .. && composer install --no-dev && cp -r vendor dist/vendor
cp .env.example .env                     # edit values
cd dist && php -S 127.0.0.1:8000         # open http://127.0.0.1:8000/contact/
```

## SMTP Configuration

Configuration is read from a `.env` file, not from `api/config.php`. Copy `.env.example`
to `.env` and fill in the real values. The loader looks in three places, in order:

1. `/home/uXXXX/.env` (outside `public_html`, the safest)
2. `public_html/.env`
3. `public_html/api/.env`

`api/config.php` is committed and only reads
environment variables, so it contains no secrets and is safe to keep in git.
Never put the mailbox password in frontend JavaScript or docs.

If an SMTP password has ever been committed or shared, change it in Hostinger and update `.env`.

## Post-deploy checks (run by you, on the live site)

These cannot be run from the repository and are listed separately in `audit-reports/REMEDIATION_STATUS.md`:
`curl -sI` on `/`, `/contact/`, `/assets/<file>`, `/fonts/<file>` (status, `Cache-Control`, CSP, HSTS, redirects), one real test enquiry, then `node src/indexnow.mjs` once the new version is live (it verifies the key file first and exits non-zero if the notification is rejected).

## Verification

Open the contact page:

```text
https://thinkvistar.com/contact/
```

Submit a valid form. The message should be delivered to `hello@thinkvistar.com`.

To verify that the PHP endpoint exists, open:

```text
https://thinkvistar.com/api/contact.php
```

An existing endpoint returns a JSON `Method not allowed` response for a normal browser `GET`. A `404` means the `api/` directory was not uploaded correctly.

## Troubleshooting

- `404` for `/api/contact.php`: upload `api/` directly inside `public_html/`.
- `PHPMailer is not installed`: upload `vendor/` and confirm `vendor/autoload.php` exists.
- `Origin not allowed`: confirm the domain (`https://thinkvistar.com`) is listed in `ALLOWED_ORIGINS` in `.env`.
- Every visitor gets "Too many enquiries": the host proxy hides visitor addresses. Set `TRUST_PROXY_HEADERS=true` in `.env`.
- SMTP authentication failure: verify the Hostinger mailbox password and SMTP hostname.
- No message in Inbox: check Spam/Junk and Hostinger mail delivery logs.

## Domain & search engine setup (thinkvistar.com)

1. Point `thinkvistar.com` and `www.thinkvistar.com` at this hosting and enable SSL (Hostinger → SSL).
2. HTTPS is live and `Strict-Transport-Security` is enabled in `.htaccess`.
3. Google Search Console: add a **Domain property** for `thinkvistar.com` and submit `https://thinkvistar.com/sitemap.xml`.
4. Bing Webmaster Tools: import the site from Search Console, then run `node src/indexnow.mjs`.
5. Create or update the **Google Business Profile** with exactly the same name, address and phone as the site footer:
   Thinkvistar LLP, Yashwant Gaurav Phase 1, Nalasopara West, Palghar, Maharashtra 401203 · +91 70210 67824.
