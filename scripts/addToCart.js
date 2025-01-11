document.addEventListener("DOMContentLoaded", function () {
    const shoppingCart = JSON.parse(localStorage.getItem("cart")) || [];
  
    const shoppingCartTableBody = document.querySelector("tbody");
  
    if (!shoppingCartTableBody) {
      console.error("Không tìm thấy phần tử <tbody>");
      return;
    }

    const subtotalElement = document.getElementById('subtotalAmount');
    const totalElement = document.getElementById('totalAmount');
    const errorSpan = document.getElementById('errorSpan');
  
    function calculateTotal() {
        let subtotal = 0;
        shoppingCart.forEach(product => {
            subtotal += product.sale * product.quantity;
        });
        subtotalElement.innerText = `$${subtotal.toFixed(2)}`;
        totalElement.innerText = `$${subtotal.toFixed(2)}`;
        return subtotal;
    }

    function displayShoppingCart() {
      shoppingCartTableBody.innerHTML = "";

      if (shoppingCart.length === 0) {
        shoppingCartTableBody.innerHTML = "<tr><td colspan='5'>Your cart is empty!</td></tr>";
        return;
      }

      shoppingCart.forEach((product, index) => {
        const total = product.sale * product.quantity;

        const row = `
          <tr>
            <td class="img_td">
              <a href="">
                <div class="img_cart">
                  <img src="${product.image}" alt="${product.title}" />
                </div>
              </a>
            </td>
            <td class="name_td">
              <p>${product.title}</p>
            </td>
            <td class="quantity_td">
              <div class="total_quantity">
                <select data-index="${index}">
                  <option value="1" ${product.quantity === 1 ? "selected" : ""}>1</option>
                  <option value="2" ${product.quantity === 2 ? "selected" : ""}>2</option>
                  <option value="3" ${product.quantity === 3 ? "selected" : ""}>3</option>
                  <option value="4" ${product.quantity === 4 ? "selected" : ""}>4</option>
                  <option value="5" ${product.quantity === 5 ? "selected" : ""}>5</option>
                </select>
              </div>
            </td>
            <td class="price_td small:table-cell">
              <div class="price_cartproducts">
                <p><span>${product.sale}</span></p>
              </div>
            </td>
            <td class="totalprice_td">
              <span>${total.toFixed(2)} $</span>
            </td>
          </tr>
        `;

        shoppingCartTableBody.innerHTML += row;
      });
      calculateTotal();
    }

    shoppingCartTableBody.addEventListener("change", function (e) {
      if (e.target.tagName.toLowerCase() === "select") {
        const index = e.target.getAttribute("data-index");
        const newQuantity = parseInt(e.target.value);

        shoppingCart[index].quantity = newQuantity;

        localStorage.setItem("cart", JSON.stringify(shoppingCart));

        displayShoppingCart();
      }
    });

    document.getElementById('discountForm').addEventListener('submit', function(e) {
      e.preventDefault(); 

      const discountCode = document.getElementById('discountCode').value;
      const subtotal = calculateTotal();
      if (discountCode === "DISCOUNT10") {
        const discountAmount = subtotal * 0.1;
        const newTotal = subtotal - discountAmount;

        subtotalElement.innerText = `$${(subtotal - discountAmount).toFixed(2)}`;
        totalElement.innerText = `$${newTotal.toFixed(2)}`;
        errorSpan.style.display = 'none';
      } else {
        errorSpan.style.display = 'block';
      }
    });

    displayShoppingCart();
});
