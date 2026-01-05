"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useReviewStore } from "../../stores/useReviewStore"
import { toast } from "react-hot-toast"
import { Edit, Trash2, User, MessageSquare, Send, LayoutGrid } from "lucide-react"
import { StarRating } from "../user/product-details-components/review/star-rating"
import { ConfirmationModal } from "../user/product-details-components/review/confirmation-modal"
import { formatDistanceToNow } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"

const REVIEW_LIMIT = 3;

export default function UserReviews({ orderProductId, userId }) {
  const { reviews, loading, error, fetchReviews, createReview, updateReview, deleteReview } = useReviewStore()
  const [newReviewText, setNewReviewText] = useState("")
  const [newRating, setNewRating] = useState(5)
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [editingReviewText, setEditingReviewText] = useState("")
  const [editingRating, setEditingRating] = useState(5)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [reviewToDeleteId, setReviewToDeleteId] = useState(null)
  const [showAllReviews, setShowAllReviews] = useState(false);

  useEffect(() => {
    if (orderProductId) {
      fetchReviews(orderProductId);
    }
  }, [orderProductId, fetchReviews]);
  

  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [reviews])

  const reviewsToShow = useMemo(() => {
    return showAllReviews ? sortedReviews : sortedReviews.slice(0, REVIEW_LIMIT);
  }, [sortedReviews, showAllReviews])

  const handleAddReview = async (e) => {
    e.preventDefault();
  
    if (!userId) {
      return toast.error("You must be logged in");
    }
  
    if (!orderProductId) {
      return toast.error("Invalid order product");
    }
  
    if (!newReviewText.trim()) {
      return toast.error("Please write a review");
    }
  
    if (newRating < 1 || newRating > 5) {
      return toast.error("Rating must be between 1 and 5");
    }
  
    const payload = {
      user_id: userId,
      order_product_id: orderProductId,
      review_text: newReviewText.trim(),
      rating: newRating,
    };
  
    try {
      await createReview(payload);
      toast.success("Review published!");
      setNewReviewText("");
      setNewRating(5);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };
  
  const saveEdit = async (id) => {
    try {
      await updateReview(id, { review_text: editingReviewText.trim(), rating: editingRating })
      toast.success("Review updated")
      setEditingReviewId(null)
    } catch (err) { toast.error(err.message) }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={async () => {
            try { await deleteReview(reviewToDeleteId); toast.success("Deleted"); } 
            catch { toast.error("Failed"); }
            setIsConfirmModalOpen(false);
        }}
        title="Delete Review"
      >
        This action will permanently remove your feedback.
      </ConfirmationModal>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Form Side */}
        <div className="lg:w-1/3">
          <div className="sticky top-32 space-y-6">
            <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                    <MessageSquare className="w-3 h-3" /> Community Feedback
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                    Reviews <span className="text-slate-300">({reviews.length})</span>
                </h3>
            </div>

            {userId ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-900/5"
              >
                <h4 className="font-bold text-slate-900 mb-4">Share your experience</h4>
                <div className="mb-6"><StarRating rating={newRating} onRatingChange={setNewRating} /></div>
                <textarea
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  rows={4}
                  placeholder="Technical performance, build quality..."
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                />
                <button
                  onClick={handleAddReview}
                  disabled={loading}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" /> {loading ? "Syncing..." : "Post Review"}
                </button>
              </motion.div>
            ) : (
              <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="font-bold mb-2">Authenticated users only</h4>
                    <p className="text-sm text-slate-400 mb-6">Join TechnoCore to contribute to the hardware community.</p>
                    <button className="text-xs font-black uppercase tracking-widest bg-blue-600 px-4 py-2 rounded-lg">Sign In</button>
                  </div>
                  <User className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5" />
              </div>
            )}
          </div>
        </div>

        {/* Right: Reviews List */}
        <div className="lg:w-2/3 space-y-6">
          {sortedReviews.length === 0 && !loading ? (
             <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-20 text-center">
                <LayoutGrid className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="font-bold text-slate-400">No data available for this unit yet.</p>
             </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {reviewsToShow.map((review) => {
                  const isUserReview = String(review.user_id) === String(userId)
                  const isEditing = editingReviewId === review.id

                  return (
                    <motion.article 
                        layout key={review.id} 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-blue-600 shrink-0 border border-white shadow-sm overflow-hidden">
                          {review.user?.profile_image_url ? (
                              <img src={review.user.profile_image_url} className="object-cover h-full w-full" />
                          ) : (
                            review.user?.name?.[0].toUpperCase() || 'A'
                          )}
                        </div>

                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-4">
                              <StarRating rating={editingRating} onRatingChange={setEditingRating} />
                              <textarea
                                value={editingReviewText}
                                onChange={(e) => setEditingReviewText(e.target.value)}
                                className="w-full p-4 bg-slate-50 rounded-xl outline-none"
                              />
                              <div className="flex gap-2">
                                <button onClick={() => saveEdit(review.id)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold">Save</button>
                                <button onClick={() => setEditingReviewId(null)} className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-start">
                                <div>
                                  <h5 className="font-bold text-slate-900">{review.user?.name || "Anonymous"}</h5>
                                  <div className="flex items-center gap-3 mt-1">
                                    <StarRating rating={review.rating} readOnly starSize="h-3 w-3" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                        {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                                    </span>
                                  </div>
                                </div>
                                {isUserReview && (
                                  <div className="flex gap-1">
                                    <button onClick={() => { setEditingReviewId(review.id); setEditingReviewText(review.review_text); setEditingRating(review.rating); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit className="w-4 h-4"/></button>
                                    <button onClick={() => { setReviewToDeleteId(review.id); setIsConfirmModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4"/></button>
                                  </div>
                                )}
                              </div>
                              <p className="mt-4 text-slate-600 text-sm leading-relaxed">{review.review_text}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </AnimatePresence>
            </div>
          )}

          {sortedReviews.length > REVIEW_LIMIT && !showAllReviews && (
            <button onClick={() => setShowAllReviews(true)} className="w-full py-4 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
              View All Feedback ({reviews.length})
            </button>
          )}
        </div>
      </div>
    </div>
  )
}