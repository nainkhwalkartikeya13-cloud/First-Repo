import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApislice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import ContentWrapper from "../components/ContentWrapper";
import { FiFilter, FiX } from "react-icons/fi";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter(
          (product) => {
            return (
              product.price.toString().includes(priceFilter) ||
              product.price === parseInt(priceFilter, 10)
            );
          }
        );
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  // Proper reset without page reload
  const handleReset = () => {
    dispatch(setChecked([]));
    setPriceFilter("");
    if (filteredProductsQuery.data) {
      dispatch(setProducts(filteredProductsQuery.data));
    }
    setMobileFilterOpen(false);
  };

  // Reusable filter sidebar content
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
          Categories
        </h3>
        <div className="space-y-2">
          {categories?.map((c) => (
            <label
              key={c._id}
              htmlFor={`cat-${c._id}`}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                id={`cat-${c._id}`}
                checked={checked.includes(c._id)}
                onChange={(e) => handleCheck(e.target.checked, c._id)}
                className="w-4 h-4 rounded accent-accent-pink"
              />
              <span className="text-sm text-text-muted group-hover:text-text-primary transition-colors">
                {c.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
          Brands
        </h3>
        <div className="space-y-2">
          {uniqueBrands?.map((brand, i) => (
            <label
              key={i}
              htmlFor={`brand-${brand}`}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                id={`brand-${brand}`}
                name="brand"
                onChange={() => handleBrandClick(brand)}
                className="w-4 h-4 accent-accent-pink"
              />
              <span className="text-sm text-text-muted group-hover:text-text-primary transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">
          Filter by Price
        </h3>
        <input
          type="text"
          placeholder="Enter Price"
          value={priceFilter}
          onChange={handlePriceChange}
          className="w-full px-3 py-2 bg-transparent border border-surface-border-light rounded-lg focus:border-accent-blue outline-none text-text-primary placeholder-text-secondary text-sm"
        />
      </div>

      {/* Reset */}
      <button
        className="w-full py-2.5 text-center bg-accent-blue hover:bg-accent-blue-hover text-white rounded-lg font-medium transition-colors text-sm"
        onClick={handleReset}
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="bg-brand-dark min-h-screen">
      <ContentWrapper>
        {/* Mobile filter button */}
        <div className="lg:hidden flex items-center justify-between py-3">
          <h2 className="text-lg font-semibold text-text-primary">
            Products ({products?.length})
          </h2>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-card border border-surface-border rounded-lg text-text-primary text-sm"
          >
            <FiFilter size={16} />
            Filters
          </button>
        </div>

        {/* Mobile filter overlay */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="absolute right-0 top-0 h-full w-80 bg-brand-navy p-6 overflow-y-auto animate-slide-down">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <FiX size={20} />
                </button>
              </div>
              <FilterContent />
            </div>
          </div>
        )}

        <div className="flex">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-[260px] shrink-0 sticky top-[80px] self-start h-[calc(100vh-80px)] overflow-y-auto p-4 border-r border-surface-border">
            <h2 className="text-lg font-semibold text-text-primary mb-6">Filters</h2>
            <FilterContent />
          </aside>

          {/* Products grid */}
          <main className="flex-1 p-4 lg:p-6">
            <h2 className="hidden lg:block text-lg font-semibold text-text-primary mb-4">
              Products ({products?.length})
            </h2>

            {products.length === 0 ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {products?.map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>
            )}
          </main>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default Shop;
