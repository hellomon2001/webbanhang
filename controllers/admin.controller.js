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
    const recentOrders = await orderModel
      .find()
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
export const deleteUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await userModel.findByIdAndDelete(id);
    res.json({ message: "Xóa người dùng thành công" });
  } catch (err) {
    next(err);
  }
};


export const getAllProducts = async (req, res, next) => {
  try {
    const products = await productsModel.find();
    res.json(products);
  } catch (err) {
    console.error("Error in getAllProducts:", err);
    next(err);
  }
};
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params; // Lấy ID từ URL
    const product = await productsModel.findById(id); // Tìm sản phẩm theo ID
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" }); // Nếu không tìm thấy sản phẩm
    }
    res.json(product); // Trả về sản phẩm nếu tìm thấy
  } catch (err) {
    console.error("Error in getProductById:", err); // Log lỗi
    next(err); // Gửi lỗi đi nếu có
  }
};
export const createProduct = async (req, res, next) => {
  try {
    const newProduct = new productsModel(req.body);
    await newProduct.save();
    res
      .status(201)
      .json({
        message: "Sản phẩm đã được thêm thành công",
        product: newProduct,
      });
  } catch (err) {
    console.error("Error in createProduct:", err);
    next(err);
  }
};
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedProduct = await productsModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json({ message: "Sản phẩm đã được cập nhật", product: updatedProduct });
  } catch (err) {
    console.error("Error in updateProduct:", err);
    next(err);
  }
};
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await productsModel.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json({ message: "Sản phẩm đã được xóa" });
  } catch (err) {
    console.error("Error in deleteProduct:", err);
    next(err);
  }
};
