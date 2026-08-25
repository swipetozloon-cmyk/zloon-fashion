const buyNowItems = JSON.parse(sessionStorage.getItem('zloon_buy_now') || '[]');
const bagItems = JSON.parse(localStorage.getItem('zloon_style_bag') || '[]');
const items = buyNowItems.length ? buyNowItems : bagItems;
const itemTarget = document.querySelector('#checkoutItems');
const totalTarget = document.querySelector('#checkoutTotal');
const numericPrice = value => Number(String(value || '').replace(/[^0-9.]/g, '')) || 0;
const total = items.reduce((sum, item) => sum + numericPrice(item.price) * Number(item.quantity || 1), 0);

itemTarget.innerHTML = items.length ? items.map(item => `<div class="checkout-item"><img src="${item.url}" alt=""><div><strong>${item.name}</strong><small>${item.color || 'As shown'} · Size ${item.size || 'M'} · Qty ${item.quantity || 1}</small></div><b>${item.price || '₹0'}</b></div>`).join('') : '<p class="small">No items selected. Please select a ZLOON look first.</p>';
totalTarget.textContent = `₹${total.toLocaleString('en-IN')}`;

document.querySelectorAll('.checkout-payments label').forEach(label => label.addEventListener('click', () => {
  document.querySelectorAll('.checkout-payments label').forEach(item => item.classList.toggle('active', item === label));
}));

async function requestOrder(form) {
  const response = await fetch('/api/orders', {
    method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, customer: { name: form.name, phone: form.phone, email: form.email }, address: { line1: form.line1, city: form.city, pincode: form.pincode }, paymentMethod: form.paymentMethod === 'cod' ? 'cod' : 'whatsapp' })
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'Unable to place order.');
  return result;
}

async function quickCheckoutVerification(form) {
  const start = await fetch('/api/auth/request-verification', {
    method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, city: form.city, member: false })
  });
  const pending = await start.json();
  if (!start.ok) throw new Error(pending.error || 'Unable to verify checkout details.');
  if (!pending.devCode) throw new Error('A verification code was sent to your WhatsApp. Please register once from the ZLOON homepage, then return to checkout.');
  const verify = await fetch('/api/auth/verify', {
    method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: pending.token, code: pending.devCode })
  });
  const verified = await verify.json();
  if (!verify.ok) throw new Error(verified.error || 'Unable to verify checkout details.');
}

document.querySelector('#checkoutPageForm').addEventListener('submit', async event => {
  event.preventDefault();
  const status = document.querySelector('#checkoutPageStatus');
  const submit = event.currentTarget.querySelector('.place-order');
  if (!items.length) { status.textContent = 'Please add a product before checkout.'; return; }
  const form = Object.fromEntries(new FormData(event.currentTarget));
  submit.disabled = true;
  status.textContent = 'Saving your order...';
  try {
    let result;
    try {
      result = await requestOrder(form);
    } catch (error) {
      if (error.message !== 'Customer login required') throw error;
      status.textContent = 'Verifying your checkout details...';
      await quickCheckoutVerification(form);
      result = await requestOrder(form);
    }
    sessionStorage.removeItem('zloon_buy_now');
    if (!buyNowItems.length) localStorage.setItem('zloon_style_bag', '[]');
    const online = form.paymentMethod !== 'cod';
    status.innerHTML = `<strong>Order placed.</strong> Opening your confirmation page...`;
    const params = new URLSearchParams({ order: result.order.id, name: form.name, payment: online ? 'Online payment pending' : 'Cash on Delivery' });
    setTimeout(() => { location.href = `order-success.html?${params}`; }, 450);
  } catch (error) {
    status.textContent = error.message;
    submit.disabled = false;
  }
});
