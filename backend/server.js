import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// routes
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import { connectDb } from "./lib/db.js";
// dotenv
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/couponst", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(PORT, () => {
  console.log("server is running on http://localhost:" + PORT);
  connectDb();
});

// KjHcKnvGl5oodFbN
