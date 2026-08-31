<?php
// api/register.php
require_once __DIR__ . "/../config/bootstrap.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail("Method not allowed", 405);

$body = input();
$name     = trim($body['name'] ?? '');
$email    = strtolower(trim($body['email'] ?? ''));
$password = $body['password'] ?? '';

if (!$name || !$email || !$password) fail("All fields are required.");
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail("Invalid email address.");
if (strlen($password) < 6) fail("Password must be at least 6 characters.");

// Check for duplicate
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) fail("An account with this email already exists.");

// Build initials avatar, e.g. "Alex Morgan" -> "AM"
$parts = preg_split('/\s+/', $name);
$initials = strtoupper(substr($parts[0], 0, 1) . substr($parts[count($parts) - 1] ?? '', 0, 1));

$hash = password_hash($password, PASSWORD_BCRYPT);

$stmt = $pdo->prepare("
    INSERT INTO users (name, email, password_hash, avatar, role, joined_at)
    VALUES (?, ?, ?, ?, 'user', CURDATE())
");
$stmt->execute([$name, $email, $hash, $initials]);

respond(["message" => "Account created successfully. Please log in."], 201);
