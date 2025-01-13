// import { Router } from "express";
// import AdminService from "../services/admin.service.js"; 

// const adminRouter = Router();
// const { router, authenticateJWT } = AdminService.buildAdminRouter();

// adminRouter.use("/admin", authenticateJWT);
// adminRouter.use(AdminService.adminBro.options.rootPath, router);

// export default adminRouter;





import { Router } from "express";
import AdminService from "../services/admin.service.js";
import path from "path";

const adminRouter = Router();
const adminRouterInstance = AdminService.buildAdminRouter();

// Định tuyến cho trang đăng nhập Admin
adminRouter.get("/admin.html", (req, res) => {
    res.sendFile(path.resolve(__dirname, "pages", "admin.html"));
});

// Bảo vệ đường dẫn Admin bằng cách kiểm tra token
adminRouter.use("/admin", (req, res, next) => {
  const token = req.cookies?.authToken || req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.redirect("/admin.html");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.redirect("/admin.html");
    }
    req.user = user;
    next();
  });
});

// Sử dụng router của AdminBro
adminRouter.use(AdminService.adminBro.options.rootPath, adminRouterInstance);

export default adminRouter;
