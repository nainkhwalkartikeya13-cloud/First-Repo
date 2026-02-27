import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";

import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";
import ContentWrapper from "../../components/ContentWrapper";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-2 text-sm text-text-secondary">
      <Icon className="text-text-muted shrink-0" size={14} />
      <span className="text-text-muted">{label}:</span>
      <span className="text-text-primary">{value}</span>
    </div>
  );

  return (
    <div className="bg-brand-navy min-h-screen">
      <ContentWrapper>
        <div className="pb-12">
          {/* Back link */}
          <div className="py-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              <BsArrowLeft size={18} />
              Back to Home
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <Loader />
            </div>
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error?.message}
            </Message>
          ) : (
            <>
              {/* Product Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Image */}
                <div className="relative overflow-hidden rounded-lg bg-surface-card">
                  <img
                    src={product?.image}
                    alt={product?.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <HeartIcon product={product} />
                </div>

                {/* Details */}
                <div className="flex flex-col">
                  <h1 className="text-xl md:text-2xl lg:text-3xl font-display font-bold text-text-primary mb-3">
                    {product?.name}
                  </h1>

                  <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6">
                    {product?.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-2xl md:text-3xl font-bold text-accent-green">
                      ${product?.price}
                    </span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 p-4 bg-surface-card rounded-lg border border-surface-border mb-6">
                    <InfoItem icon={FaStore} label="Brand" value={product?.brand} />
                    <InfoItem icon={FaClock} label="Added" value={moment(product?.createAt).format("MMM Do YY")} />
                    <InfoItem icon={FaStar} label="Reviews" value={product?.numReviews} />
                    <InfoItem icon={FaStar} label="Rating" value={product?.rating?.toFixed(1)} />
                    <InfoItem icon={FaShoppingCart} label="Quantity" value={product?.quantity} />
                    <InfoItem icon={FaBox} label="In Stock" value={product?.countInStock} />
                  </div>

                  {/* Rating + Quantity */}
                  <div className="flex items-center gap-6 mb-6">
                    <Ratings
                      value={product?.rating}
                      text={`${product?.numReviews} reviews`}
                    />

                    {product?.countInStock > 0 && (
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="px-3 py-2 rounded-lg bg-surface-card border border-surface-border text-text-primary outline-none focus:border-accent-pink text-sm"
                      >
                        {[...Array(product?.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={addToCartHandler}
                    disabled={product?.countInStock === 0}
                    className="w-full md:w-auto px-8 py-3 bg-accent-pink-hover hover:bg-accent-pink text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {product?.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                  </button>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-12 border border-surface-border rounded-lg p-4 lg:p-6">
                <ProductTabs
                  loadingProductReview={loadingProductReview}
                  userInfo={userInfo}
                  submitHandler={submitHandler}
                  rating={rating}
                  setRating={setRating}
                  comment={comment}
                  setComment={setComment}
                  product={product}
                />
              </div>
            </>
          )}
        </div>
      </ContentWrapper>
    </div>
  );
};
export default ProductDetails;
