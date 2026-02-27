import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// Shared validation helper — eliminates duplication
function validateProductFields(fields) {
  const { name, brand, description, price, category, countInStock, quantity, image } = fields;
  const stock = countInStock ?? quantity;
  const errors = [];

  if (!name) errors.push("Name is required");
  if (!brand) errors.push("Brand is required");
  if (!description) errors.push("Description is required");
  if (!price) errors.push("Price is required");
  if (!category) errors.push("Category is required");
  if (!stock) errors.push("Quantity is required");
  if (!image) errors.push("Image is required");

  return { errors, stock };
}

// @desc    Add new product
// @route   POST /api/v1/products

const addProduct = asyncHandler(async (req, res) => {
  try {
    const { errors, stock } = validateProductFields(req.fields);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors[0] });
    }

    const product = new Product({
      ...req.fields,
      price: Number(req.fields.price),
      countInStock: Number(stock),
    });
    await product.save();
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// @desc    Update product
// @route   PUT /api/v1/products/:id

const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const { errors, stock } = validateProductFields(req.fields);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors[0] });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.fields,
        price: Number(req.fields.price),
        countInStock: Number(stock),
      },
      { new: true, runValidators: true }
    );

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error, try again" });
  }
});

// @desc    Get 6 products per page
// @route   GET /api/v1/products
const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;

    const keyword = req.query.keyword
      ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res.json({
      products,
      page: 1,
      pages: Math.ceil(count / pageSize),
      hasMore: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// @desc    Get a single product
// @route   GET /api/v1/products/:id
const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      return res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Product not found" });
  }
});

// @desc    Get all product
// @route   GET /api/v1/products/allproducts
const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// @desc    Add a review
// @route   POST /api/v1/products/:id/reviews
const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Product already reviewed");
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);

      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// @desc    Fetch top products
// @route   GET /api/v1/products/top
const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// @desc    Fetch new products
// @route   GET /api/v1/products/new
const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// @desc    Filtered products
// @route   POST /api/v1/products/filtered-products
const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});
export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
