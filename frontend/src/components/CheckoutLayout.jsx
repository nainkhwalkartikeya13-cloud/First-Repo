import { Outlet } from "react-router-dom";

/**
 * Minimal layout for checkout pages — no navbar, no footer.
 * Gives that clean, distraction-free Allbirds / Shopify checkout feel.
 */
const CheckoutLayout = () => {
  return <Outlet />;
};

export default CheckoutLayout;
