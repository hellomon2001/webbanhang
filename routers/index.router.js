import {Router} from "express";
import Products_router from "./products.router.js";
import authRouter from "./auth.router.js";

export const indexRouter = Router()

indexRouter.use("/products",Products_router)
indexRouter.use("/auth", authRouter)
