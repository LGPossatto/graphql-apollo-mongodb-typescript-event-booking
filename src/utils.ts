import { Event } from "./types/eventTypes";
import { User } from "./types/userTypes";

export const removePassword = <T>(
  object: T,
  oldUser?: User,
  oldEvent?: Event,
  isUser?: boolean,
  isEvent?: boolean
) => {
  // @ts-ignore
  const ret = { ...object._doc };

  if (isUser) {
    ret.password = null;

    /* if (oldUser?.createdEvents){
        for (let i = 0; i< oldUser.createdEvents.length; i++) {
            ret.
        }
    } */
  }

  if (isEvent) {
    ret.creator = {
      // @ts-ignore
      ...object._doc.creator._doc,
      password: null,
    };
  }

  if (oldUser) {
    // @ts-ignore
    ret.user = { ...oldUser._doc, password: null };
  }

  if (oldEvent) {
    ret.event = {
      // @ts-ignore
      ...oldEvent._doc,
      creator: {
        // @ts-ignore
        ...oldEvent._doc.creator._doc,
        password: null,
      },
    };
  }

  return ret;
};
