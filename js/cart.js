const cartBadge = document.querySelector('.cart-badge');
const cartDropdown = document.getElementById('cartDropdown');
const cartItemsList = document.querySelector('.cart-items');
const emptyText = document.querySelector('.empty');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartDisplay() {
  if (cartBadge) cartBadge.textContent = cart.length;

  if (!cartItemsList || !emptyText) return;

  if (cart.length === 0) {
    emptyText.style.display = 'block';
    cartItemsList.innerHTML = '';
  } else {
    emptyText.style.display = 'none';
    cartItemsList.innerHTML = cart
      .map(item => `<li>${item.name} - £${item.price.toFixed(2)}</li>`)
      .join('');
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price) {
  cart.push({ name, price });
  saveCart();
  updateCartDisplay();
}

updateCartDisplay();
window.addToCart = addToCart;
