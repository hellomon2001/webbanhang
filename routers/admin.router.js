import express from "express";
import {
  getAdminStats,
  getRecentOrders,
  getAllUsers,
  deleteUserById,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById
} from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorization.js";

const adminRoutes = express.Router();

// Middleware áp dụng cho tất cả routes bên dưới
adminRoutes.use(verifyToken, authorizeRoles("admin"));

adminRoutes.get("/admin-only", (req, res) => {
  res.json({ message: "Welcome admin!" });
});

// Lấy thống kê admin (dashboard)
adminRoutes.get("/stats", getAdminStats);

// Lấy đơn hàng gần đây
adminRoutes.get("/orders/recent", getRecentOrders);

adminRoutes.get("/users", getAllUsers);
adminRoutes.delete("/users/:id", deleteUserById);

adminRoutes.get("/products/:id", getProductById);
adminRoutes.get("/products", getAllProducts); // Lấy danh sách sản phẩm
adminRoutes.post("/products", createProduct); // Thêm sản phẩm mới
adminRoutes.put("/products/:id", updateProduct); // Cập nhật sản phẩm
adminRoutes.delete("/products/:id", deleteProduct); // Xóa sản phẩm

export default adminRoutes;
