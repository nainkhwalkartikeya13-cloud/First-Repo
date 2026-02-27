import express from "express";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

// ✅ ONLY UPLOAD LOGIC (NO CONFIG HERE)
router.post("/", async (req, res) => {
  try {
    const { image, imageUrl } = req.body;

    if (!image && !imageUrl) {
      return res.status(400).json({ message: "No image provided" });
    }

    const source = image || imageUrl;

    const result = await cloudinary.uploader.upload(source, {
      folder: "luxe-haven",
      resource_type: "image",
    });

    return res.status(200).json({
      success: true,
      image: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Upload failed",
    });
  }
});

export default router;
