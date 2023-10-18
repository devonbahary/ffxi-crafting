import express from "express";
import items from "./routes/items";
import synthesis from "./routes/synthesis";

const app = express();

app.use(express.json());

app.use("/items", items);
app.use("/synthesis", synthesis);

app.listen(3000, () =>
  console.log(`Server is listening on port 3000`)
);
