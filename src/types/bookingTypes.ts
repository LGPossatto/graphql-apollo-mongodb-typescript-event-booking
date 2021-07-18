import { ObjectId } from "mongodb";
import { ModelOptions, prop, Ref } from "@typegoose/typegoose";
import { Field, ID, InputType, ObjectType } from "type-graphql";

import { Event } from "./eventTypes";
import { User } from "./userTypes";

@ObjectType()
@ModelOptions({ schemaOptions: { timestamps: true } })
export class Booking {
  @Field(() => ID!)
  readonly _id!: ObjectId;

  @Field(() => String!)
  @prop({ required: true, ref: "Event" })
  event!: Ref<Event>;

  @Field(() => String!)
  @prop({ required: true, ref: "User" })
  user!: Ref<User>;
}

@InputType()
export class BookingInput {
  @Field(() => ID!)
  bookingId!: ObjectId;
}
