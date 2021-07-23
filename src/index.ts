import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";

import { TContext } from "./types/helperTypes";
import { port, mongoUri } from "./config";
import schema from "./graphql/schema";

(async () => {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  const server = new ApolloServer({
    schema: await schema(),
    context: ({ req }) => {
      const context: TContext = { authBearer: "", userId: null };

      context.authBearer = req.headers.authorization || "";

      return context;
    },
  });
  await server.start();
  server.applyMiddleware({ app });

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
