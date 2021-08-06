import { ObjectId } from "mongodb";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";

import { checkAuth, removeObjectPassword, removePassword } from "../../utils";

import { Booking, BookingInput } from "../../types/bookingTypes";
import { Event, EventIdInput } from "../../types/eventTypes";
import { User } from "../../types/userTypes";
import { TContext } from "../../types/helperTypes";

import { BookingModel, EventModel, UserModel } from "../../models/models";

@Resolver(Booking)
class BookingResolver {
  @Query(() => [Booking]!)
  @UseMiddleware(checkAuth)
  async bookings(@Ctx() { userId }: TContext): Promise<Booking[] | undefined> {
    try {
      const bookings = await BookingModel.find({ user: userId as ObjectId })
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
  @UseMiddleware(checkAuth)
  async bookEvent(
    @Arg("eventIdInput") eventIdInput: EventIdInput,
    @Ctx() { userId }: TContext
  ): Promise<Booking | undefined> {
    try {
      const event = await EventModel.findById(eventIdInput.eventId).populate({
        path: "creator",
        populate: { path: "createdEvents" },
      });

      if (event) {
        const user = await UserModel.findById(userId).populate("createdEvents");

        const newBooking = new BookingModel({
          user: user,
          event: event,
        });

        await newBooking.save();
        return removePassword(newBooking, user as User, event as Event);
      } else {
        throw new Error("Event Not Found");
      }
    } catch (err) {
      console.error(err);
    }
  }

  @Mutation(() => Event)
  @UseMiddleware(checkAuth)
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
