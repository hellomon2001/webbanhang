document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) return (window.location.href = "/account.html");

  const productTableBody = document.querySelector("#products-table-body");
  const productForm = document.getElementById("product-form");
  const formTitle = document.getElementById("modal-title");
  const submitBtn = document.querySelector(".btn-save");

  if (!productTableBody) console.error("Không tìm thấy #products-table-body");
  if (!productForm) console.error("Không tìm thấy #product-form");
  if (!formTitle) console.error("Không tìm thấy #modal-title");
  if (!submitBtn) console.error("Không tìm thấy .btn-save");

  if (!productTableBody || !productForm || !formTitle || !submitBtn) {
    return;
  }

  let isEditing = false;
  let editingProductId = null;

  loadProducts();

  // Xử lý sự kiện submit của form
  productForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form
    const product = {
      title: productForm["product-name"].value,
      price_origin: parseFloat(productForm["product-price"].value) || 0, 
  sale: parseFloat(productForm["product-sale"].value) || 0, 
      category: productForm["product-category"].value,
      description_product: productForm["product-description"].value,
      image_bg: productForm["product-image-bg"].value,
      imagesDetail: Array.from(productForm["product-images"].files).map(
        (file) => file.name
      ),
    };
  
    try {
      let res;
      if (isEditing) {
        // Gửi yêu cầu cập nhật sản phẩm
        res = await fetch(`/api/admin/products/${editingProductId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(product),
        });
      } else {
        // Gửi yêu cầu thêm sản phẩm mới
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(product),
        });
      }
  
      if (!res.ok) throw new Error("Lỗi khi lưu sản phẩm");
  
      alert(isEditing ? "Đã cập nhật sản phẩm." : "Đã thêm sản phẩm.");
      closeModal(); // Đóng modal sau khi lưu
      loadProducts(); // Tải lại danh sách sản phẩm
    } catch (err) {
      console.error(err);
      alert(`Đã có lỗi xảy ra: ${err.message}`);
    }
  });
  // Tải danh sách sản phẩm và danh mục
  async function loadProducts() {
    try {
      const res = await fetch("/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể lấy danh sách sản phẩm");

      const response = await res.json();
      const products = response.data; // Dữ liệu sản phẩm
      const categories = [...new Set(products.map((product) => product.category))]; // Lấy danh mục duy nhất

      // Hiển thị danh mục trong modal
      const categorySelect = document.getElementById("product-category");
      categorySelect.innerHTML = '<option value="">Chọn danh mục</option>';
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
      });

      // Hiển thị sản phẩm trong bảng
      if (productTableBody) {
        productTableBody.innerHTML = "";
        products.forEach((product) => {
          const discountedPrice =
            (product.price_origin || 0) * (1 - (product.sale || 0) / 100);

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td><img src="${product.image_bg}" width="50" alt="Hình ảnh sản phẩm"/></td>
            <td>${product.title}</td>
            <td>${product.category}</td>
            <td>${formatCurrency(product.price_origin)}</td>
            <td>${product.sale}%</td>
            <td>${formatCurrency(discountedPrice)}</td>
            <td>
              <button class="edit-btn" data-id="${product._id}">✏️</button>
              <button class="delete-btn" data-id="${product._id}">🗑️</button>
            </td>
          `;
          productTableBody.appendChild(tr);
        });

        document
          .querySelectorAll(".edit-btn")
          .forEach((btn) =>
            btn.addEventListener("click", () => editProduct(btn.dataset.id))
          );
        document
          .querySelectorAll(".delete-btn")
          .forEach((btn) =>
            btn.addEventListener("click", () => deleteProduct(btn.dataset.id))
          );
      } else {
        console.error("Không tìm thấy bảng sản phẩm trong DOM");
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Chỉnh sửa sản phẩm
  async function editProduct(id) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) throw new Error("Không lấy được thông tin sản phẩm");
  
      const response = await res.json();
      const product = response.data;
  
      if (productForm) {
        productForm["product-name"].value = product.title || "";
        productForm["product-price"].value = product.price_origin || 0;
        if (productForm["product-sale"]) {
          productForm["product-sale"].value = product.sale || 0;
        }
        productForm["product-category"].value = product.category || ""; // Gán danh mục
        productForm["product-description"].value = product.description_product || "";
        productForm["product-image-bg"].value = product.image_bg || "";
  
        isEditing = true; // Đặt trạng thái chỉnh sửa
        editingProductId = product._id; // Gán ID sản phẩm đang chỉnh sửa
        formTitle.textContent = "Chỉnh sửa sản phẩm";
        submitBtn.textContent = "Cập nhật";
  
        // Hiển thị modal
        showAddProductModal();
      }
    } catch (err) {
      console.error(err);
      alert(`Lỗi khi lấy thông tin sản phẩm: ${err.message}`);
    }
  }

  // Xóa sản phẩm
  async function deleteProduct(id) {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể xóa sản phẩm");

      alert("Đã xóa sản phẩm.");
      loadProducts();
    } catch (err) {
      console.error(err);
      alert(`Lỗi khi xóa sản phẩm: ${err.message}`);
    }
  }

  // Định dạng tiền tệ
  function formatCurrency(amount) {
    if (isNaN(amount)) amount = 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  // Đưa hàm ra phạm vi toàn cục
  window.showAddProductModal = function () {
    const modal = document.getElementById("product-modal");
    if (modal) {
      modal.style.display = "block"; // Hiển thị modal
      formTitle.textContent = "Thêm sản phẩm mới"; // Đặt tiêu đề modal
      productForm.reset(); // Reset form để xóa dữ liệu cũ
      isEditing = false; // Đặt trạng thái không phải chỉnh sửa
      submitBtn.textContent = "Thêm"; // Đặt nút thành "Thêm"
    }
  };

  // Đóng modal
  window.closeModal = function () {
    const modal = document.getElementById("product-modal");
    if (modal) {
      modal.style.display = "none"; // Ẩn modal
      productForm.reset(); // Reset form khi đóng modal
      isEditing = false; // Reset trạng thái chỉnh sửa
      editingProductId = null;
      formTitle.textContent = "Thêm sản phẩm";
      submitBtn.textContent = "Thêm";
    }
  };
});