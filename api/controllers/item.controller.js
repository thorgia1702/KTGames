import Item from "../models/item.model.js";

export const createItem = async (req, res, next) => {
    try {
        const item = await Item.create(req.body);
        return res.status(201).json(item)
    } catch (error) {
        next(error);
    }
}