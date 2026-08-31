<?php
// config/bootstrap.php
// Included at the top of every API file. Handles CORS, JSON headers, and auth helper.

header("Access-Control-Allow-Origin: *");   // tighten to your React app's domain in production
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle CORS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/db.php";

function input() {
    $data = json_decode(file_get_contents("php://input"), true);
    return $data ?: [];
}

function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function fail($message, $code = 400) {
    respond(["error" => $message], $code);
}

// ─── Authorization: extract Bearer token & resolve the user ───
function currentUser(PDO $pdo) {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (!preg_match('/Bearer\s+(\S+)/', $authHeader, $m)) return null;
    $token = $m[1];

    $stmt = $pdo->prepare("
        SELECT u.* FROM auth_tokens t
        JOIN users u ON u.id = t.user_id
        WHERE t.token = ? AND t.expires_at > NOW() AND u.status = 'active'
    ");
    $stmt->execute([$token]);
    $user = $stmt->fetch();
    return $user ?: null;
}

// ─── Authorization guard: require login ───
function requireAuth(PDO $pdo) {
    $user = currentUser($pdo);
    if (!$user) fail("Unauthorized: please log in.", 401);
    return $user;
}

// ─── Authorization guard: require a specific permission ───
const PERMISSIONS = [
    'user'  => ['view_counselors', 'start_session', 'send_message', 'view_own_sessions'],
    'admin' => ['view_counselors', 'start_session', 'send_message', 'view_own_sessions', 'view_all_sessions', 'manage_users'],
];

function can($user, $action) {
    $role = $user['role'] ?? null;
    return $role && in_array($action, PERMISSIONS[$role] ?? []);
}

function requirePermission(PDO $pdo, $action) {
    $user = requireAuth($pdo);
    if (!can($user, $action)) fail("Forbidden: you don't have permission to do this.", 403);
    return $user;
}
