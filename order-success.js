const successQuery = new URLSearchParams(location.search);
document.querySelector('#customerName').textContent = successQuery.get('name') || 'ZLOON customer';
document.querySelector('#orderId').textContent = successQuery.get('order') || 'ZLOON order';
document.querySelector('#paymentMethod').textContent = successQuery.get('payment') || 'Cash on Delivery';
