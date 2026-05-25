// app.js - Shared config for all pages
// ⚠️ AFTER DEPLOYING BACKEND TO RENDER, REPLACE THE URL BELOW
// Example: const API = "https://your-app-name.onrender.com"

const API = "https://YOUR-RENDER-APP-NAME.onrender.com";

// ─── Helper: get logged in user from localStorage ─────────────────────────────
function getUser() {
  const u = localStorage.getItem('user');
  return u ? JSON.parse(u) : null;
}

// ─── Helper: save user to localStorage ────────────────────────────────────────
function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

// ─── Helper: logout ───────────────────────────────────────────────────────────
function logout() {
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// ─── Helper: show a toast/alert message ──────────────────────────────────────
function showMsg(id, text, type = 'danger') {
  const el = document.getElementById(id);
  if (el) {
    el.className = `alert alert-${type}`;
    el.textContent = text;
    el.style.display = 'block';
    setTimeout(() => el.style.display = 'none', 4000);
  }
}

// ─── Helper: format date nicely ───────────────────────────────────────────────
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}
