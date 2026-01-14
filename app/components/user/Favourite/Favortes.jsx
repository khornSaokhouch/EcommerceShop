"use client";

import { useState, useEffect } from "react";
import { useFavouritesStore } from "../../../stores/useFavouritesStore";
import { toast } from "react-hot-toast";
import { Heart, PackageX, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import FavouriteItemRow from "./FavouriteItemRow";
import Pagination from "../../ui/Pagination";
import ConfirmDeletionFavorites from "./ConfirmDeletionFavorites";

export default function FavouritesPageClient({ userId }) {
  const { favourites = [], loading, error, fetchFavourites, removeFavourite } = useFavouritesStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const itemsPerPage = 5;

  useEffect(() => {
    if (userId) fetchFavourites(userId);
  }, [userId, fetchFavourites]);

  const handleDeleteConfirmation = (favId) => {
    setItemToDelete(favId);
    setShowConfirmDeletion(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await toast.promise(
        removeFavourite(itemToDelete).then(() => fetchFavourites(userId)),
        {
          loading: "Removing unit from registry...",
          success: "Unit removed from favourites",
          error: "Failed to remove unit.",
        }
      );
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setShowConfirmDeletion(false);
      setItemToDelete(null);
    }
  };

  const totalPages = Math.ceil(favourites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedFavourites = Array.isArray(favourites)
    ? favourites.slice(startIndex, startIndex + itemsPerPage)
    : [];

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Favourites</p>
    </div>
  );

  if (error) return (
    <div className="p-8 bg-red-50 rounded-[32px] border border-red-100 text-center text-red-600 font-bold text-sm">
      {error}
    </div>
  );

  return (
    <div className="p-4 sm:p-8">
      <header className="mb-12">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-50 rounded-[24px] flex items-center justify-center border border-blue-100 shadow-sm shadow-blue-500/5">
            <Heart className="w-7 h-7 text-blue-600 fill-blue-600/10" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Wishlist</h1>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">
              {favourites.length} Units Reserved
            </p>
          </div>
        </div>
      </header>

      {displayedFavourites.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {displayedFavourites.filter(fav => fav?.id).map((fav) => (
              <motion.div
                key={fav.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <FavouriteItemRow
                  favourite={fav}
                  onRemove={() => handleDeleteConfirmation(fav.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
          <PackageX className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h2 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">Wishlist is Empty</h2>
          <p className="text-slate-400 text-sm font-medium">Save hardware units to view them later.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <ConfirmDeletionFavorites
        isOpen={showConfirmDeletion}
        onClose={() => setShowConfirmDeletion(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}