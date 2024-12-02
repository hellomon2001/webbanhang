async function renderDetailProduct(id, elementParent) {
  // Hàm thêm sản phẩm vào giỏ hàng
  function addToCart(product) {
    // Lấy giỏ hàng từ Local Storage hoặc khởi tạo mảng rỗng
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      // Nếu đã tồn tại, tăng số lượng
      existingProduct.quantity += 1;
    } else {
      // Nếu chưa, thêm sản phẩm mới với số lượng = 1
      product.quantity = 1;
      cart.push(product);
    }

    // Lưu giỏ hàng vào Local Storage
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Product added to cart!");
  }

  try {
    // Gửi request để lấy dữ liệu sản phẩm từ MongoDB
    const res = await fetch(`/api/products/${id}`);
    const data = await res.json();

    if (data.meta.success) {
      const {
        category,
        image_bg,
        price_origin,
        sale,
        title,
        description_product,
      } = data.data;

      const galleryImages = [image_bg];

      if (elementParent) {
        // Render chi tiết sản phẩm vào giao diện
        elementParent.innerHTML += `
          <div class="product_info">
            <div class="left_description">
              <div class="description">
                <a href="/index.html">${category}</a>
                <h2 class="title_product">${title}</h2>
                <p>${description_product}</p>
              </div>
            </div>

            <div class="center_img">
              <div class="gallery">
                <div class="cover_img">
                  <div class="boder_img">
                    ${galleryImages.map((item) => `<img id="select" src="${item}" />`).join("")}
                  </div>
                </div>
              </div>

              <div class="right_description">
                <div class="price">
                  <span>${price_origin} $</span>
                  <p>${Math.round((price_origin - (price_origin / 100) * sale) * 100) / 100} $</p>
                </div>
                <button
                  class="price_button"
                  type="button"
                  data-id="${id}"
                  data-title="${title}"
                  data-price="${price_origin}"
                  data-sale="${Math.round((price_origin - (price_origin / 100) * sale) * 100) / 100}"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        `;

        // Gắn sự kiện cho nút "Add to cart"
        const addToCartButton = elementParent.querySelector('.price_button');
        addToCartButton.addEventListener('click', function () {
          const product = {
            id: id,
            title: title,
            price: price_origin,
            sale: Math.round((price_origin - (price_origin / 100) * sale) * 100) / 100,
            image: image_bg // Nếu cần hiển thị hình ảnh trong giỏ hàng
          };

          addToCart(product); // Gọi hàm thêm vào giỏ hàng
        });

      } else {
        console.log("Something wrong with elementParent");
      }
    }
  } catch (error) {
    console.log("Something wrong with renderDetailProduct!", error);
  }
}
