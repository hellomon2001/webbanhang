import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/authorization.js";

const adminRoutes = express.Router();

adminRoutes.get(
  "/admin-only",
  verifyToken, 
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome admin!" });
  }
);

export default adminRoutes;
