"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { useStore } from "../../stores/useStore";
import { motion } from "framer-motion";
import { useUserStore } from "../../stores/userStore";
import Link from "next/link";

const BrandCategorySection = () => {
  const userId = useUserStore((state) => state.user?.id);
  const { categories, fetchCategories } = useCategoryStore();
  const { stores, fetchStores } = useStore();
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, [fetchCategories, fetchStores]);

  const slugify = (text) => {
    if (!text) return "untitled";
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const viewAllButtonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
  };

  const handleCategoryClick = (categoryName) => {
    const categorySlug = slugify(categoryName);
    router.push(`/category/${categorySlug}`);
  };

  const hasCategories = useMemo(() => categories && categories.length > 0, [categories]);
  const hasStores = useMemo(() => stores && stores.length > 0, [stores]);

  const handleStoreClick = (storeName) => {
    const storeSlug = slugify(storeName);
    router.push(`/store/${storeSlug}`);
  };

  // Responsive scroll item class
  const responsiveScrollItemClass =
    "flex-shrink-0 snap-start transition duration-300 cursor-pointer p-2 " +
    "w-[calc(33.33%-16px)] " +
    "md:w-[calc(25%-18px)] " +
    "lg:w-[calc(20%-20px)]";

  return (
    <div className="py-4">
      {/* Centered container */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl bg-white p-6 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* FEATURED STORES SECTION */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">FEATURED STORES</h2>
              <motion.button
                aria-label="View all stores"
                className="bg-gray-100 text-gray-600 rounded-full px-4 py-2 text-sm hover:bg-gray-200 transition-colors"
                variants={viewAllButtonVariants}
                whileHover="hover"
                onClick={() => router.push(`/products`)}
              >
                View All
              </motion.button>
            </div>

            {hasStores ? (
              <div className="flex space-x-6 overflow-x-scroll pb-4 scrollbar-hide snap-x" style={{ scrollBehavior: "smooth" }}>
                {stores.map((store) => (
                  <motion.div
                    key={store.id}
                    className={`${responsiveScrollItemClass} flex flex-col items-center justify-start`}
                    onClick={() => handleStoreClick(store.name)}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-14 h-14 mb-2 rounded-full flex items-center justify-center border border-gray-200 shadow-sm bg-gray-50 hover:border-red-500 transition-colors duration-200">
                      <span className="text-xl font-bold text-gray-500">{store.name ? store.name.charAt(0).toUpperCase() : "?"}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-700 text-center truncate w-full">{store.name}</p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-4 text-center">Loading stores...</p>
            )}
          </div>

          {/* TOP CATEGORIES SECTION */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">TOP CATEGORIES</h2>
              <Link href={`/products`} passHref>
                <motion.button
                  aria-label="View all categories"
                  className="bg-gray-100 text-gray-600 rounded-full px-4 py-2 text-sm"
                  variants={viewAllButtonVariants}
                  whileHover="hover"
                >
                  View All
                </motion.button>
              </Link>
            </div>

            {hasCategories ? (
              <div className="flex space-x-2 overflow-x-scroll pb-4 scrollbar-hide snap-x" style={{ scrollBehavior: "smooth" }}>
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    className={`${responsiveScrollItemClass} flex flex-col items-center justify-center`}
                    onClick={() => handleCategoryClick(category.name)}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-20 h-20 relative mb-3 rounded-full overflow-hidden border border-gray-100 shadow-md">
                      <Image
                        src={category.image_url || "/placeholder.jpg"}
                        alt={`${category.name} logo`}
                        fill
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-800 text-center whitespace-nowrap overflow-hidden text-ellipsis px-1">
                      {category.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-4 text-center">Loading categories...</p>
            )}

            <style jsx global>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCategorySection;
