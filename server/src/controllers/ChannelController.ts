import { RequestHandler, response } from "express";
import { ExtendedRequest } from "../middlewares/AuthMiddleware";
import { User } from "../models/UserModel";
import Channel from "../models/ChannelModel";
import { channel } from "diagnostics_channel";
import mongoose from "mongoose";

export const createChannel: RequestHandler = async (
  request: ExtendedRequest,
  response
) => {
  try {
    const { name, members } = request.body;
    const userId = request.userId;

    const admin = await User.findById(userId);

    if (!admin) {
      response.status(400).send("Admin user not found");
      return;
    }

    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      response.status(400).send("Some members are not valid users. ");
      return;
    }

    const newChannel = new Channel({
      name,
      members,
      admin: userId,
      type: "channel",
    });

    await newChannel.save();
    response.status(201).json({ channel: newChannel });
  } catch (error) {
    console.error({ error });
    response.status(500).send("Internal server error");
  }
};

export const getUserChannels: RequestHandler = async (
  request: ExtendedRequest,
  response
) => {
  try {
    const userId = new mongoose.Types.ObjectId(request.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updateAt: -1 });

    const channelsWithType = channels.map((channel) => ({
      ...channel.toObject(),
      type: "channel",
    }));

    response.status(200).json({ channels: channelsWithType });
  } catch (error) {
    console.error({ error });
    response.status(500).send("Internal server error");
  }
};
