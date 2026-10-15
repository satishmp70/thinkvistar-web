<?php
/**
 * =========================================================================
 * CONTACT FORM MAIL HANDLER
 * =========================================================================
 * Receives a POST from the existing contact forms, validates and sanitizes
 * every submitted value, and delivers the enquiry to the company inbox as a
 * professional HTML email with the data laid out in a table.
 *
 * Every field carrying a name attribute is picked up automatically, so adding
 * a field to the form markup adds a row to the email with no change here.
 * Known fields get a friendly label from LABELS; anything else is derived
 * from the field name.
 *
 * Responds with JSON: { "success": bool, "message": string }
 */

define('VS_CONTACT_HANDLER', true);

// -------------------------------------------------------------------------
// Configuration
// -------------------------------------------------------------------------
$configPath = __DIR__ . '/config.php';
if (!is_readable($configPath)) {
    $configPath = __DIR__ . '/config.example.php';
}
$config = require $configPath;

date_default_timezone_set($config['timezone'] ?? 'Asia/Kolkata');

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

/** Send a JSON response and stop. */
function respond($success, $message, $status = 200)
{
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message]);
    exit;
}

// -------------------------------------------------------------------------
// Request guards
// -------------------------------------------------------------------------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(false, 'Method not allowed.', 405);
}

// Only accept posts from our own site. A same-origin post is always allowed,
// whatever domain the site is deployed on, so staging hosts keep working.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '') {
    $originHost = parse_url($origin, PHP_URL_HOST);
    $sameOrigin = $originHost !== null
        && strcasecmp($originHost, (string) parse_url('http://' . ($_SERVER['HTTP_HOST'] ?? ''), PHP_URL_HOST)) === 0;

    $allowed = $config['allowed_origins'] ?? [];
    if (!$sameOrigin && $allowed && !in_array($origin, $allowed, true)) {
        respond(false, 'Origin not allowed.', 403);
    }
}

// Honeypot: real users never fill a hidden field. Silently accept so bots
// believe they succeeded, but send nothing.
if (trim((string) ($_POST['website'] ?? '')) !== '') {
    respond(true, 'Thank you for your enquiry.');
}

// Rate limit: at most max_per_hour enquiries per visitor per hour. File-based,
// so no database is needed. Behind Hostinger's CDN the visitor's address is the
// first X-Forwarded-For entry; REMOTE_ADDR would be the CDN for everyone.
$maxPerHour = (int) ($config['max_per_hour'] ?? 5);
$forwarded = trim(explode(',', (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? ''))[0]);
$visitor = $forwarded !== '' ? $forwarded : ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$bucket = sys_get_temp_dir() . '/tv_contact_' . hash('sha256', $visitor);
$now = time();
$hits = json_decode((string) @file_get_contents($bucket), true);
$hits = array_values(array_filter(is_array($hits) ? $hits : [], function ($t) use ($now) {
    return is_int($t) && $t > $now - 3600;
}));
if (count($hits) >= $maxPerHour) {
    respond(false, 'Too many enquiries from your connection. Please try again later, or email hello@thinkvistar.com directly.', 429);
}
$hits[] = $now;
@file_put_contents($bucket, json_encode($hits), LOCK_EX);

// -------------------------------------------------------------------------
// Field handling
// -------------------------------------------------------------------------

/** Friendly labels for the fields the current forms submit. */
const LABELS = [
    'clientName'      => 'Name',
    'clientCompany'   => 'Company',
    'clientEmail'     => 'Email',
    'clientPhone'     => 'Phone',
    'projectScope'    => 'Engagement Scope',
    'projectType'     => 'Project Scope',
    'projectTimeline' => 'Target Timeline',
    'projectBudget'   => 'Target Timeline',
    'projectOverview' => 'Message',
    'projectDetails'  => 'Message',
];

/** Fields that are internal plumbing rather than enquiry content. */
const SKIP_FIELDS = ['website', 'access_key', 'subject', 'from_name', 'replyto'];

/** Turn an unmapped field name into a readable label: projectScope -> Project Scope */
function labelFor($name)
{
    // array_key_exists, not isset: isset() cannot take a constant dereference
    if (array_key_exists($name, LABELS)) {
        return LABELS[$name];
    }
    $spaced = preg_replace('/(?<!^)[A-Z]/', ' $0', str_replace(['_', '-'], ' ', $name));
    return ucwords(trim(preg_replace('/\s+/', ' ', $spaced)));
}

/**
 * Strip control characters, tags and header-injection attempts, then trim.
 * Values are escaped again at render time, so this is defence in depth.
 */
function cleanValue($value)
{
    if (is_array($value)) {
        $value = implode(', ', array_map('cleanValue', $value));
    }
    $value = (string) $value;
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    $value = strip_tags($value);
    // Remove control characters except newline and tab
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value);
    return trim($value);
}

/** A single-line header value must never contain newlines. */
function cleanHeader($value)
{
    return trim(preg_replace('/[\r\n]+/', ' ', cleanValue($value)));
}

// Collect every submitted field, in the order the form sent them
$rows = [];
$submittedEmail = '';
$submittedName = '';

foreach ($_POST as $field => $rawValue) {
    if (in_array($field, SKIP_FIELDS, true) || strpos($field, '_') === 0) {
        continue;
    }

    $value = cleanValue($rawValue);
    if ($value === '') {
        continue;
    }

    if ($submittedEmail === '' && filter_var($value, FILTER_VALIDATE_EMAIL)) {
        $submittedEmail = $value;
    }
    if ($submittedName === '' && in_array($field, ['clientName', 'name', 'fullName'], true)) {
        $submittedName = $value;
    }

    $rows[labelFor($field)] = $value;
}

// -------------------------------------------------------------------------
// Validation
// -------------------------------------------------------------------------
if (!$rows) {
    respond(false, 'No form data was received.', 422);
}

if ($submittedEmail === '') {
    respond(false, 'Please provide a valid email address.', 422);
}

$totalLength = function_exists('mb_strlen')
    ? mb_strlen(implode('', $rows), 'UTF-8')
    : strlen(implode('', $rows));

if ($totalLength > 8000) {
    respond(false, 'Your submission is too long. Please shorten your message.', 422);
}

// Context rows appended after the user's own fields
$rows['Submitted On'] = date('d M Y, h:i A T');
$rows['Submitted From'] = cleanHeader($_POST['_source'] ?? ($_SERVER['HTTP_REFERER'] ?? 'Website'));

// -------------------------------------------------------------------------
// Build the email
// -------------------------------------------------------------------------

/** Fields whose value is prose and should keep its line breaks. */
function isLongForm($label)
{
    return in_array($label, ['Message', 'Project Brief', 'Project Overview', 'Comments'], true);
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
$subject = ($submittedName !== '') ? $baseSubject . ' from ' . cleanHeader($submittedName) : $baseSubject;
$htmlBody = buildHtmlBody($rows, $subject);
$textBody = buildTextBody($rows);

$replyToEmail = $submittedEmail;
$replyToName  = $submittedName !== '' ? cleanHeader($submittedName) : $submittedEmail;

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

try {
    $sent = ($config['transport'] ?? 'mail') === 'smtp'
        ? sendViaSmtp($config, $subject, $htmlBody, $textBody, $replyToEmail, $replyToName)
        : sendViaMail($config, $subject, $htmlBody, $textBody, $replyToEmail, $replyToName);

    if (!$sent) {
        throw new RuntimeException('The mail server rejected the message.');
    }

    respond(true, 'Thank you for your enquiry. We will respond within one business day.');
} catch (Throwable $e) {
    // Log the detail for the site owner, return a generic message to the visitor
    error_log('[contact-form] ' . $e->getMessage());
    respond(false, 'We could not send your enquiry right now. Please email hello@thinkvistar.com directly.', 500);
}
