<?php
// api/chat.php
require_once __DIR__ . "/../config/bootstrap.php";

$config = require __DIR__ . '/../config/apikey.php';


if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail("Method not allowed", 405);

$user = requirePermission($pdo, 'send_message');
$body = input();

$sessionId = $body['session_id'] ?? null;
$message   = trim($body['message'] ?? '');

if (!$sessionId || !$message) fail("session_id and message are required.");

// ─── Ownership check ───
$stmt = $pdo->prepare("SELECT * FROM sessions WHERE id = ?");
$stmt->execute([$sessionId]);
$session = $stmt->fetch();
if (!$session) fail("Session not found.", 404);
if ($session['user_id'] != $user['id'] && !can($user, 'view_all_sessions')) {
    fail("Forbidden: not your session.", 403);
}

// ─── Get the counselor's persona / system prompt ───
$stmt = $pdo->prepare("SELECT * FROM counselors WHERE id = ?");
$stmt->execute([$session['counselor_id']]);
$counselor = $stmt->fetch();
if (!$counselor) fail("Counselor not found.", 404);

// ─── Save the user's message ───
$stmt = $pdo->prepare("INSERT INTO messages (session_id, role, content) VALUES (?, 'user', ?)");
$stmt->execute([$sessionId, $message]);

// ─── Build full conversation history for context ───
$stmt = $pdo->prepare("SELECT role, content FROM messages WHERE session_id = ? ORDER BY id ASC");
$stmt->execute([$sessionId]);
$history = $stmt->fetchAll();

$apiMessages = array_map(fn($m) => ["role" => $m['role'], "content" => $m['content']], $history);

// ─── Call Claude API (key lives only here, server-side)
$ANTHROPIC_API_KEY =  $config['ANTHROPIC_API_KEY']; // set this in your environment, never hardcode it

$payload = json_encode([
    "model"      => " claude-sonnet-4-6",
    "max_tokens" => 1000,
    "system"     => $counselor['system_prompt'],
    "messages"   => $apiMessages,
]);

$ch = curl_init("https://api.anthropic.com/v1/messages");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_SSLVERSION     => CURL_SSLVERSION_TLSv1_2,
    CURLOPT_SSL_VERIFYPEER => false,    // ← TEMPORARY DIAGNOSTIC ONLY
    CURLOPT_SSL_VERIFYHOST => false, 
    CURLOPT_HTTPHEADER     => [
        "Content-Type: application/json",
        "x-api-key: $ANTHROPIC_API_KEY",
        "anthropic-version: 2023-06-01",
    ],
    CURLOPT_TIMEOUT => 30,
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// ── TEMPORARY DEBUG — remove after fixing ──
error_log("ANTHROPIC DEBUG: httpCode=$httpCode | curlError=$curlError | key_loaded=" . ($ANTHROPIC_API_KEY ? 'yes' : 'NO - KEY MISSING') . " | response=" . substr($response, 0, 300));

if (!$response || $httpCode >= 400) {
    error_log("Response: " . substr($response, 0, 1000));
    $reply = "I'm having trouble connecting right now. Please try again in a moment.";
} else {
    $data  = json_decode($response, true);
    $reply = $data['content'][0]['text'] ?? "I'm sorry, I couldn't generate a response.";
}

// ─── Save assistant's reply ───
$stmt = $pdo->prepare("INSERT INTO messages (session_id, role, content) VALUES (?, 'assistant', ?)");
$stmt->execute([$sessionId, $reply]);

respond(["reply" => $reply]);
