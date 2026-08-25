const zloonAdminTypography = document.createElement('link');
zloonAdminTypography.rel = 'stylesheet';
zloonAdminTypography.href = 'zloon-typography.css?v=20260831';
document.head.appendChild(zloonAdminTypography);

async function api(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Unable to load dashboard');
  return data;
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[character]));
}

function renderInventory(items = []) {
  const table = document.querySelector('#inventoryRows');
  if (!table) return;
  table.innerHTML = items.length ? items.map(item => {
    const latest = item.history?.[0];
    const change = latest ? `${latest.movement === 'in' ? 'Stock in' : 'Stock out'} · ${new Date(latest.time).toLocaleString('en-IN')}` : '—';
    return `<tr><td><strong>${esc(item.name)}</strong></td><td>${esc(item.sku)}</td><td><strong>${item.quantity}</strong></td><td>${change}</td></tr>`;
  }).join('') : '<tr><td colspan="4">No stock entries yet.</td></tr>';
}

function renderOrders(orders = []) {
  const table = document.querySelector('#orderRows');
  if (!table) return;
  table.innerHTML = orders.length ? orders.map(order => {
    const products = (order.items || []).map(item => `${esc(item.name)} (${esc(item.size || 'Standard')})`).join('<br>') || 'Product enquiry';
    const address = order.address ? `${esc(order.address.line1 || '')}<small>${esc(order.address.city || '')} · ${esc(order.address.pincode || '')}</small>` : 'WhatsApp order';
    return `<tr><td><strong>${esc(order.id)}</strong><small>${esc(order.status || 'New')}</small></td><td>${esc(order.customerName)}</td><td>${products}</td><td>${address}</td><td>${order.paymentMethod === 'cod' ? 'COD enquiry' : 'WhatsApp confirm'}</td><td>${new Date(order.createdAt).toLocaleString('en-IN')}</td></tr>`;
  }).join('') : '<tr><td colspan="6">No Style Bag order enquiries yet.</td></tr>';
}

function orderAmount(order) {
  if (Number.isFinite(Number(order.total))) return Number(order.total);
  return (order.items || []).reduce((sum, item) => {
    const price = Number(String(item.price || '').replace(/[^0-9.]/g, '')) || 0;
    return sum + price * (Number(item.quantity) || 1);
  }, 0);
}

function renderCareerApplications(applications = []) {
  const table = document.querySelector('#careerRows');
  if (!table) return;
  table.innerHTML = applications.length ? applications.map(application => `<tr><td><strong>${esc(application.name)}</strong><small>${esc(application.city)}</small></td><td>${esc(application.type)}</td><td>${esc(application.role)}</td><td>${esc(application.phone)}<small>${esc(application.email)}</small></td><td>${application.portfolio ? `<a href="${esc(application.portfolio)}" target="_blank" rel="noopener">Open link</a>` : '—'}</td><td>${esc(application.message)}</td><td>${new Date(application.createdAt).toLocaleString('en-IN')}</td></tr>`).join('') : '<tr><td colspan="7">No career applications yet.</td></tr>';
}

function showView(name) {
  document.querySelectorAll('.admin-view').forEach(view => view.classList.toggle('active', view.id === name));
  document.querySelectorAll('[data-admin-target]').forEach(button => button.classList.toggle('active', button.dataset.adminTarget === name));
  document.querySelector('.admin-content')?.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupNavigation() {
  document.querySelectorAll('[data-admin-target]').forEach(button => {
    button.addEventListener('click', () => showView(button.dataset.adminTarget));
  });
}

function setupSearch() {
  const search = document.querySelector('#adminSearch');
  if (!search) return;
  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    document.querySelectorAll('tbody tr').forEach(row => {
      row.hidden = Boolean(query) && !row.textContent.toLowerCase().includes(query);
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  setupNavigation();
  setupSearch();
  const loginModal = document.querySelector('#adminLoginModal');
  const loginStatus = document.querySelector('#adminLoginStatus');
  document.querySelectorAll('.admin-login-trigger').forEach(button => button.addEventListener('click', () => { loginModal.hidden = false; }));
  document.querySelector('.admin-login-close')?.addEventListener('click', () => { loginModal.hidden = true; });
  document.querySelector('#adminDirectLogin')?.addEventListener('submit', async event => {
    event.preventDefault();
    loginStatus.textContent = 'Signing in...';
    try {
      await api('/api/admin/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
      location.reload();
    } catch (error) { loginStatus.textContent = error.message; }
  });
  try {
    const [data, config] = await Promise.all([api('/api/admin/stats'), api('/api/config')]);
    document.querySelector('#adminApp').hidden = false;

    const localCareerApplications = JSON.parse(localStorage.getItem('zloonCareerApplications') || '[]');
    const serverCareerApplications = data.careerApplications || [];
    const careerApplications = [...serverCareerApplications, ...localCareerApplications.filter(local => !serverCareerApplications.some(server => server.id === local.id))];
    const localOfflineOrders = JSON.parse(localStorage.getItem('zloonOfflineOrders') || '[]');
    const serverOrders = data.orders || [];
    const orders = [...serverOrders, ...localOfflineOrders.filter(local => !serverOrders.some(server => server.id === local.id))];
    const totalSales = orders.reduce((sum, order) => sum + orderAmount(order), 0);

    document.querySelector('#customerCount').textContent = data.totalCustomers || 0;
    document.querySelector('#totalCustomers').textContent = data.totalCustomers || 0;
    document.querySelector('#memberCount').textContent = data.members || 0;
    document.querySelector('#visitCount').textContent = (data.visits || []).length;
    document.querySelector('#conversion').textContent = `${data.conversion || 0}%`;
    document.querySelector('#orderCount').textContent = orders.length;
    document.querySelector('#orderBadge').textContent = orders.length;
    document.querySelector('#orderFulfilCount').textContent = orders.length;
    document.querySelector('#totalSales').textContent = `₹${totalSales.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
    document.querySelector('#stockCount').textContent = (data.inventory || []).reduce((total, item) => total + Number(item.quantity || 0), 0);
    document.querySelector('#careerBadge').textContent = careerApplications.length;
    document.querySelector('#careerCount').textContent = careerApplications.length;
    document.querySelector('#spotlightBookingCount').textContent = (data.bookings || []).filter(booking => booking.type === 'spotlight').length;

    const customers = data.customers || [];
    document.querySelector('#customerRows').innerHTML = customers.length ? customers.map(customer => `<tr><td><strong>${esc(customer.name)}</strong><small>Verified customer</small></td><td>${esc(customer.email)}</td><td>${esc(customer.phone)}</td><td>${esc(customer.city)}</td><td><span class="status ${customer.member ? 'plus' : 'verified'}">${customer.member ? 'PLUS' : 'STANDARD'}</span></td><td>${new Date(customer.lastLogin).toLocaleString('en-IN')}</td></tr>`).join('') : '<tr><td colspan="6">No verified customer profiles yet.</td></tr>';

    renderOrders(orders);
    renderCareerApplications(careerApplications);
    renderInventory(data.inventory || []);
    document.querySelector('#activityRows').innerHTML = (data.visits || []).slice(-8).reverse().map(visit => `<div><strong>${esc(visit.page)}</strong><span>${new Date(visit.time).toLocaleString('en-IN')}</span></div>`).join('') || '<p>No activity recorded yet.</p>';

    const whatsappForm = document.querySelector('#whatsappSettings');
    const whatsappStatus = document.querySelector('#whatsappStatus');
    whatsappForm.number.value = config.whatsappNumber || '919782326637';
    whatsappStatus.textContent = 'Customer WhatsApp link is active.';
    whatsappForm.onsubmit = async event => {
      event.preventDefault();
      try {
        const saved = await api('/api/admin/whatsapp', { method: 'POST', body: JSON.stringify({ number: whatsappForm.number.value }) });
        whatsappStatus.textContent = `Saved: ${saved.whatsappNumber}`;
      } catch (error) { whatsappStatus.textContent = error.message; }
    };

    const stockForm = document.querySelector('#inventoryForm');
    const stockStatus = document.querySelector('#inventoryStatus');
    stockForm.onsubmit = async event => {
      event.preventDefault();
      try {
        const result = await api('/api/admin/inventory', { method: 'POST', body: JSON.stringify(Object.fromEntries(new FormData(stockForm))) });
        stockStatus.textContent = `${result.item.name} updated successfully.`;
        stockForm.reset();
        const fresh = await api('/api/admin/stats');
        renderInventory(fresh.inventory || []);
        document.querySelector('#stockCount').textContent = (fresh.inventory || []).reduce((total, item) => total + Number(item.quantity || 0), 0);
      } catch (error) { stockStatus.textContent = error.message; }
    };

    document.querySelector('#adminLogout').onclick = async () => {
      await api('/api/auth/logout', { method: 'POST' });
      location.href = 'index.html';
    };
  } catch (error) {
    // Keep the Shopify-style dashboard visible as a safe preview. Live CRM data
    // is still loaded only after an authenticated admin session is available.
    document.querySelector('#adminApp').hidden = false;
    document.querySelector('#accessDenied').hidden = true;
    const localApplications = JSON.parse(localStorage.getItem('zloonCareerApplications') || '[]');
    document.querySelector('#careerBadge').textContent = localApplications.length;
    document.querySelector('#careerCount').textContent = localApplications.length;
    renderCareerApplications(localApplications);
  }
});
