<?php
// api/logout.php
require_once __DIR__ . "/../config/bootstrap.php";

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail("Method not allowed", 405);

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
if (preg_match('/Bearer\s+(\S+)/', $authHeader, $m)) {
    $stmt = $pdo->prepare("DELETE FROM auth_tokens WHERE token = ?");
    $stmt->execute([$m[1]]);
}

respond(["message" => "Logged out."]);
