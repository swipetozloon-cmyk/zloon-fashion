window.zloonOpenLook = function (item) {
  const params = new URLSearchParams({
    name: item.name,
    image: item.url,
    price: item.price || '₹799'
  });
  location.href = `product.html?${params.toString()}`;
};
