document.addEventListener("DOMContentLoaded", () => {
    // Lấy thông tin admin từ localStorage
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/account.html";
        return;
    }

    // Hiển thị tên admin
    const adminUsername = document.getElementById("admin-username");
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (Date.now() >= payload.exp * 1000) {
            localStorage.removeItem("token");
            window.location.href = "/account.html";
          }
        adminUsername.textContent = payload.username;
    } catch (error) {
        console.error("Lỗi khi đọc token:", error);
    }

    // Xử lý đăng xuất
    const logoutBtn = document.querySelector(".logout");
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
    });

    // Lấy thống kê
    async function getStats() {
        try {
            const response = await fetch("/api/admin/stats", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                document.getElementById("total-products").textContent = data.totalProducts;
                document.getElementById("total-orders").textContent = data.totalOrders;
                document.getElementById("total-users").textContent = data.totalUsers;
                document.getElementById("total-revenue").textContent = formatCurrency(data.totalRevenue);
            }
        } catch (error) {
            console.error("Lỗi khi lấy thống kê:", error);
        }
    }

    // Lấy danh sách đơn hàng gần đây
    async function getRecentOrders() {
        try {
            const response = await fetch("/api/admin/orders/recent", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const orders = await response.json();
                const tbody = document.getElementById("recent-orders");
                tbody.innerHTML = orders.map(order => `
                    <tr>
                        <td>${order._id}</td>
                        <td>${order.user.username}</td>
                        <td>${formatDate(order.createdAt)}</td>
                        <td>${formatCurrency(order.total)}</td>
                        <td>${getStatusBadge(order.status)}</td>
                        <td>
                            <button onclick="viewOrder('${order._id}')" class="btn-view">Xem</button>
                        </td>
                    </tr>
                `).join("");
            }
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng:", error);
        }
    }

    async function getUsers() {
        try {
            const res = await fetch("/api/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Không lấy được danh sách người dùng");

            const users = await res.json();
            const tbody = document.querySelector("#user-table tbody");
            tbody.innerHTML = "";

            users.forEach((user) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td><button data-id="${user._id}" class="delete-user">❌ Xóa</button></td>
                `;
                tbody.appendChild(tr);
            });

            // Gán sự kiện xóa
            document.querySelectorAll(".delete-user").forEach((btn) => {
                btn.addEventListener("click", async () => {
                    const id = btn.getAttribute("data-id");
                    if (confirm("Bạn có chắc muốn xóa người dùng này?")) {
                        await deleteUser(id);
                    }
                });
            });
        } catch (err) {
            console.error("Lỗi khi lấy danh sách người dùng:", err);
        }
    }

    async function deleteUser(id) {
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Không thể xóa người dùng");

            alert("Đã xóa người dùng.");
            getUsers(); // load lại danh sách
        } catch (err) {
            console.error("Lỗi khi xóa người dùng:", err);
        }
    }

    // Hàm định dạng tiền tệ
    function formatCurrency(amount) {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(amount);
    }

    // Hàm định dạng ngày tháng
    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    // Hàm tạo badge trạng thái
    function getStatusBadge(status) {
        const statusMap = {
            pending: { text: "Đang chờ", class: "badge-pending" },
            processing: { text: "Đang xử lý", class: "badge-processing" },
            completed: { text: "Hoàn thành", class: "badge-completed" },
            cancelled: { text: "Đã hủy", class: "badge-cancelled" }
        };

        const statusInfo = statusMap[status] || { text: status, class: "badge-default" };
        return `<span class="badge ${statusInfo.class}">${statusInfo.text}</span>`;
    }

    // Hàm xem chi tiết đơn hàng
    window.viewOrder = function(orderId) {
        window.location.href = `/admin/orders/${orderId}`;
    };

    // Gọi các hàm để lấy dữ liệu
    getStats();
    getRecentOrders();
    getUsers();
}); 