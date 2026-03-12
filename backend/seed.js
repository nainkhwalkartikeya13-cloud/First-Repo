/**
 * SEED SCRIPT — Allbirds-style shoe store
 * Seeds: Users (admin + regular) · Categories · Products with working images
 * Run: cd backend && node seed.js
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import Product from "./models/productModel.js";
import Category from "./models/categoryModel.js";
import User from "./models/userModel.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/e-commerce";

const SIZES_MEN = [7, 8, 9, 10, 11, 12, 13];
const SIZES_WOMEN = [5, 6, 7, 8, 9, 10, 11];
const SIZES_KIDS = [1, 2, 3, 4, 5, 6];
const SIZES_UNISEX = [6, 7, 8, 9, 10, 11, 12];

/* ══════════════════════════════════════════════
   WORKING IMAGE URLS  (Unsplash — direct hotlink OK)
   ══════════════════════════════════════════════ */
const IMG = {
  // Men's
  treeRunnerM: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  treeRunnerM2: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop",
  treeRunnerM3: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop&q=60",
  woolRunnerM: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80",
  woolRunnerM2: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=80",
  dasherM: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
  dasherM2: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80",
  piperM: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",
  topperM: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800&q=80",
  mizzleM: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",

  // Women's
  treeRunnerW: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80",
  treeRunnerW2: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80",
  woolRunnerW: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=800&q=80",
  woolRunnerW2: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80",
  breezerW: "https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=800&q=80",
  piperW: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&q=80",
  dasherW: "https://images.unsplash.com/photo-1604671801908-6f0c6a092c05?w=800&q=80",
  mizzleW: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80",

  // Running
  flyer: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80",
  flyer2: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?w=800&q=80",
  relay: "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?w=800&q=80",

  // Trail
  trail: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
  trail2: "https://images.unsplash.com/photo-1576672843344-f01907a9d40c?w=800&q=80",
  trailMizzle: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",

  // Kids
  kidsWool: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80",
  kidsTree: "https://images.unsplash.com/photo-1507464098880-e367bc5d2c08?w=800&q=80",

  // Socks & Accessories
  socks: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=800&q=80",
  socksNoShow: "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=800&q=80",
  insoles: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80",
};

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // ───── WIPE ─────
  await Product.deleteMany({});
  await Category.deleteMany({});
  await User.deleteMany({});
  console.log("Cleared products, categories, and users");

  // ───── USERS ─────
  const salt = await bcrypt.genSalt(10);
  const users = await User.insertMany([
    {
      username: "Admin",
      email: "admin@allbirds.com",
      password: await bcrypt.hash("password123", salt),
      isAdmin: true,
    },
    {
      username: "John Doe",
      email: "john@allbirds.com",
      password: await bcrypt.hash("password123", salt),
      isAdmin: false,
    },
    {
      username: "Jane Smith",
      email: "jane@allbirds.com",
      password: await bcrypt.hash("password123", salt),
      isAdmin: false,
    },
  ]);
  console.log(`Created ${users.length} users (admin + regular)`);

  // ───── CATEGORIES ─────
  const categoryData = [
    { name: "Men" },
    { name: "Women" },
    { name: "Running" },
    { name: "Trail" },
    { name: "Kids" },
    { name: "Socks & Accessories" },
  ];
  const categories = await Category.insertMany(categoryData);
  const cat = {};
  categories.forEach((c) => (cat[c.name] = c._id));
  console.log("Categories created:", Object.keys(cat).join(", "));

  // ───── PRODUCTS ─────
  const products = [
    // ═══════════════════ MEN'S ═══════════════════
    {
      name: "Men's Tree Runners",
      brand: "Allbirds",
      category: cat["Men"],
      description:
        "Our everyday sneaker, made with breathable eucalyptus tree fiber. Light on your feet and the planet. Features our signature SweetFoam midsole made from sugarcane for cloud-like comfort that lasts all day.",
      material: "Eucalyptus Tree Fiber",
      sustainability: "Carbon neutral, FSC certified eucalyptus, SweetFoam sugarcane midsole",
      productCollection: "Everyday",
      image: IMG.treeRunnerM,
      images: [IMG.treeRunnerM, IMG.treeRunnerM2, IMG.treeRunnerM3],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Basin Green", hex: "#4A6741" },
        { name: "Charcoal", hex: "#36454F" },
        { name: "Navy Night", hex: "#1B2A4A" },
      ],
      sizes: SIZES_MEN,
      price: 10800,
      discountPrice: 0,
      countInStock: 50,
      rating: 4.8,
      numReviews: 1247,
      quantity: 50,
      isBestseller: true,
      isNewArrival: false,
    },
    {
      name: "Men's Wool Runners (Classic Edition)",
      brand: "Allbirds",
      category: cat["Men"],
      description:
        "The shoe that started it all. Made with ZQ Certified Merino wool for unrivaled softness. Temperature-regulating, moisture-wicking, and naturally odor-resistant. Machine washable for easy care.",
      material: "ZQ Merino Wool",
      sustainability: "ZQ certified ethical wool, SweetFoam midsole, carbon neutral",
      productCollection: "Everyday",
      image: IMG.woolRunnerM,
      images: [IMG.woolRunnerM],
      colors: [
        { name: "Natural Black", hex: "#1A1A1A" },
        { name: "Natural Grey", hex: "#A0A0A0" },
        { name: "Cream", hex: "#F5F0E8" },
        { name: "Tuke Honey", hex: "#C4973B" },
      ],
      sizes: SIZES_MEN,
      price: 11000,
      discountPrice: 0,
      countInStock: 45,
      rating: 4.9,
      numReviews: 2834,
      quantity: 45,
      isBestseller: true,
      isNewArrival: false,
    },
    {
      name: "Men's Wool Runners (Heather Edition)",
      brand: "Allbirds",
      category: cat["Men"],
      description:
        "The shoe that started it all. Made with ZQ Certified Merino wool for unrivaled softness. Temperature-regulating, moisture-wicking, and naturally odor-resistant. Machine washable for easy care.",
      material: "ZQ Merino Wool",
      sustainability: "ZQ certified ethical wool, SweetFoam midsole, carbon neutral",
      productCollection: "Everyday",
      image: IMG.woolRunnerM2,
      images: [IMG.woolRunnerM2],
      colors: [
        { name: "Natural Black", hex: "#1A1A1A" },
        { name: "Natural Grey", hex: "#A0A0A0" },
        { name: "Cream", hex: "#F5F0E8" },
        { name: "Tuke Honey", hex: "#C4973B" },
      ],
      sizes: SIZES_MEN,
      price: 11000,
      discountPrice: 0,
      countInStock: 45,
      rating: 4.9,
      numReviews: 1250,
      quantity: 45,
      isBestseller: true,
      isNewArrival: false,
    },
    {
      name: "Men's Tree Dasher 2 (Red Edition)",
      brand: "Allbirds",
      category: cat["Men"],
      description:
        "Our versatile performance shoe. Eucalyptus tree fiber upper with a supportive botanical brace and responsive SweetFoam midsole. Perfect for workouts, errands, and everything in between.",
      material: "Eucalyptus Tree Fiber",
      sustainability: "FSC certified materials, carbon neutral, recyclable packaging",
      productCollection: "Active",
      image: IMG.dasherM,
      images: [IMG.dasherM],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Dark Grey", hex: "#555555" },
        { name: "Thunder", hex: "#3D3D3D" },
      ],
      sizes: SIZES_MEN,
      price: 13500,
      discountPrice: 0,
      countInStock: 35,
      rating: 4.7,
      numReviews: 856,
      quantity: 35,
      isBestseller: false,
      isNewArrival: true,
    },
    {
      name: "Men's Tree Dasher 2 (Olive Edition)",
      brand: "Allbirds",
      category: cat["Men"],
      description:
        "Our versatile performance shoe. Eucalyptus tree fiber upper with a supportive botanical brace and responsive SweetFoam midsole. Perfect for workouts, errands, and everything in between.",
      material: "Eucalyptus Tree Fiber",
      sustainability: "FSC certified materials, carbon neutral, recyclable packaging",
      productCollection: "Active",
      image: IMG.dasherM2,
      images: [IMG.dasherM2],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Dark Grey", hex: "#555555" },
        { name: "Thunder", hex: "#3D3D3D" },
      ],
      sizes: SIZES_MEN,
      price: 13500,
      discountPrice: 0,
      countInStock: 35,
      rating: 4.7,
      numReviews: 412,
      quantity: 35,
      isBestseller: false,
      isNewArrival: true,
    },
    {
      name: "Men's Wool Pipers",
      brand: "Allbirds",
      category: cat["Men"],
      description:
        "The slip-on lifestyle shoe. Ultra-fine ZQ Merino wool keeps feet cozy and temperature regulated. Sugarcane-based SweetFoam sole provides cushioning. Wear barefoot or with our no-show socks.",
      material: "ZQ Merino Wool",
      sustainability: "ZQ certified, SweetFoam midsole, machine washable",
      productCollection: "Lifestyle",
      image: IMG.piperM,
      images: [IMG.piperM],
      colors: [
        { name: "Natural Black", hex: "#1A1A1A" },
        { name: "Natural White", hex: "#F5F0E8" },
      ],
      sizes: SIZES_MEN,
      price: 10500,
      discountPrice: 8900,
      countInStock: 40,
      rating: 4.6,
      numReviews: 543,
      quantity: 40,
      isBestseller: false,
      isNewArrival: false,
    },
    {
      name: "Men's Tree Toppers",
      brand: "Allbirds",
      category: cat["Men"],
      description:
        "High-top sneaker crafted from TENCEL Lyocell. Breathable, durable, and undeniably stylish. Elevated look meets everyday sustainable comfort.",
      material: "TENCEL Lyocell",
      sustainability: "FSC certified TENCEL, responsibly sourced, carbon neutral",
      productCollection: "Lifestyle",
      image: IMG.topperM,
      images: [IMG.topperM],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Charcoal", hex: "#36454F" },
      ],
      sizes: SIZES_MEN,
      price: 14500,
      discountPrice: 0,
      countInStock: 28,
      rating: 4.5,
      numReviews: 312,
      quantity: 28,
      isBestseller: false,
      isNewArrival: true,
    },
    {
      name: "Men's Wool Runner Mizzles",
      brand: "Allbirds",
      category: cat["Men"],
      description:
        "Our weather-ready everyday shoe. Bio-based water repellent shield over ZQ Merino Wool keeps feet dry. Puddle Guard outsole for extra grip in wet conditions.",
      material: "ZQ Merino Wool + Water Repellent",
      sustainability: "Bio-based water treatment, ZQ certified wool, SweetFoam",
      productCollection: "Weather",
      image: IMG.mizzleM,
      images: [IMG.mizzleM],
      colors: [
        { name: "Natural Black", hex: "#1A1A1A" },
        { name: "Hazy Beige", hex: "#C3B8A8" },
      ],
      sizes: SIZES_MEN,
      price: 13500,
      discountPrice: 11500,
      countInStock: 30,
      rating: 4.8,
      numReviews: 678,
      quantity: 30,
      isBestseller: true,
      isNewArrival: false,
    },

    // ═══════════════════ WOMEN'S ═══════════════════
    {
      name: "Women's Tree Runners (Edition 1)",
      brand: "Allbirds",
      category: cat["Women"],
      description:
        "Our signature everyday sneaker in a women's-specific last. Breathable eucalyptus tree fiber upper with SweetFoam midsole. Naturally soft, incredibly lightweight.",
      material: "Eucalyptus Tree Fiber",
      sustainability: "FSC certified eucalyptus, sugarcane midsole, carbon neutral",
      productCollection: "Everyday",
      image: IMG.treeRunnerW,
      images: [IMG.treeRunnerW],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Calm Sage", hex: "#8FAE80" },
        { name: "Blossom", hex: "#E8C4C4" },
        { name: "Lux Beige", hex: "#D4C5B0" },
      ],
      sizes: SIZES_WOMEN,
      price: 10800,
      discountPrice: 0,
      countInStock: 55,
      rating: 4.9,
      numReviews: 1873,
      quantity: 55,
      isBestseller: true,
      isNewArrival: false,
    },
    {
      name: "Women's Tree Runners (Edition 2)",
      brand: "Allbirds",
      category: cat["Women"],
      description:
        "Our signature everyday sneaker in a women's-specific last. Breathable eucalyptus tree fiber upper with SweetFoam midsole. Naturally soft, incredibly lightweight.",
      material: "Eucalyptus Tree Fiber",
      sustainability: "FSC certified eucalyptus, sugarcane midsole, carbon neutral",
      productCollection: "Everyday",
      image: IMG.treeRunnerW2,
      images: [IMG.treeRunnerW2],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Calm Sage", hex: "#8FAE80" },
        { name: "Blossom", hex: "#E8C4C4" },
        { name: "Lux Beige", hex: "#D4C5B0" },
      ],
      sizes: SIZES_WOMEN,
      price: 10800,
      discountPrice: 0,
      countInStock: 55,
      rating: 4.9,
      numReviews: 873,
      quantity: 55,
      isBestseller: true,
      isNewArrival: false,
    },
    {
      name: "Women's Wool Runners (Edition 1)",
      brand: "Allbirds",
      category: cat["Women"],
      description:
        "The original Allbirds shoe for women. ZQ Certified Merino wool is naturally temperature-regulating, moisture-wicking, and incredibly soft. Machine washable for effortless care.",
      material: "ZQ Merino Wool",
      sustainability: "ZQ ethical wool, SweetFoam midsole, carbon neutral",
      productCollection: "Everyday",
      image: IMG.woolRunnerW,
      images: [IMG.woolRunnerW],
      colors: [
        { name: "Natural Black", hex: "#1A1A1A" },
        { name: "Cream", hex: "#F5F0E8" },
        { name: "Blush", hex: "#E8B4B8" },
      ],
      sizes: SIZES_WOMEN,
      price: 11000,
      discountPrice: 0,
      countInStock: 60,
      rating: 4.8,
      numReviews: 2456,
      quantity: 60,
      isBestseller: true,
      isNewArrival: false,
    },
    {
      name: "Women's Wool Runners (Edition 2)",
      brand: "Allbirds",
      category: cat["Women"],
      description:
        "The original Allbirds shoe for women. ZQ Certified Merino wool is naturally temperature-regulating, moisture-wicking, and incredibly soft. Machine washable for effortless care.",
      material: "ZQ Merino Wool",
      sustainability: "ZQ ethical wool, SweetFoam midsole, carbon neutral",
      productCollection: "Everyday",
      image: IMG.woolRunnerW2,
      images: [IMG.woolRunnerW2],
      colors: [
        { name: "Natural Black", hex: "#1A1A1A" },
        { name: "Cream", hex: "#F5F0E8" },
        { name: "Blush", hex: "#E8B4B8" },
      ],
      sizes: SIZES_WOMEN,
      price: 11000,
      discountPrice: 0,
      countInStock: 60,
      rating: 4.8,
      numReviews: 1450,
      quantity: 60,
      isBestseller: true,
      isNewArrival: false,
    },
    {
      name: "Women's Tree Breezers",
      brand: "Allbirds",
      category: cat["Women"],
      description:
        "The ballet flat reimagined. Eucalyptus tree fiber keeps feet cool and comfortable. A sleek silhouette that pairs effortlessly with everything from jeans to dresses.",
      material: "Eucalyptus Tree Fiber",
      sustainability: "FSC certified, natural rubber outsole, carbon neutral",
      productCollection: "Lifestyle",
      image: IMG.breezerW,
      images: [IMG.breezerW],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Eclipse", hex: "#2B2B2B" },
        { name: "Blossom", hex: "#E8C4C4" },
      ],
      sizes: SIZES_WOMEN,
      price: 10500,
      discountPrice: 8500,
      countInStock: 40,
      rating: 4.7,
      numReviews: 1124,
      quantity: 40,
      isBestseller: false,
      isNewArrival: false,
    },
    {
      name: "Women's Wool Pipers",
      brand: "Allbirds",
      category: cat["Women"],
      description:
        "The relaxed slip-on redesigned for women. Ultra-fine ZQ Merino wool, SweetFoam sole, available in earthy palette. Machine washable and naturally odor-resistant.",
      material: "ZQ Merino Wool",
      sustainability: "ZQ certified, SweetFoam, machine washable",
      productCollection: "Lifestyle",
      image: IMG.piperW,
      images: [IMG.piperW],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Natural Black", hex: "#1A1A1A" },
        { name: "Tuke Honey", hex: "#C4973B" },
      ],
      sizes: SIZES_WOMEN,
      price: 10500,
      discountPrice: 8900,
      countInStock: 48,
      rating: 4.6,
      numReviews: 834,
      quantity: 48,
      isBestseller: false,
      isNewArrival: false,
    },
    {
      name: "Women's Tree Dasher 2",
      brand: "Allbirds",
      category: cat["Women"],
      description:
        "Performance meets sustainability with a women's-specific fit. Eucalyptus fiber upper, SweetFoam midsole, and botanical brace for natural support during any activity.",
      material: "Eucalyptus Tree Fiber",
      sustainability: "FSC certified, carbon neutral, recyclable packaging",
      productCollection: "Active",
      image: IMG.dasherW,
      images: [IMG.dasherW],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Spiced Plum", hex: "#7D4B6E" },
      ],
      sizes: SIZES_WOMEN,
      price: 13500,
      discountPrice: 0,
      countInStock: 32,
      rating: 4.8,
      numReviews: 623,
      quantity: 32,
      isBestseller: false,
      isNewArrival: true,
    },
    {
      name: "Women's Wool Runner Mizzles",
      brand: "Allbirds",
      category: cat["Women"],
      description:
        "Weather-ready comfort. Bio-based water repellent shield over ZQ Merino Wool upper. Puddle Guard outsole for superior wet-weather grip. Stay dry naturally.",
      material: "ZQ Merino Wool + Water Repellent",
      sustainability: "Bio-based treatment, ZQ certified, SweetFoam",
      productCollection: "Weather",
      image: IMG.mizzleW,
      images: [IMG.mizzleW],
      colors: [
        { name: "Natural Black", hex: "#1A1A1A" },
        { name: "Hazy Beige", hex: "#C3B8A8" },
      ],
      sizes: SIZES_WOMEN,
      price: 13500,
      discountPrice: 11500,
      countInStock: 35,
      rating: 4.7,
      numReviews: 542,
      quantity: 35,
      isBestseller: false,
      isNewArrival: false,
    },

    // ═══════════════════ RUNNING ═══════════════════
    {
      name: "Tree Flyer 2 (Edition 1)",
      brand: "Allbirds",
      category: cat["Running"],
      description:
        "Our lightest, most responsive running shoe. SwiftFoam midsole with natural fiber upper delivers a springy, energized ride. Engineered for tempo runs and race day.",
      material: "Eucalyptus Tree Fiber + SwiftFoam",
      sustainability: "Bio-based SwiftFoam, FSC certified upper, carbon neutral",
      productCollection: "Performance",
      image: IMG.flyer,
      images: [IMG.flyer],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Thunder", hex: "#3D3D3D" },
        { name: "Flame", hex: "#E84D1D" },
      ],
      sizes: SIZES_UNISEX,
      price: 16000,
      discountPrice: 13500,
      countInStock: 25,
      rating: 4.8,
      numReviews: 445,
      quantity: 25,
      isBestseller: true,
      isNewArrival: true,
    },
    {
      name: "Tree Flyer 2 (Edition 2)",
      brand: "Allbirds",
      category: cat["Running"],
      description:
        "Our lightest, most responsive running shoe. SwiftFoam midsole with natural fiber upper delivers a springy, energized ride. Engineered for tempo runs and race day.",
      material: "Eucalyptus Tree Fiber + SwiftFoam",
      sustainability: "Bio-based SwiftFoam, FSC certified upper, carbon neutral",
      productCollection: "Performance",
      image: IMG.flyer2,
      images: [IMG.flyer2],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Thunder", hex: "#3D3D3D" },
        { name: "Flame", hex: "#E84D1D" },
      ],
      sizes: SIZES_UNISEX,
      price: 16000,
      discountPrice: 13500,
      countInStock: 25,
      rating: 4.8,
      numReviews: 210,
      quantity: 25,
      isBestseller: true,
      isNewArrival: true,
    },
    {
      name: "Tree Dasher Relay",
      brand: "Allbirds",
      category: cat["Running"],
      description:
        "The daily training companion. Responsive midsole geometry maximizes energy return. Natural fiber upper with strategic ventilation. Light for tempo, comfortable for easy days.",
      material: "Eucalyptus Tree Fiber + SweetFoam",
      sustainability: "Carbon neutral, FSC certified, bio-based materials",
      productCollection: "Performance",
      image: IMG.relay,
      images: [IMG.relay],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Dark Grey", hex: "#555555" },
      ],
      sizes: SIZES_UNISEX,
      price: 14000,
      discountPrice: 0,
      countInStock: 30,
      rating: 4.7,
      numReviews: 324,
      quantity: 30,
      isBestseller: false,
      isNewArrival: true,
    },

    // ═══════════════════ TRAIL ═══════════════════
    {
      name: "Trail Runner SWT (Edition 1)",
      brand: "Allbirds",
      category: cat["Trail"],
      description:
        "Built for the wild. Rugged Trino upper, wide toe box, and deep lug pattern deliver grip on any terrain. SweetFoam midsole cushions every step on dirt, rock, and root.",
      material: "Trino (merino + tree fiber) + Rubber Lug",
      sustainability: "Natural Trino blend, SweetFoam, carbon neutral",
      productCollection: "Trail",
      image: IMG.trail,
      images: [IMG.trail],
      colors: [
        { name: "Natural Black", hex: "#1A1A1A" },
        { name: "Basin Green", hex: "#4A6741" },
        { name: "Thunder", hex: "#3D3D3D" },
      ],
      sizes: SIZES_UNISEX,
      price: 16800,
      discountPrice: 14500,
      countInStock: 20,
      rating: 4.9,
      numReviews: 267,
      quantity: 20,
      isBestseller: true,
      isNewArrival: false,
    },
    {
      name: "Trail Runner SWT (Edition 2)",
      brand: "Allbirds",
      category: cat["Trail"],
      description:
        "Built for the wild. Rugged Trino upper, wide toe box, and deep lug pattern deliver grip on any terrain. SweetFoam midsole cushions every step on dirt, rock, and root.",
      material: "Trino (merino + tree fiber) + Rubber Lug",
      sustainability: "Natural Trino blend, SweetFoam, carbon neutral",
      productCollection: "Trail",
      image: IMG.trail2,
      images: [IMG.trail2],
      colors: [
        { name: "Natural Black", hex: "#1A1A1A" },
        { name: "Basin Green", hex: "#4A6741" },
        { name: "Thunder", hex: "#3D3D3D" },
      ],
      sizes: SIZES_UNISEX,
      price: 16800,
      discountPrice: 14500,
      countInStock: 20,
      rating: 4.9,
      numReviews: 120,
      quantity: 20,
      isBestseller: true,
      isNewArrival: false,
    },
    {
      name: "Trail Runner Mizzle",
      brand: "Allbirds",
      category: cat["Trail"],
      description:
        "Weather-ready trail performance. Water-repellent upper with deep lug outsole. Takes on mud, rain, and rugged terrain while keeping feet dry and comfortable.",
      material: "Trino + Water Repellent + Rubber Lug",
      sustainability: "Bio-based water treatment, natural Trino blend, carbon neutral",
      productCollection: "Trail",
      image: IMG.trailMizzle,
      images: [IMG.trailMizzle],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Natural Black", hex: "#1A1A1A" },
      ],
      sizes: SIZES_UNISEX,
      price: 17500,
      discountPrice: 0,
      countInStock: 18,
      rating: 4.7,
      numReviews: 189,
      quantity: 18,
      isBestseller: false,
      isNewArrival: true,
    },

    // ═══════════════════ KIDS ═══════════════════
    {
      name: "Kids' Wool Runners",
      brand: "Allbirds",
      category: cat["Kids"],
      description:
        "Mini versions of the legend. Same merino wool comfort, sized for little adventures. Machine washable and slip-on easy. Durable SweetFoam sole for playgrounds and beyond.",
      material: "ZQ Merino Wool",
      sustainability: "ZQ certified, SweetFoam, machine washable",
      productCollection: "Kids",
      image: IMG.kidsWool,
      images: [IMG.kidsWool],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Buoy Red", hex: "#C52B2B" },
        { name: "Basin Green", hex: "#4A6741" },
      ],
      sizes: SIZES_KIDS,
      price: 7500,
      discountPrice: 6000,
      countInStock: 60,
      rating: 4.8,
      numReviews: 342,
      quantity: 60,
      isBestseller: false,
      isNewArrival: false,
    },
    {
      name: "Kids' Tree Runners",
      brand: "Allbirds",
      category: cat["Kids"],
      description:
        "Light and breezy for active kids. Eucalyptus fiber stays cool, SweetFoam keeps things bouncy. Easy slip-on fit so they can do it themselves.",
      material: "Eucalyptus Tree Fiber",
      sustainability: "FSC certified, SweetFoam, carbon neutral",
      productCollection: "Kids",
      image: IMG.kidsTree,
      images: [IMG.kidsTree],
      colors: [
        { name: "Blizzard", hex: "#E8E4DC" },
        { name: "Navy Night", hex: "#1B2A4A" },
      ],
      sizes: SIZES_KIDS,
      price: 7500,
      discountPrice: 0,
      countInStock: 45,
      rating: 4.7,
      numReviews: 213,
      quantity: 45,
      isBestseller: false,
      isNewArrival: true,
    },

    // ═══════════════════ SOCKS & ACCESSORIES ═══════════════════
    {
      name: "Trino Ankle Socks (3-Pack)",
      brand: "Allbirds",
      category: cat["Socks & Accessories"],
      description:
        "Our signature Trino blend — merino wool meets eucalyptus tree fiber. Naturally moisture-wicking, temperature-regulating, and odor-fighting. Three pairs per pack.",
      material: "Trino (Merino Wool + Eucalyptus)",
      sustainability: "Natural Trino blend, responsible sourcing",
      productCollection: "Accessories",
      image: IMG.socks,
      images: [IMG.socks],
      colors: [
        { name: "Natural Black", hex: "#1A1A1A" },
        { name: "Natural White", hex: "#F5F0E8" },
      ],
      sizes: [7, 8, 9, 10, 11, 12],
      price: 3800,
      discountPrice: 0,
      countInStock: 150,
      rating: 4.6,
      numReviews: 578,
      quantity: 150,
      isBestseller: false,
      isNewArrival: false,
    },
    {
      name: "Trino No-Show Socks (3-Pack)",
      brand: "Allbirds",
      category: cat["Socks & Accessories"],
      description:
        "Invisible comfort. Trino blend no-show socks designed for our shoes. Silicone grip heel keeps them hidden. Naturally moisture-wicking and odor-resistant.",
      material: "Trino (Merino Wool + Eucalyptus)",
      sustainability: "Natural Trino blend, responsible sourcing",
      productCollection: "Accessories",
      image: IMG.socksNoShow,
      images: [IMG.socksNoShow],
      colors: [
        { name: "Natural White", hex: "#F5F0E8" },
        { name: "Natural Black", hex: "#1A1A1A" },
      ],
      sizes: [7, 8, 9, 10, 11, 12],
      price: 3800,
      discountPrice: 0,
      countInStock: 120,
      rating: 4.5,
      numReviews: 423,
      quantity: 120,
      isBestseller: false,
      isNewArrival: false,
    },
    {
      name: "Wool Insoles",
      brand: "Allbirds",
      category: cat["Socks & Accessories"],
      description:
        "Extra cushion for any shoe. ZQ Certified merino wool insoles add a layer of natural temperature regulation and all-day comfort.",
      material: "ZQ Merino Wool",
      sustainability: "ZQ certified, castor bean foam base",
      productCollection: "Accessories",
      image: IMG.insoles,
      images: [IMG.insoles],
      colors: [{ name: "Natural White", hex: "#F5F0E8" }],
      sizes: [7, 8, 9, 10, 11, 12, 13],
      price: 2500,
      discountPrice: 0,
      countInStock: 200,
      rating: 4.4,
      numReviews: 287,
      quantity: 200,
      isBestseller: false,
      isNewArrival: false,
    },
  ];

  const inserted = await Product.insertMany(products);
  console.log(`Seeded ${inserted.length} products`);

  console.log("\n════════════════════════════════════════");
  console.log("  SEED COMPLETE!");
  console.log("════════════════════════════════════════");
  console.log(`  Users:      ${users.length}`);
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Products:   ${inserted.length}`);
  console.log("");
  console.log("  LOGIN CREDENTIALS:");
  console.log("  ─────────────────────────────────────");
  console.log("  Admin:   admin@allbirds.com / password123");
  console.log("  User 1:  john@allbirds.com  / password123");
  console.log("  User 2:  jane@allbirds.com  / password123");
  console.log("════════════════════════════════════════\n");

  await mongoose.disconnect();
  console.log("Disconnected");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
