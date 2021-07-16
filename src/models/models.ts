import { getModelForClass } from "@typegoose/typegoose";

import { Event } from "../types/eventTypes";
import { User } from "../types/userTypes";

export const EventModel = getModelForClass(Event);
export const UserModel = getModelForClass(User);
