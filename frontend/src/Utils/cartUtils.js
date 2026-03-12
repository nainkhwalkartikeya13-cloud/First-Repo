export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Calculate the items price (use discountPrice when available)
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => {
      const effectivePrice =
        item.discountPrice > 0 ? item.discountPrice : item.price;
      return acc + effectivePrice * item.qty;
    }, 0)
  );

  // Calculate potential discount from applied coupon
  const discountRate = state.appliedCoupon ? state.appliedCoupon.discount / 100 : 0;
  state.discountPrice = addDecimals(Number(state.itemsPrice) * discountRate);

  // Calculate the shipping price (free over ₹4,999 after items price, else ₹99)
  state.shippingPrice = addDecimals(
    Number(state.itemsPrice) >= 4999 ? 0 : 99
  );

  // Calculate the tax price (15% GST)
  state.taxPrice = addDecimals(Number((0.15 * (Number(state.itemsPrice) - Number(state.discountPrice))).toFixed(2)));

  // Calculate the total price
  state.totalPrice = (
    Number(state.itemsPrice) -
    Number(state.discountPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  // Save the cart to localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
