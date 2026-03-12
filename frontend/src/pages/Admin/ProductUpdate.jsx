import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApislice";
import { toast } from "react-toastify";
import ContentWrapper from "../../components/ContentWrapper";

const ProductUpdate = () => {
  const params = useParams();

  const { data: productData } = useGetProductByIdQuery(params._id);


  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [discountPrice, setDiscountPrice] = useState(
    productData?.discountPrice || ""
  );
  const [images, setImages] = useState(productData?.images || []);
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock || "");
  const [outOfStockSizes, setOutOfStockSizes] = useState("");
  const [uploading, setUploading] = useState(false);

  // hook
  const navigate = useNavigate();

  // Fetch categories using RTK Query
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  // Define the update product mutation
  const [updateProduct] = useUpdateProductMutation();

  // Define the delete product mutation
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
      setDiscountPrice(productData.discountPrice || 0);
      setCategory(productData.category?._id || productData.category);
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setImages(productData.images || []);
      setStock(productData.countInStock);
      setOutOfStockSizes(productData.outOfStockSizes?.join(", ") || "");
    }
  }, [productData]);

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

    setUploading(true);
    try {
      const imageData = await toBase64(file);
      const res = await uploadProductImage({ image: imageData }).unwrap();
      setImage(res.image);
      toast.success("Image uploaded successfully");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const uploadExtraFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageData = await toBase64(file);
      const res = await uploadProductImage({ image: imageData }).unwrap();
      setImages((prev) => [...prev, res.image]);
      toast.success("Additional image added");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveExtraImage = (imgUrl) => {
    setImages((prev) => prev.filter((img) => img !== imgUrl));
    toast.info("Image removed from gallery");
  };

  const handleSetAsCover = (imgUrl) => {
    if (!image) {
      setImage(imgUrl);
      setImages((prev) => prev.filter((img) => img !== imgUrl));
    } else {
      const oldCover = image;
      setImage(imgUrl);
      setImages((prev) => [oldCover, ...prev.filter((img) => img !== imgUrl)]);
    }
    toast.success("Cover image updated");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productFields = {
        image,
        name,
        description,
        price,
        discountPrice,
        category,
        quantity,
        brand,
        countInStock: stock,
        images: images,
        outOfStockSizes: outOfStockSizes.split(",").map(s => s.trim()).filter(Boolean),
      };

      console.log("SUBMIT_DEBUG: Data being sent to updateProduct:", { productId: params._id, formData: productFields });
      // Update product using the RTK Query mutation
      await updateProduct({
        productId: params._id,
        ...productFields
      }).unwrap();

      toast.success(`Product successfully updated`);
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log("SUBMIT_DEBUG: Response from updateProduct error:", err);
      toast.error(err?.data?.error || err?.error || "Product update failed. Try again.");
    }
  };

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      await deleteProduct(params._id).unwrap();
      toast.success(`Product deleted`);
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.error || err?.error || "Delete failed. Try again.");
    }
  };

  return (
    <div className="bg-white dark:bg-white min-h-screen text-gray-900 dark:text-gray-900 transition-colors duration-300 pb-20 pt-10">
      <ContentWrapper>
        <div className="grid place-content-center py-8">
          <div className="w-[320px] md:w-[460px] xl:w-[700px]">
            <h1 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-gray-900">
              Update Product
            </h1>

            {/* Images Section */}
            <div className="bg-gray-50 dark:bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-900 mb-4 uppercase tracking-wider">Product Images</h2>

              {image && (
                <div className="mb-6">
                  <span className="block text-xs font-medium text-gray-500 mb-2">Main Image</span>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                    <img
                      src={image}
                      alt="product"
                      className="block max-h-[250px] mx-auto object-contain rounded"
                    />
                  </div>
                </div>
              )}

              {images.length > 0 && (
                <div className="mb-6">
                  <span className="block text-xs font-medium text-gray-500 mb-2">Additional Images Gallery</span>
                  <div className="flex flex-wrap gap-4">
                    {images.map((img, i) => (
                      <div key={i} className="relative group rounded-lg border border-gray-200 bg-white w-24 h-24 flex-shrink-0 shadow-sm overflow-hidden">
                        <img
                          src={img}
                          alt={`extra-${i}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveExtraImage(img)}
                          className="absolute top-1 right-1 bg-white/90 hover:bg-red-500 hover:text-white text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
                          title="Remove image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSetAsCover(img)}
                          className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] font-medium py-1 text-center transition-colors hover:bg-black w-full shadow-md z-10"
                          title="Set as Cover Image"
                        >
                          SET COVER
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <label className="flex-1 border border-dashed border-gray-300 bg-white rounded-lg p-4 text-center text-sm cursor-pointer text-gray-600 hover:bg-gray-100 transition-colors shadow-sm font-medium">
                  {uploading ? "Uploading..." : "Update Main Image"}
                  <input type="file" name="image" accept="image/*" onChange={uploadFileHandler} hidden />
                </label>

                <label className="flex-1 border border-dashed border-gray-300 bg-white rounded-lg p-4 text-center text-sm cursor-pointer text-gray-600 hover:bg-gray-100 transition-colors shadow-sm font-medium">
                  {uploading ? "Uploading..." : "+ Add Additional Image"}
                  <input type="file" accept="image/*" onChange={uploadExtraFileHandler} hidden />
                </label>
              </div>
            </div>

            <div className="p-3">
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[300px]">
                  <label className="text-gray-900 dark:text-gray-900 font-medium">
                    Name
                  </label>{" "}
                  <br />
                  <input
                    type="text"
                    className="mt-1 p-2.5 border rounded-lg w-full mb-4 bg-white dark:bg-white placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-900 outline-none border-gray-200 dark:border-gray-200 focus:border-accent-blue transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="text-gray-900 dark:text-gray-900 font-medium">
                    Price
                  </label>{" "}
                  <br />
                  <input
                    type="number"
                    className="mt-1 p-2.5 border rounded-lg w-full mb-4 bg-white dark:bg-white placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-900 outline-none border-gray-200 dark:border-gray-200 focus:border-accent-blue transition-colors"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[140px]">
                  <label className="text-gray-900 dark:text-gray-900 font-medium">
                    Quantity
                  </label>{" "}
                  <br />
                  <input
                    type="number"
                    className="mt-1 p-2.5 border rounded-lg w-full mb-4 bg-white dark:bg-white placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-900 outline-none border-gray-200 dark:border-gray-200 focus:border-accent-blue transition-colors"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="flex-1 min-w-[140px]">
                  <label className="text-gray-900 dark:text-gray-900 font-medium">
                    Brand
                  </label>{" "}
                  <br />
                  <input
                    type="text"
                    className="mt-1 p-2.5 border rounded-lg w-full mb-4 bg-white dark:bg-white placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-900 outline-none border-gray-200 dark:border-gray-200 focus:border-accent-blue transition-colors"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="block mt-4 mb-1 text-gray-900 dark:text-gray-900 font-medium">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 p-2.5 border rounded-lg bg-white dark:bg-white text-gray-900 dark:text-gray-900 outline-none border-gray-200 dark:border-gray-200 focus:border-accent-blue transition-colors h-24 resize-y"
                />
              </div>

              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex-1">
                  <label className="text-gray-900 dark:text-gray-900 font-medium">
                    Count In Stock
                  </label>{" "}
                  <br />
                  <input
                    type="text"
                    className="mt-1 p-2.5 border rounded-lg w-full mb-4 bg-white dark:bg-white placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-900 outline-none border-gray-200 dark:border-gray-200 focus:border-accent-blue transition-colors"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>

                <div className="flex-1">
                  <label className="text-gray-900 dark:text-gray-900 font-medium tracking-tight">
                    Sold Out Sizes (ex: 8, 9, 10)
                  </label>{" "}
                  <br />
                  <input
                    type="text"
                    className="mt-1 p-2.5 border rounded-lg w-full mb-4 bg-white dark:bg-white placeholder-gray-400 dark:placeholder-gray-400 text-gray-900 dark:text-gray-900 outline-none border-gray-200 dark:border-gray-200 focus:border-accent-blue transition-colors"
                    value={outOfStockSizes}
                    onChange={(e) => setOutOfStockSizes(e.target.value)}
                    placeholder="e.g. 7, 8.5"
                  />
                </div>

                <div className="flex-1">
                  <label className="text-gray-900 dark:text-gray-900 font-medium">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 p-2.5 border rounded-lg bg-white dark:bg-white text-gray-900 dark:text-gray-900 outline-none border-gray-200 dark:border-gray-200 focus:border-accent-blue transition-colors"
                  >
                    {categories?.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={handleSubmit}
                className="bg-gray-900 hover:bg-gray-800 transition-colors text-white px-8 py-3 rounded-lg font-semibold shadow-md flex-1"
              >
                Update
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 transition-colors text-white px-8 py-3 rounded-lg font-semibold shadow-md flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default ProductUpdate;
