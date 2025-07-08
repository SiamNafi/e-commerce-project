import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,
  // get coupon
  getMyCoupon: async () => {
    try {
      const res = await axios.get("/coupons");
      set({ coupon: res.data });
    } catch (error) {
      console.log("Error getting coupon", error);
    }
  },
  // apply coupn
  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", { code });
      set({ coupon: response.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  },
  // remove coupon
  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },
  //   fetch and get all cart items
  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response?.data?.message || "Failed to get cart items");
    }
  },
  //   add to cart
  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart");
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add product to cart"
      );
    }
  },
  //remove form cart
  removeFromCart: async (productId) => {
    try {
      await axios.delete("/cart", { data: { productId } });
      set((prevState) => ({
        cart: prevState.cart.filter((item) => item._id !== productId),
      }));
      get().calculateTotals();
      toast.success("Prouduct remvoed from cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove product from cart"
      );
    }
  },
  // update quantity
  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      await get().removeFromCart(productId); // wait for it to finish
      return; // ✅ return early to avoid making PUT request
    }

    try {
      await axios.put(`/cart/${productId}`, { quantity });
      set((prevState) => ({
        cart: prevState.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      }));
      get().calculateTotals();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  },
  // clear cart
  clearCart: async () => {
    try {
      await axios.delete("/cart", { data: {} }); // send empty body
    } catch (error) {
      console.error("Failed to clear cart from backend", error);
    }

    set({ cart: [], coupon: null, total: 0, subtotal: 0 });
  },

  //   calculate totals
  calculateTotals: () => {
    const { cart, coupon } = get();

    const subtotal = cart.reduce((sum, item) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      return sum + (isNaN(price) || isNaN(quantity) ? 0 : price * quantity);
    }, 0);

    let total = subtotal;

    if (
      coupon &&
      typeof coupon.discountPercentage !== "undefined" &&
      !isNaN(Number(coupon.discountPercentage))
    ) {
      const discountPercentage = Number(coupon.discountPercentage);
      const discount = (subtotal * discountPercentage) / 100;
      total = subtotal - discount;
    }

    set({ subtotal, total });
  },
}));
