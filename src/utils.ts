import { MiddlewareFn } from "type-graphql";
import jwt from "jsonwebtoken";

import { TContext } from "./types/helperTypes";
import { Event } from "./types/eventTypes";
import { AuthData, User } from "./types/userTypes";
import { secretKey } from "./config";

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

export const checkAuth: MiddlewareFn<TContext> = ({ context }, next) => {
  const { userToken } = context;

  if (userToken) {
    const token = userToken.split(" ")[1];
    let decodeToken;

    try {
      decodeToken = jwt.verify(token, secretKey as string) as AuthData;
      context.userId = decodeToken.userId;

      return next();
    } catch (err) {
      throw new Error("Not Authorized");
    }
  } else throw new Error("No Authorization Key Was Received");
};
