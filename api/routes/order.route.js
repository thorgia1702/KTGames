import express from "express";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/orders", getOrders);
router.delete("/delete/:id", deleteOrder);
router.post("/update/:id", updateOrder);
router.get("/get/:id", getOrder);

export default router;
