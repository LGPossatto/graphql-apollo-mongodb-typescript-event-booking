import { getModelForClass } from "@typegoose/typegoose";

import { Event } from "../types/eventTypes";
import { User } from "../types/userTypes";
import { Booking } from "../types/bookingTypes";

export const EventModel = getModelForClass(Event);
export const UserModel = getModelForClass(User);
export const BookingModel = getModelForClass(Booking);
