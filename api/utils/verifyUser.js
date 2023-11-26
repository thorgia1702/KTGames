import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/user.model.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return next(errorHandler(403, "Forbidden"));

    try {
      // Fetch the user's role from the database
      const userData = await User.findById(user.id);
      if (!userData) {
        return next(errorHandler(404, "User not found"));
      }

      req.user = {
        ...user,
        role: userData.role,
      };

      next();
    } catch (error) {
      return next(errorHandler(500, "Internal Server Error"));
    }
  });
};

