import { Schema, model, Document } from "mongoose";
import IUser from "./interfaces/user.interface.ts"


const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    interests: {
      type: Array,
      default: [],
    },

  },
  { timestamps: true, collection: "users" }
);

type UserType = IUser;

const UserModel = model<UserType>("User", UserSchema);
export default UserModel;
