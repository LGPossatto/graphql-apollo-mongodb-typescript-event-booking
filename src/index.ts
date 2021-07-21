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
    graphqlHTTP(async (req) => {
      return {
        schema: await schema(),
        context: {
          userToken: req.headers.authorization,
          userId: "",
        },
        graphiql: true,
      };
    })
  );

  mongoose
    .connect(mongoUri as string, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("Now connected to database...");
      app.listen(port, () => console.log("Now listening on port 5000..."));
    });
})();
