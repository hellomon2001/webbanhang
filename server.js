import express from "express";
import Dotenv from "dotenv";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { indexRouter } from "./routers/index.router.js";
import connectMongodb from "./data/connectDB.js";
import AdminBro from "admin-bro";
import mongoose from "mongoose";
import AdminBroMongoose from "admin-bro-mongoose";
import AdminBroExpress from "admin-bro-expressjs";
import { productsModel } from "./models/products.model.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
Dotenv.config();

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  databases: [mongoose],
  rootPath: "/admin",
  resources: [
    {
      resource: productsModel,
      options: {
        properties: {
          createdAt: {
            isVisible: { list: true, edit: false, filter: true, show: true },
          },
          updatedAt: {
            isVisible: { list: true, edit: false, filter: true, show: true },
          },
        },
        actions: {
          delete: {
            actionType: "record",
            handler: async (request, response, context) => {
              const { record, resource } = context;
              console.log("Attempting to delete record with ID:", record.id());
              try {
                const deleted = await productsModel.findByIdAndDelete(
                  record.id()
                );
                if (!deleted) {
                  throw new Error("Record not found");
                }
                return {
                  record: record.toJSON(),
                  notice: {
                    message: "Record deleted successfully",
                    type: "success",
                  },
                  redirectUrl: "/admin/resources/products",
                };
              } catch (error) {
                console.error("Delete error:", error.message);
                throw new Error("Failed to delete record: " + error.message);
              }
            },
          },
        },
      },
    },
  ],
});

const router = AdminBroExpress.buildRouter(adminBro);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(adminBro.options.rootPath, router);

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/", express.static(path.join(__dirname, "pages")));
app.use("/css", express.static(path.join(__dirname, "styles")));
app.use("/scripts", express.static(path.join(__dirname, "scripts")));

app.use("/api", indexRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || "01";
  if (err.message.includes("Cast to ObjectId failed for value"))
    err.message = "Notfound!";
  return res.status(statusCode).json({
    meta: {
      success: false,
      error: err.message,
      code,
    },
    data: null,
  });
});

connectMongodb(process.env.CONNECTDB)
  .then((data) => {
    console.log(data.message);
    app.listen(PORT, () => console.log("Server is running at PORT:", PORT));
  })
  .catch((err) => {
    console.log(err);
  });
