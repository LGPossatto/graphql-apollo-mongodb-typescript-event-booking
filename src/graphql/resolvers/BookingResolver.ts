import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { BookingModel, EventModel, UserModel } from "../../models/models";

import { Booking, BookingInput } from "../../types/bookingTypes";
import { Event, EventIdInput } from "../../types/eventTypes";

@Resolver(Booking)
class BookingResolver {
  @Query(() => [Booking]!)
  async bookings(): Promise<Booking[] | undefined> {
    try {
      const bookings = await BookingModel.find()
        .populate({
          path: "user",
          populate: { path: "createdEvents" },
        })
        .populate({
          path: "event",
          populate: { path: "creator" },
        });

      return bookings.map((booking) => {
        return {
          // @ts-ignore
          ...booking._doc,
          // @ts-ignore
          user: { ...booking._doc.user._doc, password: null },
          event: {
            // @ts-ignore
            ...booking._doc.event._doc,
            creator: {
              // @ts-ignore
              ...booking._doc.event._doc.creator._doc,
              password: null,
            },
          },
        };
      });
    } catch (err) {
      console.error(err);
    }
  }

  @Mutation(() => Booking)
  async bookEvent(
    @Arg("eventIdInput") eventIdInput: EventIdInput
  ): Promise<Booking | undefined> {
    try {
      const event = await EventModel.findById(eventIdInput.eventId).populate({
        path: "creator",
        populate: { path: "createdEvents" },
      });

      if (event) {
        const newBooking = new BookingModel({
          user: "60f1ccc94915a31f1c9fa45f",
          // @ts-ignore
          event: event,
        });

        await newBooking.save();
        return {
          // @ts-ignore
          ...newBooking._doc,
          event: {
            // @ts-ignore
            ...event._doc,
            creator: {
              // @ts-ignore
              ...event._doc.creator._doc,
              password: null,
            },
          },
        };
      } else {
        throw new Error("Event Not Found");
      }
    } catch (err) {
      console.error(err);
    }
  }

  @Mutation(() => Event)
  async cancelBooking(
    @Arg("bookingInput") bookingInput: BookingInput
  ): Promise<Event | undefined> {
    try {
      const booking = await BookingModel.findById(
        bookingInput.bookingId
      ).populate({
        path: "event",
        populate: { path: "creator", populate: "createdEvents" },
      });

      await BookingModel.deleteOne({ _id: bookingInput.bookingId });

      if (booking) {
        return {
          // @ts-ignore
          ...booking._doc.event._doc,
          creator: {
            // @ts-ignore
            ...booking._doc.event._doc.creator._doc,
            password: null,
          },
        };
      } else {
        throw new Error("Booking Not Found");
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default BookingResolver;
