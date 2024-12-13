import mongoose from "mongoose";

export interface MessageChannel {
  sender: mongoose.Types.ObjectId;
  content?: string;
  fileUrl?: string;
  timestamp: Date;
  channelId: mongoose.Types.ObjectId;
  messageType: "text" | "file";
}
