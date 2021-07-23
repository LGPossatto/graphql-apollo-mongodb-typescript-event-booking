import { ObjectId } from "mongodb";

export type TContext = {
  authBearer: string;
  userId: ObjectId | null;
};
