import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./pages/Footer";
import NewsletterPopup from "./components/NewsletterPopup";

function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <>
      <ToastContainer />
      <NewsletterPopup />
      <Navigation />
      <main className={isHome ? "relative" : "pt-[120px]"}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;

