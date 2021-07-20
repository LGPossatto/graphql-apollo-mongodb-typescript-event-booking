import { Event } from "./types/eventTypes";
import { User } from "./types/userTypes";

export const removePassword = <T>(
  object: T,
  oldUser?: User,
  oldEvent?: Event,
  isEvent?: boolean
) => {
  // @ts-ignore
  const ret = { ...object._doc };

  if (isEvent) {
    // @ts-ignore
    ret.creator = { ...oldUser._doc, password: null };
  } else if (oldUser) {
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

export const removeObjectPassword = <T>(object: T, isUser?: boolean) => {
  // @ts-ignore
  const ret = { ...object._doc };

  if (isUser) {
    ret.password = null;
  } else {
    ret.creator = {
      // @ts-ignore
      ...object._doc.creator._doc,
      password: null,
    };
  }

  return ret;
};
