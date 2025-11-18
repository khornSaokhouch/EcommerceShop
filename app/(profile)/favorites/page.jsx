"use client";

import { useUserStore } from "../../stores/userStore";
import Favourites from "../../components/user/Favourite/Favortes";

export default function UserFavouritesPage() {

  // Get logged-in user ID from your store
  const userId = useUserStore((state) => state.user?.id);

  if (!userId) {
    return <p>You must be logged in to view your favourites.</p>;
  }

  return (
    <div>
      <Favourites userId={userId} />
    </div>
  );
}
