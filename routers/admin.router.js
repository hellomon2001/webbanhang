import express from "express";
import { getAdminStats, getRecentOrders, getAllUsers, deleteUserById } from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorization.js";

const adminRoutes = express.Router();

// Middleware áp dụng cho tất cả routes bên dưới
adminRoutes.use(verifyToken, authorizeRoles("admin"));

// Route test quyền admin (tuỳ chọn giữ lại để debug)
adminRoutes.get("/admin-only", (req, res) => {
  res.json({ message: "Welcome admin!" });
});

// Lấy thống kê admin (dashboard)
adminRoutes.get("/stats", getAdminStats);

// Lấy đơn hàng gần đây
adminRoutes.get("/orders/recent", getRecentOrders);

adminRoutes.get("/users", getAllUsers);
adminRoutes.delete("/users/:id", deleteUserById);

export default adminRoutes;
