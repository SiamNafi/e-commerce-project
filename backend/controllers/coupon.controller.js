import Coupon from "../models/coupon.mode.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.json(coupon || null);
  } catch (error) {
    console.log("error in getcoupon controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon Not Found" });
    }
    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Coupon Expired" });
    }
    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage, // ✅ fixed
    });
  } catch (error) {
    console.log("Error in validateCoupon controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};
