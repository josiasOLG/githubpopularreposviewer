import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../adapters/repositories/UserRepository";
import { ObjectId } from "mongoose";

// Estender a interface Request para incluir a propriedade userId
declare global {
  namespace Express {
    interface Request {
      userId?: string | ObjectId;
    }
  }
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    return res.status(401).json({ error: "No user ID provided" });
  }

  const userRepository = new UserRepository();
  const user = await userRepository.getById(userId);

  if (!user || !user.accessToken) {
    return res
      .status(401)
      .json({ error: "Invalid user ID or no access token found" });
  }

  try {
    const decoded = jwt.verify(
      user.accessToken,
      process.env.JWT_SECRET as string
    );
    req.userId = (decoded as any).userId;
    next();
  } catch (error: any) {
    console.error("Token verification error:", error);

    if (error.name === "TokenExpiredError" && user.refreshToken) {
      try {
        const newAccessToken = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET as string,
          { expiresIn: "1h" }
        );
        user.accessToken = newAccessToken;
        await userRepository.update(user._id, user);
        res.setHeader("Access-Token", newAccessToken);
        req.userId = user._id?.toString();
        return next();
      } catch (refreshError) {
        console.error("Failed to refresh access token:", refreshError);
        return res.status(401).json({ error: "Invalid or expired token" });
      }
    } else {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
  }
};
