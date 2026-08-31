// Base URL — change this to your live domain when deploying
const API_BASE = "/api"; // proxied to http://localhost/solace-backend/api via vite.config.js

//Core fetch wrapper
async function apiCall(endpoint, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "An unexpected error occurred.");
  return data;
}

// Auth endpoints
export const AuthAPI = {
  /**
   * Register a new user account.
   * POST /api/register.php
   */
  register: (name, email, password) =>
    apiCall("register.php", {
      method: "POST",
      body: { name, email, password },
    }),

  /**
   * Log in and receive an auth token + user object.
   * POST /api/login.php  →  { token, user }
   */
  login: (email, password) =>
    apiCall("login.php", { method: "POST", body: { email, password } }),

  /**
   * Invalidate the current token on the server.
   * POST /api/logout.php
   */
  logout: (token) => apiCall("logout.php", { method: "POST", token }),

  /**
   * Validate a saved token and return the current user.
   * GET /api/me.php  →  { user }
   */
  me: (token) => apiCall("me.php", { token }),
};

// Counselors endpoints
export const CounselorsAPI = {
  /**
   * Get all counselors with specialties.
   * GET /api/counselors.php  →  { counselors: [...] }
   */
  list: (token) => apiCall("counselors.php", { token }),
};

// Sessions endpoints
export const SessionsAPI = {
  /**
   * Get sessions for the current user (admin: all sessions).
   * GET /api/sessions.php  →  { sessions: [...] }
   */
  list: (token) => apiCall("sessions.php", { token }),

  /**
   * Start a new therapy session with a counselor.
   * POST /api/sessions.php  →  { session: { id, user_id, counselor_id, status } }
   */
  create: (token, counselorId) =>
    apiCall("sessions.php", {
      method: "POST",
      token,
      body: { counselor_id: counselorId },
    }),

  /**
   * Mark a session as completed.
   * PUT /api/sessions.php
   */
  end: (token, sessionId, topic = "") =>
    apiCall("sessions.php", {
      method: "PUT",
      token,
      body: { session_id: sessionId, topic },
    }),
};

// Chat / Messages endpoints
export const ChatAPI = {
  /**
   * Send a message. The PHP backend calls Claude and returns the AI reply.
   * POST /api/chat.php  →  { reply: "..." }
   */
  send: (token, sessionId, message) =>
    apiCall("chat.php", {
      method: "POST",
      token,
      body: { session_id: sessionId, message },
    }),

  /**
   * Fetch full message history for a session (used when resuming).
   * GET /api/messages.php?session_id=X  →  { messages: [...] }
   */
  history: (token, sessionId) =>
    apiCall(`messages.php?session_id=${sessionId}`, { token }),
};
