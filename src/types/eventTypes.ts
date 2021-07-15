import { prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, Float, ID, InputType, ObjectType } from "type-graphql";

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
