import express from "express";
import formidable from "express-formidable";
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";
import {
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
} from "../controllers/productController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/search/suggestions", getSearchSuggestions);
router.post("/bulk-upload", authenticate, authorizeAdmin, upload.single("file"), bulkUpload);
router.route("/").get(fetchProducts).post(authenticate, authorizeAdmin, formidable(), addProduct);
router.route("/allProducts").get(fetchAllProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);
router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);
router.route("/filtered-products").post(filterProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(authenticate, authorizeAdmin, updateProductDetails)
  .delete(authenticate, authorizeAdmin, removeProduct);

export default router;
