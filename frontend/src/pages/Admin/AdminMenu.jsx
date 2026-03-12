import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import ContentWrapper from "../../components/ContentWrapper";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // console.log(onClick);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <ContentWrapper>
        <div>
          <button className={`rounded-lg`} onClick={toggleMenu}>
            {/* {isMenuOpen ? (
              <AiOutlineClose color="white" size={26} />
            ) : (
              <>
                <HiOutlineMenuAlt1 color="white" size={26} />
              </>
            )} */}
            <RxDashboard size={26} className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-white transition-colors" />
          </button>
        </div>
      </ContentWrapper>
      <ContentWrapper>
        <div className="relative">
          {isMenuOpen && (
            <section className="bg-white dark:bg-white border border-gray-200 dark:border-gray-200 text-gray-900 dark:text-gray-900 p-4 fixed top-[80px] right-6 2xl:right-[10%] rounded-xl shadow-lg z-50">
              <ul className="list-none mt-2" onClick={toggleMenu}>
                <li>
                  <NavLink
                    className="list-item py-2 px-3 mb-5 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg transition-colors"
                    to="/admin/dashboard"
                    style={({ isActive }) => ({
                      color: isActive ? "#db1143f3" : "",
                    })}
                  >
                    Admin Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="list-item py-2 px-3 mb-5 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg transition-colors"
                    to="/admin/categorylist"
                    style={({ isActive }) => ({
                      color: isActive ? "#db1143f3" : "",
                    })}
                  >
                    Create Category
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className=" py-2 px-3 block mb-5 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg transition-colors"
                    to="/admin/productlist"
                    style={({ isActive }) => ({
                      color: isActive ? "#db1143f3" : "",
                    })}
                  >
                    Create Product
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className=" py-2 px-3 block mb-5 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg transition-colors"
                    to="/admin/allproductslist"
                    style={({ isActive }) => ({
                      color: isActive ? "#db1143f3" : "",
                    })}
                  >
                    All Products
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="py-2 px-3 block mb-5 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg transition-colors"
                    to="/admin/userlist"
                    style={({ isActive }) => ({
                      color: isActive ? "#db1143f3" : "",
                    })}
                  >
                    Manage Users
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="py-2 px-3 block mb-5 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg transition-colors"
                    to="/admin/orderlist"
                    style={({ isActive }) => ({
                      color: isActive ? "#db1143f3" : "",
                    })}
                  >
                    Manage Orders
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="py-2 px-3 block mb-5 hover:bg-gray-100 dark:hover:bg-gray-100 rounded-lg transition-colors"
                    to="/admin/couponlist"
                    style={({ isActive }) => ({
                      color: isActive ? "#db1143f3" : "",
                    })}
                  >
                    Manage Coupons
                  </NavLink>
                </li>
              </ul>
            </section>
          )}
        </div>
      </ContentWrapper>
    </div>
  );
};

export default AdminMenu;
