import express from "express";
import {
  login,
  logout,
  singin,
  refreshToken,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/signup", singin);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

export default router;
