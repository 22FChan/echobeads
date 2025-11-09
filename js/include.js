// --- Include HTML files dynamically ---
async function includeHTML(id, file) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`Element with id "${id}" not found. Skipping include for ${file}.`);
    return;
  }

  try {
    const res = await fetch(file);
    if (res.ok) {
      el.innerHTML = await res.text();
    } else {
      el.innerHTML = `<!-- Failed to load ${file} (status ${res.status}) -->`;
    }
  } catch (err) {
    console.error("Error including", file, err);
  }
}

// --- Cart data ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// --- Initialize everything after DOM is ready ---
document.addEventListener("DOMContentLoaded", async () => {
  // Include HTML parts
  await includeHTML("header", "header.html");
  await includeHTML("footer", "footer.html");
  await includeHTML("donate", "donate.html");

  // Initialize header, cart, donation popup
  initHeader();
  initDonationPopup();
});

// --- Header, sidebar, cart ---
function initHeader() {
  // Sidebar
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuToggle = document.querySelector('.menu-toggle');
  const closeBtn = document.querySelector('.close-btn');

function openSidebar() {
  sidebar?.classList.add('open');
  overlay?.classList.add('show');
  
  // Lock scroll but compensate for scrollbar width
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = scrollBarWidth + 'px';
}

function closeSidebar() {
  sidebar?.classList.remove('open');
  overlay?.classList.remove('show');

  // Restore scroll
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}


  menuToggle?.addEventListener('click', openSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeSidebar(); });
  document.querySelectorAll(".sidebar a").forEach(link => link.addEventListener("click", closeSidebar));

  // Cart elements (must be after header included)
  const cartBadge = document.querySelector('.cart-badge');
  const cartDropdown = document.getElementById('cartDropdown');
  const cartItemsList = document.querySelector('.cart-items');
  const emptyText = document.querySelector('.empty');
  const cartContainer = document.getElementById('cartContainer');
  const cartIcon = document.getElementById('cartIcon');

  function updateCartDisplay() {
    if(cartBadge) cartBadge.textContent = cart.length;

    if(!cartItemsList || !emptyText) return;

    if(cart.length === 0) {
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

  window.addToCart = addToCart;

  // Initial cart display
  updateCartDisplay();

  // Cart dropdown toggle
  if(cartIcon && cartDropdown && cartContainer) {
    cartIcon.addEventListener('click', e => {
      cartDropdown.classList.toggle('show');
      e.stopPropagation();
    });

    cartDropdown.addEventListener('mouseenter', () => cartDropdown.classList.add('show'));
    cartDropdown.addEventListener('mouseleave', () => cartDropdown.classList.remove('show'));

    document.body.addEventListener('click', e => {
      if(!cartContainer.contains(e.target)) {
        cartDropdown.classList.remove('show');
      }
    });
  }
}

// --- Donation Popup ---
function initDonationPopup() {
  const popup = document.getElementById("donation-popup");
  if(!popup) return;

  const lastShown = localStorage.getItem("donationLastShown");
  const now = Date.now();
  const FIVE_MINUTES = 5 * 60 * 1000;

  if(!lastShown || now - parseInt(lastShown, 10) > FIVE_MINUTES) {
    setTimeout(() => {
      popup.style.display = "block";
      localStorage.setItem("donationLastShown", Date.now().toString());
    }, 2000);
  }

  const closeBtn = popup.querySelector(".close-popup");
  closeBtn?.addEventListener("click", () => {
    popup.style.display = "none";
  });
}




