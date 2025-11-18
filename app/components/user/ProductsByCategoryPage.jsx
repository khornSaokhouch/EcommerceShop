"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProductStore } from "../../stores/useProductStore";
import ProductCard from "../user/ProductCard";
import { useUserStore } from "../../stores/userStore";
import { toast } from "react-hot-toast";
import { useFavouritesStore } from "../../stores/useFavouritesStore";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { ArrowLeft, Tag, ShoppingBag } from "lucide-react";

// --- Slugify function ---
const slugify = (text) =>
  (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

// --- Category Promotion Banner ---
const CategoryPromotionBanner = ({ promotion }) => {
  if (!promotion || !promotion.name) return null;

  const startDate = new Date(promotion.start_date).toLocaleDateString();
  const endDate = new Date(promotion.end_date).toLocaleDateString();

  return (
    <div className="w-full bg-red-600 text-white p-4 rounded-xl shadow-lg mb-10 mt-4 flex items-center justify-between animate-pulse-slow">
      <div className="flex items-center space-x-4">
        <Tag className="h-8 w-8 text-yellow-300" />
        <div>
          <h3 className="text-xl font-extrabold tracking-wider uppercase">
            {promotion.name}
          </h3>
          <p className="text-sm font-medium opacity-90">
            {promotion.description || "Grab these deals before they're gone!"}
          </p>
        </div>
      </div>
      <div className="text-right text-sm font-semibold">
        <p>Sale ends:</p>
        <p className="text-yellow-300">{endDate}</p>
      </div>
    </div>
  );
};

export default function ProductsByCategoryPage({ categoryName }) {
  const router = useRouter();
  const userId = useUserStore((state) => state.user?.id);
  const { products, loading, error, fetchProductsByCategory } = useProductStore();
  const { categories } = useCategoryStore();
  const { favourites, addFavourite, removeFavourite } = useFavouritesStore();

  const [categoryId, setCategoryId] = useState(null);
  const [resolvedCategoryName, setResolvedCategoryName] = useState("Loading Category...");
  const [isLoading, setIsLoading] = useState(false);

  // Load category by slug
  useEffect(() => {
    if (!categoryName || categories.length === 0) return;

    const matchedCategory = categories.find(cat => slugify(cat.name) === categoryName);

    if (!matchedCategory) {
      setResolvedCategoryName("Unknown Category");
      return;
    }

    setCategoryId(matchedCategory.id);
    setResolvedCategoryName(matchedCategory.name);

    fetchProductsByCategory(matchedCategory.id);
  }, [categoryName, categories, fetchProductsByCategory]);

  // Find category promotion
  const category = categories.find(cat => cat.id === Number(categoryId));
  const categoryPromotion = category?.promotion || null;

  const isPromotionActive = (promotion) => {
    if (!promotion) return false;
    const today = new Date();
    const start = new Date(promotion.start_date);
    const end = new Date(promotion.end_date);
    return start <= today && today <= end;
  };

  const activeCategoryPromotion = isPromotionActive(categoryPromotion) ? categoryPromotion : null;

  // Apply category promotion to products without their own
  const productsWithPromotion = products.map(product => {
    if (product.promotion && isPromotionActive(product.promotion)) return product;
    if (activeCategoryPromotion) return { ...product, promotion: activeCategoryPromotion };
    return product;
  });

  // Add/Remove favourite handler
  const handleToggleFavourite = async (productId) => {
    if (!userId) {
      toast.error("You need to be logged in to manage favourites.");
      return;
    }

    setIsLoading(true);
    try {
      // Find existing favourite for this product
      const favRecord = favourites?.find(fav => fav?.product_id === productId);

      if (!favRecord) {
        // Add favourite
        await addFavourite({ user_id: userId, product_id: productId });
        toast.success("Added to favourites!");
      } else {
        // Remove favourite by DB ID
        await removeFavourite(favRecord.id);
        toast.success("Removed from favourites!");
      }
    } catch (err) {
      toast.error(`Failed to update favourite: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 text-base font-semibold text-gray-600 bg-white border border-gray-300 rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Shopping
          </button>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-6 md:mt-0 tracking-tight">
            <ShoppingBag className="inline-block h-8 w-8 text-indigo-500 mr-3" />
            {resolvedCategoryName}
          </h1>
        </div>

        {/* Promotion Banner */}
        {activeCategoryPromotion && <CategoryPromotionBanner promotion={activeCategoryPromotion} />}

        {/* Products */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
          {loading && <div className="text-center text-indigo-600 py-16 font-semibold text-lg">Loading products...</div>}

          {error && (
            <div className="text-center text-red-700 bg-red-50 border border-red-300 p-8 rounded-xl font-medium shadow-inner">
              <p className="text-xl font-semibold mb-2">Error loading products.</p>
              <p>Details: {error}</p>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center text-gray-500 bg-gray-50 border border-gray-200 p-10 rounded-xl font-medium italic shadow-inner">
              <p className="text-2xl mb-2">😔</p>
              <p>No products found in the **{resolvedCategoryName}** category at the moment.</p>
              <p className="text-sm mt-2">Check back soon for new arrivals!</p>
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <p className="text-sm text-gray-500 mb-6 font-medium">
                Showing **{products.length}** products currently available in the **{resolvedCategoryName}** category.
              </p>

              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
                {productsWithPromotion.map((product) => {
                  const favRecord = favourites?.find(fav => fav?.product_id === product.id);

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavourite={!!favRecord}
                      favouriteId={favRecord?.id || null}
                      onAddFavourite={() => handleToggleFavourite(product.id)}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
