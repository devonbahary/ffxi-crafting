import express from "express";
import dotenv from "dotenv";
import items from "./routes/items";
import synthesis from "./routes/synthesis";

dotenv.config();

const { SERVER_PORT } = process.env;

const app = express();

app.use(express.json());

app.use("/items", items);
app.use("/synthesis", synthesis);

app.listen(SERVER_PORT, () =>
  console.log(`Server is listening on port ${SERVER_PORT}`)
);
