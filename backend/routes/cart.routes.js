import express from "express";
import {
  addToCart,
  getCartProducts,
  removeAllCart,
  updateQuantity,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, removeAllCart);
router.delete("/:id", protectRoute, updateQuantity);

export default router;
