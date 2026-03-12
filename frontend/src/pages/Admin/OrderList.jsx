import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery } from "../../redux/api/orderApiSlice";
import ContentWrapper from "../../components/ContentWrapper";

const OrderList = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="bg-white dark:bg-white min-h-[100vh] text-gray-900 dark:text-gray-900 transition-colors duration-300 pb-20 pt-10">
      {isLoading ? (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <ContentWrapper>
          <div className="flex flex-col md:flex-row">
            <div className="overflow-x-auto bg-white dark:bg-white rounded-xl shadow-sm border border-gray-100 dark:border-gray-200 p-6 mx-4 md:mx-auto max-w-7xl w-full">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-900 dark:text-gray-900">
                Orders Management
              </h2>

              <table className="w-full text-left border-collapse">
                <thead className="w-full">
                  <tr className="border-b border-gray-200 dark:border-gray-200 mb-4 text-gray-700 dark:text-gray-600 font-semibold">
                    <th className="py-3 px-2">Image</th>
                    <th className="py-3 px-2">ID</th>
                    <th className="py-3 px-2">User</th>
                    <th className="py-3 px-2">Date</th>
                    <th className="py-3 px-2">Total</th>
                    <th className="py-3 px-2">Paid</th>
                    <th className="py-3 px-2">Delivered</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>

                <tbody className="my-8">
                  {Array.isArray(orders) &&
                    [...orders]
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .filter(order => order && order._id)
                      .map((order) => (
                        <tr
                          key={order._id}
                          className="border-b border-gray-100 dark:border-gray-100 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-2">
                            {order.orderItems?.[0]?.image ? (
                              <img
                                src={order.orderItems[0].image}
                                alt={order._id}
                                className="w-16 h-16 object-cover rounded-md"
                              />
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-[10px] text-gray-500">
                                No Image
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-2 font-medium">{order._id}</td>

                          <td className="py-3 px-2">
                            {order.user?.username ? (
                              <span className="font-medium text-gray-900">{order.user.username}</span>
                            ) : (order.shippingAddress?.firstName || order.shippingAddress?.lastName) ? (
                              <span className="font-medium text-gray-700">
                                {order.shippingAddress.firstName} {order.shippingAddress.lastName} <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-1">Guest</span>
                              </span>
                            ) : (
                              <span className="text-gray-400 italic text-sm">Guest</span>
                            )}
                          </td>

                          <td className="py-3 px-2 text-gray-600 dark:text-gray-400">
                            {order.createdAt
                              ? order.createdAt.substring(0, 10)
                              : "N/A"}
                          </td>

                          <td className="py-3 px-2 font-semibold">
                            ₹{order.totalPrice?.toFixed(2) || "0.00"}
                          </td>

                          <td className="py-3 px-2">
                            {order.isPaid ? (
                              <p className="px-3 py-1 text-center bg-green-100 text-green-800 dark:bg-green-100 dark:text-green-800 max-w-[120px] rounded-full text-sm font-medium">
                                Completed
                              </p>
                            ) : (
                              <p className="px-3 py-1 text-center bg-yellow-100 text-yellow-800 dark:bg-yellow-100 dark:text-yellow-800 max-w-[120px] rounded-full text-sm font-medium">
                                Pending
                              </p>
                            )}
                          </td>

                          <td className="py-3 px-2">
                            {order.isDelivered ? (
                              <p className="px-3 py-1 text-center bg-green-100 text-green-800 dark:bg-green-100 dark:text-green-800 max-w-[120px] rounded-full text-sm font-medium">
                                Completed
                              </p>
                            ) : (
                              <p className="px-3 py-1 text-center bg-yellow-100 text-yellow-800 dark:bg-yellow-100 dark:text-yellow-800 max-w-[120px] rounded-full text-sm font-medium">
                                Pending
                              </p>
                            )}
                          </td>

                          <td className="py-3 px-2">
                            <Link to={`/order/${order._id}`}>
                              <button className="px-4 py-1.5 text-center bg-accent-blue hover:bg-accent-blue-hover text-white rounded-md text-sm transition-colors shadow-sm">
                                More
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </ContentWrapper>
      )}
    </div>
  );
};

export default OrderList;
