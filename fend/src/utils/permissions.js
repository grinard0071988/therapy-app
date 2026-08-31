// Role-Based Access Control
// Mirrors the PHP PERMISSIONS array in config/bootstrap.php exactly.
// The server re-checks every permission independently — this is only for
// showing/hiding UI elements, not as a security guarantee.

export const PERMISSIONS = {
  user: [
    "view_counselors",
    "start_session",
    "send_message",
    "view_own_sessions",
  ],
  admin: [
    "view_counselors",
    "start_session",
    "send_message",
    "view_own_sessions",
    "view_all_sessions",
    "manage_users",
  ],
};

/**
 * Check whether a user has a given permission.
 * @param {object|null} user  - the current user object (or null if logged out)
 * @param {string}      action - one of the permission strings above
 * @returns {boolean}
 */
export function can(user, action) {
  if (!user) return false;
  return (PERMISSIONS[user.role] ?? []).includes(action);
}
