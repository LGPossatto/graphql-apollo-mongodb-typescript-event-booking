import { getModelForClass } from "@typegoose/typegoose";

import { Event } from "../types/eventTypes";

export const EventModel = getModelForClass(Event);
