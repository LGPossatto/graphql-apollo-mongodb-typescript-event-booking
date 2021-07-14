import express from "express";

import { port } from "./config";

const app = express();
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(port, () => console.log("Now listening on port 5000..."));
