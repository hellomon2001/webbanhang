import jwt from "jsonwebtoken";
import { Unauthorized, Forbidden } from "../core/response.error.js";

export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Unauthorized("Access token missing");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    next(new Unauthorized("Invalid or expired token"));
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return next(new Forbidden("You do not have permission (admin only)"));
  }
  next();
};
