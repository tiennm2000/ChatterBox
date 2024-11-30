import { RequestHandler } from "express";
import { User } from "../models/UserModel";
import { ExtendedRequest } from "../middlewares/AuthMiddleware";

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

    response.status(200).json({ contacts });
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error.");
  }
};
