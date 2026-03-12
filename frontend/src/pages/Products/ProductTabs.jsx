import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import { useCheckPurchaseQuery } from "../../redux/api/orderApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  const { data: purchaseData, isLoading: isLoadingPurchase } = useCheckPurchaseQuery(product?._id, {
    skip: !userInfo || !product?._id,
  });

  if (isLoading) {
    return <Loader />;
  }

  const tabs = [
    { id: 1, label: "Write a Review" },
    { id: 2, label: `Reviews (${product?.reviews?.length || 0})` },
    { id: 3, label: "Top Products" },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.id
                ? "border-gray-900 dark:border-indigo-400 text-gray-900 dark:text-white"
                : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 1 && (
        <div className="max-w-xl">
          {userInfo ? (
            isLoadingPurchase ? (
              <p className="text-gray-500 text-sm">Verifying purchase status...</p>
            ) : purchaseData?.purchased ? (
              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-800/50 focus:border-gray-400 dark:focus:border-gray-500 text-sm transition-colors"
                  >
                    <option value="">Select a rating</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Your Review
                  </label>
                  <textarea
                    id="comment"
                    rows="4"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full p-2.5 border border-gray-200 dark:border-gray-700 rounded-lg outline-none text-gray-900 dark:text-white bg-white dark:bg-gray-800/50 focus:border-gray-400 dark:focus:border-gray-500 text-sm transition-colors resize-none placeholder-gray-300 dark:placeholder-gray-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="px-6 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                >
                  {loadingProductReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-100 dark:border-gray-700 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Only verified buyers can leave a review. Purchase this item to share your thoughts!
                </p>
              </div>
            )
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Please{" "}
              <Link to="/login" className="text-gray-900 dark:text-indigo-400 underline underline-offset-2">
                sign in
              </Link>{" "}
              to write a review.
            </p>
          )}
        </div>
      )}

      {activeTab === 2 && (
        <div>
          {product.reviews.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm py-8 text-center">
              No reviews yet. Be the first to share your thoughts!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="p-4 bg-white dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{review.name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {review.createdAt.substring(0, 10)}
                    </span>
                  </div>
                  <Ratings value={review.rating} />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 3 && (
        <div className="flex gap-4 flex-wrap">
          {!data ? (
            <Loader />
          ) : (
            data.map((product) => (
              <div key={product._id}>
                <SmallProduct product={product} />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProductTabs;
