import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: [true, "Email is required."],
    unique: true,
  },
});
