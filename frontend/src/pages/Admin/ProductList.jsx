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
    category: "",
    quantity: "",
    brand: "",
    countInStock: "",
    image: "",
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
      toast.success(res.message);
    } catch (err) {
      toast.error(err?.data?.message || "Image upload failed");
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
        if (value !== undefined && value !== null) formData.append(key, value);
      });

      const res = await createProduct(formData).unwrap();
      toast.success(`${res.name} created successfully`);
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Product creation failed");
    }
  };

  return (
    <div className="bg-[#0E1629] min-h-screen text-[#F6F6F6]">
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
            <label className="block border border-[#444] rounded p-4 text-center cursor-pointer mb-4">
              {uploading ? "Uploading..." : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                onChange={uploadFileHandler}
                hidden
              />
            </label>

            {/* Inputs */}
            <Input name="name" label="Name" value={form.name} onChange={handleChange} />
            <Input name="price" label="Price" type="number" value={form.price} onChange={handleChange} />
            <Input name="quantity" label="Quantity" type="number" value={form.quantity} onChange={handleChange} />
            <Input name="brand" label="Brand" value={form.brand} onChange={handleChange} />
            <Input name="countInStock" label="Count In Stock" type="number" value={form.countInStock} onChange={handleChange} />

            {/* Category */}
            <label className="block mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="input"
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
              className="input h-24"
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={creating}
              className="w-full mt-6 bg-[#db1143f3] hover:bg-[#FF2E63] py-2 rounded font-semibold disabled:opacity-60"
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
      className="input"
    />
  </div>
);
