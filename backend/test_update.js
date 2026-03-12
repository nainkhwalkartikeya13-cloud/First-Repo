import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

await mongoose.connect(process.env.MONGO_URI);
const Product = mongoose.model('Product', new mongoose.Schema({
  name: String,
  images: [String]
}, {strict: false}), 'products');

const p = await Product.findOne({ name: 'Men\'s Tree Dasher 2 (Red Edition)' });
console.log("Found:", p.name, "Images:", p.images);
p.images = [];
await p.save();

const p2 = await Product.findOne({ name: 'Men\'s Tree Dasher 2 (Red Edition)' });
console.log("After save:", p2.images);

process.exit(0);
