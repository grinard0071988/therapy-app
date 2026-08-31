const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    background: #0F0D0B;
    font-family: 'DM Sans', sans-serif;
    color: #E8E0D5;
    -webkit-font-smoothing: antialiased;
  }

  input, textarea, button {
    font-family: 'DM Sans', sans-serif;
  }

  textarea { resize: none; }

  ::-webkit-scrollbar         { width: 4px; }
  ::-webkit-scrollbar-track   { background: transparent; }
  ::-webkit-scrollbar-thumb   { background: rgba(255,255,255,0.12); border-radius: 2px; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60% { transform: translateX(-6px); }
    40%,80% { transform: translateX(6px); }
  }
  @keyframes bounce {
    0%,100% { transform: translateY(0);  opacity: .5; }
    50%      { transform: translateY(-7px); opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%,100% { opacity: 1; }
    50%     { opacity: .3; }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(10px); }
    to   { opacity: 1; transform: translateX(0); }
  }
`;

export default GLOBAL_STYLES;
