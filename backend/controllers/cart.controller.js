import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    const existItem = user.cartItems.find((item) => item.id === productId);
    if (existItem) {
      existItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("error in add to cart", error.message);
    res.status(500).json({ message: "server error", erro: error.message });
  }
};

export const removeAllCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("error in remove cart", error.message);
    res.status(500).json({ message: "server erro", erro: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.body;
    const { quantity } = req.body;
    const user = req.user;
    const existingitem = user.cartItems.find((item) => item.id === productId);
    if (existingitem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      existingitem.quantity = quantity;
      await user.save();
      res.json(cartItems);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("error in updatequantity controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    const products = await Product({ _id: { $in: req.user.cartItems } });
    // add quantity for each product
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.json(cartItems);
  } catch (error) {
    console.log("error in getCartProducts controller", error.message);
    res.status(500).json({ messge: "server error", error: error.message });
  }
};
