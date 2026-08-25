for (const href of ['product-layout-extra.css', 'product-trust-cart.css', 'product-quantity.css']) {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = href;
  document.head.appendChild(css);
}

const zloonProductFooter = document.createElement('script');
zloonProductFooter.src = 'footer-loader.js';
document.head.appendChild(zloonProductFooter);

const trustStrip = document.querySelector('.trust-strip');
const productInfo = document.querySelector('.product-info');
const message = document.querySelector('#productMessage');
if (trustStrip && productInfo) {
  productInfo.insertBefore(trustStrip, message);
  trustStrip.querySelector('article:last-child').innerHTML = '<span>➜</span><div><strong>Free shipping</strong><small>Delivery in 1–2 days</small></div>';
}

const query = new URLSearchParams(location.search);
const product = {
  name: query.get('name') || 'ZLOON Fashion Look',
  url: query.get('image') || 'assets/zloon-logo.jpg',
  price: query.get('price') || '₹799'
};
let colour = 'As shown';
let size = 'M';

document.querySelector('#productImage').src = product.url;
document.querySelector('#productName').textContent = product.name;
document.querySelector('#productPrice').textContent = product.price;
document.querySelector('#productCode').textContent = `SKU: ZL-${product.name.replace(/[^A-Z]/gi, '').slice(0, 5).toUpperCase()}-${String(product.name.length * 73).padStart(4, '0')}`;

document.querySelectorAll('#colourChoices button').forEach(button => button.onclick = () => {
  colour = button.dataset.colour;
  document.querySelectorAll('#colourChoices button').forEach(item => item.classList.toggle('active', item === button));
});
document.querySelectorAll('#sizeChoices button').forEach(button => button.onclick = () => {
  size = button.dataset.size;
  document.querySelectorAll('#sizeChoices button').forEach(item => item.classList.toggle('active', item === button));
});

const payment = document.querySelector('#paymentMode');
const quantityBlock = document.createElement('div');
quantityBlock.className = 'quantity-section';
quantityBlock.innerHTML = '<span class="product-section-label">Quantity</span><div class="quantity-picker"><button type="button" aria-label="Decrease quantity">−</button><input type="number" value="1" min="1" max="10" inputmode="numeric" aria-label="Quantity"><button type="button" aria-label="Increase quantity">+</button></div>';
payment.before(quantityBlock);
const quantityInput = quantityBlock.querySelector('input');
const quantityButtons = quantityBlock.querySelectorAll('button');
const getQuantity = () => Math.max(1, Math.min(10, Number(quantityInput.value) || 1));
quantityButtons[0].onclick = () => { quantityInput.value = Math.max(1, getQuantity() - 1); };
quantityButtons[1].onclick = () => { quantityInput.value = Math.min(10, getQuantity() + 1); };
quantityInput.onchange = () => { quantityInput.value = getQuantity(); };

function addToCart() {
  const quantity = getQuantity();
  const bag = JSON.parse(localStorage.getItem('zloon_style_bag') || '[]');
  const existing = bag.find(item => item.name === product.name && item.size === size && item.color === colour);
  if (existing) existing.quantity = Math.min(10, existing.quantity + quantity);
  else bag.push({ ...product, color: colour, size, quantity });
  localStorage.setItem('zloon_style_bag', JSON.stringify(bag));
  message.textContent = `${quantity} item${quantity > 1 ? 's' : ''} added to your cart.`;
}

document.querySelector('#addToCart').onclick = addToCart;
const buyButton = document.querySelector('#orderWhatsApp');
buyButton.textContent = 'Buy It Now';
buyButton.onclick = () => {
  const quantity = getQuantity();
  const checkoutItem = { ...product, color: colour, size, quantity };
  sessionStorage.setItem('zloon_buy_now', JSON.stringify([checkoutItem]));
  location.href = 'checkout.html?mode=buy-now';
};
