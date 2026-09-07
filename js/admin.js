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
  cloudMode = await waitForSupabase();
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
    if (!res.error) {
      showToast(editingId != null ? 'Product updated!' : 'Product added!');
      closeProductForm();
      await syncCloudCatalog();
      renderAdmin();
      return;
    }
    showToast('Cloud save failed, saving locally: ' + res.error);
    cloudMode = false;
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
    if (!res.error) {
      await syncCloudCatalog();
      renderAdmin();
      showToast('Product deleted');
      return;
    }
    showToast('Cloud delete failed, deleting locally: ' + res.error);
    cloudMode = false;
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
    if (!res.error) {
      await syncCloudCatalog();
      renderAdmin();
      showToast('Cloud catalog reset to defaults');
      return;
    }
    showToast('Cloud reset failed, resetting locally: ' + res.error);
    cloudMode = false;
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
  if (!res.error) {
    await syncCloudCatalog();
    renderAdmin();
    showToast('Catalog pushed to cloud!');
    return;
  }
  showToast('Cloud push failed: ' + res.error);
}

async function renderAdminOrders() {
  const body = document.getElementById('adminOrdersBody');
  if (!body) return;
  const orders = await dbListRecentOrders();
  const statusLabels = { pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered' };
  const statusColors = { pending: '#f59e0b', confirmed: '#3b82f6', processing: '#8b5cf6', shipped: '#06b6d4', delivered: '#10b981' };
  body.innerHTML = orders.length ? orders.map(o => {
    const items = (Array.isArray(o.items) ? o.items : [])
      .map(i => `${escapeHtml(i.name || 'Item')}${i.size ? ' (' + escapeHtml(i.size) + ')' : ''} × ${i.qty}`).join(', ');
    const date = o.created_at ? new Date(o.created_at).toLocaleString() : '';
    const status = o.status || 'pending';
    const color = statusColors[status] || '#666';
    const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const statusOptions = statuses.map(s =>
      `<option value="${s}" ${s === status ? 'selected' : ''}>${statusLabels[s]}</option>`
    ).join('');
    const paymentVerified = o.payment_verified;
    const hasScreenshot = !!o.payment_screenshot;
    const paymentStatusHtml = o.payment === 'cod'
      ? '<span style="color:#10b981"><i class="fas fa-check-circle"></i> COD</span>'
      : hasScreenshot
        ? `<span style="color:${paymentVerified ? '#10b981' : '#f59e0b'}"><i class="fas ${paymentVerified ? 'fa-check-circle' : 'fa-clock'}"></i> ${paymentVerified ? 'Verified' : 'Pending'}</span> <a href="#" onclick="openScreenshotModal('${escapeHtml(o.order_code)}');return false;"><i class="fas fa-image"></i></a>`
        : '<span style="color:#ef4444"><i class="fas fa-times-circle"></i> No Screenshot</span>';
    return `<tr>
      <td><strong>#${escapeHtml(o.order_code)}</strong><br><small style="color:var(--text-light)">${escapeHtml(date)}</small><br><span class="order-status-badge" style="background:${color}20;color:${color}">${statusLabels[status]}</span></td>
      <td>${escapeHtml(items.substring(0, 80))}${items.length > 80 ? '...' : ''}<br><small><a href="#" onclick="showAdminOrderDetail('${escapeHtml(o.order_code)}');return false;">View Full</a></small></td>
      <td>${escapeHtml(o.name || '')}<br><small style="color:var(--text-light)">${escapeHtml(o.phone || '')}</small><br><small>${escapeHtml(o.address || '')}${o.pickupStore ? '<br><em>Pickup: ' + escapeHtml(o.pickupStore) + '</em>' : ''}</small></td>
      <td><strong>₹${Number(o.total || 0).toLocaleString()}</strong><br><small>${escapeHtml(o.payment || '')}</small><br><small>${paymentStatusHtml}</small></td>
      <td>
        <select onchange="updateOrderStatus('${escapeHtml(o.order_code)}', this.value)" style="padding:0.4rem;border-radius:6px;border:1px solid var(--border);font-size:0.8rem;width:100%;max-width:120px;margin-bottom:0.3rem">
          ${statusOptions}
        </select>
      </td>
    </tr>`;
  }).join('') : '<tr><td colspan="5" style="text-align:center;color:var(--text-light);padding:1.5rem">No orders yet.</td></tr>';
}

async function updateOrderStatus(orderCode, newStatus) {
  if (!supa) { showToast('Cloud not connected'); return; }
  const { error } = await supa.from('orders').update({ status: newStatus }).eq('order_code', orderCode);
  if (error) { showToast('Failed to update: ' + error.message); return; }
  showToast('Order status updated to ' + newStatus);
  renderAdminOrders();
}

function showAdminOrderDetail(orderCode) {
  dbListRecentOrders().then(orders => {
    const order = orders.find(o => o.order_code === orderCode);
    if (!order) { showToast('Order not found'); return; }
    const items = Array.isArray(order.items) ? order.items : [];
    const itemsHtml = items.map(i => `<div style="display:flex;gap:1rem;padding:0.5rem 0;border-bottom:1px solid var(--border)">
      <img src="${i.img || 'https://via.placeholder.com/50'}" style="width:50px;height:50px;object-fit:cover;border-radius:4px" onerror="this.src='https://via.placeholder.com/50'">
      <div><strong>${escapeHtml(i.name || 'Product')}</strong><br><small>${i.size ? 'Size: ' + i.size + ' × ' : ''}${i.qty}</small><br><strong>₹${Number(i.price || 0).toLocaleString()}</strong></div>
    </div>`).join('');
    const paymentLabels = { upi: 'UPI / GPay / PhonePe', cod: 'Cash on Delivery', card: 'Credit/Debit Card', emi: 'No Cost EMI' };
    const paymentStatus = order.payment === 'cod' ? 'COD - No verification needed' :
      (order.payment_verified ? 'Payment Verified' : 'Payment Pending Verification');
    alert(`ORDER DETAILS\n\nOrder: #${order.order_code}\nDate: ${order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}\nStatus: ${order.status || 'pending'}\n\nITEMS:\n${items.map(i => `- ${i.name || 'Product'} (${i.size || 'One Size'}) x${i.qty} = ₹${(i.price || 0) * i.qty}`).join('\n')}\n\nSUBTOTAL: ₹${order.subtotal || 0}\nSHIPPING: ${order.shipping == 0 ? 'Free' : '₹' + order.shipping}\nDISCOUNT: -₹${order.discount || 0}\nTOTAL: ₹${order.total || 0}\n\nPAYMENT: ${paymentLabels[order.payment] || order.payment || 'N/A'}\nPAYMENT STATUS: ${paymentStatus}\n\n${order.pickupStore ? 'PICKUP: ' + order.pickupStore : 'DELIVERY:\n' + (order.name || '') + '\n' + (order.address || '') + '\n' + (order.city || '') + ', ' + (order.state || '') + ' - ' + (order.pincode || '') + '\nPhone: ' + (order.phone || '')}`);
  });
}

// Settings Modal
let currentScreenshotOrder = null;

function switchSettingsTab(tab) {
  document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.settings-panel').forEach(p => p.style.display = 'none');
  document.getElementById('settings' + tab.charAt(0).toUpperCase() + tab.slice(1)).style.display = 'block';
  event.target.closest('.settings-tab').classList.add('active');
}

function openSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (!modal) return;
  // Load all settings into form
  document.getElementById('sStoreName').value = getSetting('storeName', 'StitchCraft');
  document.getElementById('sTagline').value = getSetting('tagline', "India's trusted garment store");
  document.getElementById('sDescription').value = getSetting('storeDesc', 'Your trusted garment store since 2010');
  document.getElementById('sPhone').value = getSetting('storePhone', '+91 98765 43210');
  document.getElementById('sEmail').value = getSetting('storeEmail', 'info@stitchcraft.in');
  document.getElementById('sAddress').value = getSetting('storeAddress', '123 Fashion Street, Mumbai - 400001');
  document.getElementById('sGST').value = getSetting('gstNumber', '');
  document.getElementById('sFreeShippingAbove').value = getSetting('freeShippingAbove', 999);
  document.getElementById('sShippingCharge').value = getSetting('shippingCharge', 99);
  document.getElementById('sGSTRate').value = getSetting('gstRate', 18);
  document.getElementById('sDeliveryDays').value = getSetting('deliveryDays', '3-7 business days');
  document.getElementById('sUPI').value = getStoreUPI();
  document.getElementById('sFacebook').value = getSetting('socialFacebook', '');
  document.getElementById('sInstagram').value = getSetting('socialInstagram', '');
  document.getElementById('sTwitter').value = getSetting('socialTwitter', '');
  document.getElementById('sYoutube').value = getSetting('socialYoutube', '');
  document.getElementById('sWhatsapp').value = getSetting('socialWhatsapp', '');
  renderPromoList();
  modal.classList.add('active');
}

function closeSettingsModal() {
  document.getElementById('settingsModal').classList.remove('active');
}

function saveAllSettings() {
  setSetting('storeName', document.getElementById('sStoreName').value.trim() || 'StitchCraft');
  setSetting('tagline', document.getElementById('sTagline').value.trim());
  setSetting('storeDesc', document.getElementById('sDescription').value.trim());
  setSetting('storePhone', document.getElementById('sPhone').value.trim());
  setSetting('storeEmail', document.getElementById('sEmail').value.trim());
  setSetting('storeAddress', document.getElementById('sAddress').value.trim());
  setSetting('gstNumber', document.getElementById('sGST').value.trim());
  setSetting('freeShippingAbove', parseFloat(document.getElementById('sFreeShippingAbove').value) || 999);
  setSetting('shippingCharge', parseFloat(document.getElementById('sShippingCharge').value) || 99);
  setSetting('gstRate', parseFloat(document.getElementById('sGSTRate').value) || 18);
  setSetting('deliveryDays', document.getElementById('sDeliveryDays').value.trim());
  setStoreUPI(document.getElementById('sUPI').value.trim());
  setSetting('socialFacebook', document.getElementById('sFacebook').value.trim());
  setSetting('socialInstagram', document.getElementById('sInstagram').value.trim());
  setSetting('socialTwitter', document.getElementById('sTwitter').value.trim());
  setSetting('socialYoutube', document.getElementById('sYoutube').value.trim());
  setSetting('socialWhatsapp', document.getElementById('sWhatsapp').value.trim());
  showToast('Settings saved successfully!');
  closeSettingsModal();
  applySettingsToUI();
}

// Promo Codes
function getPromoCodes() {
  return getSetting('promoCodes', [
    { code: 'FESTIVE2025', type: 'percent', value: 50, minOrder: 0, active: true },
    { code: 'EXTRA500', type: 'fixed', value: 500, minOrder: 999, active: true }
  ]);
}

function savePromoCodes(codes) {
  setSetting('promoCodes', codes);
}

function renderPromoList() {
  const list = document.getElementById('promoList');
  if (!list) return;
  const promos = getPromoCodes();
  list.innerHTML = promos.map((p, i) => `
    <div class="promo-item">
      <div class="promo-item-info">
        <span class="promo-item-code">${escapeHtml(p.code)}</span>
        <span class="promo-item-desc">${p.type === 'percent' ? p.value + '% Off' : '₹' + p.value + ' Off'} | Min ₹${p.minOrder}</span>
        <span class="${p.active ? 'promo-item active-badge' : 'promo-item inactive-badge'}">${p.active ? 'Active' : 'Inactive'}</span>
      </div>
      <button class="icon-btn del" onclick="deletePromo(${i})" title="Delete"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');
}

function addPromoCode() {
  const code = document.getElementById('pCode').value.trim().toUpperCase();
  const type = document.getElementById('pType').value;
  const value = parseFloat(document.getElementById('pValue').value) || 0;
  const minOrder = parseFloat(document.getElementById('pMinOrder').value) || 0;
  const active = document.getElementById('pActive').value === 'true';
  if (!code || value <= 0) { showToast('Enter valid promo code and value'); return; }
  const promos = getPromoCodes();
  if (promos.find(p => p.code === code)) { showToast('Promo code already exists'); return; }
  promos.push({ code, type, value, minOrder, active });
  savePromoCodes(promos);
  document.getElementById('pCode').value = '';
  document.getElementById('pValue').value = '';
  document.getElementById('pMinOrder').value = '0';
  renderPromoList();
  showToast('Promo code added!');
}

function deletePromo(index) {
  if (!confirm('Delete this promo code?')) return;
  const promos = getPromoCodes();
  promos.splice(index, 1);
  savePromoCodes(promos);
  renderPromoList();
  showToast('Promo code deleted');
}

// Apply settings to UI elements
function applySettingsToUI() {
  const storeName = getSetting('storeName', 'StitchCraft');
  const tagline = getSetting('tagline', "India's trusted garment store");
  const phone = getSetting('storePhone', '+91 98765 43210');
  const email = getSetting('storeEmail', 'info@stitchcraft.in');
  const address = getSetting('storeAddress', '123 Fashion Street, Mumbai - 400001');
  // Update logo/name in navbar
  document.querySelectorAll('.logo, .footer-logo').forEach(el => {
    const icon = el.querySelector('i');
    const text = icon ? icon.nextSibling : el.firstChild;
    if (text) text.textContent = ' ' + storeName;
  });
  // Update tagline
  document.querySelectorAll('[data-footer-desc]').forEach(el => el.textContent = getSetting('storeDesc', "India's most trusted garment store, serving customers since 2010."));
  // Update contact info
  const addrEl = document.querySelector('[data-address]');
  if (addrEl) addrEl.textContent = address;
  const phoneEl = document.querySelector('[data-phone]');
  if (phoneEl) phoneEl.textContent = phone;
  const emailEl = document.querySelector('[data-email]');
  if (emailEl) emailEl.textContent = email;
  // Update free shipping text
  const freeShipEl = document.querySelectorAll('[data-free-shipping]');
  const freeShipAbove = getSetting('freeShippingAbove', 999);
  freeShipEl.forEach(el => el.textContent = 'Free Shipping Above ₹' + freeShipAbove);
}

// Screenshot Modal
function openScreenshotModal(orderCode) {
  currentScreenshotOrder = orderCode;
  const modal = document.getElementById('screenshotModal');
  if (!modal) return;
  dbListRecentOrders().then(orders => {
    const order = orders.find(o => o.order_code === orderCode);
    if (!order) { showToast('Order not found'); return; }
    const img = document.getElementById('screenshotImage');
    const statusText = document.getElementById('paymentStatusText');
    if (order.payment_screenshot) {
      img.src = order.payment_screenshot;
      img.style.display = 'block';
      statusText.textContent = `Payment Status: ${order.payment_verified ? 'VERIFIED' : 'PENDING VERIFICATION'}`;
      statusText.style.color = order.payment_verified ? '#10b981' : '#f59e0b';
    } else {
      img.style.display = 'none';
      statusText.textContent = 'No payment screenshot uploaded';
      statusText.style.color = '#ef4444';
    }
  });
  modal.classList.add('active');
}

function closeScreenshotModal() {
  document.getElementById('screenshotModal').classList.remove('active');
  currentScreenshotOrder = null;
}

async function markPaymentVerified() {
  if (!currentScreenshotOrder || !supa) return;
  const { error } = await supa.from('orders').update({ payment_verified: true }).eq('order_code', currentScreenshotOrder);
  if (error) { showToast('Failed: ' + error.message); return; }
  showToast('Payment verified!');
  closeScreenshotModal();
  renderAdminOrders();
}

async function markPaymentFailed() {
  if (!currentScreenshotOrder || !supa) return;
  if (!confirm('Mark this payment as failed?')) return;
  const { error } = await supa.from('orders').update({ paymentVerified: false, status: 'cancelled' }).eq('order_code', currentScreenshotOrder);
  if (error) { showToast('Failed: ' + error.message); return; }
  showToast('Payment marked as failed!');
  closeScreenshotModal();
  renderAdminOrders();
}

// ============ TABS ============
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tabProducts').style.display = tab === 'products' ? 'block' : 'none';
  document.getElementById('tabBilling').style.display = tab === 'billing' ? 'block' : 'none';
  document.getElementById('tabInventory').style.display = tab === 'inventory' ? 'block' : 'none';
  event.target.closest('.admin-tab').classList.add('active');
  if (tab === 'billing') clearBill();
  if (tab === 'inventory') renderInventory();
}

// ============ BILLING ============
let billItems = [];
let currentBillProduct = null;

function searchBillProduct(query) {
  const results = document.getElementById('billProductResults');
  if (!query || query.length < 2) { results.innerHTML = ''; return; }
  const q = query.toLowerCase();
  const matches = products.filter(p =>
    (p.name || '').toLowerCase().includes(q) ||
    (p.category || '').toLowerCase().includes(q) ||
    (p.brand || '').toLowerCase().includes(q)
  ).slice(0, 6);
  results.innerHTML = matches.length ? matches.map(p => `
    <div class="bill-search-item" onclick="selectBillProduct(${p.id})">
      <strong>${escapeHtml(p.name)}</strong>
      <small>${escapeHtml(p.category)} | ₹${Number(p.price || 0).toLocaleString()}</small>
      <span class="bill-stock-badge ${getTotalStock(p) > 0 ? 'in-stock' : 'out-stock'}">
        ${getTotalStock(p) > 0 ? 'In Stock' : 'Out of Stock'}
      </span>
    </div>
  `).join('') : '<div class="bill-search-empty">No products found</div>';
}

function selectBillProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  currentBillProduct = product;
  document.getElementById('billProductSearch').value = product.name;
  document.getElementById('billProductResults').innerHTML = '';
  const defaultSize = Array.isArray(product.sizes) && product.sizes.length ? product.sizes[0] : 'One Size';
  const qty = 1;
  addBillItem(product, defaultSize, qty);
}

function getTotalStock(product) {
  if (!product || !product.stock) return 0;
  return Object.values(product.stock).reduce((s, v) => s + (parseInt(v, 10) || 0), 0);
}

function addBillItem(product, size, qty) {
  if (getTotalStock(product) <= 0) { showToast('Product out of stock!'); return; }
  const existing = billItems.find(i => i.productId === product.id && i.size === size);
  if (existing) {
    if (existing.qty >= (product.stock[size] || 0)) { showToast('Not enough stock!'); return; }
    existing.qty += qty;
  } else {
    billItems.push({ productId: product.id, name: product.name, size, qty, price: product.price || 0, img: product.img || '' });
  }
  renderBillItems();
  document.getElementById('billProductSearch').value = '';
  currentBillProduct = null;
}

function renderBillItems() {
  const container = document.getElementById('billItems');
  if (!container) return;
  if (!billItems.length) { container.innerHTML = '<p class="bill-empty">Add products to create a bill</p>'; updateBillTotals(); return; }
  container.innerHTML = billItems.map((item, i) => `
    <div class="bill-item">
      <img src="${item.img || 'https://via.placeholder.com/40'}" alt="${escapeHtml(item.name)}" onerror="this.src='https://via.placeholder.com/40'">
      <div class="bill-item-info">
        <strong>${escapeHtml(item.name)}</strong>
        <small>Size: ${item.size} | ₹${Number(item.price || 0).toLocaleString()} × ${item.qty}</small>
      </div>
      <div class="bill-item-qty">
        <button onclick="updateBillItemQty(${i}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="updateBillItemQty(${i}, 1)">+</button>
      </div>
      <div class="bill-item-total">₹${Number(item.price * item.qty || 0).toLocaleString()}</div>
      <button class="bill-item-remove" onclick="removeBillItem(${i})"><i class="fas fa-times"></i></button>
    </div>
  `).join('');
  updateBillTotals();
}

function updateBillItemQty(index, delta) {
  const item = billItems[index];
  if (!item) return;
  const product = products.find(p => p.id === item.productId);
  if (!product) return;
  const newQty = item.qty + delta;
  if (newQty < 1) return;
  if (newQty > (product.stock[item.size] || 0)) { showToast('Not enough stock!'); return; }
  item.qty = newQty;
  renderBillItems();
}

function removeBillItem(index) {
  billItems.splice(index, 1);
  renderBillItems();
}

function updateBillTotals() {
  const subtotal = billItems.reduce((s, i) => s + (i.price * i.qty), 0);
  const discountPct = parseFloat(document.getElementById('billDiscount')?.value) || 0;
  const discountAmt = subtotal * discountPct / 100;
  const afterDiscount = subtotal - discountAmt;
  const gst = afterDiscount * 0.18;
  const total = afterDiscount + gst;
  document.getElementById('billSubtotal').textContent = '₹' + subtotal.toLocaleString();
  document.getElementById('billGST').textContent = '₹' + gst.toFixed(0).toLocaleString();
  document.getElementById('billDiscountAmt').textContent = '-₹' + discountAmt.toFixed(0).toLocaleString();
  document.getElementById('billTotal').textContent = '₹' + total.toFixed(0).toLocaleString();
}

function clearBill() {
  billItems = [];
  document.getElementById('billCustomerName').value = '';
  document.getElementById('billCustomerPhone').value = '';
  document.getElementById('billDiscount').value = '0';
  document.getElementById('billPaymentMethod').value = 'cash';
  renderBillItems();
}

function generateBill() {
  if (!billItems.length) { showToast('Add items to generate bill'); return; }
  const customerName = document.getElementById('billCustomerName').value.trim() || 'Walk-in Customer';
  const customerPhone = document.getElementById('billCustomerPhone').value.trim() || '-';
  const subtotal = billItems.reduce((s, i) => s + (i.price * i.qty), 0);
  const discountPct = parseFloat(document.getElementById('billDiscount')?.value) || 0;
  const discountAmt = subtotal * discountPct / 100;
  const afterDiscount = subtotal - discountAmt;
  const gstRate = getGSTRate ? getGSTRate() : 18;
  const gst = afterDiscount * gstRate / 100;
  const total = afterDiscount + gst;
  const paymentMethod = document.getElementById('billPaymentMethod').value;
  const paymentLabels = { cash: 'Cash', upi: 'UPI', card: 'Card', mixed: 'Mixed (Cash + UPI)' };
  const billNo = 'INV' + Date.now().toString().slice(-8);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Update bill header with store settings
  const storeName = getSetting('storeName', 'StitchCraft');
  const storeAddress = getSetting('storeAddress', '123 Fashion Street, Mumbai - 400001');
  const storePhone = getSetting('storePhone', '+91 98765 43210');
  const storeEmail = getSetting('storeEmail', 'info@stitchcraft.in');
  const billLogoEl = document.querySelector('#billPrintContent .bill-logo');
  if (billLogoEl) billLogoEl.innerHTML = '<i class="fas fa-seedling"></i> ' + storeName;
  const taglineEl = document.querySelector('#billPrintContent .bill-tagline');
  if (taglineEl) taglineEl.textContent = 'Quality Garments Since 2010';
  const addrEl = document.querySelector('#billPrintContent .bill-address');
  if (addrEl) addrEl.textContent = storeAddress;
  const contactEl = document.querySelector('#billPrintContent .bill-contact');
  if (contactEl) contactEl.textContent = 'Ph: ' + storePhone + ' | Email: ' + storeEmail;

  document.getElementById('billPrintNo').textContent = billNo;
  document.getElementById('billPrintDate').textContent = dateStr + ' ' + timeStr;
  document.getElementById('billPrintCustomer').textContent = customerName;
  document.getElementById('billPrintPhone').textContent = customerPhone;
  document.getElementById('billPrintItems').innerHTML = billItems.map((item, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(item.name)}</td>
      <td>${item.size}</td>
      <td>${item.qty}</td>
      <td>₹${Number(item.price || 0).toLocaleString()}</td>
      <td>₹${Number(item.price * item.qty || 0).toLocaleString()}</td>
    </tr>
  `).join('');
  document.getElementById('billPrintSubtotal').textContent = '₹' + subtotal.toLocaleString();
  document.getElementById('billPrintGST').textContent = '₹' + gst.toFixed(0).toLocaleString() + ' (' + gstRate + '%)';
  document.getElementById('billPrintDiscount').textContent = '-₹' + discountAmt.toFixed(0).toLocaleString();
  document.getElementById('billPrintTotal').textContent = '₹' + total.toFixed(0).toLocaleString();
  document.getElementById('billPrintPayment').textContent = paymentLabels[paymentMethod];

  // Update footer
  const footerEl = document.querySelector('#billPrintContent .bill-footer p:first-child');
  if (footerEl) footerEl.textContent = 'Thank you for shopping with ' + storeName + '!';

  // Deduct stock
  billItems.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (product && product.stock && product.stock[item.size] != null) {
      product.stock[item.size] = Math.max(0, (parseInt(product.stock[item.size], 10) || 0) - item.qty);
    }
  });
  saveCatalog();

  document.getElementById('billPrintModal').classList.add('active');
}

function closeBillPrint() {
  document.getElementById('billPrintModal').classList.remove('active');
}

function printBill() {
  const printContent = document.getElementById('billPrintContent').innerHTML;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>StitchCraft Bill</title>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; font-size: 14px; }
        .bill-header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 15px; }
        .bill-logo { font-size: 28px; font-weight: bold; color: #2d5a27; }
        .bill-logo i { margin-right: 8px; }
        .bill-tagline { color: #666; font-size: 12px; margin: 5px 0; }
        .bill-address, .bill-contact { font-size: 12px; color: #555; }
        .bill-info { margin: 15px 0; display: flex; justify-content: space-between; }
        .bill-info-row { display: flex; gap: 30px; }
        .bill-items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .bill-items-table th { background: #f0f0f0; padding: 8px; border: 1px solid #ddd; text-align: left; }
        .bill-items-table td { padding: 8px; border: 1px solid #ddd; }
        .bill-items-table th:last-child, .bill-items-table td:last-child { text-align: right; }
        .bill-items-table th:nth-child(3),
        .bill-items-table td:nth-child(3),
        .bill-items-table th:nth-child(4),
        .bill-items-table td:nth-child(4) { text-align: center; }
        .bill-totals { margin-left: auto; width: 250px; }
        .bill-total-row { display: flex; justify-content: space-between; padding: 5px 0; }
        .bill-total-row.grand { font-size: 18px; font-weight: bold; border-top: 2px solid #333; margin-top: 5px; padding-top: 10px; color: #2d5a27; }
        .bill-payment-info { margin: 15px 0; padding: 10px; background: #f5f5f5; border-radius: 4px; }
        .bill-footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; }
        .bill-footer p:first-child { font-size: 16px; font-weight: bold; color: #2d5a27; }
        .bill-footer-note { font-size: 11px; color: #888; margin-top: 5px; }
        .bill-actions-print { display: none; }
        @media print { .bill-actions-print { display: none !important; } }
      </style>
    </head>
    <body>${printContent}</body>
    </html>
  `);
  printWindow.document.close();
  setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
}

// ============ INVENTORY ============
function renderInventory() {
  const tbody = document.getElementById('inventoryTableBody');
  if (!tbody) return;
  const catFilter = document.getElementById('inventoryCategoryFilter')?.value || 'all';
  const stockFilter = document.getElementById('inventoryStockFilter')?.value || 'all';
  let filtered = products.filter(p => {
    if (catFilter !== 'all' && p.category !== catFilter) return false;
    const total = getTotalStock(p);
    if (stockFilter === 'low' && total >= 10) return false;
    if (stockFilter === 'out' && total > 0) return false;
    if (stockFilter === 'available' && total <= 0) return false;
    return true;
  });
  tbody.innerHTML = filtered.length ? filtered.map(p => {
    const total = getTotalStock(p);
    const sizes = Array.isArray(p.sizes) ? p.sizes : ['One Size'];
    const sizeStock = sizes.map(s => `${s}: ${p.stock[s] || 0}`).join(', ');
    const statusColor = total === 0 ? '#ef4444' : total < 10 ? '#f59e0b' : '#10b981';
    const statusText = total === 0 ? 'Out of Stock' : total < 10 ? 'Low Stock' : 'In Stock';
    return `<tr>
      <td><strong>${escapeHtml(p.name || '')}</strong><br><small style="color:var(--text-light)">₹${Number(p.price || 0).toLocaleString()}</small></td>
      <td>${escapeHtml(p.category || '')}</td>
      <td><strong style="color:${statusColor}">${total}</strong></td>
      <td><small>${escapeHtml(sizeStock)}</small></td>
      <td><span style="color:${statusColor};font-weight:600">${statusText}</span></td>
    </tr>`;
  }).join('') : '<tr><td colspan="5" style="text-align:center;color:var(--text-light);padding:1.5rem">No products found</td></tr>';
  // Populate category filter
  const catSelect = document.getElementById('inventoryCategoryFilter');
  if (catSelect && catSelect.options.length <= 1) {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))].sort();
    cats.forEach(c => catSelect.add(new Option(c, c)));
  }
}

function exportInventory() {
  let csv = 'Product,Category,Price,Total Stock,Sizes\n';
  products.forEach(p => {
    const total = getTotalStock(p);
    const sizes = Array.isArray(p.sizes) ? p.sizes.map(s => `${s}:${p.stock[s] || 0}`).join(';') : '';
    csv += `"${p.name || ''}","${p.category || ''}",${p.price || 0},${total},"${sizes}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'stitchcraft_inventory_' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
  URL.revokeObjectURL(url);
}
