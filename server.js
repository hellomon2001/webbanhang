import express from "express"
import Dotenv from "dotenv"
import {fileURLToPath} from "url"
import path, {dirname} from "path"



const __dirname = dirname(fileURLToPath(import.meta.url));
Dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use("/images",express.static(path.join(__dirname,'images')));
app.use("/",express.static(path.join(__dirname, 'pages')))
app.use("/css",express.static(path.join(__dirname, 'styles')))

app.listen(PORT,() => console.log("Server is running at PORT:", PORT));