import { ObjectId } from "mongodb";
import { prop, Ref } from "@typegoose/typegoose";
import { Field, ID, InputType, ObjectType } from "type-graphql";

import { Event } from "./eventTypes";

@ObjectType()
export class User {
  @Field(() => ID!)
  readonly _id!: ObjectId;

  @Field(() => String!)
  @prop({ required: true, unique: true, type: () => String })
  email!: string;

  @Field(() => String, { nullable: true })
  @prop({ required: true, type: () => String })
  password!: string | null;

  @Field(() => [Event]!)
  @prop({ required: true, ref: "Event" })
  createdEvents!: Ref<Event>[];
}

@InputType()
export class UserInput {
  @Field(() => String!)
  email!: string;

  @Field(() => String!)
  password!: string;
}
