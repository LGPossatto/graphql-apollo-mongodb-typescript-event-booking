import { ObjectId } from "mongodb";

import { EventModel, UserModel } from "./models/models";
import { Event } from "./types/eventTypes";
import { User } from "./types/userTypes";

export const getUser = async (userId: ObjectId): Promise<User | undefined> => {
  try {
    const user = (await UserModel.findById(userId)) as User;
    const newEvents = getEvents(user.createdEvents as ObjectId[]) as unknown;

    return {
      _id: user._id,
      email: user.email,
      password: null,
      createdEvents: newEvents as Event[],
    };
  } catch (err) {
    console.error(err);
  }
};

export const getEvents = async (
  eventIds: ObjectId[]
): Promise<Event[] | undefined> => {
  try {
    const events = await EventModel.find({ _id: { $in: eventIds } });

    return events.map((event) => {
      const newCreator = getUser(event.creator as ObjectId) as unknown;

      return {
        _id: event._id,
        title: event.title,
        description: event.description,
        price: event.price,
        date: event.date,
        creator: newCreator as User,
      };
    });
  } catch (err) {
    console.error(err);
  }
};
