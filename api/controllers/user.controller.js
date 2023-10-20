import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import { io } from "../utils/initSocketIo.js";

export const test = (req, res) => {
  res.json({
    message: "API route is working",
  });
};

export const updateUser = async (req, res, next) => {
  if (
    (req.user.id !== req.params.id) &
    (req.user.id !== "652dfb3ed4d4a5853e8f8dd0")
  ) {
    return next(
      errorHandler(401, "You do not have permission to update this user!")
    );
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // const roomId = 123;
    // io.emit(`roomid:${roomId}`, { message: "message" });

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
          phone: req.body.phone,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== "652dfb3ed4d4a5853e8f8dd0")
    return next(
      errorHandler(401, "You do not have permission do delete user!")
    );
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};
