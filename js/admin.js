/* StitchCraft Admin Panel logic.
   Uses the catalog + stock helpers from js/app.js (DEFAULT_PRODUCTS,
   normalizeProduct, getStock, stockStatus, stockLabel, saveCatalog,
   resetCatalog, showToast). Catalog is stored in localStorage, so the
   shop (index.html) picks up every change automatically. */

const ADMIN_PASSWORD = 'admin123'; // <-- CHANGE THIS to your own password
const AUTH_KEY = 'stitchcraft_admin_auth';
const ADMIN_CATEGORIES = ['kurtas', 'sarees', 'lehengas', 'western', 'kurtis', 'menswear', 'kids', 'accessories'];
let editingId = null;
let adminSearch = '';
let adminCategory = 'all';
let cloudMode = false;

document.addEventListener('DOMContentLoaded', async () => {
  const catFilter = document.getElementById('adminCategoryFilter');
  ADMIN_CATEGORIES.forEach(c => {
    const o = document.createElement('option');
    o.value = c; o.textContent = c.charAt(0).toUpperCase() + c.slice(1);
    catFilter.appendChild(o);
  });
  const fCat = document.getElementById('fCategory');
  ADMIN_CATEGORIES.forEach(c => {
    const o = document.createElement('option');
    o.value = c; o.textContent = c.charAt(0).toUpperCase() + c.slice(1);
    fCat.appendChild(o);
  });
  await setupAdminCloud();
  if (cloudMode) {
    const u = await getSessionUser();
    if (u && await isAdminUser()) showAdmin();
    else window.location.href = 'login.html?return=admin';
  } else if (isAuthed()) showAdmin();
});

async function setupAdminCloud() {
  cloudMode = cloudEnabled();
  const emailInput = document.getElementById('adminEmail');
  if (emailInput) emailInput.style.display = cloudMode ? 'block' : 'none';
  const pushBtn = document.getElementById('pushCloudBtn');
  if (pushBtn) pushBtn.style.display = cloudMode ? '' : 'none';
  const ordersSec = document.getElementById('ordersSection');
  if (ordersSec) ordersSec.style.display = cloudMode ? 'block' : 'none';
  if (cloudMode) {
    document.querySelectorAll('.admin-hint').forEach(h => {
      h.innerHTML = '<i class="fas fa-info-circle"></i> You are editing the <strong>shared cloud catalog</strong> — changes appear for every customer. Orders from all customers appear below.';
    });
  }
}

function isAuthed() {
  try { return sessionStorage.getItem(AUTH_KEY) === '1'; } catch (e) { return false; }
}

async function adminLogin(e) {
  if (e) e.preventDefault();
  if (cloudMode) {
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const errEl = document.getElementById('loginError');
    if (!email || !password) { errEl.textContent = 'Enter your admin email and password.'; return false; }
    const res = await signInWithEmail(email, password);
    if (res.error) { errEl.textContent = res.error; return false; }
    if (!await isAdminUser()) {
      await signOutUser();
      errEl.textContent = 'This account is not an admin. Ask an admin to promote it.';
      return false;
    }
    document.getElementById('adminPassword').value = '';
    errEl.textContent = '';
    showAdmin();
    return false;
  }
  const val = document.getElementById('adminPassword').value;
  if (val === ADMIN_PASSWORD) {
    try { sessionStorage.setItem(AUTH_KEY, '1'); } catch (err) {}
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginError').textContent = '';
    showAdmin();
  } else {
    document.getElementById('loginError').textContent = 'Wrong password. Try again.';
  }
  return false;
}

async function adminLogout() {
  if (cloudMode) { try { await signOutUser(); } catch (e) {} }
  try { sessionStorage.removeItem(AUTH_KEY); } catch (e) {}
  document.getElementById('adminView').style.display = 'none';
  document.getElementById('loginView').style.display = 'flex';
}

async function showAdmin() {
  document.getElementById('loginView').style.display = 'none';
  document.getElementById('adminView').style.display = 'block';
  try { await syncCloudCatalog(); } catch (e) {}
  renderAdmin();
  if (cloudMode) renderAdminOrders();
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function filteredAdminProducts() {
  const q = adminSearch.toLowerCase().trim();
  return products.filter(p => {
    if (adminCategory !== 'all' && p.category !== adminCategory) return false;
    if (!q) return true;
    return (p.name + ' ' + (p.brand || '') + ' ' + p.category).toLowerCase().includes(q);
  });
}

function renderAdmin() {
  const totalUnits = products.reduce((s, p) => s + getStock(p), 0);
  const lowCount = products.filter(p => stockStatus(p) === 'low').length;
  const outCount = products.filter(p => stockStatus(p) === 'out').length;
  document.getElementById('statGrid').innerHTML = `
    <div class="stat-card"><div class="stat-num">${products.length}</div><div class="stat-label">Products</div></div>
    <div class="stat-card"><div class="stat-num">${totalUnits.toLocaleString()}</div><div class="stat-label">Total units in stock</div></div>
    <div class="stat-card warn"><div class="stat-num">${lowCount}</div><div class="stat-label">Low stock (≤ ${LOW_STOCK_THRESHOLD})</div></div>
    <div class="stat-card danger"><div class="stat-num">${outCount}</div><div class="stat-label">Out of stock</div></div>`;

  const rows = filteredAdminProducts().map(p => {
    const st = stockStatus(p);
    const pill = st === 'out' ? '<span class="pill out">Out of Stock</span>'
      : st === 'low' ? `<span class="pill low">${escapeHtml(stockLabel(p))}</span>`
      : '<span class="pill ok">In Stock</span>';
    const chips = p.sizes.map(s => {
      const q = getStock(p, s);
      return `<span class="stock-chip${q <= 0 ? ' zero' : ''}">${escapeHtml(s)}: ${q}</span>`;
    }).join('');
    return `
      <tr>
        <td><div class="prod-cell">
          <img src="${escapeHtml(p.img || '')}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
          <div><div class="p-name">${escapeHtml(p.name)}</div><div class="p-brand">${escapeHtml(p.brand || '')} · ${escapeHtml(p.gender || '')}</div></div>
        </div></td>
        <td>${escapeHtml(p.category)}</td>
        <td>₹${Number(p.price || 0).toLocaleString()}${p.oldPrice ? `<br><small style="color:var(--text-light);text-decoration:line-through">₹${Number(p.oldPrice).toLocaleString()}</small>` : ''}</td>
        <td><div class="stock-total">${getStock(p)} units</div><div class="stock-chips">${chips}</div></td>
        <td>${pill}</td>
        <td class="td-actions">
          <button class="icon-btn edit" title="Edit" onclick="openProductForm(${p.id})"><i class="fas fa-pen"></i></button>
          <button class="icon-btn del" title="Delete" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
        </td>
      </tr>`;
  }).join('');
  document.getElementById('adminTableBody').innerHTML = rows ||
    '<tr><td colspan="6" style="text-align:center;color:var(--text-light);padding:2rem">No products match your search.</td></tr>';
}

function adminSearchChanged(v) { adminSearch = v; renderAdmin(); }
function adminCategoryChanged(v) { adminCategory = v; renderAdmin(); }

// ---------- Add / Edit form ----------

function parseListInput(id) {
  return document.getElementById(id).value.split(',').map(s => s.trim()).filter(Boolean);
}

function openProductForm(id) {
  editingId = (typeof id === 'number') ? id : null;
  const p = editingId != null ? products.find(pr => pr.id === editingId) : null;
  document.getElementById('productFormTitle').textContent = p ? 'Edit Product' : 'Add Product';
  document.getElementById('fName').value = p ? p.name : '';
  document.getElementById('fBrand').value = p ? (p.brand || '') : 'StitchCraft';
  document.getElementById('fCategory').value = p ? p.category : ADMIN_CATEGORIES[0];
  document.getElementById('fGender').value = p ? p.gender : 'women';
  document.getElementById('fPrice').value = p ? p.price : '';
  document.getElementById('fOldPrice').value = p && p.oldPrice ? p.oldPrice : '';
  document.getElementById('fRating').value = p ? p.rating : 4.5;
  document.getElementById('fReviews').value = p ? (p.reviews || 0) : 0;
  document.getElementById('fBadge').value = p ? (p.badge || '') : '';
  document.getElementById('fImg').value = p ? (p.img || '') : '';
  document.getElementById('fDesc').value = p ? (p.desc || '') : '';
  document.getElementById('fSizes').value = p ? p.sizes.join(', ') : 'S, M, L, XL';
  document.getElementById('fColors').value = p ? (p.colors || []).join(', ') : '';
  rebuildStockRows(p ? p.stock : null);
  document.getElementById('productFormModal').classList.add('active');
}

function closeProductForm() {
  document.getElementById('productFormModal').classList.remove('active');
  editingId = null;
}

function currentFormSizes() {
  const list = parseListInput('fSizes');
  return list.length ? list : ['One Size'];
}

function rebuildStockRows(preset) {
  const box = document.getElementById('stockRows');
  const sizes = currentFormSizes();
  // keep values already typed when sizes are re-typed
  const existing = {};
  box.querySelectorAll('input[data-size]').forEach(inp => { existing[inp.getAttribute('data-size')] = inp.value; });
  box.innerHTML = sizes.map(s => {
    let v;
    if (preset && preset[s] != null) v = preset[s];
    else if (existing[s] != null && existing[s] !== '') v = existing[s];
    else v = DEFAULT_STOCK_PER_SIZE;
    return `<div class="stock-row"><span title="${escapeHtml(s)}">${escapeHtml(s)}</span><input type="number" min="0" step="1" data-size="${escapeHtml(s)}" value="${escapeHtml(v)}"></div>`;
  }).join('');
}

function setAllStock() {
  const raw = document.getElementById('stockQuickValue').value;
  const v = Math.max(0, parseInt(raw, 10) || 0);
  document.querySelectorAll('#stockRows input[data-size]').forEach(inp => { inp.value = v; });
  showToast(`All sizes set to ${v}`);
}

function nextProductId() {
  return products.reduce((m, p) => Math.max(m, p.id || 0), 0) + 1;
}

async function saveProductForm() {
  const name = document.getElementById('fName').value.trim();
  const price = parseFloat(document.getElementById('fPrice').value);
  if (!name) { showToast('Product name is required'); return; }
  if (isNaN(price) || price < 0) { showToast('Enter a valid price'); return; }
  const sizes = currentFormSizes();
  const stock = {};
  document.querySelectorAll('#stockRows input[data-size]').forEach(inp => {
    const s = inp.getAttribute('data-size');
    stock[s] = Math.max(0, parseInt(inp.value, 10) || 0);
  });
  sizes.forEach(s => { if (stock[s] == null) stock[s] = DEFAULT_STOCK_PER_SIZE; });
  const oldPrice = parseFloat(document.getElementById('fOldPrice').value);
  const rating = parseFloat(document.getElementById('fRating').value);
  const reviews = parseInt(document.getElementById('fReviews').value, 10);
  const data = {
    name,
    brand: document.getElementById('fBrand').value.trim() || 'StitchCraft',
    category: document.getElementById('fCategory').value,
    gender: document.getElementById('fGender').value,
    price,
    oldPrice: (!isNaN(oldPrice) && oldPrice > 0) ? oldPrice : 0,
    rating: (!isNaN(rating)) ? Math.min(5, Math.max(0, rating)) : 4.5,
    reviews: (!isNaN(reviews) && reviews > 0) ? reviews : 0,
    badge: document.getElementById('fBadge').value,
    colors: parseListInput('fColors'),
    sizes,
    stock,
    desc: document.getElementById('fDesc').value.trim(),
    img: document.getElementById('fImg').value.trim(),
  };
  if (cloudMode) {
    let res;
    if (editingId != null) res = await dbUpdateProduct(editingId, data);
    else res = await dbInsertProduct(data);
    if (res.error) { showToast(res.error); return; }
    showToast(editingId != null ? 'Product updated!' : 'Product added!');
    closeProductForm();
    await syncCloudCatalog();
    renderAdmin();
    return;
  }
  if (editingId != null) {
    const i = products.findIndex(pr => pr.id === editingId);
    if (i >= 0) products[i] = normalizeProduct(Object.assign({ id: editingId }, data));
    showToast('Product updated!');
  } else {
    products.push(normalizeProduct(Object.assign({ id: nextProductId() }, data)));
    showToast('Product added!');
  }
  saveCatalog();
  closeProductForm();
  renderAdmin();
}

async function deleteProduct(id) {
  const p = products.find(pr => pr.id === id);
  if (!p) return;
  if (!confirm(`Delete "${p.name}" permanently?`)) return;
  if (cloudMode) {
    const res = await dbDeleteProduct(id);
    if (res.error) { showToast(res.error); return; }
    await syncCloudCatalog();
    renderAdmin();
    showToast('Product deleted');
    return;
  }
  products = products.filter(pr => pr.id !== id);
  saveCatalog();
  renderAdmin();
  showToast('Product deleted');
}

async function resetAllProducts() {
  if (cloudMode) {
    if (!confirm('Replace the ENTIRE cloud catalog with the original 18 default products?')) return;
    const res = await dbReplaceAllProducts(DEFAULT_PRODUCTS.map(normalizeProduct));
    if (res.error) { showToast(res.error); return; }
    await syncCloudCatalog();
    renderAdmin();
    showToast('Cloud catalog reset to defaults');
    return;
  }
  if (!confirm('Discard ALL admin changes and restore the original 18 products?')) return;
  resetCatalog();
  saveCatalog();
  renderAdmin();
  showToast('Catalog reset to defaults');
}

/* One-time migration: upload this browser's catalog to the shared cloud. */
async function pushLocalToCloud() {
  if (!cloudMode) return;
  if (!confirm('Upload this browser\'s catalog to the shared cloud (replaces cloud products)?')) return;
  const local = loadCatalog() || DEFAULT_PRODUCTS;
  const res = await dbReplaceAllProducts(local.map(normalizeProduct));
  if (res.error) { showToast(res.error); return; }
  await syncCloudCatalog();
  renderAdmin();
  showToast('Catalog pushed to cloud!');
}

async function renderAdminOrders() {
  const body = document.getElementById('adminOrdersBody');
  if (!body) return;
  const orders = await dbListRecentOrders();
  body.innerHTML = orders.length ? orders.map(o => {
    const items = (Array.isArray(o.items) ? o.items : [])
      .map(i => `${escapeHtml(i.name || 'Item')}${i.size ? ' (' + escapeHtml(i.size) + ')' : ''} × ${i.qty}`).join(', ');
    const date = o.created_at ? new Date(o.created_at).toLocaleString() : '';
    return `<tr>
      <td><strong>#${escapeHtml(o.order_code)}</strong><br><small style="color:var(--text-light)">${escapeHtml(date)}</small></td>
      <td>${escapeHtml(items)}</td>
      <td>${escapeHtml(o.name || '')}<br><small style="color:var(--text-light)">${escapeHtml(o.phone || '')}</small></td>
      <td><strong>₹${Number(o.total || 0).toLocaleString()}</strong></td>
    </tr>`;
  }).join('') : '<tr><td colspan="4" style="text-align:center;color:var(--text-light);padding:1.5rem">No orders yet.</td></tr>';
}
