import { mongoose } from "@typegoose/typegoose";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { removeObjectPassword } from "../../utils";

import { AuthData, User, UserInput } from "../../types/userTypes";
import { UserModel } from "../../models/models";
import { secretKey } from "../../config";

@Resolver(User)
class UserResolver {
  @Query(() => AuthData!)
  async login(@Arg("userInput") userInput: UserInput): Promise<AuthData> {
    const user = await UserModel.findOne({ email: userInput.email });

    if (!user) {
      throw new Error("Wrong Credentials");
    } else if (
      !(await bcrypt.compare(userInput.password, user.password as string))
    ) {
      throw new Error("Wrong Credentials");
    } else {
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        secretKey as string,
        {
          expiresIn: "1h",
        }
      );

      return {
        userId: user.id,
        token: token,
        tokenExpiration: 1,
      };
    }
  }

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

      // await newUser.save();
      return removeObjectPassword(newUser, true);
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default UserResolver;
