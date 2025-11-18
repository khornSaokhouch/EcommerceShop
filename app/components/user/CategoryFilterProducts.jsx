"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { useProductStore } from "../../stores/useProductStore";
import { useStore } from "../../stores/useStore";
import { useUserStore } from "../../stores/userStore";
import { useFavouritesStore } from "../../stores/useFavouritesStore";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { ListOrdered, Store } from "lucide-react"; // Imported Store icon

// --- 1. Component: Sidebar Button (Unified for Category/Store) ---
// Note: This component is made slightly more generic to handle both types.
const SidebarFilterButton = ({ item, isSelected, onClick, type }) => {
  const iconFallback = type === 'store' 
    ? (item.name ? item.name.charAt(0).toUpperCase() : '?') 
    : (item.name ? item.name.charAt(0).toUpperCase() : '?');

  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 300 }}
      key={item.id || 'all'}
    >
      <button
        onClick={() => onClick(item)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm 
          ${
            isSelected
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
              : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
          }`}
      >
        <div
          className={`w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center text-xs font-semibold ${
            isSelected ? "bg-white text-indigo-600" : "bg-gray-100 text-gray-500"
          }`}
        >
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{iconFallback}</span>
          )}
        </div>
        <span className="truncate">{item.name}</span>
      </button>
    </motion.li>
  );
};

// --- 2. Component: Product Skeleton Loader (Kept as is) ---
const ProductSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg animate-pulse p-4 border border-gray-100">
    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-8 bg-gray-100 rounded-lg w-full"></div>
  </div>
);

// --- 3. Main Component Redesign (Sidebar Layout with Dual Filter) ---
const CategoryFilterProducts = () => {
  const { categories, fetchCategories } = useCategoryStore();
  const { stores, fetchStores } = useStore();
  const { products, fetchProductsByCategoryAndStore, loading, error } = useProductStore();

  const userId = useUserStore((state) => state.user?.id);
  const { favourites, addFavourite, removeFavourite } = useFavouritesStore();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStore, setSelectedStore] = useState({ id: 'all', name: 'All Stores' }); // Initialize with 'All Stores'

  // Fetch products by category (with optional store filter)
// Original implementation in CategoryFilterProducts component
const fetchProducts = useCallback(
    (categoryId, storeId) => fetchProductsByCategoryAndStore(categoryId, storeId),
    [fetchProductsByCategoryAndStore]
);


  // Load categories and stores on mount
  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, [fetchCategories, fetchStores]);

  // Set initial category and fetch initial products
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // Fetch products whenever category or store filter changes
  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory.id, selectedStore?.id);
    }
}, [selectedCategory, selectedStore, fetchProducts]);


  // --- Handlers ---
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedStore({ id: 'all', name: 'All Stores' }); // reset store filter
  };
  

  const handleStoreClick = (store) => {
    setSelectedStore(store);
    // Note: Category selection is preserved
  };

  const handleToggleFavourite = async (productId) => {
    if (!userId) {
      toast.error("You must be logged in to manage favourites.");
      return;
    }
  
    const favRecord = favourites?.find((f) => f.product_id === productId);
  
    try {
      const toastId = toast.loading(
        favRecord ? "Removing from favourites..." : "Adding to favourites..."
      );
  
      if (favRecord) {
        await removeFavourite(favRecord.id);   // <- here
        toast.success("Removed from favourites!", { id: toastId });
      } else {
        await addFavourite({ user_id: userId, product_id: productId });
        toast.success("Added to favourites!", { id: toastId });
      }
    } catch (err) {
      toast.error(`Failed to update favourite: ${err.message}`);
    }
  };
  

  const allStoresItem = { id: 'all', name: 'All Stores', image_url: null };
  const filterableStores = [allStoresItem, ...stores];


  return (
    <div className="max-w-full mx-auto flex min-h-screen gap-8 py-8 px-6">
      
      {/* Left Sidebar (Dual Filter) */}
      <aside className="w-64 bg-white rounded-xl p-5 flex-shrink-0 sticky top-4 border border-gray-100 h-fit shadow-xl">
        
        {/* Category Section */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center border-b pb-3 border-gray-100">
          <ListOrdered className="h-5 w-5 mr-3 text-indigo-500" /> Product Categories
        </h2>
        <ul className="space-y-2 mb-8">
          {categories.map((cat) => (
            <SidebarFilterButton
              key={`cat-${cat.id}`}
              item={cat}
              isSelected={selectedCategory?.id === cat.id}
              onClick={handleCategoryClick}
              type="category"
            />
          ))}
        </ul>
        
        {/* Store Section */}
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center border-b pb-3 border-gray-100">
          <Store className="h-5 w-5 mr-3 text-blue-500" /> Filter by Store
        </h2>
        <ul className="space-y-2">
          {filterableStores.map((store) => (
            <SidebarFilterButton
              key={`store-${store.id}`}
              item={store}
              isSelected={selectedStore?.id === store.id}
              onClick={handleStoreClick}
              type="store"
            />
          ))}
        </ul>

      </aside>

      {/* Right Products */}
      <main className="flex-1 p-2">
        {/* Category and Filter Info */}
        <div className="mb-8 pb-3 border-b border-gray-200">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {selectedCategory ? selectedCategory.name : "Select a Category"}
          </h2>
          <p className="text-lg font-medium text-gray-500 mt-1">
            {selectedStore?.id === 'all'
              ? `Showing all products (${products.length} Items)`
              : `Filtered by: ${selectedStore?.name} (${products.length} Items)`
            }
          </p>
        </div>

        {error && (
          <div className="text-center py-16 text-red-700 bg-red-100 border border-red-300 p-8 rounded-xl font-medium shadow-inner">
            <p className="text-xl font-semibold mb-2">Oops! Failed to load products.</p>
            <p>Error details: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {products.length > 0 ? (
              <motion.div
                key={`${selectedCategory?.id}-${selectedStore?.id || "all"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {products.map((product) => {
                  const isFavourite = favourites?.some((f) => f?.product_id === product.id);
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ProductCard
                        product={product}
                        isFavourite={isFavourite}
                        onAddFavourite={() => handleToggleFavourite(product.id)}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="no-products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-gray-500 bg-gray-50 border border-gray-200 p-10 rounded-xl font-medium italic shadow-inner"
              >
                <p className="text-2xl mb-2">🔎</p>
                <p>No products found for the selected category/store.</p>
                <p className="text-sm mt-2">Try adjusting your filters!</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

export default CategoryFilterProducts;