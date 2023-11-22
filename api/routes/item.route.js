import express from "express";
import {
  createItem,
  getItems,
  deleteItem,
  updateItem,
  getItem,
} from "../controllers/item.controller.js";

const router = express.Router();

router.post("/create", createItem);
router.get("/items", getItems);
router.delete("/delete/:id", deleteItem);
router.post("/update/:id", updateItem);
router.get("/get/:id", getItem);

export default router;
