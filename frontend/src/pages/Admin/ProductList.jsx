import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApislice";

import ContentWrapper from "../../components/ContentWrapper";

const ProductList = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    quantity: "",
    brand: "",
    countInStock: "",
    image: "",
    images: [],
  });

  const [imagePreview, setImagePreview] = useState(null);

  const [uploadProductImage, { isLoading: uploading }] =
    useUploadProductImageMutation();
  const [createProduct, { isLoading: creating }] =
    useCreateProductMutation();

  const { data: categories = [] } = useFetchCategoriesQuery();

  // 🔁 reusable handler
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🖼️ Image upload
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const image = await toBase64(file);
      const res = await uploadProductImage({ image }).unwrap();
      setForm((prev) => ({ ...prev, image: res.image }));
      setImagePreview(res.image);
      toast.success(res.message || "Image uploaded successfully");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Image upload failed");
    }
  };

  const uploadExtraFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const image = await toBase64(file);
      const res = await uploadProductImage({ image }).unwrap();
      setForm((prev) => ({ ...prev, images: [...prev.images, res.image] }));
      toast.success("Additional image added successfully");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Image upload failed");
    }
  };

  // 📦 Create product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image || !form.name || !form.price || !form.category) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(val => formData.append(key, val));
          } else {
            formData.append(key, value);
          }
        }
      });

      const res = await createProduct(formData).unwrap();
      toast.success(`${res.name} created successfully`);
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Product creation failed");
    }
  };

  return (
    <div className="bg-white dark:bg-white min-h-screen text-gray-900 dark:text-gray-900 transition-colors duration-300 pb-20 pt-10">
      <ContentWrapper>
        <div className="grid place-content-center py-8">
          <form
            onSubmit={handleSubmit}
            className="w-[320px] md:w-[460px] xl:w-[700px]"
          >
            <h1 className="text-2xl font-semibold mb-6 text-center">
              Create Product
            </h1>

            {/* Image Preview */}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="mb-4 max-h-[220px] w-full object-contain rounded-lg"
              />
            )}

            {/* Image Upload */}
            <label className="block border border-dashed border-gray-300 dark:border-gray-300 bg-white dark:bg-white rounded-lg p-8 text-center cursor-pointer mb-4 text-gray-700 dark:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-50 transition-colors">
              {uploading ? "Uploading..." : "Upload Primary Image"}
              <input
                type="file"
                accept="image/*"
                onChange={uploadFileHandler}
                hidden
              />
            </label>

            {/* Extra Images Preview & Upload */}
            {form.images.length > 0 && (
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {form.images.map((img, i) => (
                  <img key={i} src={img} alt={`extra-${i}`} className="h-16 w-16 object-cover rounded" />
                ))}
              </div>
            )}
            <label className="block border border-dashed border-gray-300 dark:border-gray-300 bg-white dark:bg-white rounded-lg p-4 text-center text-sm cursor-pointer mb-6 text-gray-600 dark:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-50 transition-colors">
              {uploading ? "Uploading..." : "+ Add Additional Image"}
              <input
                type="file"
                accept="image/*"
                onChange={uploadExtraFileHandler}
                hidden
              />
            </label>

            {/* Inputs */}
            <Input name="name" label="Name" value={form.name} onChange={handleChange} />
            <div className="flex gap-4">
              <div className="flex-1">
                <Input name="price" label="Price" type="number" value={form.price} onChange={handleChange} />
              </div>
              <div className="flex-1">
                <Input name="discountPrice" label="Discount Price" type="number" value={form.discountPrice} onChange={handleChange} />
              </div>
            </div>
            <Input name="quantity" label="Quantity" type="number" value={form.quantity} onChange={handleChange} />
            <Input name="brand" label="Brand" value={form.brand} onChange={handleChange} />
            <Input name="countInStock" label="Count In Stock" type="number" value={form.countInStock} onChange={handleChange} />

            {/* Category */}
            <label className="block mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full mt-1 p-2.5 border rounded-lg bg-white dark:bg-white text-gray-900 dark:text-gray-900 outline-none border-gray-300 dark:border-gray-300 focus:border-gray-400 dark:focus:border-gray-400 transition-colors"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Description */}
            <label className="block mt-4 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 p-2.5 border rounded-lg bg-white dark:bg-white text-gray-900 dark:text-gray-900 outline-none border-gray-300 dark:border-gray-300 focus:border-gray-400 dark:focus:border-gray-400 transition-colors h-24 resize-y"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={creating}
              className="w-full mt-6 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-white dark:text-gray-900 py-3 rounded-lg font-semibold disabled:opacity-60 shadow-md"
            >
              {creating ? "Creating..." : "Create Product"}
            </button>
          </form>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default ProductList;

/* 🔧 Small reusable input */
const Input = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block mb-1">{label}</label>
    <input
      {...props}
      className="w-full mt-1 p-2.5 border rounded-lg bg-white dark:bg-white text-gray-900 dark:text-gray-900 placeholder-gray-400 dark:placeholder-gray-400 outline-none border-gray-300 dark:border-gray-300 focus:border-gray-400 dark:focus:border-gray-400 transition-colors"
    />
  </div>
);
