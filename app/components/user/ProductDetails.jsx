"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { useShoppingCartStore } from "../../stores/useShoppingCart";
import { useUserStore } from "../../stores/userStore";
import { useFavouritesStore } from "../../stores/useFavouritesStore";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import ProductImageGallery from "./product-details-components/ProductImageGallery";
import ProductInfo from "./product-details-components/ProductInfo";
import ProductActions from "./product-details-components/ProductActions";
import ProductMeta from "./product-details-components/ProductMeta";
import RightSidebar from "./product-details-components/RightSidebar";
import PaymentMethods from "./product-details-components/PaymentMethods";
import ProductDiscountSection from "./ProductDiscountSection";
import Products from "./Products";
import UserReviews from "./UserReviews";

export default function ProductDetails({ productId }) {
  const userId = useUserStore((state) => state.user?.id);
  const { product, fetchProduct } = useProductStore();
  const { carts, updateCart, fetchCartsByUserId } = useShoppingCartStore();
  const { addFavourite, favourites } = useFavouritesStore();

  const [quantity, setQuantity] = useState(1);
  const [isFavourited, setIsFavourited] = useState(false);

  useEffect(() => {
    if (productId) fetchProduct(productId);
    if (userId) fetchCartsByUserId(userId);
  }, [productId, userId, fetchProduct, fetchCartsByUserId]);

  useEffect(() => {
    if (product && Array.isArray(favourites)) {
      const isFav = favourites.some((fav) => fav?.product_id === product.id);
      setIsFavourited(isFav);
    }
  }, [product, favourites]);

  const handleFavouriteClick = async () => {
    if (!userId) return toast.error("Please log in.");
    setIsFavourited(!isFavourited);
    try {
      await addFavourite({ user_id: userId, product_id: product.id });
      toast.success(isFavourited ? "Removed" : "Added to favourites");
    } catch { setIsFavourited(isFavourited); }
  };

  // Find order_product_id for this product (only if purchased)
const orderProductId = carts?.[0]?.items?.find(
  (item) => item.product_item_id === product?.id
)?.order_product_id;


  const handleAddToCart = async () => {
    if (!userId) return toast.error("Please log in.");
    const cart = carts[0];
    if (!cart) return toast.error("Cart not found.");

    const currentItems = cart.items || [];
    const itemIndex = currentItems.findIndex(i => i.product_item_id === product.id);
    let updatedItems = itemIndex > -1 
      ? currentItems.map((item, idx) => idx === itemIndex ? { ...item, qty: item.qty + quantity } : item)
      : [...currentItems, { product_item_id: product.id, qty: quantity }];

    await toast.promise(updateCart(cart.id, { items: updatedItems }), {
      loading: "Updating cart...",
      success: "Added to cart!",
      error: "Error updating cart.",
    });
    fetchCartsByUserId(userId);
  };

  

  if (!product) return null;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      <main className="max-w-8xl mx-auto px-4 lg:px-8">
        <motion.div
          className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left: Image */}
            <div className="lg:col-span-4 border-r border-slate-50">
              <ProductImageGallery product={product} />
            </div>

            {/* Middle: Info */}
            <div className="lg:col-span-5 p-8 md:p-12">
              <ProductInfo product={product} />
              <ProductActions
                quantity={quantity}
                setQuantity={setQuantity}
                handleAddToCart={handleAddToCart}
                handleFavouriteClick={handleFavouriteClick}
                isFavourited={isFavourited}
              />
              <div className="mt-12 pt-8 border-t border-slate-50">
                <ProductMeta />
              </div>
            </div>

            {/* Right: Sidebar */}
            <div className="lg:col-span-3 bg-slate-50/50 p-8">
              <RightSidebar product={product} />
              <PaymentMethods />
            </div>
          </div>
        </motion.div>

        <section className="mt-20">
  <UserReviews
    orderProductId={orderProductId}
    userId={userId}
  />
</section>


        <section className="mt-12"><ProductDiscountSection /></section>
        <section className="mt-20"><Products /></section>
      </main>
    </div>
  );
}