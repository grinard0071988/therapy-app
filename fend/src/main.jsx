import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import GLOBAL_STYLES from "./styles/globals.js";

// ── Inject global styles once ──────────────────────────────────────────────
const styleEl = document.createElement("style");
styleEl.textContent = GLOBAL_STYLES;
document.head.appendChild(styleEl);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
