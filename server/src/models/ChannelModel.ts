import mongoose, { Document } from "mongoose";

interface IChannel extends Document {
  name: string;
  members: mongoose.Types.ObjectId[];
  admin: mongoose.Types.ObjectId;
  messages: mongoose.Types.ObjectId[];
}

const channelSchema = new mongoose.Schema<IChannel>(
  {
    name: {
      type: String,
      required: true,
    },
    members: [{ type: mongoose.Schema.ObjectId, ref: "Users", required: true }],
    admin: { type: mongoose.Schema.ObjectId, ref: "Users", required: true },
    messages: [
      { type: mongoose.Schema.ObjectId, ref: "Messages", required: false },
    ],
  },
  { timestamps: true }
);

const Channel = mongoose.model("Channels", channelSchema);

export default Channel;
