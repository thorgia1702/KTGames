import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.json({
    message: "API route is working",
  });
};

export const updateUser = async (req, res, next) => {
  if ((req.user.id !== req.params.id) & (req.user.role !== "admin")) {
    return next(
      errorHandler(401, "You do not have permission to update this user!")
    );
  }
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
          phone: req.body.phone,
          role: req.body.role,
          ktpoint: req.body.ktpoint,
          trophy: req.body.trophy,
          status: req.body.status,
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
  if (req.user.role !== "admin")
    return next(
      errorHandler(401, "You do not have permission to delete this user!")
    );
  if (req.user.role !== "admin") {
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
