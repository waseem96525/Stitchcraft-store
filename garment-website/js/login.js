/* Single shared login page for shoppers AND admins (login.html).
   - Shopper tab  -> Supabase login -> back to store (index.html).
   - Admin tab    -> Supabase login + is_admin check -> admin dashboard.
   Signup still lives in the store's account popup; new shoppers are
   sent back there from the "Create an account" link. */

function loginReturnTarget() {
  try {
    const r = new URLSearchParams(window.location.search).get('return');
    return r === 'admin' ? 'admin.html' : 'index.html';
  } catch (e) { return 'index.html'; }
}

document.addEventListener('DOMContentLoaded', () => {
  const note = document.getElementById('loginCloudNote');
  if (!cloudEnabled()) {
    if (note) note.textContent = 'Online login is not connected yet — open the store as a guest, or ask the owner to paste the Supabase keys.';
    return;
  }
  if (note) note.textContent = 'Your account works on every device.';
  // already logged in? route by role, no need to log in again
  getSessionUser().then(async (u) => {
    if (!u) {
      try {
        const r = new URLSearchParams(window.location.search).get('return');
        if (r === 'admin') switchLoginTab('admin');
      } catch (e) {}
      return;
    }
    if (await isAdminUser()) window.location.href = 'admin.html';
    else window.location.href = loginReturnTarget();
  });
});

function switchLoginTab(which) {
  const user = which === 'user';
  document.getElementById('tabUser').classList.toggle('active', user);
  document.getElementById('tabAdmin').classList.toggle('active', !user);
  document.getElementById('userPane').style.display = user ? 'block' : 'none';
  document.getElementById('adminPane').style.display = user ? 'none' : 'block';
}

async function doLogin(role) {
  const isUser = role === 'user';
  const email = document.getElementById(isUser ? 'luEmail' : 'laEmail').value.trim();
  const password = document.getElementById(isUser ? 'luPass' : 'laPass').value;
  const errEl = document.getElementById(isUser ? 'luErr' : 'laErr');
  errEl.textContent = '';
  if (!email || !password) { errEl.textContent = 'Enter your email and password.'; return; }
  const res = await signInWithEmail(email, password);
  if (res.error) { errEl.textContent = res.error; return; }
  if (!isUser) {
    if (!await isAdminUser()) {
      await signOutUser();
      errEl.textContent = 'This account is not an admin.';
      return;
    }
    window.location.href = 'admin.html';
    return;
  }
  window.location.href = loginReturnTarget();
}

function goSignup() {
  window.location.href = 'index.html#signup';
  return false;
}
