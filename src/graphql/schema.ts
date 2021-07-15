import { buildSchema } from "type-graphql";

import EventResolver from "./resolvers/EventResolver";

const schema = async () => {
  return await buildSchema({
    resolvers: [EventResolver],
  });
};

export default schema;
