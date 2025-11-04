async function includeHTML(id, file) {
  const el = document.getElementById(id);
  if (!el) return;
  try {
    const res = await fetch(file);
    if (res.ok) {
      el.innerHTML = await res.text();
    } else {
      el.innerHTML = "<!-- Failed to load " + file + " -->";
    }
  } catch (err) {
    console.error("Error including", file, err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await includeHTML("header", "header.html");
  await includeHTML("footer", "footer.html");

  initHeaderSidebarCart();
  updateCartDisplay();
});



function initHeaderSidebarCart() {
  // To toggle the sidebar
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuToggle = document.querySelector('.menu-toggle');
  const closeBtn = document.querySelector('.close-btn');

  menuToggle?.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('show');
  });
  closeBtn?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });
  overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
  });

  const cartIcon = document.getElementById('cartIcon');
  cartIcon?.addEventListener('click', () => {
    const cartDropdown = document.getElementById('cartDropdown');
    cartDropdown.classList.toggle('show');
  });
}

// Make the cart display thingy
const cartBadge = document.querySelector('.cart-badge');
const cartItemsList = document.querySelector('.cart-items');
const emptyText = document.querySelector('.empty');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartDisplay() {
  if (!cartBadge) return;
  cartBadge.textContent = cart.length;

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

// Make addToCart global for other pages
window.addToCart = addToCart;
