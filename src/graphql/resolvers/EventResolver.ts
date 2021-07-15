import { mongoose } from "@typegoose/typegoose";
import { Arg, Mutation, Query, Resolver } from "type-graphql";

import { Event, EventInput } from "../../types/eventTypes";
import { EventModel } from "../../models/eventModel";

@Resolver(Event)
class EventResolver {
  @Query(() => [Event!]!)
  async events(): Promise<Event[]> {
    try {
      const events = await EventModel.find();
      return events;
    } catch (err) {
      throw new Error(err);
    }
  }

  @Mutation(() => Event!)
  async createEvent(@Arg("eventInput") eventInput: EventInput): Promise<Event> {
    try {
      const event = new EventModel({
        _id: new mongoose.Types.ObjectId(),
        ...eventInput,
      });

      await event.save();
      return event;
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default EventResolver;
