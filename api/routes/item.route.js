import express from "express";
import { createItem, getItems } from "../controllers/item.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createItem);
router.get("/items", getItems);

export default router;
