import mongoose, { Document } from "mongoose";
import { genSalt, hash } from "bcrypt";

interface IUser extends Document {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  color?: number;
  profileSetup: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    require: [true, "Email is required."],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "Password is required."],
  },
  firstName: {
    type: String,
    require: false,
  },
  lastName: {
    type: String,
    require: false,
  },
  image: {
    type: String,
    require: false,
  },
  color: {
    type: Number,
    require: false,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next();
});

export const User =
  mongoose.models.Users || mongoose.model("Users", userSchema);
