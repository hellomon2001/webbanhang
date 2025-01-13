import AdminBro from "admin-bro";
import AdminBroExpress from "admin-bro-expressjs";
import bcrypt from "bcryptjs";
import adminModel from "../models/admin.model.js";
import jwt from "jsonwebtoken";

class AdminService {
  constructor() {
    this.adminBro = new AdminBro({
      resources: [],
      rootPath: "/admin",
    });
  }

  async authenticate(email, password) {
    const admin = await adminModel.findOne({ username: email });
    if (admin) {
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (isPasswordValid) {
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return { admin, token };
      }
    }
    return null;
  }

  buildAdminRouter() {
    return AdminBroExpress.buildAuthenticatedRouter(this.adminBro, {
      authenticate: async (email, password) => {
        const authResult = await this.authenticate(email, password);
        return authResult ? authResult.admin : false;
      },
      cookieName: "adminbro",
      cookiePassword: "cookie-secret",
    });
  }
}

export default new AdminService();
