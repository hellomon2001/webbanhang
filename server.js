import express from "express";
import Dotenv from "dotenv";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { indexRouter } from "./routers/index.router.js";
import connectMongodb from "./data/connectDB.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
Dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

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
