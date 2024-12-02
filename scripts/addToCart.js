document.addEventListener("DOMContentLoaded", function () {
    // Lấy giỏ hàng từ LocalStorage
    const shoppingCart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // Lấy tbody để hiển thị giỏ hàng
    const shoppingCartTableBody = document.querySelector("tbody");
  
    if (!shoppingCartTableBody) {
      console.error("Không tìm thấy phần tử <tbody>");
      return;
    }

    // Lấy các phần tử cần cập nhật
    const subtotalElement = document.getElementById('subtotalAmount');
    const totalElement = document.getElementById('totalAmount');
    const errorSpan = document.getElementById('errorSpan');
  
    // Hàm tính tổng tiền giỏ hàng
    function calculateTotal() {
        let subtotal = 0;
        shoppingCart.forEach(product => {
            subtotal += product.sale * product.quantity;
        });
        // Cập nhật subtotal
        subtotalElement.innerText = `$${subtotal.toFixed(2)}`;
        totalElement.innerText = `$${subtotal.toFixed(2)}`;
        return subtotal;
    }

    // Hàm hiển thị giỏ hàng
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
      // Tính lại tổng tiền sau khi hiển thị giỏ hàng
      calculateTotal();
    }

    // Lắng nghe sự kiện thay đổi số lượng
    shoppingCartTableBody.addEventListener("change", function (e) {
      if (e.target.tagName.toLowerCase() === "select") {
        const index = e.target.getAttribute("data-index");
        const newQuantity = parseInt(e.target.value);

        // Cập nhật số lượng sản phẩm trong giỏ hàng
        shoppingCart[index].quantity = newQuantity;

        // Cập nhật lại giỏ hàng trong LocalStorage
        localStorage.setItem("cart", JSON.stringify(shoppingCart));

        // Cập nhật lại giỏ hàng trên giao diện
        displayShoppingCart();
      }
    });

    // Xử lý mã giảm giá
    document.getElementById('discountForm').addEventListener('submit', function(e) {
      e.preventDefault(); // Ngăn không cho form gửi đi

      const discountCode = document.getElementById('discountCode').value;

      // Kiểm tra mã giảm giá
      const subtotal = calculateTotal();
      if (discountCode === "DISCOUNT10") {
        // Giảm giá 10%
        const discountAmount = subtotal * 0.1;
        const newTotal = subtotal - discountAmount;

        // Cập nhật giá trị
        subtotalElement.innerText = `$${(subtotal - discountAmount).toFixed(2)}`;
        totalElement.innerText = `$${newTotal.toFixed(2)}`;
        errorSpan.style.display = 'none';
      } else {
        errorSpan.style.display = 'block';
      }
    });

    // Hiển thị giỏ hàng
    displayShoppingCart();
});
