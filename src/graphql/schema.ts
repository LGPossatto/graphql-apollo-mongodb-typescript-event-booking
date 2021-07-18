import { buildSchema } from "type-graphql";

import EventResolver from "./resolvers/EventResolver";
import UserResolver from "./resolvers/UserResolver";
import BookingResolver from "./resolvers/BookingResolver";

const schema = async () => {
  return await buildSchema({
    resolvers: [EventResolver, UserResolver, BookingResolver],
  });
};

export default schema;
