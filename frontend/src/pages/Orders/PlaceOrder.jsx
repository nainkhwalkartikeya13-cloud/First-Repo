import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";
import ContentWrapper from "../../components/ContentWrapper";
import axios from "axios";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      setPaymentLoading(true);

      // Step 1: Create order in MongoDB
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: "Razorpay",
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      console.log("Order created:", res);

      // Step 2: Create Razorpay order
      const { data: razorpayOrder } = await axios.post(
        "http://localhost:5000/api/v1/razorpay/create-order",
        {
          amount: cart.totalPrice,
          mongoOrderId: res._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo?.token}`,
          },
        }
      );

      console.log("Razorpay order created:", razorpayOrder);

      // Step 3: Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Add this to your .env
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "LuxeHaven",
        description: `Order #${res._id}`,
        order_id: razorpayOrder.razorpayOrderId,
        handler: async function (response) {
          try {
            console.log("Payment response:", response);

            // Step 4: Verify payment
            const { data } = await axios.post(
              "http://localhost:5000/api/v1/razorpay/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                mongoOrderId: res._id,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userInfo?.token}`,
                },
              }
            );

            console.log("Payment verified:", data);

            if (data.success) {
              // Clear cart and navigate to order details
              dispatch(clearCartItems());
              toast.success("Payment successful!");
              
              // Navigate to order details page
              navigate(`/order/${res._id}`);
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error(
              error?.response?.data?.message || "Payment verification failed!"
            );
            setPaymentLoading(false);
          }
        },
        prefill: {
          name: userInfo?.username || cart.shippingAddress.name || "",
          email: userInfo?.email || "",
          contact: cart.shippingAddress.phone || "",
        },
        notes: {
          address: `${cart.shippingAddress.address}, ${cart.shippingAddress.city}`,
        },
        theme: {
          color: "#db1143",
        },
        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
            toast.info("Payment cancelled");
          },
        },
      };

      // Check if Razorpay is loaded
      if (typeof window.Razorpay === "undefined") {
        toast.error("Razorpay SDK not loaded. Please refresh the page.");
        setPaymentLoading(false);
        return;
      }

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast.error(`Payment Failed: ${response.error.description}`);
        setPaymentLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Place order error:", error);
      toast.error(error?.data?.message || error?.message || "Error creating order");
      setPaymentLoading(false);
    }
  };

  return (
    <div className="bg-[#0E1629] min-h-screen">
      <ContentWrapper>
        <ProgressSteps step1 step2 step3 />
        <div className="mx-auto mt-8 px-4">
          {cart.cartItems.length === 0 ? (
            <Message>Your cart is empty</Message>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <td className="px-1 py-2 text-left align-top">Image</td>
                    <td className="px-1 py-2 text-left hidden lg:block">
                      Product
                    </td>
                    <td className="px-1 py-2 text-left">Quantity</td>
                    <td className="px-1 py-2 text-left">Price</td>
                    <td className="px-1 py-2 text-left">Total</td>
                  </tr>
                </thead>

                <tbody>
                  {cart.cartItems.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2">
                        <Link to={`/product/${item.product}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 object-cover"
                          />
                        </Link>
                      </td>

                      <td className="p-2 hidden lg:block">
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </td>
                      <td className="p-2">{item.qty}</td>
                      <td className="p-2">₹{item.price.toFixed(2)}</td>
                      <td className="p-2">
                        ₹{(item.qty * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl lg:text-2xl font-semibold mb-5">
              Order Summary
            </h2>
            <div className="flex justify-between flex-wrap p-4 bg-[#0E1629] border border-[#444444] items-center gap-8">
              <ul className="flex flex-col gap-2">
                <li>
                  <span className="font-semibold mb-4">Items:</span> ₹
                  {cart.itemsPrice}
                </li>
                <li>
                  <span className="font-semibold mb-4">Shipping:</span> ₹
                  {cart.shippingPrice}
                </li>
                <li>
                  <span className="font-semibold mb-4">Tax:</span> ₹
                  {cart.taxPrice}
                </li>
                <li>
                  <span className="font-semibold mb-4">Total:</span> ₹
                  {cart.totalPrice}
                </li>
              </ul>

              {error && (
                <Message variant="danger">{error.data.message}</Message>
              )}

              <div>
                <h2 className="text-lg xl:text-xl font-semibold mb-2">
                  Shipping:
                </h2>
                <p>
                  <strong>Address:</strong> {cart.shippingAddress.address},{" "}
                  {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              </div>

              <div>
                <h2 className="text-lg xl:text-xl font-semibold mb-4">
                  Payment Method
                </h2>
                <strong>Method:</strong> Razorpay
              </div>
            </div>

            <div className="flex justify-center items-center w-full">
              <button
                type="button"
                className="bg-[#db1143f3] hover:bg-[#FF2E63] transition-colors text-white border-none outline-none w-[320px] md:w-[460px] 2xl:w-[520px] px-4 py-2 rounded cursor-pointer my-[1rem] text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={cart.cartItems.length === 0 || isLoading || paymentLoading}
                onClick={placeOrderHandler}
              >
                {isLoading || paymentLoading ? "Processing..." : "Pay with Razorpay"}
              </button>
            </div>

            {(isLoading || paymentLoading) && <Loader />}
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default PlaceOrder;