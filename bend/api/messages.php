<?php
// api/messages.php
// GET /api/messages.php?session_id=5
require_once __DIR__ . "/../config/bootstrap.php";

if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail("Method not allowed", 405);

$user = requireAuth($pdo);
$sessionId = $_GET['session_id'] ?? null;
if (!$sessionId) fail("session_id is required.");

$stmt = $pdo->prepare("SELECT * FROM sessions WHERE id = ?");
$stmt->execute([$sessionId]);
$session = $stmt->fetch();
if (!$session) fail("Session not found.", 404);
if ($session['user_id'] != $user['id'] && !can($user, 'view_all_sessions')) {
    fail("Forbidden: not your session.", 403);
}

$stmt = $pdo->prepare("SELECT role, content, created_at FROM messages WHERE session_id = ? ORDER BY id ASC");
$stmt->execute([$sessionId]);

respond(["messages" => $stmt->fetchAll()]);
