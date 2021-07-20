import { Arg, Mutation, Query, Resolver } from "type-graphql";

import { removeObjectPassword, removePassword } from "../../utils";

import { BookingModel, EventModel, UserModel } from "../../models/models";
import { Booking, BookingInput } from "../../types/bookingTypes";
import { Event, EventIdInput } from "../../types/eventTypes";
import { User } from "../../types/userTypes";

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
          populate: { path: "creator", populate: { path: "createdEvents" } },
        });

      return bookings.map((booking) => {
        return removePassword(
          booking,
          booking.user as User,
          booking.event as Event
        );
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
        const user = await UserModel.findById(event.creator).populate(
          "createdEvents"
        );

        const newBooking = new BookingModel({
          user: user,
          event: event,
        });

        // await newBooking.save();
        return removePassword(newBooking, user as User, event as Event);
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

      // await BookingModel.deleteOne({ _id: bookingInput.bookingId });

      if (booking) {
        return removeObjectPassword(booking.event);
      } else {
        throw new Error("Booking Not Found");
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export default BookingResolver;
