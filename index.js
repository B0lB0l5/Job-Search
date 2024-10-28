import dotenv from "dotenv";
import express from "express";
import path from "path";
import { dbConnection } from "./database/connection.js";
import { bootstrap } from "./src/bootstrap.js";
const app = express();
dotenv.config({ path: path.resolve("./config/.env") });
const port = process.env.PORT || 3000
// connect to db 
dbConnection();
// api
bootstrap(app, express);

app.listen(port, () => console.log(`E-Commerce app listening on port ${port}!`));
