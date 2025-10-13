// catalog.js - loads products.json and renders product grid
async function loadProducts(containerSelector){
  try{
    const res = await fetch('../data/products.json');
    const products = await res.json();
    const container = document.querySelector(containerSelector);
    if(!container) return;
    container.innerHTML = '';
    products.forEach(p=>{
      const card = document.createElement('article'); card.className='product-card';
      card.innerHTML = `
        <img class="product-image" loading="lazy" src="${p.image}" alt="${p.name}">
        <div class="product-name">${p.name}</div>
        <div class="product-price">£${p.price}</div>
        <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
          <input class="qty-input" type="number" min="1" value="1" data-id="${p.id}">
          <button class="add-to-cart-btn" data-id="${p.id}" data-name="${p.name}" data-price="${p.price}" data-image="${p.image}">Add to cart</button>
        </div>
      `;
      container.appendChild(card);
    });

    // wire buttons
    container.querySelectorAll('.add-to-cart-btn').forEach(btn=> btn.addEventListener('click', function(){
      const id = this.dataset.id; const name = this.dataset.name; const price = Number(this.dataset.price); const image = this.dataset.image;
      const q = Number(this.parentElement.querySelector('.qty-input').value) || 1;
      addToCart({id,name,price,image,qty:q});
    }));

  }catch(e){ console.error('Failed to load products', e) }
}

// helper to get product by id (used by product page)
async function getProductById(id){
  const res = await fetch('../data/products.json');
  const products = await res.json();
  return products.find(p=> p.id === id);
}
