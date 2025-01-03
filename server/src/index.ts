import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoute";
import contactsRoutes from "./routes/ContactRoute";
import setupSocket from "./socket";
import messagesRoutes from "./routes/MessageRoute";
import channelRoutes from "./routes/ChannelRoute";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const port = process.env.PORT || 3001;
const database_url = process.env.DATABASE_URL!;

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.get("/", (request: Request, response: Response) => {
  response.send("Hello World");
});

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages/", messagesRoutes);
app.use("/api/channel", channelRoutes);

const server = app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);

setupSocket(server);

mongoose
  .connect(database_url)
  .then(() => console.log("Database connection successfully"))
  .catch((err: Error) => console.error(err.message));
