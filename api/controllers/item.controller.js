import Item from "../models/item.model.js";
import { errorHandler } from "../utils/error.js";

export const createItem = async (req, res, next) => {
  try {
    const item = await Item.create(req.body);
    return res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const getItems = async (req, res, next) => {
  try {
    const items = await Item.find({});
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

export const deleteItem = async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return next(errorHandler(404,'Item not found!'));
  }
  try {
    await Item.findByIdAndDelete((req.params.id))
    res.status(200).json('Item deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const updateItem = async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if(!item) {
    return next(errorHandler(404, 'Item not found'));
  }
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true}
    );
      res.status(200).json(updatedItem)
  } catch (error) {
    next(error)
  }
}