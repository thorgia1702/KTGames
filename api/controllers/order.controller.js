import Order from "../models/order.mode.js";
import { errorHandler } from "../utils/error.js";

export const createOrder = async (req, res, next) => {
  try {
    const order = await Order.create(req.body);
    return res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return next(errorHandler(404, "Order not found!"));
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const deleteOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(errorHandler(404, "Order not found!"));
  }
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const updateOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(errorHandler(404, "Order not found"));
  }
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
