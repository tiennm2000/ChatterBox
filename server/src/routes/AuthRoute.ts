import { Router } from "express";
import { getUserInfo, login, signup } from "../controllers/AuthController";
import { verifyToken } from "../middlewares/AuthMiddleware";

const authRoutes = Router();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.get("/user-info", verifyToken, getUserInfo);

export default authRoutes;
