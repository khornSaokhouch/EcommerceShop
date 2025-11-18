"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useStore } from "../../../stores/useStore"; // store for store data
import { useProductStore } from "../../../stores/useProductStore"; // store for products
import { useUserStore } from "../../../stores/userStore";
import { useFavouritesStore } from "../../../stores/useFavouritesStore";
import ProductCard from "../../../components/user/ProductCard"; // your product card component
import { motion } from "framer-motion";
import { MapPin, Globe, Clock, Package, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function StoreProductsPage() {
  const { name: storeSlug } = useParams();
  const { stores, fetchStores } = useStore();
  const { products, fetchProductsByStore, loading, error } = useProductStore();
  const userId = useUserStore((state) => state.user?.id);
  const { favourites, addFavourite, removeFavourite } = useFavouritesStore();

  const [store, setStore] = useState(null);
  const [isLoadingFav, setIsLoadingFav] = useState(false);

  const slugify = (text) =>
    text
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");

  // Fetch stores on mount
  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Find store by slug and fetch products
  useEffect(() => {
    if (stores.length > 0 && storeSlug) {
      const found = stores.find((s) => slugify(s.name) === storeSlug);
      setStore(found || null);

      if (found) fetchProductsByStore(found.id);
    }
  }, [stores, storeSlug, fetchProductsByStore]);

  // Toggle favourite for a product
  const handleToggleFavourite = async (productId) => {
    if (!userId) {
      toast.error("You need to be logged in to manage favourites.");
      return;
    }

    setIsLoadingFav(true);
    try {
      // Find existing favourite for this product
      const favRecord = favourites?.find(fav => fav?.product_id === productId);

      if (!favRecord) {
        await addFavourite({ user_id: userId, product_id: productId });
        toast.success("Added to favourites!");
      } else {
        await removeFavourite(favRecord.id);
        toast.success("Removed from favourites!");
      }
    } catch (err) {
      toast.error(`Failed to update favourite: ${err.message}`);
    } finally {
      setIsLoadingFav(false);
    }
  };

  // --- Render States ---
  if (!store && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-10">
        <div className="p-8 bg-white rounded-xl shadow-lg border border-gray-200 text-center">
          <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-gray-700">Store Not Found</h2>
          <p className="text-gray-500 mt-1">The requested store could not be located.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="bg-indigo-700 pt-16 pb-24 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {store && (
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border-4 border-white bg-white shadow-lg">
                {store.image_url ? (
                  <img src={store.image_url} alt={store.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 text-4xl font-extrabold text-indigo-500">
                    {store.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="pt-4">
                <h1 className="text-5xl font-extrabold mb-1 leading-tight">{store.name}</h1>
                <p className="text-indigo-200 text-lg">{store.description || "Browse our latest products below."}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Store Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 -mt-16 relative z-20">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 text-sm">
            {(store?.address || store?.city || store?.country) && (
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-indigo-500" />
                <span>{[store.address, store.city, store.country].filter(Boolean).join(", ")}</span>
              </div>
            )}
            {store?.website_url && (
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-indigo-500" />
                <a href={store.website_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  {store.website_url}
                </a>
              </div>
            )}
            {store?.business_hours && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>{store.business_hours}</span>
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b border-gray-200 pb-2">
            Products ({products.length})
          </h2>

          {loading && (
            <div className="text-center text-indigo-600 py-16 font-semibold text-lg">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
              Loading products...
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center text-gray-500 bg-white border border-gray-200 p-12 rounded-lg font-medium">
              <Package className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p>This store currently has no products listed.</p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <motion.div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {products.map((product) => {
                const favRecord = favourites?.find(fav => fav?.product_id === product.id);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavourite={!!favRecord}
                    favouriteId={favRecord?.id || null}
                    onAddFavourite={() => handleToggleFavourite(product.id)}
                    disabled={isLoadingFav}
                  />
                );
              })}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
