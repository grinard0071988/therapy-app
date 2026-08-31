import { useState, useEffect, useCallback } from "react";
import { AuthAPI } from "../api/api.js";

const TOKEN_KEY = "solace_token";

/**
 * useAuth
 * Manages authentication state throughout the app.
 * Persists the token in sessionStorage so a page refresh keeps the user logged in.
 *
 * Returns: { user, token, loading, login, logout }
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // true while restoring session on mount

  // Restore session on first render
  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (!saved) {
      setLoading(false);
      return;
    }

    AuthAPI.me(saved)
      .then(({ user }) => {
        setToken(saved);
        setUser(user);
      })
      .catch(() => sessionStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  // login: called by LoginScreen or RegisterScreen after a successful API call
  const login = useCallback((tok, usr) => {
    sessionStorage.setItem(TOKEN_KEY, tok);
    setToken(tok);
    setUser(usr);
  }, []);

  // logout: invalidates the server token, then clears local state
  const logout = useCallback(async () => {
    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (saved) {
      try {
        await AuthAPI.logout(saved);
      } catch {
        /* server already cleared it */
      }
      sessionStorage.removeItem(TOKEN_KEY);
    }
    setToken(null);
    setUser(null);
  }, []);

  return { user, token, loading, login, logout };
}
