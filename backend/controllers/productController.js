import asyncHandler from "express-async-handler";
import fs from "fs";
import csv from "csv-parser";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import Order from "../models/orderModel.js";

// Shared validation helper — eliminates duplication
function validateProductFields(fields) {
  const { name, brand, description, price, category, countInStock, quantity, image } = fields;
  const stock = countInStock !== undefined ? countInStock : quantity;
  const errors = [];

  if (!name) errors.push("Name is required");
  if (!brand) errors.push("Brand is required");
  if (!description) errors.push("Description is required");
  if (!price && price !== 0) errors.push("Price is required");
  if (!category) errors.push("Category is required");
  if (stock === undefined || stock === null || stock === "") errors.push("Quantity is required");
  if (!image) errors.push("Product image is required");

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
      discountPrice: req.fields.discountPrice ? Number(req.fields.discountPrice) : 0,
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
    const fields = (req.fields && Object.keys(req.fields).length > 0) ? req.fields : req.body;
    console.log("UPDATE_DEBUG payload:", fields);
    const { errors, stock } = validateProductFields(fields);
    if (errors.length > 0) {
      return res.status(400).json({ error: errors[0] });
    }

    let images = fields.images || [];
    if (typeof images === "string") {
      try {
        images = JSON.parse(images);
      } catch (e) {
        images = [images];
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...fields,
        price: Number(fields.price),
        discountPrice: fields.discountPrice ? Number(fields.discountPrice) : 0,
        countInStock: Number(stock),
        images: images,
        outOfStockSizes: fields.outOfStockSizes || [],
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
    const pageSize = 24;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .populate("category")
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      hasMore: page < Math.ceil(count / pageSize),
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
      return res.status(404).json({ error: "Product not found" });
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

      // Check if user has purchased the product
      const hasPurchased = await Order.findOne({
        user: req.user._id,
        isPaid: true,
        "orderItems.product": req.params.id,
      });

      if (!hasPurchased) {
        res.status(403);
        throw new Error("Only buyers can review this product");
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
    const products = await Product.find({}).sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

// @desc    Filter products
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

// @desc    Get search suggestions
// @route   GET /api/v1/products/search/suggestions
const getSearchSuggestions = asyncHandler(async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.json([]);

    const suggestions = await Product.find({
      name: { $regex: keyword, $options: "i" },
    })
      .select("name _id")
      .limit(5);

    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

// @desc    Bulk upload products from CSV
// @route   POST /api/v1/products/bulk-upload
const bulkUpload = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const products = [];
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          for (const item of results) {
            // Find or create category
            let categoryId;
            if (item.category) {
              let category = await Category.findOne({ name: item.category });
              if (!category) {
                category = await Category.create({ name: item.category });
              }
              categoryId = category._id;
            }

            const product = {
              name: item.name,
              image: item.image,
              brand: item.brand,
              quantity: Number(item.quantity) || 0,
              description: item.description,
              price: Number(item.price) || 0,
              category: categoryId,
              countInStock: Number(item.countInStock) || 0,
            };

            products.push(product);
          }

          await Product.insertMany(products);
          fs.unlinkSync(req.file.path); // Remove temp file
          res.status(201).json({ message: `${products.length} products uploaded successfully` });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Error during bulk insert" });
        }
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
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
  getSearchSuggestions,
  bulkUpload,
};
