import mongoose from "mongoose";

const productsSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image_bg: {
      type: String,
    },
    price_origin: {
      type: Number,
      required: true,
    },
    sale: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    imagesDetail: [],   
  },
  {
    timestamps: true,
  }
);

export const productsModel = mongoose.model("products",productsSchema)