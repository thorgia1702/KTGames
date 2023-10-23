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
    (req.user.id !== "653679a9e085b01c2a40c08c")
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
  if (req.user.id !== "653679a9e085b01c2a40c08c")
    return next(
      errorHandler(401, "You do not have permission to delete user!")
    );
  if (req.params.id === "653679a9e085b01c2a40c08c") {
    return next(
      errorHandler(401, "You do not have permission to delete admin!")
    );
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted!");
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
