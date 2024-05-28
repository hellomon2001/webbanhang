import {Router} from "express";
import Products_router from "./products.router.js";

export const indexRouter = Router()

indexRouter.use("/products",Products_router)