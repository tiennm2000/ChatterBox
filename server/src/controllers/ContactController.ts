import { RequestHandler, response } from "express";
import { User } from "../models/UserModel";
import { ExtendedRequest } from "../middlewares/AuthMiddleware";
import mongoose from "mongoose";
import Message from "../models/MessagesModel";

interface SearchRequestBody {
  searchTerm: string;
}

export const searchContacts: RequestHandler = async (
  request: ExtendedRequest,
  response
) => {
  try {
    const { searchTerm } = request.body as SearchRequestBody;
    if (searchTerm === undefined || searchTerm === null) {
      response.status(400).send("Search Term is required");
      return;
    }

    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm);

    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.userId } },
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] },
      ],
    });

    const contactsWithType = contacts.map((contact) => ({
      ...contact.toObject(), // Convert mongoose document to plain object
      type: "contact", // Add the 'type' property
    }));

    response.status(200).json({ contacts: contactsWithType });
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error.");
  }
};

export const getContactsForDMList: RequestHandler = async (
  request: ExtendedRequest,
  response
) => {
  try {
    const { userId } = request;
    let user = new mongoose.Types.ObjectId(userId);
    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: user }, { recipient: user }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: {
                $eq: ["$sender", user],
              },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
          type: "contact",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    response.status(200).json({ contacts });
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error.");
  }
};

export const getAllContacts: RequestHandler = async (
  request: ExtendedRequest,
  response
) => {
  try {
    const users = await User.find(
      { _id: { $ne: request.userId } },
      "firstName lastName _id"
    );

    const contacts = users.map((user) => ({
      label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
      value: user._id,
    }));

    response.status(200).json({ contacts });
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error.");
  }
};
