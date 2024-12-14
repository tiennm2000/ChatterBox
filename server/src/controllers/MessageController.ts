import { RequestHandler } from "express";
import { ExtendedRequest } from "../middlewares/AuthMiddleware";
import Message from "../models/MessagesModel";
import { mkdirSync, renameSync } from "fs";

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
    })
      .populate("sender", "_id")
      .populate("recipient", "_id")
      .sort({ timestamp: 1 });

    response.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    response.status(400).send("Internal Server Error");
  }
};

export const uploadFile: RequestHandler = async (
  request: ExtendedRequest,
  response
) => {
  try {
    if (!request.file) {
      response.status(400).send("File is required");
      return;
    }

    const date = Date.now();
    let fileDir = `uploads/files/${date}`;
    let fileName = `${fileDir}/${request.file.originalname}`;

    mkdirSync(fileDir, { recursive: true });
    renameSync(request.file.path, fileName);

    response.status(200).json({ filePath: fileName });
  } catch (error) {
    console.error(error);
    response.status(400).send("Internal Server Error");
  }
};
