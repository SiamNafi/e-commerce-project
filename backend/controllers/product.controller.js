import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); //get all products
    res.json({ products });
  } catch (error) {
    console.log("error in all product", error.message);
    res.status(500).json({ message: "server Error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      return res.json(JSON.parse(featuredProducts));
    }
    // if not from redis
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts) {
      res.status(404).json({ message: "No featured products found" });
    }
    // store in redis for quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {}
  console.log("error in featured product", error.message);
};

export const createProduct = async (req, res) => {
  try {
    const { name, image, price, category, description } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "Products_image",
      });
    }
    const product = await Product.create({
      name: name,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      price,
      category,
      description,
    });
    res.status(201).json(product);
  } catch (error) {
    console.log("error in create product", error.message);
    res.status(500).json({ message: "server Error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product Not Found!" });
    }
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log("Image deleted successfully");
      } catch (error) {
        console.log("Error deleting image", error.message);
      }
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("error in delete product", error.message);
    res.status(500).json({ message: "server Error", error: error.message });
  }
};

export const getRecomendation = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          image: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    console.log("error in get recommended products", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const getProductByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const product = await Product.find({ category });
    res.json(product);
  } catch (error) {
    console.log("error in category controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updateProduct = await product.save();
      await updateFeaturedProductCache();
      res.json(updateProduct);
    } else {
      res.status(404).json({ message: "No Product Found" });
    }
  } catch (error) {
    console.log("error in feauture product controller", error.message);
    res.status(500).json({ message: "server error", error: error.message });
  }
};

async function updateFeaturedProductCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("error in updateFeaturedProductCache", error.message);
  }
}
