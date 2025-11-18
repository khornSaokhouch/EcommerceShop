import { create } from 'zustand';
import { request } from '../util/request';

export const useFavouritesStore = create((set) => ({
  favourites: [],
  loading: false,
  error: null,

  // Fetch favourites for a specific user by userId
  fetchFavourites: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/favourites/${userId}`, 'GET');
      set({ favourites: res || [], loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch favourites', loading: false });
    }
  },

  // Add a favourite (returns the new favourite record)
  addFavourite: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await request('/favourites', 'POST', payload);
      const favourite = res.data; // contains DB id and product_id
      set((state) => ({
        favourites: [...state.favourites, favourite],
        loading: false,
      }));
      return favourite; // return new favourite for frontend
    } catch (err) {
      set({ error: err.message || 'Failed to add favourite', loading: false });
      throw err;
    }
  },

  // Remove a favourite by its database ID
  removeFavourite: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/favourites/${id}`, 'DELETE');
      set((state) => ({
        favourites: state.favourites.filter((fav) => fav.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message || 'Failed to remove favourite', loading: false });
      throw err;
    }
  },

  // Get a favourite by its ID
  getFavouriteById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/favourites/${id}`, 'GET');
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({ error: err.message || 'Failed to fetch favourite', loading: false });
      return null;
    }
  },
}));
