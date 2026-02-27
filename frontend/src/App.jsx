import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./pages/Footer";

function App() {
  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="mt-[80px]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;

