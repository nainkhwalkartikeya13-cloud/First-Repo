import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApislice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import ProductCard from "./Products/ProductCard";
import { ProductSkeletonGrid } from "../components/ProductSkeleton";
import { FiFilter, FiX, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

/* ───────────────────── helpers ───────────────────── */
const parseParams = (search) => {
  const p = new URLSearchParams(search);
  return {
    category: p.get("category") || "",       // category name: "Men", "Women", etc.
    filter: p.get("filter") || "",           // "new", "bestsellers", "sale"
    collection: p.get("collection") || "",   // "Everyday","Active","Weather", etc.
    search: p.get("search") || "",           // keyword
    maxPrice: p.get("maxPrice") ? Number(p.get("maxPrice")) : 0,
    minPrice: p.get("minPrice") ? Number(p.get("minPrice")) : 0,
    sort: p.get("sort") || "",               // "price-asc", etc.
  };
};

const bannerTitles = {
  "": "Shop All",
  new: "New Arrivals",
  bestsellers: "Bestsellers",
  sale: "Sale",
};

/* ───────────────────── Allbirds-style Shop Page ───────────────────── */

const Shop = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const filteredProductsQuery = useGetFilteredProductsQuery({ checked, radio });

  const [sortBy, setSortBy] = useState("default");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all"); // "all" or category _id
  const [pageTitle, setPageTitle] = useState("Shop All");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [collectionType, setCollectionType] = useState("");
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [expandedSections, setExpandedSections] = useState(["categories", "price"]);

  /* ── Parse URL params whenever location changes ── */
  const urlParams = useMemo(() => parseParams(location.search), [location.search]);

  useEffect(() => {
    if (!categoriesQuery.isLoading && categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, categoriesQuery.isLoading, dispatch]);

  /* ── React to URL params once categories are loaded ── */
  useEffect(() => {
    if (!categoriesQuery.data || categoriesQuery.isLoading) return;
    const cats = categoriesQuery.data;
    const { category, filter, collection, search, maxPrice: mp, sort } = urlParams;

    // Match category by name
    let matchedCatId = "all";
    if (category) {
      const found = cats.find(
        (c) => c.name.toLowerCase() === category.toLowerCase()
      );
      if (found) matchedCatId = found._id;
    }

    setActiveCategory(matchedCatId);
    dispatch(setChecked(matchedCatId === "all" ? [] : [matchedCatId]));

    // Build title
    let title = category ? `${category}'s` : "";
    if (filter && bannerTitles[filter]) {
      title = title ? `${title} ${bannerTitles[filter]}` : bannerTitles[filter];
    } else if (collection) {
      title = title ? `${title} ${collection}` : collection;
    } else if (search) {
      title = search.replace(/\+/g, " ");
    } else if (!title) {
      title = "Shop All";
    }
    setPageTitle(title);

    setFilterType(filter);
    setCollectionType(collection);
    setSearchTerm(search.replace(/\+/g, " "));
    setMaxPrice(mp);
    if (sort) setSortBy(sort);
  }, [urlParams, categoriesQuery.data, categoriesQuery.isLoading, dispatch]);

  /* ── Client-side filtering + sorting on loaded products ── */
  useEffect(() => {
    if (!filteredProductsQuery.isLoading && filteredProductsQuery.data) {
      let filtered = [...filteredProductsQuery.data];

      // Category pill filter (already handled by API via checked, but double-ensure)
      if (activeCategory !== "all") {
        filtered = filtered.filter(
          (p) =>
            p.category === activeCategory ||
            p.category?._id === activeCategory
        );
      }

      // Filter type
      if (filterType === "new") {
        filtered = filtered.filter((p) => p.isNewArrival);
      } else if (filterType === "bestsellers") {
        filtered = filtered.filter((p) => p.isBestseller);
      } else if (filterType === "sale") {
        filtered = filtered.filter((p) => p.discountPrice && p.discountPrice > 0);
      }

      // Collection filter
      if (collectionType) {
        filtered = filtered.filter(
          (p) =>
            p.productCollection &&
            p.productCollection.toLowerCase() === collectionType.toLowerCase()
        );
      }

      // Search keyword (client-side name match)
      if (searchTerm) {
        const terms = searchTerm.toLowerCase().split(/\s+/);
        filtered = filtered.filter((p) =>
          terms.some(
            (t) =>
              p.name?.toLowerCase().includes(t) ||
              p.description?.toLowerCase().includes(t) ||
              p.material?.toLowerCase().includes(t)
          )
        );
      }

      // Max price filter
      if (maxPrice > 0) {
        filtered = filtered.filter((p) => {
          const effectivePrice = p.discountPrice && p.discountPrice > 0 ? p.discountPrice : p.price;
          return effectivePrice <= maxPrice;
        });
      }

      // Color filter
      if (selectedColors.length > 0) {
        filtered = filtered.filter((p) =>
          p.colors?.some((c) => selectedColors.includes(c.name))
        );
      }

      // Size filter
      if (selectedSizes.length > 0) {
        filtered = filtered.filter((p) =>
          p.sizes?.some((s) => selectedSizes.includes(s))
        );
      }

      // Material filter
      if (selectedMaterials.length > 0) {
        filtered = filtered.filter((p) =>
          selectedMaterials.includes(p.material)
        );
      }

      // ── Sorting Logic ──
      if (sortBy === "price-asc") {
        filtered.sort((a, b) => {
          const pA = a.discountPrice > 0 ? a.discountPrice : a.price;
          const pB = b.discountPrice > 0 ? b.discountPrice : b.price;
          return pA - pB;
        });
      } else if (sortBy === "price-desc") {
        filtered.sort((a, b) => {
          const pA = a.discountPrice > 0 ? a.discountPrice : a.price;
          const pB = b.discountPrice > 0 ? b.discountPrice : b.price;
          return pB - pA;
        });
      } else if (sortBy === "rating") {
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortBy === "newest") {
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      dispatch(setProducts(filtered));
    }
  }, [
    filteredProductsQuery.isLoading,
    filteredProductsQuery.data,
    dispatch,
    activeCategory,
    sortBy,
    checked,
    radio,
    filterType,
    collectionType,
    searchTerm,
    maxPrice,
    selectedColors,
    selectedSizes,
    selectedMaterials,
  ]);

  const handleCategoryPill = (id) => {
    if (id === "all") {
      navigate("/shop");
    } else {
      const cat = categories?.find((c) => c._id === id);
      if (cat) navigate(`/shop?category=${encodeURIComponent(cat.name)}`);
    }
  };

  const handleReset = () => {
    navigate("/shop");
    setSortBy("default");
    setMobileFilterOpen(false);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedMaterials([]);
    setMaxPrice(0);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  const toggleFilter = (list, setList, item) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const allProducts = useMemo(() => filteredProductsQuery.data || [], [filteredProductsQuery.data]);
  const colors = useMemo(() => {
    const set = new Set();
    allProducts.forEach(p => p.colors?.forEach(c => set.add(JSON.stringify(c))));
    return Array.from(set).map(s => JSON.parse(s));
  }, [allProducts]);

  const sizes = useMemo(() => {
    const set = new Set();
    allProducts.forEach(p => p.sizes?.forEach(s => set.add(s)));
    return Array.from(set).sort((a, b) => a - b);
  }, [allProducts]);

  const materials = useMemo(() => {
    const set = new Set();
    allProducts.forEach(p => p.material && set.add(p.material));
    return Array.from(set);
  }, [allProducts]);

  // eslint-disable-next-line react/prop-types
  const Accordion = ({ title, id, children }) => (
    <div className="border-b border-[#E5E5E5] py-5">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.15em] text-[#212A2C]"
      >
        {title}
        <motion.div animate={{ rotate: expandedSections.includes(id) ? 180 : 0 }}>
          <FiChevronDown size={14} />
        </motion.div>
      </button>
      <AnimatePresence>
        {expandedSections.includes(id) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  /* ─── Premium Hero Banner ─── */
  const HeroBanner = () => {
    // Dynamic background gradient based on category or filter
    let bgClass = "bg-gradient-to-br from-[#1a1f22] via-[#212A2C] to-[#2c3639]";
    if (pageTitle.toLowerCase().includes("women")) bgClass = "bg-gradient-to-br from-[#3b3633] via-[#4a4440] to-[#59524e]";
    if (pageTitle.toLowerCase().includes("kids")) bgClass = "bg-gradient-to-br from-[#2c3d36] via-[#354840] to-[#3e534a]";

    return (
      <div className={`relative ${bgClass} text-white text-center py-20 md:py-32 px-6 overflow-hidden`}>
        {/* Subtle noise/texture overlay for premium feel */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}></div>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-12 h-[2px] bg-white/40 mb-8"
          />
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6"
            style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
          >
            {pageTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-[15px] md:text-[16px] text-white/80 max-w-lg mx-auto leading-relaxed font-light"
          >
            Sustainable shoes, apparel, and accessories made with natural
            materials. Light on your feet. Light on the planet.
          </motion.p>
        </div>
      </div>
    );
  };

  /* ─── Floating Category Pills ─── */
  const CategoryPills = () => {
    // Hardcoded static categories as requested for consistency
    const staticCategories = [
      { name: "All", id: "all" },
      { name: "Men", id: categories?.find(c => c.name === "Men")?._id || "men" },
      { name: "Women", id: categories?.find(c => c.name === "Women")?._id || "women" },
      { name: "Running", id: categories?.find(c => c.name === "Running")?._id || "running" },
      { name: "Trail", id: categories?.find(c => c.name === "Trail")?._id || "trail" },
      { name: "Kids", id: categories?.find(c => c.name === "Kids")?._id || "kids" },
      { name: "Socks & Accessories", id: categories?.find(c => c.name === "Socks & Accessories")?._id || "socks" },
    ];

    return (
      <div className="bg-white border-b border-[#E5E5E5]/60">
        <div className="max-w-[1320px] mx-auto px-4 md:px-10">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4 px-2">
            {staticCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryPill(cat.id === "all" ? "all" : cat.id)}
                className={`shrink-0 px-6 py-2.5 rounded-full text-[13px] font-bold uppercase tracking-[0.1em] transition-all duration-300 ${activeCategory === cat.id || (cat.id === "all" && activeCategory === "all")
                  ? "bg-[#212A2C] text-white shadow-md scale-105"
                  : "bg-[#F5F5F2] text-[#212A2C] hover:bg-[#e8e8e3] hover:scale-105"
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ─── Sort / Filter Bar ─── */
  const ControlBar = () => (
    <div className="max-w-[1320px] mx-auto px-5 md:px-10 flex items-center justify-between py-4">
      <span className="text-[13px] text-[#767676]">
        {products?.length || 0} product{products?.length !== 1 ? "s" : ""}
      </span>

      <div className="flex items-center gap-3">
        {/* Sort */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-transparent pr-6 pl-2 py-1.5 text-[12px] font-medium text-[#212A2C] uppercase tracking-[0.08em] cursor-pointer outline-none"
          >
            <option value="default">Sort By</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
          </select>
          <FiChevronDown
            size={13}
            className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[#212A2C]"
          />
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="md:hidden flex items-center gap-1.5 text-[12px] font-medium text-[#212A2C] uppercase tracking-[0.08em]"
        >
          <FiFilter size={14} />
          Filter
        </button>
      </div>
    </div>
  );

  /* ─── Mobile Filter Drawer ─── */
  const MobileDrawer = () => (
    <AnimatePresence>
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2
                className="text-lg font-light"
                style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
              >
                Filter
              </h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="text-[#767676] hover:text-[#212A2C] transition-colors"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#767676] mb-3">
                  Category
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => { handleCategoryPill("all"); setMobileFilterOpen(false); }}
                    className={`block w-full text-left px-3 py-2 text-sm ${activeCategory === "all" ? "text-[#212A2C] font-medium bg-[#F5F5F2]" : "text-[#767676]"}`}
                  >
                    All
                  </button>
                  {categories?.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => { handleCategoryPill(c._id); setMobileFilterOpen(false); }}
                      className={`block w-full text-left px-3 py-2 text-sm ${activeCategory === c._id ? "text-[#212A2C] font-medium bg-[#F5F5F2]" : "text-[#767676]"}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#767676] mb-3">
                  Sort
                </h4>
                {["default", "price-asc", "price-desc", "rating", "newest"].map(
                  (v) => (
                    <button
                      key={v}
                      onClick={() => { setSortBy(v); setMobileFilterOpen(false); }}
                      className={`block w-full text-left px-3 py-2 text-sm ${sortBy === v ? "text-[#212A2C] font-medium bg-[#F5F5F2]" : "text-[#767676]"}`}
                    >
                      {{ default: "Default", "price-asc": "Price: Low → High", "price-desc": "Price: High → Low", rating: "Top Rated", newest: "Newest" }[v]}
                    </button>
                  )
                )}
              </div>

              <Accordion title="Price" id="price">
                <input
                  type="range"
                  min="0"
                  max="20000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#212A2C] mb-2"
                />
                <div className="flex justify-between text-[12px] text-[#767676]">
                  <span>₹0</span>
                  <span className="font-bold text-[#212A2C]">Up to ₹{maxPrice || '20,000'}</span>
                </div>
              </Accordion>

              {colors.length > 0 && (
                <Accordion title="Color" id="colors">
                  <div className="grid grid-cols-5 gap-3">
                    {colors.map((c, i) => (
                      <button
                        key={i}
                        title={c.name}
                        onClick={() => toggleFilter(selectedColors, setSelectedColors, c.name)}
                        className={`w-6 h-6 rounded-full border transition-all ${selectedColors.includes(c.name) ? "ring-2 ring-offset-2 ring-[#212A2C] scale-110" : "border-gray-200"}`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </Accordion>
              )}

              {sizes.length > 0 && (
                <Accordion title="Size" id="sizes">
                  <div className="grid grid-cols-3 gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => toggleFilter(selectedSizes, setSelectedSizes, s)}
                        className={`py-2 text-[12px] border transition-all ${selectedSizes.includes(s) ? "bg-[#212A2C] text-white border-[#212A2C]" : "border-[#E5E5E5] text-[#212A2C] hover:border-[#212A2C]"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Accordion>
              )}

              {materials.length > 0 && (
                <Accordion title="Material" id="materials">
                  {materials.map((m) => (
                    <label key={m} className="flex items-center gap-3 cursor-pointer py-1.5 group">
                      <input
                        type="checkbox"
                        checked={selectedMaterials.includes(m)}
                        onChange={() => toggleFilter(selectedMaterials, setSelectedMaterials, m)}
                        className="w-4 h-4 accent-[#212A2C]"
                      />
                      <span className="text-[13px] text-[#767676] group-hover:text-[#212A2C] transition-colors">{m}</span>
                    </label>
                  ))}
                </Accordion>
              )}

              <button
                onClick={handleReset}
                className="w-full py-3 bg-[#212A2C] text-white text-[12px] font-bold uppercase tracking-[0.12em] hover:bg-[#1a2022] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  /* ─── Sidebar Filter ─── */
  const FilterSidebar = () => {
    return (
      <div className="hidden md:block w-64 shrink-0 pr-6 h-fit">
        <Accordion title="Price" id="price">
          <input
            type="range"
            min="0"
            max="20000"
            step="500"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-[#212A2C] mb-2"
          />
          <div className="flex justify-between text-[12px] text-[#767676]">
            <span>₹0</span>
            <span className="font-bold text-[#212A2C]">Up to ₹{maxPrice || '20,000'}</span>
          </div>
        </Accordion>

        {colors.length > 0 && (
          <Accordion title="Color" id="colors">
            <div className="grid grid-cols-5 gap-3">
              {colors.map((c, i) => (
                <button
                  key={i}
                  title={c.name}
                  onClick={() => toggleFilter(selectedColors, setSelectedColors, c.name)}
                  className={`w-6 h-6 rounded-full border transition-all ${selectedColors.includes(c.name) ? "ring-2 ring-offset-2 ring-[#212A2C] scale-110" : "border-gray-200"}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </Accordion>
        )}

        {sizes.length > 0 && (
          <Accordion title="Size" id="sizes">
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleFilter(selectedSizes, setSelectedSizes, s)}
                  className={`py-2 text-[12px] border transition-all rounded-sm ${selectedSizes.includes(s) ? "bg-[#212A2C] text-white border-[#212A2C]" : "border-[#E5E5E5] text-[#212A2C] hover:border-[#212A2C]"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </Accordion>
        )}

        {materials.length > 0 && (
          <Accordion title="Material" id="materials">
            {materials.map((m) => (
              <label key={m} className="flex items-center gap-3 cursor-pointer py-1.5 group">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(m)}
                  onChange={() => toggleFilter(selectedMaterials, setSelectedMaterials, m)}
                  className="w-4 h-4 accent-[#212A2C]"
                />
                <span className="text-[13px] text-[#767676] group-hover:text-[#212A2C] transition-colors">{m}</span>
              </label>
            ))}
          </Accordion>
        )}

        <button
          onClick={handleReset}
          className="mt-8 text-[11px] font-bold uppercase tracking-[0.15em] text-[#767676] hover:text-[#212A2C] transition-colors border-b border-transparent hover:border-[#212A2C]"
        >
          Clear All
        </button>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white min-h-screen pb-20"
    >
      <HeroBanner />

      {/* ─── Unified Shop Header ─── */}
      <div className="bg-white border-b border-[#E5E5E5]">
        <CategoryPills />
        <div className="bg-[#F5F5F2] border-t border-[#E5E5E5]">
          <ControlBar />
        </div>
      </div>

      <div className="bg-[#F5F5F2]">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-12 flex flex-col md:flex-row gap-8 lg:gap-14">
          <FilterSidebar />

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProductsQuery.isLoading ? (
              <ProductSkeletonGrid count={8} />
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[360px] text-center bg-white border border-gray-100 p-12 shadow-sm rounded-sm">
                <h3
                  className="text-xl font-light text-[#212A2C] mb-2"
                  style={{ fontFamily: "Source Serif 4, Georgia, serif" }}
                >
                  No products found
                </h3>
                <p className="text-[14px] text-[#767676] mb-6 max-w-sm">
                  Try adjusting your filters or browse all products.
                </p>
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-[#212A2C] text-white text-[12px] font-bold uppercase tracking-[0.12em] hover:bg-[#1a2022] transition-colors"
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 lg:gap-x-5 lg:gap-y-10">
                {products?.filter(p => p && p._id).map((p) => (
                  <ProductCard key={p._id} p={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileDrawer />
    </motion.div>
  );
};

export default Shop;
