import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Provider } from "react-redux";
import store from "./redux/store.js";

// Routes
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./pages/Admin/AdminRoute.jsx";

// Auth (loaded eagerly — critical path)
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

// Lazy-loaded pages (code splitting)
const Profile = lazy(() => import("./pages/User/Profile.jsx"));
const UserOrder = lazy(() => import("./pages/User/UserOrder.jsx"));
const UserList = lazy(() => import("./pages/Admin/UserList.jsx"));
const CategoryList = lazy(() => import("./pages/Admin/CategoryList.jsx"));
const ProductList = lazy(() => import("./pages/Admin/ProductList.jsx"));
const AllProducts = lazy(() => import("./pages/Admin/AllProducts.jsx"));
const ProductUpdate = lazy(() => import("./pages/Admin/ProductUpdate.jsx"));
const OrderList = lazy(() => import("./pages/Admin/OrderList.jsx"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard.jsx"));
const ProductDetails = lazy(() => import("./pages/Products/ProductDetails.jsx"));
const Shipping = lazy(() => import("./pages/Orders/Shipping.jsx"));
const PlaceOrder = lazy(() => import("./pages/Orders/PlaceOrder.jsx"));
const Order = lazy(() => import("./pages/Orders/Order.jsx"));
const OrderTracking = lazy(() => import("./pages/Orders/OrderTracking.jsx"));
const CouponList = lazy(() => import("./pages/Admin/CouponList.jsx"));

// Eagerly loaded pages
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Products/Favorites.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";
import Sustainability from "./pages/Sustainability.jsx";
import FAQPage from "./pages/Info/FAQPage.jsx";
import ContactPage from "./pages/Info/ContactPage.jsx";
import ShoeCarePage from "./pages/Info/ShoeCarePage.jsx";
import AboutPage from "./pages/Info/AboutPage.jsx";
import MaterialsPage from "./pages/Info/MaterialsPage.jsx";


import Loader from "./components/Loader.jsx";
import CheckoutLayout from "./components/CheckoutLayout.jsx";

// eslint-disable-next-line react/prop-types
const LazyRoute = ({ children }) => (
  <Suspense fallback={<div className="flex justify-center items-center min-h-screen bg-white"><Loader /></div>}>
    {children}
  </Suspense>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* ─── Main layout (nav + footer) ─── */}
      <Route path="/" element={<App />}>
        {/* Public */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="favorite" element={<Favorites />} />
        <Route path="product/:id" element={<LazyRoute><ProductDetails /></LazyRoute>} />
        <Route path="cart" element={<Cart />} />
        <Route path="shop" element={<Shop />} />
        <Route path="sustainability" element={<Sustainability />} />

        {/* Info / Static Pages */}
        <Route path="about" element={<AboutPage />} />
        <Route path="materials" element={<MaterialsPage />} />
        <Route path="faq" element={<FAQPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="shoe-care" element={<ShoeCarePage />} />

        <Route path="user-orders" element={<LazyRoute><UserOrder /></LazyRoute>} />

        {/* Protected (inside main layout) */}
        <Route element={<PrivateRoute />}>
          <Route path="profile" element={<LazyRoute><Profile /></LazyRoute>} />
        </Route>

        {/* Admin */}
        <Route path="admin" element={<AdminRoute />}>
          <Route path="userlist" element={<LazyRoute><UserList /></LazyRoute>} />
          <Route path="categorylist" element={<LazyRoute><CategoryList /></LazyRoute>} />
          <Route path="productlist" element={<LazyRoute><ProductList /></LazyRoute>} />
          <Route path="productlist/:pageNumber" element={<LazyRoute><ProductList /></LazyRoute>} />
          <Route path="allproductslist" element={<LazyRoute><AllProducts /></LazyRoute>} />
          <Route path="product/update/:_id" element={<LazyRoute><ProductUpdate /></LazyRoute>} />
          <Route path="orderlist" element={<LazyRoute><OrderList /></LazyRoute>} />
          <Route path="couponlist" element={<LazyRoute><CouponList /></LazyRoute>} />
          <Route path="dashboard" element={<LazyRoute><AdminDashboard /></LazyRoute>} />
        </Route>
      </Route>

      {/* ─── Checkout layout (no nav / no footer) ─── */}
      <Route element={<CheckoutLayout />}>
        {/* These routes handle their own Guest vs Logged In logic internally */}
        <Route path="shipping" element={<LazyRoute><Shipping /></LazyRoute>} />
        <Route path="placeorder" element={<LazyRoute><PlaceOrder /></LazyRoute>} />
        <Route path="order/:id" element={<LazyRoute><Order /></LazyRoute>} />
        <Route path="order-tracking/:id" element={<LazyRoute><OrderTracking /></LazyRoute>} />
      </Route>
    </>
  )
);

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "PLACEHOLDER_CLIENT_ID";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ThemeProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </ThemeProvider>
  </Provider>
);