<?php
// api/me.php
// Used on app load to check if the saved token is still valid (session restore)
require_once __DIR__ . "/../config/bootstrap.php";

$user = currentUser($pdo);
if (!$user) fail("Not authenticated.", 401);

unset($user['password_hash']);
respond(["user" => $user]);
