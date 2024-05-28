import { Router } from "express";
import Products_controller from "../controllers/products.controller.js";
import { UsagiController } from "../helpers/wrapcontroller.js";

const Products_router = Router();
const { getAllproducts, getProduct, searchProduct } =
  UsagiController(Products_controller);

Products_router.get("/", getAllproducts);
Products_router.get("/search", searchProduct);
Products_router.get("/:id", getProduct);

export default Products_router;
