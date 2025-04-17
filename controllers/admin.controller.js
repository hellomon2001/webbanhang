// controllers/admin.controller.js
import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import { productsModel } from "../models/products.model.js";

export const getAdminStats = async (req, res, next) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productsModel.countDocuments();
    const orders = await orderModel.find();

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      totalRevenue,
    });
  } catch (err) {
    console.error("Error in getStats:", err); // Thêm log để kiểm tra lỗi trong controller
    next(err); // Gửi lỗi đi nếu có
  }
};

export const getRecentOrders = async (req, res, next) => {
  try {
    const recentOrders = await orderModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "username");

    res.json(recentOrders);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
    try {
      const users = await userModel.find({}, "-password"); // không trả về password
      res.json(users);
    } catch (err) {
      next(err);
    }
  };
  
  // Xóa người dùng
  export const deleteUserById = async (req, res, next) => {
    try {
      const { id } = req.params;
      await userModel.findByIdAndDelete(id);
      res.json({ message: "Xóa người dùng thành công" });
    } catch (err) {
      next(err);
    }
  };