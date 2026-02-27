// pages/Orders/Order.jsx - Simple Version
import { useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../redux/api/orderApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import ContentWrapper from "../../components/ContentWrapper";

const Order = () => {
  const { id } = useParams();
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(id);

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">Order not found</Message>;

  return (
    <div className="bg-[#0E1629] min-h-screen">
      <ContentWrapper>
        <div className="max-w-4xl mx-auto mt-8 px-4 py-8">
          {/* Success Message */}
          <div className="bg-green-900/20 border border-green-500 rounded p-6 mb-6">
            <h1 className="text-2xl font-bold text-green-400 mb-2">
              ✓ Order Placed Successfully!
            </h1>
            <p className="text-gray-300">Order ID: {order._id}</p>
            <p className="text-gray-300">
              {order.isPaid ? (
                <span className="text-green-400">Payment Successful</span>
              ) : (
                <span className="text-yellow-400">Payment Pending</span>
              )}
            </p>
          </div>

          {/* Order Items */}
          <div className="bg-[#0E1629] border border-[#444444] rounded p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Items</h2>
            {order.orderItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-4 mb-4 pb-4 border-b border-[#333] last:border-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-400">Quantity: {item.qty}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{item.price}</p>
                  <p className="text-gray-400">
                    Total: ₹{(item.qty * item.price).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping & Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#0E1629] border border-[#444444] rounded p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>

            <div className="bg-[#0E1629] border border-[#444444] rounded p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Items:</span>
                  <span>₹{order.itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{order.shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{order.taxPrice}</span>
                </div>
                <hr className="border-[#444444]" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{order.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default Order;