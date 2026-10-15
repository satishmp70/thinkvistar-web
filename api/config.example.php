<?php
/**
 * =========================================================================
 * CONTACT FORM CONFIGURATION (TEMPLATE)
 * =========================================================================
 * Loads configuration from environment variables (.env file) with fallbacks.
 *
 * Supported .env locations:
 *   1) api/.env
 *   2) Project root (.env)
 *
 * Copy .env.example to .env and configure your real credentials.
 */

// Block direct browser access; this file is only ever included by contact.php
if (!defined('VS_CONTACT_HANDLER')) {
    http_response_code(403);
    exit('Forbidden');
}

// -------------------------------------------------------------------------
// Lightweight .env loader (Zero external dependencies)
// -------------------------------------------------------------------------
if (!function_exists('loadEnvFile')) {
    function loadEnvFile(string $path): bool
    {
        if (!is_file($path) || !is_readable($path)) {
            return false;
        }

        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) {
            return false;
        }

        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) {
                continue;
            }

            if (str_starts_with($line, 'export ')) {
                $line = trim(substr($line, 7));
            }

            $parts = explode('=', $line, 2);
            if (count($parts) !== 2) {
                continue;
            }

            $key = trim($parts[0]);
            $val = trim($parts[1]);

            if (
                (str_starts_with($val, '"') && str_ends_with($val, '"')) ||
                (str_starts_with($val, "'") && str_ends_with($val, "'"))
            ) {
                $val = substr($val, 1, -1);
            }

            if (getenv($key) === false) {
                putenv("{$key}={$val}");
            }
            if (!isset($_ENV[$key])) {
                $_ENV[$key] = $val;
            }
            if (!isset($_SERVER[$key])) {
                $_SERVER[$key] = $val;
            }
        }

        return true;
    }
}

// Search for .env in 3 locations:
// 1) Outside public_html (Hostinger home directory - Most Secure!)
// 2) Project root / public_html/.env
// 3) api/.env
$envCandidates = [
    dirname(__DIR__, 2) . '/.env', // Outside public_html: /home/uXXXX/.env
    dirname(__DIR__) . '/.env',    // Inside public_html: /home/uXXXX/public_html/.env
    __DIR__ . '/.env',             // Inside api folder:  /home/uXXXX/public_html/api/.env
];

foreach ($envCandidates as $envFile) {
    if (is_file($envFile)) {
        loadEnvFile($envFile);
        break;
    }
}

// Helper to read environment variables with fallback
$getEnv = function (string $key, mixed $default = null): mixed {
    $val = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);
    if ($val === false || $val === null || $val === '') {
        return $default;
    }
    return $val;
};

$allowedOrigins = [
    'https://thinkvistar.com',
    'https://www.thinkvistar.com',
];
if ($customOrigins = $getEnv('ALLOWED_ORIGINS')) {
    $allowedOrigins = array_values(array_filter(array_map('trim', explode(',', $customOrigins))));
}

return [
    'recipient'       => $getEnv('MAIL_RECIPIENT', 'hello@thinkvistar.com'),
    'recipient_name'  => $getEnv('MAIL_RECIPIENT_NAME', 'Thinkvistar LLP'),
    'subject'         => $getEnv('MAIL_SUBJECT', 'New Contact Form Enquiry'),
    'timezone'        => $getEnv('MAIL_TIMEZONE', 'Asia/Kolkata'),
    'max_per_hour'    => (int) $getEnv('MAIL_MAX_PER_HOUR', 5),
    'allowed_origins' => $allowedOrigins,
    'transport'       => $getEnv('MAIL_TRANSPORT', 'smtp'),
    'from_email'      => $getEnv('MAIL_FROM_EMAIL', 'hello@vistarsolution.com'),
    'from_name'       => $getEnv('MAIL_FROM_NAME', 'Thinkvistar Website'),
    'smtp' => [
        'host'       => $getEnv('SMTP_HOST', 'smtp.hostinger.com'),
        'port'       => (int) $getEnv('SMTP_PORT', 465),
        'encryption' => $getEnv('SMTP_ENCRYPTION', 'ssl'),
        'username'   => $getEnv('SMTP_USERNAME', 'hello@vistarsolution.com'),
        'password'   => $getEnv('SMTP_PASSWORD', ''),
    ],
];
