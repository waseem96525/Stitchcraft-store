/* Supabase client + all auth/database helpers for StitchCraft.
   Works in two modes:
   - CLOUD (keys pasted in supabase-config.js): real login + shared database.
   - LOCAL (keys not pasted yet): every helper safely no-ops so the shop
     and admin panel keep working exactly as before with localStorage.
   Requires the Supabase JS CDN before this file (see index.html/admin.html). */

const SUPABASE_ENABLED =
  typeof SUPABASE_URL === 'string' && SUPABASE_URL.indexOf('http') === 0 &&
  typeof SUPABASE_ANON_KEY === 'string' && SUPABASE_ANON_KEY.length > 20;

let supa = null;
let supaReady = false;
try {
  if (SUPABASE_ENABLED && typeof window !== 'undefined' && window.supabase) {
    supa = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) { supa = null; }

async function testSupabaseConnection() {
  if (!supa) return false;
  try {
    const { error } = await supa.from('products').select('id').limit(1);
    return !error;
  } catch (e) { return false; }
}

function cloudEnabled() { return !!supa; }

async function waitForSupabase() {
  if (!supa) { supaReady = false; return false; }
  supaReady = await testSupabaseConnection();
  return supaReady;
}

/* ---------- Auth ---------- */

async function getSessionUser() {
  if (!supa) return null;
  try {
    const { data } = await supa.auth.getSession();
    return (data && data.session && data.session.user) || null;
  } catch (e) { return null; }
}

async function signUpWithEmail(email, password) {
  if (!supa) return { error: 'Cloud login is not configured yet.' };
  const { data, error } = await supa.auth.signUp({ email, password });
  if (error) return { error: error.message };
  if (data && data.session) return { user: data.session.user };
  return { needsConfirmation: true };
}

async function signInWithEmail(email, password) {
  if (!supa) return { error: 'Cloud login is not configured yet.' };
  const { data, error } = await supa.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { user: (data && data.user) || null };
}

async function signOutUser() {
  if (supa) { try { await supa.auth.signOut(); } catch (e) {} }
}

async function isAdminUser() {
  if (!supa) return false;
  try {
    const user = await getSessionUser();
    if (!user) return false;
    const { data, error } = await supa.from('profiles').select('is_admin').eq('id', user.id).single();
    if (error || !data) return false;
    return data.is_admin === true;
  } catch (e) { return false; }
}

/* ---------- Products (shared catalog) ---------- */

function dbRowToProduct(r) {
  return normalizeProduct({
    id: r.id,
    name: r.name,
    brand: r.brand,
    category: r.category,
    gender: r.gender,
    price: Number(r.price),
    oldPrice: Number(r.old_price || 0),
    rating: Number(r.rating == null ? 4.5 : r.rating),
    reviews: Number(r.reviews || 0),
    badge: r.badge || '',
    colors: r.colors || [],
    sizes: (r.sizes && r.sizes.length) ? r.sizes : ['One Size'],
    stock: r.stock || {},
    desc: r.description || '',
    img: r.img || '',
  });
}

function productToDbRow(p) {
  return {
    name: p.name,
    brand: p.brand || 'StitchCraft',
    category: p.category,
    gender: p.gender,
    price: p.price,
    old_price: p.oldPrice || 0,
    rating: p.rating == null ? 4.5 : p.rating,
    reviews: p.reviews || 0,
    badge: p.badge || '',
    colors: p.colors || [],
    sizes: p.sizes && p.sizes.length ? p.sizes : ['One Size'],
    stock: p.stock || {},
    description: p.desc || '',
    img: p.img || '',
  };
}

async function dbListProducts() {
  if (!supa) return null;
  const { data, error } = await supa.from('products').select('*').order('id', { ascending: true });
  if (error) return null;
  return (data || []).map(dbRowToProduct);
}

async function dbInsertProduct(p) {
  if (!supa) return { error: 'Cloud is not configured.' };
  const { data, error } = await supa.from('products').insert(productToDbRow(p)).select('id').single();
  if (error) return { error: error.message };
  return { id: data && data.id };
}

async function dbUpdateProduct(id, p) {
  if (!supa) return { error: 'Cloud is not configured.' };
  const { error } = await supa.from('products').update(productToDbRow(p)).eq('id', id);
  if (error) return { error: error.message };
  return {};
}

async function dbDeleteProduct(id) {
  if (!supa) return { error: 'Cloud is not configured.' };
  const { error } = await supa.from('products').delete().eq('id', id);
  if (error) return { error: error.message };
  return {};
}

/* Replace the whole cloud catalog with the given list (used by "Reset to defaults"). */
async function dbReplaceAllProducts(list) {
  if (!supa) return { error: 'Cloud is not configured.' };
  const del = await supa.from('products').delete().neq('id', 0);
  if (del.error) return { error: del.error.message };
  if (!list.length) return {};
  const ins = await supa.from('products').insert(list.map(productToDbRow));
  if (ins.error) return { error: ins.error.message };
  return {};
}

async function dbUpdateStock(id, stock) {
  if (!supa) return;
  try { await supa.from('products').update({ stock }).eq('id', id); } catch (e) {}
}

/* ---------- Orders ---------- */

async function dbCreateOrder(order) {
  if (!supa) return { error: 'Cloud is not configured.' };
  const user = await getSessionUser();
  const row = {
    user_id: user ? user.id : null,
    order_code: order.orderCode,
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    discount: order.discount,
    total: order.total,
    name: order.name || '',
    phone: order.phone || '',
    address: order.address || '',
    city: order.city || '',
    state: order.state || '',
    pincode: order.pincode || '',
    payment: order.payment || '',
    pickup_store: order.pickupStore || null,
  };
  const { error } = await supa.from('orders').insert(row);
  if (error) return { error: error.message };
  return {};
}

async function dbListMyOrders() {
  if (!supa) return [];
  try {
    const user = await getSessionUser();
    if (!user) return [];
    const { data, error } = await supa.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20);
    if (error) return [];
    return data || [];
  } catch (e) { return []; }
}

async function dbListRecentOrders() {
  if (!supa) return [];
  try {
    const { data, error } = await supa.from('orders').select('*').order('created_at', { ascending: false }).limit(20);
    if (error) return [];
    return data || [];
  } catch (e) { return []; }
}
