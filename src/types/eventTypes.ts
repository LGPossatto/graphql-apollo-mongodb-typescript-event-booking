import { ObjectId } from "mongodb";
import { prop, Ref } from "@typegoose/typegoose";
import { Field, Float, ID, InputType, ObjectType } from "type-graphql";

import { User } from "./userTypes";

@ObjectType()
export class Event {
  @Field(() => ID!)
  readonly _id!: ObjectId;

  @Field(() => String!)
  @prop({ required: true, type: () => String })
  title!: string;

  @Field(() => String!)
  @prop({ required: true, type: () => String })
  description!: string;

  @Field(() => Float!)
  @prop({ required: true, type: () => Number })
  price!: number;

  @Field(() => Date!)
  @prop({ required: true, type: () => Date })
  date!: Date;

  @Field(() => User!)
  @prop({ required: true, ref: User })
  creator!: Ref<User>;
}

@InputType()
export class EventInput {
  @Field(() => String!)
  title!: string;

  @Field(() => String!)
  description!: string;

  @Field(() => Float!)
  price!: number;

  @Field(() => Date!)
  date!: Date;
}

@InputType()
export class EventIdInput {
  @Field(() => ID!)
  eventId!: ObjectId;
}
