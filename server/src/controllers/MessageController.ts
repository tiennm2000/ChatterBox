import { RequestHandler } from "express";
import { ExtendedRequest } from "../middlewares/AuthMiddleware";
import Message from "../models/MessagesModel";

export const getMessages: RequestHandler = async (
  request: ExtendedRequest,
  response
) => {
  try {
    const user1 = request.userId;
    const user2 = request.body.id;

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    response.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    response.status(400).send("Internal Server Error");
  }
};
