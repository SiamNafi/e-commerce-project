import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),

  // Create a product
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((state) => ({
        products: [...state.products, res.data],
        loading: false,
      }));
      toast.success("Product created");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create product");
      set({ loading: false });
    }
  },

  // Get all products
  getProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data.products, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get products");
      set({ loading: false });
    }
  },

  // Delete product
  deleteProduct: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${productId}`);
      set((state) => ({
        products: state.products.filter((product) => product._id !== productId),
        loading: false,
      }));
      toast.success("Product deleted");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete product");
      set({ loading: false });
    }
  },

  // Toggle featured product
  toggleFeaturedProduct: async (productId) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${productId}`);
      set((state) => ({
        products: state.products.map((product) =>
          product._id === productId
            ? { ...product, isFeatured: response.data.isFeatured }
            : product
        ),
        loading: false,
      }));
      toast.success("Product feature status updated");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update product");
      set({ loading: false });
    }
  },
}));
