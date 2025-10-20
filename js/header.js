// header.js

function initHeader() {
  // === Sidebar logic ===
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuToggle = document.querySelector(".menu-toggle");
  const closeBtn = document.querySelector(".close-btn");

  function toggleSidebar() {
    sidebar?.classList.add("open");
    overlay?.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  function closeSidebar() {
    sidebar?.classList.remove("open");
    overlay?.classList.remove("show");
    document.body.style.overflow = "";
  }

  // Open/close handlers
  if (menuToggle) {
    menuToggle.addEventListener("click", toggleSidebar);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeSidebar);
  }

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeSidebar();
  });

  document.querySelectorAll(".sidebar a").forEach(link => {
    link.addEventListener("click", closeSidebar);
  });

  if (overlay) {
    overlay.addEventListener("click", closeSidebar);
  }

  // === Shopping cart dropdown logic ===
  const cartIcon = document.getElementById("cartIcon");
  const cartDropdown = document.getElementById("cartDropdown");
  const cartContainer = document.getElementById("cartContainer");

  if (cartIcon && cartDropdown && cartContainer) {
    // Toggle dropdown on click
    cartIcon.addEventListener("click", (e) => {
      cartDropdown.classList.toggle("show");
      e.stopPropagation();
    });

    // Keep dropdown open on hover
    cartDropdown.addEventListener("mouseenter", () => {
      cartDropdown.classList.add("show");
    });

    cartDropdown.addEventListener("mouseleave", () => {
      cartDropdown.classList.remove("show");
    });

    // Close dropdown when clicking outside
    document.body.addEventListener("click", (e) => {
      if (!cartContainer.contains(e.target)) {
        cartDropdown.classList.remove("show");
      }
    });
  }

  // Initial cart update
  updateCartUI();
}


// === Utility functions for cart ===

function getCart() {
  const cartJSON = localStorage.getItem("shoppingCart");
  return cartJSON ? JSON.parse(cartJSON) : [];
}

function saveCart(cart) {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

function updateCartUI() {
  const cart = getCart();
  const cartItemsEl = document.querySelector(".cart-items");
  const emptyMsg = document.querySelector(".cart-dropdown .empty");
  const badge = document.querySelector(".cart-badge");

  if (!cartItemsEl || !emptyMsg || !badge) return;

  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    emptyMsg.style.display = "block";
    badge.textContent = "0";
  } else {
    emptyMsg.style.display = "none";

    cart.slice(0, 3).forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.qty} × ${item.name}`;
      cartItemsEl.appendChild(li);
    });

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = totalQty > 99 ? "99+" : totalQty;
  }
}

function addItemToCart(name, qty = 1) {
  const cart = getCart();
  const index = cart.findIndex(item => item.name === name);

  if (index !== -1) {
    cart[index].qty += qty;
  } else {
    cart.push({ name, qty });
  }

  saveCart(cart);
  updateCartUI();
}


// === Export to global scope if needed ===
window.addItemToCart = addItemToCart;
window.initHeader = initHeader;
