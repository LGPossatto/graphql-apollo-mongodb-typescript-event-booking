import { buildSchema } from "type-graphql";

import EventResolver from "./resolvers/EventResolver";
import UserResolver from "./resolvers/UserResolver";

const schema = async () => {
  return await buildSchema({
    resolvers: [EventResolver, UserResolver],
  });
};

export default schema;
