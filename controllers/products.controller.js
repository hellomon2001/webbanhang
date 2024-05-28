import Products_service from "../services/products.service.js";

class Products_controller {
  getAllproducts = async (req, res, next) =>
    (await Products_service.Products(req.query.category)).send(res);

  getProduct = async (req, res, next) =>
    (await Products_service.Product(req.params.id)).send(res);

  searchProduct = async (req, res, next) =>
    (await Products_service.SearchProducts(req.query.title)).send(res);
}

export default new Products_controller();
