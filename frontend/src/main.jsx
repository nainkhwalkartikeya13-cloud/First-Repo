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

// Eagerly loaded pages
import Home from "./pages/Home.jsx";
import Favorites from "./pages/Products/Favorites.jsx";
import Cart from "./pages/Cart.jsx";
import Shop from "./pages/Shop.jsx";

import Loader from "./components/Loader.jsx";

const LazyRoute = ({ children }) => (
  <Suspense fallback={<div className="flex justify-center items-center min-h-screen bg-brand-navy"><Loader /></div>}>
    {children}
  </Suspense>
);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public */}
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="favorite" element={<Favorites />} />
      <Route path="product/:id" element={<LazyRoute><ProductDetails /></LazyRoute>} />
      <Route path="cart" element={<Cart />} />
      <Route path="shop" element={<Shop />} />
      <Route path="user-orders" element={<LazyRoute><UserOrder /></LazyRoute>} />

      {/* Protected */}
      <Route element={<PrivateRoute />}>
        <Route path="profile" element={<LazyRoute><Profile /></LazyRoute>} />
        <Route path="shipping" element={<LazyRoute><Shipping /></LazyRoute>} />
        <Route path="placeorder" element={<LazyRoute><PlaceOrder /></LazyRoute>} />
        <Route path="order/:id" element={<LazyRoute><Order /></LazyRoute>} />
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
        <Route path="dashboard" element={<LazyRoute><AdminDashboard /></LazyRoute>} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);