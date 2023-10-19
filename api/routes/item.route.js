import express from 'express';
import { createItem } from '../controllers/item.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken,createItem)

export default router;