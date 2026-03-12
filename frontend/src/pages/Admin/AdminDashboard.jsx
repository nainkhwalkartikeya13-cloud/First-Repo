import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApislice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
  useGetMonthlyRevenueGrowthQuery,
  useGetTopSellingProductsQuery,
} from "../../redux/api/orderApiSlice";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";

import { useState, useEffect } from "react";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";
import ContentWrapper from "../../components/ContentWrapper";
import { Link } from "react-router-dom";
import { DashboardSkeleton } from "../../components/Skeletons";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();
  const { data: growthData } = useGetMonthlyRevenueGrowthQuery();
  const { data: topProducts } = useGetTopSellingProductsQuery();
  const { data: allProducts } = useAllProductsQuery();

  const [state, setState] = useState({
    options: {
      chart: { type: "line", toolbar: { show: false } },
      tooltip: { theme: "dark" },
      colors: ["#6366f1"],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 3 },
      title: { text: "Sales Trend", align: "left", style: { fontSize: "16px", fontWeight: 600 } },
      grid: { borderColor: "#f1f1f1" },
      markers: { size: 4 },
      xaxis: { categories: [], title: { text: "Date" } },
      yaxis: { title: { text: "Sales" }, min: 0 },
    },
    series: [{ name: "Sales", data: [] }],
  });

  const [topProductsState, setTopProductsState] = useState({
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      plotOptions: { bar: { borderRadius: 4, horizontal: true, barHeight: "70%" } },
      dataLabels: { enabled: true, formatter: (val) => `${val} units`, style: { fontSize: "10px" } },
      xaxis: { categories: [] },
      colors: ["#8b5cf6"],
      title: { text: "Top Selling Products (Qty)", align: "left", style: { fontSize: "16px", fontWeight: 600 } },
    },
    series: [{ name: "Quantity", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));
      setState((prevState) => ({
        ...prevState,
        options: { ...prevState.options, xaxis: { categories: formattedSalesDate.map((item) => item.x) } },
        series: [{ name: "Sales", data: formattedSalesDate.map((item) => item.y) }],
      }));
    }
  }, [salesDetail]);

  useEffect(() => {
    if (topProducts) {
      setTopProductsState((prev) => ({
        ...prev,
        options: { ...prev.options, xaxis: { categories: topProducts.map((p) => p.name) } },
        series: [{ name: "Quantity", data: topProducts.map((p) => p.totalQty) }],
      }));
    }
  }, [topProducts]);

  if (isLoading || loading || loadingTwo) return <DashboardSkeleton />;

  const lowStockProducts = allProducts?.filter(p => p && p._id && p.countInStock < 5) || [];

  return (
    <div className="bg-[#fcfcfc] dark:bg-white min-h-[100vh] text-gray-900 dark:text-gray-900 transition-colors duration-300 pb-12 pt-6 font-sans">
      <ContentWrapper>
        <section className="flex flex-col">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Overview</h1>
            <div className="text-sm text-gray-500 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
              Dashboard Live Data
            </div>
          </div>

          <div className="w-full flex justify-around flex-wrap gap-4">
            {/* Total Sales Card */}
            <div className="rounded-xl shadow-sm border border-gray-200 bg-white p-6 flex-1 min-w-[20rem] hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="font-bold rounded-xl w-12 h-12 flex justify-center items-center bg-emerald-50 text-emerald-600 p-3 text-lg">
                  ₹
                </div>
                {growthData && (
                  <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${Number(growthData.growth) >= 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
                    {Number(growthData.growth) >= 0 ? (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" /></svg>
                    )}
                    {Math.abs(growthData.growth)}%
                    <span className="font-medium text-gray-400 ml-1">MoM</span>
                  </div>
                )}
              </div>
              <p className="mt-5 text-gray-500 font-medium text-sm uppercase tracking-wider">Total Sales</p>
              <h1 className="text-3xl font-bold mt-1 tracking-tight">
                ₹ {sales?.totalSales?.toLocaleString("en-IN") || "0.00"}
              </h1>
            </div>

            {/* Customers Card */}
            <div className="rounded-xl shadow-sm bg-white border border-gray-200 p-6 flex-1 min-w-[20rem] hover:shadow-md transition-shadow">
              <div className="font-bold rounded-xl w-12 h-12 flex justify-center items-center bg-sky-50 text-sky-600 p-3 text-lg">
                👥
              </div>
              <p className="mt-5 text-gray-500 font-medium text-sm uppercase tracking-wider">Customers</p>
              <h1 className="text-3xl font-bold mt-1 tracking-tight">
                {customers?.length || 0}
              </h1>
            </div>

            {/* Orders Card */}
            <div className="rounded-xl shadow-sm bg-white border border-gray-200 p-6 flex-1 min-w-[20rem] hover:shadow-md transition-shadow">
              <div className="font-bold rounded-xl w-12 h-12 flex justify-center items-center bg-indigo-50 text-indigo-600 p-3 text-lg">
                📦
              </div>
              <p className="mt-5 text-gray-500 font-medium text-sm uppercase tracking-wider">Total Orders</p>
              <h1 className="text-3xl font-bold mt-1 tracking-tight">
                {orders?.totalOrders || 0}
              </h1>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mt-12 mb-12">
            {/* Main Analytics Area */}
            <div className="lg:w-3/4 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                  <Chart options={state.options} series={state.series} type="line" height={320} />
                </div>
                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                  <h3 className="text-[16px] font-bold text-[#212A2C] mb-4">Revenue by Category</h3>
                  <Chart
                    options={{
                      labels: ["Men", "Women", "Kids", "Accessories"],
                      colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e"],
                      legend: { position: "bottom" },
                      dataLabels: { enabled: true, formatter: (val) => `${Math.round(val)}%` }
                    }}
                    series={[45, 35, 12, 8]}
                    type="donut"
                    height={320}
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <Chart options={topProductsState.options} series={topProductsState.series} type="bar" height={350} />
              </div>

              {/* Inventory Health Heatmap (Simplified) */}
              <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                <h3 className="text-[16px] font-bold text-[#212A2C] mb-6">Inventory Health Portfolio</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Optimal Stock", count: 24, p: "70%", color: "bg-emerald-500" },
                    { label: "Overstocked", count: 5, p: "15%", color: "bg-sky-500" },
                    { label: "Low Stock", count: 3, p: "9%", color: "bg-amber-500" },
                    { label: "Out of Stock", count: 2, p: "6%", color: "bg-rose-500" },
                  ].map((item) => (
                    <div key={item.label} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.p}</span>
                      </div>
                      <p className="text-xl font-bold text-[#212A2C]">{item.count}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Alerts */}
            <div className="lg:w-1/4">
              <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm sticky top-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                    Inventory Alerts
                  </h2>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-bold">
                    {lowStockProducts.length}
                  </span>
                </div>

                {lowStockProducts.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {lowStockProducts.slice(0, 5).map((p) => (
                      <div key={p._id} className="group p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt="" className="w-10 h-10 object-cover rounded bg-gray-100" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-gray-800">{p.name}</p>
                            <p className="text-xs text-rose-500 font-bold bg-rose-50 inline-block px-1.5 rounded mt-0.5">
                              {p.countInStock} items left
                            </p>
                          </div>
                        </div>
                        <Link
                          to={`/admin/product/update/${p._id}`}
                          className="mt-3 block text-center text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-gray-900 transition-colors"
                        >
                          Restock Now →
                        </Link>
                      </div>
                    ))}
                    {lowStockProducts.length > 5 && (
                      <Link to="/admin/allproductslist" className="text-center text-xs font-semibold text-indigo-600 p-2 border border-indigo-50 rounded-lg hover:bg-indigo-50 transition-colors mt-2">
                        View all stock alerts
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <div className="text-gray-200 text-4xl mb-2 text-center">✅</div>
                    <p className="text-sm text-gray-400 font-medium">All items are sufficiently stocked</p>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-50">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quick Actions</h3>
                  <Link to="/admin/productlist" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-lg transition-all">
                    <span>➕</span> Add New Product
                  </Link>
                  <Link to="/admin/categorylist" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-lg transition-all">
                    <span>🏷️</span> Manage Categories
                  </Link>
                  <Link to="/admin/allproductslist" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-lg transition-all">
                    <span>📤</span> All Products (Bulk Upload)
                  </Link>
                  <Link to="/admin/couponlist" className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 p-2 hover:bg-gray-50 rounded-lg transition-all">
                    <span>🎫</span> Manage Coupons
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold mb-6">Recent Orders</h2>
            <OrderList />
          </div>
        </section>
      </ContentWrapper>
    </div >
  );
};

export default AdminDashboard;
