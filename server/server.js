import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import items from "./items";

dotenv.config();

const { SERVER_PORT } = process.env;

const app = express();

// app.use(bodyParser.json());
app.use(express.json());

app.use("/items", items);

app.listen(SERVER_PORT, () =>
  console.log(`Server is listening on port ${SERVER_PORT}`)
);
