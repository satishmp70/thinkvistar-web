# Deployment Guide

This project is deployed as a static website with a PHP SMTP mail endpoint.
Node.js and `node_modules` are not required on the server. Before deploying, run a full build on your computer
(`cd _src && npm run build`, see README.md) so the HTML, `/assets` and `sitemap.xml` are up to date.

## Local Setup

PHP 8.1 or newer and Composer are required for local SMTP mail testing.

1. From the project root directory, install PHPMailer (if `vendor/` does not already exist):

```bash
composer install --no-dev
```

2. Ensure `api/config.php` exists (copy from `api/config.example.php` if needed) and configure your SMTP settings.

3. Start the local server:

```bash
php -S 127.0.0.1:8000
```

4. Open:

```text
http://127.0.0.1:8000/contact/
```

Keep the PHP server running while testing the form. The form submits to `/api/contact.php` on the same server.

## Server Setup

The server does not need Node.js or `node_modules`. You do not need to upload `_src/`
(it is blocked from the web by `.htaccess` if you do), but make sure the hidden `.htaccess` file in the root **is** uploaded.

1. Open Hostinger File Manager or connect through SFTP.
2. Open the domain's `public_html/` directory.
3. Upload the project files directly into `public_html/`.
4. Upload `api/config.php` separately with the real SMTP password (keep it secure and out of public git repositories).

5. Install PHPMailer on the server:

```bash
cd public_html
composer install --no-dev --optimize-autoloader
```

This creates `public_html/vendor/`. Do not commit `vendor/` or `api/config.php` to git.

The server must use PHP 8.1 or newer.

The following paths must exist in `public_html/`:

```text
public_html/.htaccess
public_html/index.html
public_html/404.html
public_html/about/index.html
public_html/contact/index.html
public_html/assets/
public_html/fonts/
public_html/images/
public_html/api/contact.php
public_html/api/config.php
public_html/vendor/autoload.php
```

## SMTP Configuration

In `public_html/api/config.php`, confirm these values:

```php
'transport' => 'smtp',
'host' => 'smtp.hostinger.com',
'username' => 'hello@thinkvistar.com',
'password' => 'YOUR_MAILBOX_PASSWORD',
```

Keep the password private. Do not place it in frontend JavaScript or public documentation.

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
- `Origin not allowed`: confirm the domain (`https://thinkvistar.com`) is listed in `allowed_origins` in `api/config.php`.
- SMTP authentication failure: verify the Hostinger mailbox password and SMTP hostname.
- No message in Inbox: check Spam/Junk and Hostinger mail delivery logs.

## Domain & search engine setup (thinkvistar.com)

1. Point `thinkvistar.com` and `www.thinkvistar.com` at this hosting and enable SSL (Hostinger → SSL).
2. Once HTTPS works, uncomment the `Strict-Transport-Security` line in `.htaccess`.
3. Google Search Console: add a **Domain property** for `thinkvistar.com` and submit `https://thinkvistar.com/sitemap.xml`.
4. Bing Webmaster Tools: import the site from Search Console, then run `node _src/indexnow.mjs`.
5. Create or update the **Google Business Profile** with exactly the same name, address and phone as the site footer:
   Thinkvistar LLP, Yashwant Gaurav Phase 1, Nalasopara West, Palghar, Maharashtra 401203 · +91 70210 67824.
