import { ObjectId } from "mongodb";

export type TContext = {
  userToken: string;
  userId: ObjectId;
};
