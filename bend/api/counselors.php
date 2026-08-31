<?php
// api/counselors.php
require_once __DIR__ . "/../config/bootstrap.php";

$user = requirePermission($pdo, 'view_counselors');

$counselors = $pdo->query("SELECT * FROM counselors ORDER BY id")->fetchAll();

foreach ($counselors as &$c) {
    $stmt = $pdo->prepare("SELECT specialty FROM counselor_specialties WHERE counselor_id = ?");
    $stmt->execute([$c['id']]);
    $c['specialties'] = array_column($stmt->fetchAll(), 'specialty');
    // Don't leak the system prompt to the frontend's network tab unless you want it server-side only
    // (kept here for use by chat.php, removed below)
    unset($c['system_prompt']);
}

respond(["counselors" => $counselors]);
