import express from "express";
import { createItem, getItems, deleteItem, updateItem } from "../controllers/item.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createItem);
router.get("/items", getItems);
router.delete("/delete/:id", deleteItem);
router.post("/update/:id", updateItem);

export default router;
