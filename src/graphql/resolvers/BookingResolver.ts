import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { BookingModel, EventModel } from "../../models/models";

import { Booking, BookingInput } from "../../types/bookingTypes";
import { EventIdInput } from "../../types/eventTypes";

@Resolver(Booking)
class BookingResolver {
  @Query(() => [Booking]!)
  async bookings(): Promise<Booking[] | undefined> {
    try {
      const bookings = await BookingModel.find();
      return bookings;
    } catch (err) {
      console.error(err);
    }
  }

  @Mutation(() => Booking)
  async bookEvent(
    @Arg("eventIdInput") eventIdInput: EventIdInput
  ): Promise<Booking | undefined> {
    try {
      const event = await EventModel.findById(eventIdInput.eventId)
        .populate({
          path: "user",
          populate: { path: "createdEvents" },
        })
        .populate({
          path: "event",
          populate: { path: "creator" },
        });

      if (event) {
        const newBooking = new BookingModel({
          user: "60f1ccc94915a31f1c9fa45f",
          event: event.id,
        });

        await newBooking.save();
        return newBooking;
      } else {
        throw new Error("Event Not Found");
      }
    } catch (err) {
      console.error(err);
    }
  }

  @Mutation(() => Booking)
  async cancelBooking(
    @Arg("bookingInput") bookingInput: BookingInput
  ): Promise<String> {
    return "string";
  }
}

export default BookingResolver;
