import {
  Arg,
  Field,
  Float,
  ID,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

@ObjectType()
class Event {
  @Field(() => ID!)
  _id!: string;

  @Field(() => String!)
  title!: string;

  @Field(() => String!)
  description!: string;

  @Field(() => Float!)
  price!: number;

  @Field(() => String!)
  date!: string;
}

@InputType()
class EventInput {
  @Field(() => String!)
  title!: string;

  @Field(() => String!)
  description!: string;

  @Field(() => Float!)
  price!: number;

  @Field(() => String!)
  date!: string;
}

@Resolver(Event)
class EventResolver {
  @Query(() => [Event!]!)
  events(): Event[] {
    return [
      {
        _id: "string",
        title: "string",
        description: "string",
        price: 27.32,
        date: "new Date()",
      },
    ];
  }

  @Mutation(() => Event!)
  createEvent(@Arg("eventInput") eventInput: EventInput): Event {
    return { _id: "string", ...eventInput };
  }
}

export default EventResolver;
