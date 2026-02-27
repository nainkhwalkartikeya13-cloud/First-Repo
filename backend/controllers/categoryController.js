import Category from "../models/categoryModel.js";

import asyncHandler from "express-async-handler";

// @desc    Create new category
// @route   POST /api/v1/category
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: "Name should be required" });

  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    return res.status(400).json({
      message: `Category ${existingCategory.name} already exists`,
    });
  }

  const category = await new Category({ name }).save();
  res.status(200).json(category);
});

// @desc    Update category
// @route   PUT /api/v1/category/categoryId
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { categoryId } = req.params;

  try {
    const category = await Category.findOne({ _id: categoryId });
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.name = name;

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @desc    Delete a category
// @route   DELETE /api/v1/category/categoryId
const removeCategory = asyncHandler(async (req, res) => {
  try {
    const deleteCategory = await Category.findByIdAndDelete(
      req.params.categoryId
    );
    if (!deleteCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      message: "Category deleted",
      category: {
        id: deleteCategory._id,
        name: deleteCategory.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// @desc    Get all category
// @route   GET /api/v1/category/categories
const listCategory = asyncHandler(async (req, res) => {
  try {
    const all = await Category.find({});
    res.json(all);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

// @desc    Get a category
// @route   GET /api/v1/category/id

const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};
