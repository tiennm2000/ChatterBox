import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const database_url = process.env.DATABASE_URL!;

app.use(
  cors({
    origin: [process.env.ORIGIN!],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

const server = app.listen(port, () =>
  console.log(`Server is running on http:\\localhost:${port}`)
);

mongoose
  .connect(database_url)
  .then(() => console.log("Database connection successfully"))
  .catch((err: Error) => console.error(err.message));
