const hidden_cart = document.querySelector(".hidden_cart");
const cart = document.querySelector(".cart");

hidden_cart.addEventListener("mouseenter", () => {
  cart.classList.remove("obscure");
});

hidden_cart.addEventListener("mouseleave", () => {
  cart.classList.add("obscure");
});

const obscure = () => {
  cart.classList.add("obscure");
};
const showCart = () => {
  cart.classList.remove("obscure");
};

cart.addEventListener("mouseenter", showCart);
cart.addEventListener("mouseleave", obscure);

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
  
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
  
    renderCart();
  }
  
  function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.cart');
  
    if (cart.length === 0) {
      cartContainer.innerHTML = `
        <div class="cart obscure">
          <div class="over_cart">
            <h3>Cart</h3>
          </div>
          <div>
            <div class="main_cart">
              <div class="items">
                <span>0</span>
              </div>
              <span>Your shopping bag is empty.</span>
              <a href=""><span class="hidden_instruction">Go to all products page</span><button class="btn_cart">Explore products</button></a>
            </div>
          </div>
        </div>
      `;
      return;
    }
  
    let cartContent = '';
  
    cart.forEach(product => {
      cartContent += `
        <div class="cart obscure">
          <div class="over_cart">
            <h3>Cart</h3>
          </div>
  
          <div class="cart_top">
            <div class="main_cart_top">
              <a href="">
                <div class="img_cart_top">
                  <img src="${product.image}" alt="" />
                </div>
              </a>
  
              <div class="right_cart_top">
                <div class="content_cart_top">
                  <div class="main_cart_right">
                    <div class="info_product_cart">
                      <h3><a href="">${product.title}</a></h3>
                      <p>Quantity: ${product.quantity}</p>
                    </div>
  
                    <div class="end_right_cart">
                      <div class="price_right_cart">
                        <div class="text_right">
                          <span>${product.price}</span>
                          <span>${product.sale}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div class="remove_cart_bot">
                  <button onclick="removeFromCart(${product.id})">
                    <i class="fa-regular fa-trash-can" id="icon_remove"></i>
                    <span class="remove_span" data-id="${product.id}">Remove</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
  
          <div class="bottom_cart">
            <div class="top_bottom_cart">
              <span>Subtotal <span style="font-weight: 400">(excl. taxes)</span></span>
              <span class="price_bottom_cart">${(product.price * product.quantity).toFixed(2)}</span>
            </div>
            <a href="/cart.html">
              <button class="go_to_cart">Go to cart</button>
            </a>
          </div>
        </div>
      `;
    });
  
    cartContainer.innerHTML = cartContent;
  }
  
  function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(product => product.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart(); 
  }
  







 