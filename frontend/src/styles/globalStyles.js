export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0; 
  }

 :root{
  --bg:#070D1A;
  --surface:rgba(15,23,42,0.94);
  --surface2:rgba(18,28,49,0.96);
  --surface-alt:#111827;

  --border:rgba(148,163,184,0.18);
  --border2:rgba(148,163,184,0.24);

  --text:#E5E7EB;
  --text-secondary:#CBD5E1;
  --muted:#94A3B8;

  --accent:#60A5FA;
  --accent2:#818CF8;
  --accent3:#38BDF8;

  --green:#34D399;
  --amber:#FBBF24;
  --orange:#F97316;
  --red:#F87171;
  --cyan:#22D3EE;

  --shadow:0 24px 80px rgba(0,0,0,0.35);
  --font:'Outfit',sans-serif;
}

  html, body, #root { 
    min-height: 100%; 
  }
 body {
  font-family: var(--font);
  color: var(--text);
  line-height: 1.55;
  background: radial-gradient(circle at 22% 18%, rgba(96,165,250,0.14), transparent 26%),
              radial-gradient(circle at 78% 8%, rgba(56,189,248,0.12), transparent 26%),
              radial-gradient(circle at 50% 100%, rgba(244,114,182,0.08), transparent 28%),
              var(--bg);
  min-height: 100vh;
}

  ::selection {
    background: rgba(96,165,250,0.3);
    color: var(--text);
  }

  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.16);
    border-radius: 99px;
  }

  input, select, textarea {
    font-family: var(--font);
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border2);
    border-radius: 14px;
    color: var(--text);
    padding: 12px 14px;
    font-size: 14px;
    outline: none;
    width: 100%;
    transition: border-color .2s ease, box-shadow .2s ease, background .2s ease;
  }

  button, input, select, textarea {
    line-height: 1.4;
  }

  input::placeholder,
  textarea::placeholder {
    color: rgba(255,255,255,0.6);
  }

  input:focus, select:focus, textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(96,165,250,0.16);
  }

  select {
    cursor: pointer;
    -webkit-appearance: none;
  }

  select option { background: #111827; }

  button {
    font-family: var(--font);
    cursor: pointer;
    border: none;
    outline: none;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
  }

  input, select, textarea {
    font-family: var(--font);
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border2);
    border-radius: 10px;
    color: var(--text);
    padding: 11px 14px;
    font-size: 14px;
    outline: none;
    width: 100%;
    transition: border-color .2s, box-shadow .2s;
  }

  input::placeholder { color: rgba(255,255,255,0.65); }

  input:focus, select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(79,158,255,0.12);
  }

  input::placeholder { color: var(--muted); }

  select {
    cursor: pointer;
    -webkit-appearance: none;
  }

  select option { background: #1a1d27; }

  button {
    font-family: var(--font);
    cursor: pointer;
    border: none;
    outline: none;
  }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to { opacity:1; transform:translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity:0; }
    to { opacity:1; }
  }

  @keyframes fadeDown {
    from { opacity:0; transform: translateY(-20px); }
    to { opacity:1; transform: translateY(0); }
  }

  @keyframes scaleIn {
    from { opacity:0; transform:scale(0.95); }
    to { opacity:1; transform:scale(1); }
  }

  .aFadeDown { animation: fadeDown .4s cubic-bezier(.22,1,.36,1) both; }

  @keyframes slideL {
    from { opacity:0; transform:translateX(30px); }
    to { opacity:1; transform:translateX(0); }
  }

  @keyframes slideR {
    from { opacity:0; transform:translateX(-30px); }
    to { opacity:1; transform:translateX(0); }
  }

  @keyframes shimmer {
    0% { background-position:-200% center; }
    100% { background-position:200% center; }
  }

  @keyframes spin {
    from { transform:rotate(0deg); }
    to { transform:rotate(360deg); }
  }

  @keyframes float {
    0%,100% { transform:translateY(0); }
    50% { transform:translateY(-10px); }
  }

  @keyframes blob {
    0%,100% { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; }
    50% { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; }
  }

  @keyframes ring {
    0% { transform:scale(1); opacity:.5; }
    100% { transform:scale(1.7); opacity:0; }
  }

  @keyframes toast-in {
    from { transform:translateX(120%); opacity:0; }
    to { transform:translateX(0); opacity:1; }
  }

  @keyframes shake {
    0%,100% { transform: translateX(0); }
    15%,45%,75% { transform: translateX(-8px); }
    30%,60%,90% { transform: translateX(8px); }
  }

  @keyframes pulse {
    0%,100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }

  .aFadeUp { animation: fadeUp .5s cubic-bezier(.22,1,.36,1) both; }
  .aFadeIn { animation: fadeIn .4s ease both; }
  .aScaleIn { animation: scaleIn .4s cubic-bezier(.22,1,.36,1) both; }
  .aSlideL { animation: slideL .4s cubic-bezier(.22,1,.36,1) both; }
  .aSlideR { animation: slideR .4s cubic-bezier(.22,1,.36,1) both; }
  .aShake { animation: shake .45s ease both; }
  .aPulse { animation: pulse 2.4s ease-in-out infinite; }

  .shimmer {
    display: inline-block;
    color: transparent;
    background: linear-gradient(90deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.25) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    background-size: 200% auto;
    animation: shimmer 2.2s linear infinite;
  }

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(10px);
    opacity: .22;
    animation: blob 8s ease-in-out infinite;
  }

  .empty img {
    display: block;
    width: 100%;
    max-width: 280px;
    margin: 0 auto 18px;
    border-radius: 22px;
    box-shadow: 0 28px 70px rgba(0, 0, 0, 0.25);
    object-fit: cover;
  }

  .d1 { animation-delay:.07s; }
  .d2 { animation-delay:.14s; }
  .d3 { animation-delay:.21s; }
  .d4 { animation-delay:.28s; }
  .d5 { animation-delay:.35s; }

  .btn-primary {
  background: linear-gradient(135deg, var(--accent), var(--accent2), var(--accent3));
  background-size: 200% 200%;
  animation: gradientMove 4s ease infinite;

  color: white;
  font-weight: 700;
  padding: 13px 28px;
  border-radius: 12px;

  box-shadow: 0 0 20px rgba(129,140,248,0.4);
  transition: all .2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 0 35px rgba(129,140,248,0.7);
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

  .btn-ghost {
    background:transparent;
    color:var(--muted);
    font-size:13px;
    padding:8px 16px;
    border-radius:8px;
    border:1px solid var(--border);
  }

  .tab-btn {
    flex: 1;
    border: 0;
    border-bottom: 2px solid transparent;
    background: transparent;
    color: var(--muted);
    padding: 12px 14px;
    font-size: 13px;
    font-weight: 700;
    transition: all 0.2s ease;
    min-width: 110px;
    text-align: center;
  }

  .tab-btn.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
    background: rgba(79,158,255,.12);
  }

  .tab-btn:hover {
    color: var(--accent);
    background: rgba(79,158,255,.08);
  }

  .card {
  background: var(--surface);
  backdrop-filter: blur(18px);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 24px;
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
  box-shadow: var(--shadow);
  color: var(--text);
}

.card:hover {
  transform: translateY(-4px);
  border-color: rgba(96,165,250,0.35);
  box-shadow: 0 22px 60px rgba(0,0,0,0.45);
}

.hero-panel {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 22px;
  align-items: flex-start;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(96,165,250,0.12);
  color: var(--accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.8px;
}

.month-pill {
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: var(--muted);
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 700;
  transition: all .2s ease;
}

.month-pill.active {
  background: rgba(96,165,250,0.18);
  color: var(--accent);
  box-shadow: 0 10px 30px rgba(96,165,250,0.16);
  border-color: rgba(96,165,250,0.28);
}

.month-pill:hover {
  background: rgba(96,165,250,0.12);
}

.g2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.g3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.g4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }

@media (max-width: 980px) {
  .g2, .g3, .g4 { grid-template-columns: 1fr; }
}

.insight-card {
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 18px;
    padding: 18px 20px;
    transition: transform .2s ease, box-shadow .2s ease;
}

.insight-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 28px rgba(0,0,0,.24);
}

  .toast {
    animation: fadeIn .25s ease-out, shake .35s ease .2s;
    transform-origin: center;
    font-weight: 700;
    box-shadow: 0 8px 26px rgba(0,0,0,.38);
  }

  .empty {
    border: 1px dashed rgba(255,255,255,.18);
    border-radius: 18px;
    padding: 32px;
    text-align: center;
    color: var(--muted);
    background: rgba(255,255,255,.03);
    animation: fadeIn .5s ease both;
  }

  .empty h3 {
    margin-top: 12px;
    color: var(--text);
    font-size: 18px;
    font-weight: 800;
  }

  .empty p {
    margin: 10px auto 16px;
    max-width: 320px;
    line-height: 1.5;
    color: var(--muted);
  }

  .empty button {
    background: linear-gradient(135deg,var(--accent),var(--accent2));
    color: white;
    border: none;
    border-radius: 10px;
    padding: 9px 16px;
    font-weight: 700;
    box-shadow: 0 8px 20px rgba(79,158,255,.25);
    cursor: pointer;
    transform: translateY(0);
    transition: transform .2s ease, box-shadow .2s ease;
  }

  .empty button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(79,158,255,.35);
  }

  .badge {
    border: 1px solid rgba(255,255,255,.15);
    box-shadow: 0 4px 14px rgba(0,0,0,.25);
    backdrop-filter: blur(3px);
    transition: transform .2s ease, box-shadow .2s ease;
  }

  .badge:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(0,0,0,.35);
  }

  .prog-bar {
    height: 8px;
    border-radius: 999px;
    background: rgba(255,255,255,.08);
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.12);
  }

  .prog-fill {
    height: 100%;
    width: 0;
    transition: width .9s ease-out;
    border-radius: 999px;
  }

  .progress-animate {
    animation: widthGrow .8s ease-out forwards;
  }

  @keyframes widthGrow {
    from { width: 0; }
    to { width: 100%; }
  }

  .input-lbl {
    font-size:11px;
    font-weight:600;
    color:var(--muted);
    text-transform:uppercase;
    letter-spacing:1px;
    display:block;
    margin-bottom:6px;
  }

  nav {
  background: rgba(10,12,20,0.7);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(129,140,248,0.2);
}


`;