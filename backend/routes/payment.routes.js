import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  checkoutSuccess,
  createCheckoutSession,
} from "../controllers/payment.controller.js";

const router = express.Router();
router.post("/create-checkout-sesssion", protectRoute, createCheckoutSession);
router.post("/checkout-success");

export default router;
