import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import { UsagiController } from "../helpers/wrapController.js";

const authRouter = Router();
const { login, register } = UsagiController(
    new AuthController()
);

authRouter.post("/login", login);
authRouter.post("/register", register);

export default authRouter;