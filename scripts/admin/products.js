// products.js
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) return window.location.href = "/account.html";

    const productTableBody = document.querySelector("#product-table-body");
    const productForm = document.getElementById("product-form");
    const formTitle = document.getElementById("form-title");
    const submitBtn = document.getElementById("submit-btn");

    if (!productTableBody || !productForm || !formTitle || !submitBtn) {
        console.error("Một hoặc nhiều phần tử DOM không tồn tại.");
        return;
    }

    let isEditing = false;
    let editingProductId = null;

    loadProducts();

    productForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const product = {
            name: productForm.name.value,
            price: parseFloat(productForm.price.value),
            stock: parseInt(productForm.stock.value),
            image: productForm.image.value,
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
            alert("Đã có lỗi xảy ra.");
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
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td><img src="${product.image}" width="50"/></td>
                        <td>${product.name}</td>
                        <td>${formatCurrency(product.price)}</td>
                        <td>${product.stock}</td>
                        <td>
                            <button class="edit-btn" data-id="${product._id}">✏️</button>
                            <button class="delete-btn" data-id="${product._id}">🗑️</button>
                        </td>
                    `;
                    productTableBody.appendChild(tr);
                });

                document.querySelectorAll(".edit-btn").forEach((btn) =>
                    btn.addEventListener("click", () => editProduct(btn.dataset.id))
                );
                document.querySelectorAll(".delete-btn").forEach((btn) =>
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
        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Không lấy được thông tin sản phẩm");

            const product = await res.json();
            if (productForm) {
                productForm.name.value = product.name;
                productForm.price.value = product.price;
                productForm.stock.value = product.stock;
                productForm.image.value = product.image;

                isEditing = true;
                editingProductId = product._id;
                formTitle.textContent = "Chỉnh sửa sản phẩm";
                submitBtn.textContent = "Cập nhật";
            }
        } catch (err) {
            console.error(err);
            alert("Lỗi khi lấy thông tin sản phẩm.");
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
            alert("Lỗi khi xóa sản phẩm.");
        }
    }

    function formatCurrency(amount) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    }
});
