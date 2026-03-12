import { apiSlice } from "./apiSlice";

const COUPON_URL = "/api/v1/coupon";

export const couponApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCoupons: builder.query({
            query: () => ({
                url: COUPON_URL,
            }),
            providesTags: ["Coupon"],
            keepUnusedDataFor: 5,
        }),

        getActiveCoupons: builder.query({
            query: () => ({
                url: `${COUPON_URL}/active`,
            }),
            providesTags: ["Coupon"],
            keepUnusedDataFor: 5,
        }),

        createCoupon: builder.mutation({
            query: (data) => ({
                url: COUPON_URL,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Coupon"],
        }),

        deleteCoupon: builder.mutation({
            query: (couponId) => ({
                url: `${COUPON_URL}/${couponId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Coupon"],
        }),

        validateCoupon: builder.mutation({
            query: (data) => ({
                url: `${COUPON_URL}/validate`,
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const {
    useGetCouponsQuery,
    useGetActiveCouponsQuery,
    useCreateCouponMutation,
    useDeleteCouponMutation,
    useValidateCouponMutation,
} = couponApiSlice;
