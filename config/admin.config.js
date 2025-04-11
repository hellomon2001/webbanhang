import dotenv from "dotenv";
dotenv.config();

import AdminBro from "admin-bro";
import AdminBroMongoose from "admin-bro-mongoose";
import AdminBroExpress from "admin-bro-expressjs";
import mongoose from "mongoose";
import { productsModel } from "../models/products.model.js";
import userModel from "../models/user.model.js"; 
import bcrypt from "bcryptjs";

AdminBro.registerAdapter(AdminBroMongoose);

// Tạo instance AdminBro
const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: "/admin",
  resources: [
    {
      resource: productsModel,
      options: {
        properties: {
          createdAt: { isVisible: { list: true, edit: false, filter: true, show: true } },
          updatedAt: { isVisible: { list: true, edit: false, filter: true, show: true } },
        },
      },
    },
  ],
});

// Phân quyền đăng nhập chỉ cho user có role: 'admin'
const adminRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await userModel.findOne({ username: email });
    if (user && user.role === 'admin') {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) return user;
    }
    return null;
  },
  cookieName: "adminbro",
  cookiePassword: process.env.ADMIN_COOKIE_PASS,
});

export { adminBro, adminRouter };
