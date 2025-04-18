// products.js
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

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const product = {
      title: productForm["product-name"].value, // Tên sản phẩm
      price_origin: parseFloat(productForm["product-price"].value), // Giá gốc
      sale: parseFloat(productForm["product-sale"].value) || 0, // Giảm giá (%)
      category: productForm["product-category"].value, // Danh mục
      description_product: productForm["product-description"].value, // Mô tả sản phẩm
      image_bg: productForm["product-image-bg"].value, // Hình ảnh nền
      imagesDetail: Array.from(productForm["product-images"].files).map(
        (file) => file.name
      ), // Danh sách hình ảnh chi tiết
    };

    try {
      let res;
      if (isEditing) {
        res = await fetch(`/api/admin/products/${editingProductId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(product),
        });
      } else {
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
      productForm.reset();
      isEditing = false;
      editingProductId = null;
      formTitle.textContent = "Thêm sản phẩm";
      submitBtn.textContent = "Thêm";
      loadProducts();
    } catch (err) {
      console.error(err);
      alert(`Đã có lỗi xảy ra: ${err.message}`);
    }
  });

  async function loadProducts() {
    try {
      const res = await fetch("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Không thể lấy danh sách sản phẩm");

      const products = await res.json();
      if (productTableBody) {
        productTableBody.innerHTML = "";
        products.forEach((product) => {
          // Tính giá sau giảm
          const discountedPrice =
            (product.price_origin || 0) * (1 - (product.sale || 0) / 100);

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td><img src="${
              product.image_bg
            }" width="50" alt="Hình ảnh sản phẩm"/></td>
            <td>${product.title}</td>
            <td>${product.category}</td>
            <td>${formatCurrency(product.price_origin)}</td>
            <td>${product.sale}%</td>
            <td>${formatCurrency(
              discountedPrice
            )}</td> <!-- Hiển thị giá sau giảm -->
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

  async function editProduct(id) {
    console.log("Editing product with ID:", id); // Debug ID
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!res.ok) throw new Error("Không lấy được thông tin sản phẩm");
  
      const product = await res.json();
      if (productForm) {
        productForm["product-name"].value = product.title || "";
        productForm["product-price"].value = product.price_origin || 0;
        if (productForm["product-sale"]) {
          productForm["product-sale"].value = product.sale || 0;
        }
        productForm["product-category"].value = product.category || "";
        productForm["product-description"].value = product.description_product || "";
        productForm["product-image-bg"].value = product.image_bg || "";
  
        isEditing = true;
        editingProductId = product._id;
        formTitle.textContent = "Chỉnh sửa sản phẩm";
        submitBtn.textContent = "Cập nhật";
      }
    } catch (err) {
      console.error(err);
      alert(`Lỗi khi lấy thông tin sản phẩm: ${err.message}`);
    }
  }

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

  function formatCurrency(amount) {
    if (isNaN(amount)) amount = 0;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }
  
  function showAddProductModal() {
    const modal = document.getElementById("product-modal");
    if (modal) modal.style.display = "block";
  }

  function closeModal() {
    const modal = document.getElementById("product-modal");
    if (modal) modal.style.display = "none";
  }
});
