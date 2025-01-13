import {Router} from "express";
import Products_router from "./products.router.js";
import authRouter from "./auth.router.js";
import adminRouter from "./admin.router.js";

export const indexRouter = Router()

indexRouter.use("/products",Products_router)
indexRouter.use("/auth", authRouter)
indexRouter.use(adminRouter)