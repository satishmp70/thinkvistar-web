<?php
/**
 * =========================================================================
 * CONTACT FORM HANDLER
 * =========================================================================
 * Accepts the website enquiry form and emails it to the company inbox.
 *
 * Works two ways, from the same <form method="post" action="/api/contact.php">:
 *   - With JavaScript the page posts via fetch() and sends "Accept: application/json";
 *     this script answers with JSON { success, message, errors? }.
 *   - Without JavaScript (or if the script bundle fails) the browser posts the form
 *     natively; this script answers with a small HTML page. Enquiry data therefore
 *     never travels in a URL.
 *
 * The accepted fields are an explicit allowlist (FIELDS below). Anything else is
 * ignored, wrong types are rejected, and nothing is sent unless every rule passes.
 */

define('VS_CONTACT_HANDLER', true);

$config = require __DIR__ . '/config.php';
date_default_timezone_set($config['timezone'] ?? 'Asia/Kolkata');

// -------------------------------------------------------------------------
// Field contract. Keep SCOPES / TIMELINES identical to the <option> values in
// src/pages/contact.html (the build's verify step checks they match).
// -------------------------------------------------------------------------
const SCOPES = [
    'Custom SaaS Platform Development',
    'Headless CMS Architecture & Migration',
    'Healthcare / FinTech Regulated System',
    'High-Throughput Web Application',
    'Legacy Enterprise Modernization',
    'Dedicated Senior Engineering Squad',
    'Architecture Code Audit & Optimization',
];
const TIMELINES = [
    'Immediate (Within 30 Days)',
    'Next Quarter (1-3 Months)',
    'Flexible / Exploration Phase',
];
const MAX_FIELDS = 20;
const MAX_BODY_BYTES = 32768;

/** Visible label, in the order shown in the email. */
const LABELS = [
    'clientName'      => 'Name',
    'clientCompany'   => 'Company',
    'clientEmail'     => 'Email',
    'clientPhone'     => 'Phone',
    'projectScope'    => 'Engagement Scope',
    'projectTimeline' => 'Target Timeline',
    'projectOverview' => 'Message',
];

// -------------------------------------------------------------------------
// Response helpers
// -------------------------------------------------------------------------
$wantsJson = stripos((string) ($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json') !== false;

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

/** Send a response (JSON for scripts, a small HTML page for native form posts) and stop. */
function respond($success, $message, $status = 200, array $errors = [])
{
    global $wantsJson;
    http_response_code($status);

    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        $payload = ['success' => $success, 'message' => $message];
        if ($errors) {
            $payload['errors'] = $errors;
        }
        echo json_encode($payload);
        exit;
    }

    header('Content-Type: text/html; charset=utf-8');
    $title = $success ? 'Thank you' : 'We could not send your enquiry';
    $items = '';
    foreach ($errors as $text) {
        $items .= '<li>' . htmlspecialchars($text, ENT_QUOTES, 'UTF-8') . '</li>';
    }
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width,initial-scale=1">'
        . '<meta name="robots" content="noindex">'
        . '<title>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . ' | Thinkvistar</title>'
        . '<style>body{font:16px/1.6 system-ui,Segoe UI,Arial,sans-serif;color:#1f2937;margin:0;padding:48px 20px;background:#f5f7fa}'
        . 'main{max-width:560px;margin:0 auto;background:#fff;border:1px solid #e3e8ef;border-radius:12px;padding:32px}'
        . 'h1{margin:0 0 12px;font-size:1.5rem;color:#0a2540}a{color:#1a56db}ul{padding-left:20px}</style></head><body><main>'
        . '<h1>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</h1>'
        . '<p role="status">' . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . '</p>'
        . ($items !== '' ? '<ul>' . $items . '</ul>' : '')
        . '<p>' . ($success
            ? '<a href="/">Back to the Thinkvistar website</a>'
            : 'Use your browser\'s Back button to correct the form, or email <a href="mailto:hello@thinkvistar.com">hello@thinkvistar.com</a>.')
        . '</p></main></body></html>';
    exit;
}

// -------------------------------------------------------------------------
// Request guards
// -------------------------------------------------------------------------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(false, 'Method not allowed. Please use the contact form.', 405);
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY_BYTES) {
    respond(false, 'Your submission is too large.', 413);
}

/** Reduce an origin to scheme://host[:port], lower-case, default ports removed. null = not a valid origin. */
function normalizeOrigin($origin)
{
    $parts = parse_url(trim((string) $origin));
    if (!is_array($parts) || empty($parts['scheme']) || empty($parts['host'])
        || isset($parts['path']) && $parts['path'] !== '' && $parts['path'] !== '/'
        || isset($parts['user']) || isset($parts['query']) || isset($parts['fragment'])) {
        return null;
    }
    $scheme = strtolower($parts['scheme']);
    if (!in_array($scheme, ['http', 'https'], true)) {
        return null;
    }
    $port = $parts['port'] ?? null;
    if (($scheme === 'https' && $port === 443) || ($scheme === 'http' && $port === 80)) {
        $port = null;
    }
    return $scheme . '://' . strtolower($parts['host']) . ($port ? ':' . $port : '');
}

// Browsers always send Origin on cross-origin and on POST requests. When it is
// present it must exactly match a configured origin (scheme, host and port).
// A request with no Origin header (older clients, scripts, curl) is still allowed:
// the Origin header is not an authentication mechanism, so the honeypot, field
// contract and rate limit below are the real abuse controls.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $allowed = array_filter(array_map('normalizeOrigin', $config['allowed_origins'] ?? []));
    $normalized = normalizeOrigin($origin);
    if ($normalized === null || !in_array($normalized, $allowed, true)) {
        respond(false, 'Origin not allowed.', 403);
    }
}

// Honeypot: real users never fill a hidden field. Pretend success, send nothing.
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    respond(true, 'Thank you for your enquiry.');
}

// -------------------------------------------------------------------------
// Validation (explicit allowlist, scalar strings only)
// -------------------------------------------------------------------------

/** Remove control characters (keeps newlines/tabs), normalise newlines and trim. Escaping happens at render time. */
function cleanValue($value)
{
    $value = str_replace(["\r\n", "\r"], "\n", (string) $value);
    return trim(preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value));
}

/** A single-line header value must never contain newlines. */
function cleanHeader($value)
{
    return trim(preg_replace('/[\r\n]+/', ' ', cleanValue($value)));
}

function textLength($value)
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

if (count($_POST) === 0) {
    respond(false, 'No form data was received.', 422, ['form' => 'Please fill in the form and submit again.']);
}
if (count($_POST) > MAX_FIELDS) {
    respond(false, 'Your submission could not be processed.', 422, ['form' => 'Too many fields.']);
}

$errors = [];
$clean = [];

foreach (array_keys(LABELS) as $field) {
    $raw = $_POST[$field] ?? '';
    if (is_array($raw)) {
        $errors[$field] = 'Invalid value.';
        continue;
    }
    $clean[$field] = cleanValue($raw);
}

if ($errors) {
    respond(false, 'Your submission could not be processed.', 422, $errors);
}

$name = $clean['clientName'];
if ($name === '') {
    $errors['clientName'] = 'Please enter your full name.';
} elseif (preg_match_all('/\p{L}/u', $name) < 2) {
    $errors['clientName'] = 'Name must contain at least 2 letters.';
} elseif (textLength($name) > 60) {
    $errors['clientName'] = 'Name is too long (max 60 characters).';
}

$company = $clean['clientCompany'];
if ($company === '') {
    $errors['clientCompany'] = 'Please enter your company or organization.';
} elseif (!preg_match('/\p{L}/u', $company) || textLength($company) < 2) {
    $errors['clientCompany'] = 'Company name must contain letters.';
} elseif (textLength($company) > 80) {
    $errors['clientCompany'] = 'Company name is too long (max 80 characters).';
}

$email = $clean['clientEmail'];
if ($email === '') {
    $errors['clientEmail'] = 'Please enter your work email.';
} elseif (textLength($email) > 120 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $errors['clientEmail'] = 'Please enter a valid email address.';
}

$phone = $clean['clientPhone'];
if ($phone !== '') {
    $digits = preg_replace('/\D/', '', $phone);
    if (textLength($phone) > 20 || strlen($digits) < 7 || strlen($digits) > 15
        || strpos($phone, '+') > 0 || preg_match('/[^\d\s+().\-]/', $phone)) {
        $errors['clientPhone'] = 'Please enter a valid phone number (7-15 digits).';
    }
}

if (!in_array($clean['projectScope'], SCOPES, true)) {
    $errors['projectScope'] = 'Please select an engagement scope.';
}

if ($clean['projectTimeline'] !== '' && !in_array($clean['projectTimeline'], TIMELINES, true)) {
    $errors['projectTimeline'] = 'Please select a valid timeline.';
}

$message = $clean['projectOverview'];
if ($message === '') {
    $errors['projectOverview'] = 'Please tell us a little about your project.';
} elseif (textLength($message) < 20) {
    $errors['projectOverview'] = 'Please add a bit more detail (at least 20 characters).';
} elseif (textLength($message) > 2000) {
    $errors['projectOverview'] = 'Project brief is too long (max 2000 characters).';
}

if ($errors) {
    respond(false, 'Please correct the highlighted fields and try again.', 422, $errors);
}

// Rows in display order; empty optional fields are omitted.
$rows = [];
foreach (LABELS as $field => $label) {
    if ($clean[$field] !== '') {
        $rows[$label] = $clean[$field];
    }
}
$rows['Submitted On'] = date('d M Y, h:i A T');
$source = $_POST['_source'] ?? 'Website';
$source = is_array($source) ? 'Website' : cleanHeader($source);
$rows['Submitted From'] = function_exists('mb_substr') ? mb_substr($source, 0, 200, 'UTF-8') : substr($source, 0, 200);

// -------------------------------------------------------------------------
// Rate limit: at most max_per_hour accepted enquiries per visitor per hour.
// The counter file is locked for the whole read-check-write sequence, so
// concurrent requests cannot all pass on the same count. If the counter cannot
// be stored the request is refused (fail closed) rather than left unlimited.
// X-Forwarded-For is client-controlled, so it is only used when the host's
// proxy is known to overwrite it (TRUST_PROXY_HEADERS=true).
// -------------------------------------------------------------------------

/** First usable private directory for counters, created with mode 0700. */
function rateLimitDir(array $config)
{
    $candidates = array_filter([
        $config['rate_dir'] ?? null,
        dirname(__DIR__, 2) . '/.thinkvistar-ratelimit',
        sys_get_temp_dir() . '/thinkvistar-ratelimit',
    ]);
    foreach ($candidates as $dir) {
        // Concurrent first requests may both try to create the folder; the loser's mkdir fails even
        // though the folder now exists, so re-check instead of falling through to a different
        // candidate (which would give that request its own, separate counter).
        if ((is_dir($dir) || @mkdir($dir, 0700, true) || is_dir($dir)) && is_writable($dir)) {
            return $dir;
        }
    }
    return null;
}

/** Returns true when this request is within budget (and records it), false when over the limit, null when storage failed. */
function takeRateLimitSlot($dir, $visitor, $limit)
{
    $file = $dir . '/tv_' . hash('sha256', $visitor);
    $handle = @fopen($file, 'c+');
    if ($handle === false) {
        return null;
    }
    if (!flock($handle, LOCK_EX)) {
        fclose($handle);
        return null;
    }
    $now = time();
    $hits = json_decode((string) stream_get_contents($handle), true);
    $hits = array_values(array_filter(is_array($hits) ? $hits : [], function ($t) use ($now) {
        return is_int($t) && $t > $now - 3600;
    }));

    $allowed = count($hits) < $limit;
    if ($allowed) {
        $hits[] = $now;
        rewind($handle);
        $ok = ftruncate($handle, 0) && fwrite($handle, json_encode($hits)) !== false && fflush($handle);
        if (!$ok) {
            flock($handle, LOCK_UN);
            fclose($handle);
            return null;
        }
    }
    flock($handle, LOCK_UN);
    fclose($handle);
    return $allowed;
}

/** Occasionally delete counters that have been idle for over two hours. */
function pruneRateLimitDir($dir)
{
    if (random_int(1, 50) !== 1) {
        return;
    }
    $cutoff = time() - 7200;
    foreach (array_slice(glob($dir . '/tv_*') ?: [], 0, 500) as $file) {
        if (@filemtime($file) < $cutoff) {
            @unlink($file);
        }
    }
}

$visitor = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!empty($config['trust_proxy_headers'])) {
    $forwarded = trim(explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? ''))[0]);
    if (filter_var($forwarded, FILTER_VALIDATE_IP) !== false) {
        $visitor = $forwarded;
    }
}

$rateDir = rateLimitDir($config);
$slot = $rateDir === null ? null : takeRateLimitSlot($rateDir, $visitor, max(1, (int) ($config['max_per_hour'] ?? 5)));
if ($slot === null) {
    error_log('[contact-form] rate-limit storage unavailable; refusing request');
    respond(false, 'The enquiry form is temporarily unavailable. Please email hello@thinkvistar.com directly.', 503);
}
if ($slot === false) {
    respond(false, 'Too many enquiries from your connection. Please try again later, or email hello@thinkvistar.com directly.', 429);
}
pruneRateLimitDir($rateDir);

// -------------------------------------------------------------------------
// Build the email
// -------------------------------------------------------------------------

/** Fields whose value is prose and should keep its line breaks. */
function isLongForm($label)
{
    return $label === 'Message';
}

function buildHtmlBody(array $rows, $subject)
{
    $tableRows = '';
    $i = 0;
    foreach ($rows as $label => $value) {
        $background = ($i % 2 === 0) ? '#ffffff' : '#f7f9fc';
        $safeLabel = htmlspecialchars($label, ENT_QUOTES, 'UTF-8');
        $safeValue = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');

        // Preserve the paragraph breaks the sender typed
        if (isLongForm($label)) {
            $safeValue = nl2br($safeValue);
        }

        $tableRows .= '
        <tr>
          <td style="padding:12px 16px;background:' . $background . ';border-bottom:1px solid #e2e8f0;font-size:14px;color:#475569;font-weight:600;width:170px;vertical-align:top;">' . $safeLabel . '</td>
          <td style="padding:12px 16px;background:' . $background . ';border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;line-height:1.6;vertical-align:top;">' . $safeValue . '</td>
        </tr>';
        $i++;
    }

    $safeSubject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');

    return '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>' . $safeSubject . '</title>
</head>
<body style="margin:0;padding:0;background:#eef2f7;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(15,23,42,0.08);">

          <tr>
            <td style="background:#0a2540;padding:24px 28px;">
              <div style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.01em;">' . $safeSubject . '</div>
              <div style="color:#94a3b8;font-size:13px;margin-top:6px;">A new enquiry was submitted on thinkvistar.com</div>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:8px;border-collapse:separate;overflow:hidden;">
                <tr>
                  <th align="left" style="padding:12px 16px;background:#0f3460;color:#ffffff;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;font-weight:700;">Field</th>
                  <th align="left" style="padding:12px 16px;background:#0f3460;color:#ffffff;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;font-weight:700;">Details</th>
                </tr>' . $tableRows . '
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 28px 26px;">
              <div style="font-size:13px;color:#64748b;line-height:1.6;">Reply directly to this email to respond to the sender.</div>
            </td>
          </tr>

          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 28px;">
              <div style="font-size:12px;color:#94a3b8;">Thinkvistar LLP &middot; Automated notification from the website contact form</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>';
}

function buildTextBody(array $rows)
{
    $lines = ["New Contact Form Enquiry", str_repeat('=', 48), ''];
    foreach ($rows as $label => $value) {
        $lines[] = $label . ':';
        $lines[] = '  ' . str_replace("\n", "\n  ", $value);
        $lines[] = '';
    }
    return implode("\n", $lines);
}

$baseSubject = $config['subject'] ?? 'New Contact Form Enquiry';
$subject = $baseSubject . ' from ' . cleanHeader($name);
$htmlBody = buildHtmlBody($rows, $subject);
$textBody = buildTextBody($rows);

// Reply-To comes only from the validated email field.
$replyToEmail = $email;
$replyToName  = cleanHeader($name);

// -------------------------------------------------------------------------
// Delivery
// -------------------------------------------------------------------------

/** Send through authenticated SMTP using PHPMailer. */
function sendViaSmtp($config, $subject, $htmlBody, $textBody, $replyToEmail, $replyToName)
{
    $autoloads = [
        __DIR__ . '/../vendor/autoload.php',
        __DIR__ . '/vendor/autoload.php',
    ];
    foreach ($autoloads as $autoload) {
        if (is_readable($autoload)) {
            require_once $autoload;
            break;
        }
    }

    if (!class_exists('PHPMailer\\PHPMailer\\PHPMailer')) {
        throw new RuntimeException('PHPMailer is not installed. Run: composer require phpmailer/phpmailer');
    }

    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = $config['smtp']['host'];
    $mail->Port       = (int) $config['smtp']['port'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['smtp']['username'];
    $mail->Password   = $config['smtp']['password'];
    $mail->SMTPSecure = $config['smtp']['encryption'] === 'tls'
        ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS
        : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
    $mail->CharSet    = 'UTF-8';

    // Anti-spam deliverability optimizations:
    // 1. Envelope Sender (Return-Path matches From address for SPF/DMARC alignment)
    $mail->Sender     = $config['from_email'];

    // 2. Set valid Hostname for Message-ID header (prevents server hostname flags)
    $fromDomain       = substr(strrchr($config['from_email'], '@'), 1);
    if (!empty($fromDomain)) {
        $mail->Hostname = $fromDomain;
    }

    // 3. Remove PHPMailer signature header so spam scanners don't penalize automated scripts
    $mail->XMailer    = ' ';

    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['recipient'], $config['recipient_name'] ?? '');
    $mail->addReplyTo($replyToEmail, $replyToName);

    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $htmlBody;
    $mail->AltBody = $textBody;

    $mail->send();
    return true;
}

/** Send through PHP's built-in mail(), as a multipart alternative message. */
function sendViaMail($config, $subject, $htmlBody, $textBody, $replyToEmail, $replyToName)
{
    $boundary = '=_vs_' . bin2hex(random_bytes(12));

    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
        'From: ' . sprintf('%s <%s>', $config['from_name'], $config['from_email']),
        'Reply-To: ' . sprintf('%s <%s>', $replyToName, $replyToEmail),
        'X-Mailer: Thinkvistar Contact Form',
    ];

    $body = "--$boundary\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . $textBody . "\r\n\r\n"
        . "--$boundary\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: 8bit\r\n\r\n"
        . $htmlBody . "\r\n\r\n"
        . "--$boundary--";

    // -f sets the envelope sender so the mail is not rejected as spoofed
    return mail(
        $config['recipient'],
        '=?UTF-8?B?' . base64_encode($subject) . '?=',
        $body,
        implode("\r\n", $headers),
        '-f' . $config['from_email']
    );
}

/** Test-only transport: records the message as JSON instead of sending it. */
function sendViaFile($config, $subject, $htmlBody, $textBody, $replyToEmail, $replyToName)
{
    $path = (string) ($config['mail_file'] ?? '');
    if ($path === '') {
        throw new RuntimeException('MAIL_FILE_PATH is not set.');
    }
    $line = json_encode([
        'to' => $config['recipient'], 'subject' => $subject, 'reply_to' => $replyToEmail,
        'reply_to_name' => $replyToName, 'text' => $textBody,
    ]) . "\n";
    return file_put_contents($path, $line, FILE_APPEND | LOCK_EX) !== false;
}

try {
    $transport = $config['transport'] ?? 'mail';
    if ($transport === 'smtp') {
        $sent = sendViaSmtp($config, $subject, $htmlBody, $textBody, $replyToEmail, $replyToName);
    } elseif ($transport === 'file') {
        $sent = sendViaFile($config, $subject, $htmlBody, $textBody, $replyToEmail, $replyToName);
    } else {
        $sent = sendViaMail($config, $subject, $htmlBody, $textBody, $replyToEmail, $replyToName);
    }

    if (!$sent) {
        throw new RuntimeException('The mail server rejected the message.');
    }

    respond(true, 'Thank you for your enquiry. We aim to respond within one business day.');
} catch (Throwable $e) {
    // Log the detail for the site owner, return a generic message to the visitor
    error_log('[contact-form] ' . $e->getMessage());
    respond(false, 'We could not send your enquiry right now. Please email hello@thinkvistar.com directly.', 500);
}
