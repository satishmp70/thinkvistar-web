# Deployment Guide

Every push to `main` (or *Run workflow* in the Actions tab) runs `.github/workflows/check.yml`:

1. **build**: builds the site from `src/` + `static/`, runs every check (SEO, links, browser, contact
   endpoint, Lighthouse), adds PHPMailer (`vendor/`) and keeps a copy of the output on the `deploy` branch.
2. **deploy**: only if every check passed, copies the output to the server's `public_html` over SSH
   (`rsync`), then checks that `/` returns 200 and `/api/contact.php` returns 405.

The server needs no Node, no Composer and no source code. `rsync --delete` removes files that are no longer
built, but never touches `.env`, `api/.env`, `.well-known/`, `.git/`, `.user.ini` or `php.ini`.

## One-time setup

### 1. Turn on SSH (Hostinger)

hPanel → **Advanced → SSH Access** → *Enable*. Note the **IP**, **port** (Hostinger uses `65002`) and
**username** (`uXXXXXXX`). On a VPS, use your server's IP, port `22` and a deploy user.

### 2. Create a deploy key (on your own computer)

```bash
ssh-keygen -t ed25519 -C "github-deploy-thinkvistar" -f ~/.ssh/thinkvistar_deploy -N ""
```

- Public key: hPanel → SSH Access → **SSH keys → Add SSH key**, paste `~/.ssh/thinkvistar_deploy.pub`.
  (VPS: append it to `~/.ssh/authorized_keys` of the deploy user.)
- Test it: `ssh -i ~/.ssh/thinkvistar_deploy -p 65002 uXXXXXXX@SERVER_IP 'pwd; ls; which rsync'`
- Find the web root while logged in. Usually `/home/uXXXXXXX/domains/thinkvistar.com/public_html`
  (older accounts: `/home/uXXXXXXX/public_html`).

### 3. Record the server's host key

```bash
ssh-keyscan -p 65002 SERVER_IP
```

Copy all the lines it prints (needed so the workflow refuses to connect to an impostor server).

### 4. Add the secrets in GitHub

Repository → **Settings → Environments → New environment** → name it `production`.
Optionally restrict *Deployment branches* to `main`, or add yourself as a *Required reviewer* to approve each deploy.
Under **Environment secrets** add:

| Secret            | Value                                                         |
|-------------------|---------------------------------------------------------------|
| `SSH_HOST`        | server IP, e.g. `153.92.x.x`                                  |
| `SSH_PORT`        | `65002` (Hostinger) or `22`                                   |
| `SSH_USER`        | `uXXXXXXX`                                                    |
| `SSH_PRIVATE_KEY` | full contents of `~/.ssh/thinkvistar_deploy` (private key)    |
| `SSH_KNOWN_HOSTS` | output of step 3                                              |
| `DEPLOY_PATH`     | the web root from step 2, must end in `public_html`           |

Optional *Environment variable* `SITE_URL` (default `https://thinkvistar.com`) for the smoke test.

### 5. Put `.env` on the server (once)

`config.php` reads `.env` from the folder that **contains** `public_html` (outside the web root).
Fill it from `.env.example` with a NEW mailbox password, then upload it next to `public_html`:

```bash
# web root /home/uXXXXXXX/domains/thinkvistar.com/public_html  ->  .env goes in domains/thinkvistar.com/
scp -i ~/.ssh/thinkvistar_deploy -P 65002 .env uXXXXXXX@SERVER_IP:domains/thinkvistar.com/.env
# web root /home/uXXXXXXX/public_html  ->  .env goes in the home folder
# scp -i ~/.ssh/thinkvistar_deploy -P 65002 .env uXXXXXXX@SERVER_IP:.env
```

### 6. Stop the old Hostinger Git deployment

hPanel → **Advanced → Git**: delete the auto-deploy / webhook for this repository, so two deployments don't
write to `public_html` at once. (The `deploy` branch is still kept on GitHub as a history of what was live.)

### 7. First deploy

GitHub → **Actions → build-and-deploy → Run workflow** (branch `main`). When it is green, open the site and
send one test enquiry from `/contact/`. From now on every push to `main` deploys automatically.

**Rollback:** Actions → open the last good run on `main` → *Re-run all jobs*. That rebuilds and redeploys that commit.

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
