import { apiSlice } from "./apiSlice";
import { ORDERS_URL, PAYPAL_URL } from "../constants";

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: order,
      }),
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
    }),

    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
    }),

    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),

    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
    }),

    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: "PUT",
      }),
    }),

    getTotalOrders: builder.query({
      query: () => `${ORDERS_URL}/total-orders`,
    }),

    getTotalSales: builder.query({
      query: () => `${ORDERS_URL}/total-sales`,
    }),

    getTotalSalesByDate: builder.query({
      query: () => `${ORDERS_URL}/total-sales-by-date`,
    }),

    processOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/process`,
        method: "PUT",
      }),
    }),

    shipOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/ship`,
        method: "PUT",
      }),
    }),
    getMonthlyRevenueGrowth: builder.query({
      query: () => `${ORDERS_URL}/revenue-growth`,
    }),

    getTopSellingProducts: builder.query({
      query: () => `${ORDERS_URL}/top-selling`,
    }),
    checkPurchase: builder.query({
      query: (productId) => `${ORDERS_URL}/check-purchase/${productId}`,
    }),
  }),
});

export const {
  useGetTotalOrdersQuery,
  useGetTotalSalesQuery,
  useGetTotalSalesByDateQuery,
  useGetMonthlyRevenueGrowthQuery,
  useGetTopSellingProductsQuery,
  // ------------------
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useGetMyOrdersQuery,
  useDeliverOrderMutation,
  useProcessOrderMutation,
  useShipOrderMutation,
  useGetOrdersQuery,
  useCheckPurchaseQuery,
} = orderApiSlice;
