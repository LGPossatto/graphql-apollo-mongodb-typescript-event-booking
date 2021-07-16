import { mongoose } from "@typegoose/typegoose";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";

import { User, UserInput } from "../../types/userTypes";
import { UserModel } from "../../models/models";

@Resolver(User)
class UserResolver {
  @Mutation(() => User!)
  async createUser(@Arg("userInput") userInput: UserInput): Promise<User> {
    try {
      const { email, password } = userInput;
      const newPassword = await bcrypt.hash(password, 12);

      const newUser = new UserModel({
        _id: new mongoose.Types.ObjectId(),
        email,
        password: newPassword,
        createdEvents: [],
      });

      await newUser.save();
      return {
        _id: newUser._id,
        email: newUser.email,
        password: null,
        createdEvents: newUser.createdEvents,
      };
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default UserResolver;
