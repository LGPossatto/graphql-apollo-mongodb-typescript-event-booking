import "reflect-metadata";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import mongoose from "mongoose";

import { port, mongoUri } from "./config";
import schema from "./graphql/schema";

(async () => {
  const app = express();
  app.use(express.json());
  app.use(
    "/graphql",
    graphqlHTTP({
      schema: await schema(),
      graphiql: true,
    })
  );

  mongoose
    .connect(mongoUri as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Now connected to database...");
      app.listen(port, () => console.log("Now listening on port 5000..."));
    });
})();
