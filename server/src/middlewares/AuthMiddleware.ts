import { RequestHandler, Request } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}
export interface ExtendedRequest extends Request {
  userId?: string;
}

export const verifyToken: RequestHandler = (
  req: ExtendedRequest,
  res,
  next
) => {
  const token = req.cookies?.jwt;

  if (!token) {
    res.status(401).send("You are not authenticated");
    return;
  }
  jwt.verify(
    token,
    process.env.JWT_KEY!,
    async (
      err: VerifyErrors | null,
      payload: string | JwtPayload | undefined
    ) => {
      if (err) {
        res.status(403).send("Token is not valid!");
        return;
      }

      const decodePayload = payload as CustomJwtPayload;
      req.userId = decodePayload.userId;
      next();
    }
  );
};
