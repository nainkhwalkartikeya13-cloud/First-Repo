import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery, useBulkUploadMutation } from "../../redux/api/productApiSlice";
import { toast } from "react-toastify";
import { useState } from "react";
import ContentWrapper from "../../components/ContentWrapper";

const AllProducts = () => {
  const { data: products, isLoading, isError, refetch } = useAllProductsQuery();
  const [bulkUpload, { isLoading: isUploading }] = useBulkUploadMutation();
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await bulkUpload(formData).unwrap();
      toast.success(res.message);
      refetch();
      setIsBulkOpen(false);
    } catch (err) {
      toast.error(err?.data?.error || "Bulk upload failed");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <div className="bg-white dark:bg-white min-h-screen transition-colors duration-300 pb-20 pt-10">
      <ContentWrapper>
        <div className="flex flex-col md:flex-row">
          <div className="p-3 w-full">
            <div className="md:ml-12 flex justify-between items-center mb-8">
              <div className="text-xl md:text-3xl font-semibold text-gray-900 dark:text-gray-900">
                All Products ({products?.length})
              </div>
              <button
                onClick={() => setIsBulkOpen(!isBulkOpen)}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
              >
                {isBulkOpen ? "Close Bulk Upload" : "Bulk Upload CSV"}
              </button>
            </div>

            {isBulkOpen && (
              <div className="md:ml-12 mb-10 p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <div className="max-w-xl mx-auto text-center">
                  <h3 className="text-lg font-semibold mb-2">Mass Inventory Upload</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Professional tool for adding large product sets. Ensure your CSV has headers:
                    <code className="mx-1 bg-gray-100 px-1 rounded">name, price, category, brand, description, countInStock, image</code>
                  </p>

                  <label className="cursor-pointer inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {isUploading ? "Uploading..." : "Select CSV File"}
                    <input type="file" accept=".csv" onChange={handleBulkUpload} hidden disabled={isUploading} />
                  </label>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full px-4 xl:px-8">
              {products.filter(p => p && p._id).map((product) => (
                <div key={product._id} className="w-full">
                  <div className="flex justify-center flex-col md:flex-row bg-white dark:bg-white border border-gray-200 dark:border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-50 w-full md:w-[15rem] p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain mx-auto"
                      />
                    </div>
                    <div className="p-6 flex flex-col justify-around flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="text-xl font-semibold text-gray-900 dark:text-gray-900">
                          {product?.name?.substring(0, 30)}...
                        </h5>

                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                          {moment(product.createdAt).format("MMMM Do YYYY")}
                        </p>
                      </div>

                      {product.countInStock < 5 && (
                        <div className="mb-4">
                          <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider animate-pulse">
                            Low Stock: {product.countInStock} left
                          </span>
                        </div>
                      )}

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-2">
                        {product?.description?.substring(0, 120)}...
                      </p>

                      <div className="flex justify-between items-center mt-auto">
                        <Link
                          to={`/admin/product/update/${product._id}`}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white dark:text-white bg-gray-900 dark:bg-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-800 transition-colors shadow-sm"
                        >
                          Update Product
                          <svg
                            className="w-3.5 h-3.5 ml-2"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M1 5h12m0 0L9 1m4 4L9 9"
                            />
                          </svg>
                        </Link>
                        <p className="text-gray-900 dark:text-gray-900 font-bold text-lg">
                          ₹ {product?.price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default AllProducts;
