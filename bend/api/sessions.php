<?php
// api/sessions.php
require_once __DIR__ . "/../config/bootstrap.php";

$method = $_SERVER['REQUEST_METHOD'];

// ─── GET: list sessions ───
if ($method === 'GET') {
    $user = requirePermission($pdo, 'view_own_sessions');

    if (can($user, 'view_all_sessions')) {
        // Admins see everyone's sessions
        $stmt = $pdo->query("
            SELECT s.*, u.name AS user_name, c.name AS counselor_name, c.avatar AS counselor_avatar, c.color AS counselor_color
            FROM sessions s
            JOIN users u ON u.id = s.user_id
            JOIN counselors c ON c.id = s.counselor_id
            ORDER BY s.started_at DESC
        ");
    } else {
        $stmt = $pdo->prepare("
            SELECT s.*, c.name AS counselor_name, c.avatar AS counselor_avatar, c.color AS counselor_color
            FROM sessions s
            JOIN counselors c ON c.id = s.counselor_id
            WHERE s.user_id = ?
            ORDER BY s.started_at DESC
        ");
        $stmt->execute([$user['id']]);
    }
    respond(["sessions" => $stmt->fetchAll()]);
}

// ─── POST: start a new session ───
if ($method === 'POST') {
    $user = requirePermission($pdo, 'start_session');
    $body = input();
    $counselorId = $body['counselor_id'] ?? null;
    if (!$counselorId) fail("counselor_id is required.");

    $check = $pdo->prepare("SELECT id FROM counselors WHERE id = ?");
    $check->execute([$counselorId]);
    if (!$check->fetch()) fail("Counselor not found.", 404);

    $stmt = $pdo->prepare("INSERT INTO sessions (user_id, counselor_id, status) VALUES (?, ?, 'active')");
    $stmt->execute([$user['id'], $counselorId]);
    $sessionId = $pdo->lastInsertId();

    respond(["session" => ["id" => (int)$sessionId, "user_id" => $user['id'], "counselor_id" => (int)$counselorId, "status" => "active"]], 201);
}

// ─── PUT: end a session ───
if ($method === 'PUT') {
    $user = requireAuth($pdo);
    $body = input();
    $sessionId = $body['session_id'] ?? null;
    $topic = $body['topic'] ?? null;
    if (!$sessionId) fail("session_id is required.");

    // Ownership check: users can only end their own sessions (admins can end any)
    $stmt = $pdo->prepare("SELECT * FROM sessions WHERE id = ?");
    $stmt->execute([$sessionId]);
    $session = $stmt->fetch();
    if (!$session) fail("Session not found.", 404);
    if ($session['user_id'] != $user['id'] && !can($user, 'view_all_sessions')) {
        fail("Forbidden: not your session.", 403);
    }

    $stmt = $pdo->prepare("UPDATE sessions SET status = 'completed', ended_at = NOW(), topic = ? WHERE id = ?");
    $stmt->execute([$topic, $sessionId]);

    respond(["message" => "Session ended."]);
}

fail("Method not allowed", 405);
