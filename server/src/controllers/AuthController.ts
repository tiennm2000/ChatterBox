import { RequestHandler } from "express";
import { User } from "../models/UserModel";
import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import { ExtendedRequest } from "../middlewares/AuthMiddleware";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email: string, userId: string) => {
  return sign({ email, userId }, process.env.JWT_KEY!, { expiresIn: maxAge });
};

// Signup handler
export const signup: RequestHandler = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      response.status(400).send("Email and Password is Required");
      return;
    }

    const user = await User.create({ email, password });

    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "none",
    });

    response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error({ error });
    response.status(500).send("Internal Server Error");
  }
};

// Login handler
export const login: RequestHandler = async (request, response) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      response.status(400).send("Email and Password is Required");
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      response.status(404).send("User with the given email not found.");
      return;
    }

    const auth = await compare(password, user.password);
    console.log(user.password);
    if (!auth) {
      response.status(400).send("Password is incorrect");
      return;
    }

    response.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "none",
    });

    response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.error({ error });
    response.status(500).send("Internal Server Error");
  }
};

// Get user info
export const getUserInfo: RequestHandler = async (
  request: ExtendedRequest,
  response
) => {
  try {
    const userData = await User.findById(request.userId);
    if (!userData) {
      response.status(404).send("User with the given id not found");
      return;
    }

    response.status(200).json({
      user: {
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
      },
    });
  } catch (error) {
    console.error({ error });
    response.status(500).send("Internal Server Error");
  }
};

// Update profile
export const updateProfile: RequestHandler = async (
  request: ExtendedRequest,
  response
) => {
  try {
    const { userId } = request;
    const { firstName, lastName, color } = request.body;

    if (!firstName || !lastName) {
      response.status(400).send("First name and last name are required");
      return;
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetup: true },
      { new: true, runValidators: true }
    );

    response.status(200).json({
      user: {
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName: userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
      },
    });
  } catch (error) {
    console.error({ error });
    response.status(500).send("Internal Server Error");
  }
};

// Add profile image
export const addProfileImage: RequestHandler = async (
  request: ExtendedRequest,
  response
) => {
  try {
    if (!request.file) {
      response.status(400).send("File is required.");
      return;
    }

    const date = Date.now();
    const fileName = "uploads/profiles/" + date + request.file.originalname;

    renameSync(request.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    response.status(200).json({ image: updatedUser.image });
  } catch (error) {
    console.error({ error });
    response.status(500).send("Internal Server Error");
  }
};

// Remove profile image
export const removeProfileImage: RequestHandler = async (
  request: ExtendedRequest,
  response
) => {
  try {
    const { userId } = request;
    const user = await User.findById(userId);

    if (!user) {
      response.status(404).send("User not found.");
      return;
    }

    if (user.image) {
      unlinkSync(user.image);
    }

    user.image = null;
    await user.save();

    response.status(200).send("Profile image removed successfully");
  } catch (error) {
    console.error({ error });
    response.status(500).send("Internal Server Error");
  }
};

//logOut
export const logOut: RequestHandler = async (
  request: ExtendedRequest,
  response
) => {
  try {
    response.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "none" });

    response.status(200).send("Log Out successfully");
  } catch (error) {
    console.error({ error });
    response.status(500).send("Internal Server Error");
  }
};
