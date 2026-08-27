const buyNowItems = JSON.parse(sessionStorage.getItem('zloon_buy_now') || '[]');
const bagItems = JSON.parse(localStorage.getItem('zloon_style_bag') || '[]');
const items = buyNowItems.length ? buyNowItems : bagItems;
const itemTarget = document.querySelector('#checkoutItems');
const totalTarget = document.querySelector('#checkoutTotal');
const priceNumber = value => Number(String(value || '').replace(/[^0-9.]/g, '')) || 0;
const total = items.reduce((sum, item) => sum + priceNumber(item.price) * Number(item.quantity || 1), 0);

itemTarget.innerHTML = items.length ? items.map(item => `<div class="checkout-item"><img src="${item.url}" alt=""><div><strong>${item.name}</strong><small>${item.color || 'As shown'} · Size ${item.size || 'M'} · Qty ${item.quantity || 1}</small></div><b>${item.price || '₹0'}</b></div>`).join('') : '<p class="small">No items selected. Please select a ZLOON look first.</p>';
totalTarget.textContent = `₹${total.toLocaleString('en-IN')}`;

document.querySelectorAll('.checkout-payments label').forEach(label => label.addEventListener('click', () => {
  document.querySelectorAll('.checkout-payments label').forEach(item => item.classList.toggle('active', item === label));
}));

document.querySelector('#checkoutPageForm').addEventListener('submit', event => {
  event.preventDefault();
  const status = document.querySelector('#checkoutPageStatus');
  const submit = event.currentTarget.querySelector('.place-order');
  if (!items.length) { status.textContent = 'Please add a product before checkout.'; return; }
  const form = Object.fromEntries(new FormData(event.currentTarget));
  const orderId = `ZL-${Math.random().toString(16).slice(2, 10).toUpperCase()}`;
  const order = { id: orderId, items, customer: form, total, createdAt: new Date().toISOString() };
  const orders = JSON.parse(localStorage.getItem('zloon_orders') || '[]');
  localStorage.setItem('zloon_orders', JSON.stringify([order, ...orders]));
  sessionStorage.removeItem('zloon_buy_now');
  if (!buyNowItems.length) localStorage.setItem('zloon_style_bag', '[]');
  submit.disabled = true;
  status.innerHTML = '<strong>Order placed.</strong> Opening your confirmation page...';
  const payment = form.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Payment confirmation pending';
  const params = new URLSearchParams({ order: orderId, name: form.name, payment });
  setTimeout(() => { location.href = `order-success.html?${params}`; }, 350);
});
