import express from "express";
import { createItem, getItems, deleteItem } from "../controllers/item.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createItem);
router.get("/items", getItems);
router.delete("/delete/:id", deleteItem);

export default router;
