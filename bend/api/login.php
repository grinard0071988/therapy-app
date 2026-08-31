<?php
// api/login.php
require_once __DIR__ . "/../config/bootstrap.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail("Method not allowed", 405);

$body     = input();
$email    = strtolower(trim($body['email'] ?? ''));
$password = $body['password'] ?? '';

if (!$email || !$password) fail("Email and password are required.");

$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    fail("Incorrect email or password.", 401);
}
// password_verify($password, $user['password_hash']);
if ($user['status'] !== 'active') {
    fail("Your account has been suspended. Please contact support.", 403);
}

// Generate a secure random token (acts like a session/JWT token)
$token = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));

$stmt = $pdo->prepare("INSERT INTO auth_tokens (token, user_id, expires_at) VALUES (?, ?, ?)");
$stmt->execute([$token, $user['id'], $expiresAt]);

unset($user['password_hash']); // never send the hash back to the client

respond([
    "token" => $token,
    "user"  => $user,
]);
