import { productsModel } from "../models/products.model.js";
import { NotFound, ResponseError } from "../core/response.error.js";
import { OK, ResponseSuccess } from "../core/response.success.js";

class Products_service {
  Products = async (category) => {
    const query = category ? { category } : {};
    const data = await productsModel.find(query);
    return new OK(data)
  };

  Product = async (id) => {
    if (!id) throw new NotFound();
    const data = await productsModel.findOne({ _id: id });
    if (data)
      return new ResponseSuccess
  };

  SearchProducts = async (title) => {
    if (!title) throw new NotFound();
    const data = await productsModel.find({ title: { $regex: title } });
    if (data)
    return new ResponseSuccess
  };
}

export default new Products_service();
