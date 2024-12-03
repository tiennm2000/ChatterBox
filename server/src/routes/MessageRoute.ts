import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware";
import { getMessages } from "../controllers/MessageController";

const messagesRoutes = Router();

messagesRoutes.post("/get-messages", verifyToken, getMessages);

export default messagesRoutes;
