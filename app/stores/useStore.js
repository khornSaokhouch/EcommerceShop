import { create } from "zustand";
import { request } from "../util/request";
import { useAuthStore } from "./authStore"; // import auth store

export const useStore = create((set) => ({
  stores: [],
  loading: false,
  error: null,

  // Fetch all stores or by userId
  fetchStores: async (userId) => {
    set({ loading: true, error: null });
    try {
      const url = userId ? `/stores?user_id=${userId}` : "/stores";
      const res = await request(url, "GET");
      set({
        stores: Array.isArray(res) ? res : [],
        loading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err.message || "Failed to fetch stores",
        loading: false,
        stores: [],
      });
    }
  },

  fetchStoresByUserId: async (userId) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/stores/user/${userId}`, "GET");
      set({
        stores: Array.isArray(res) ? res : [],
        loading: false,
        error: null,
      });
    } catch (err) {
      set({
        error: err.message || "Failed to fetch stores by user",
        loading: false,
        stores: [],
      });
    }
  },

  getStoreById: async (id) => {
    try {
      const res = await request(`/stores/${id}`, "GET");
      return res;
    } catch (err) {
      console.error("Failed to fetch store by ID:", err);
      return null;
    }
  },

  createStore: async (data) => {
    try {
      if (!data.name) {
        throw new Error("Missing required field: name");
      }
  
      const newStore = await request("/stores", "POST", data);
  
      set((state) => ({
        stores: [...state.stores, newStore],
        error: null,
      }));
  
      return newStore;
    } catch (err) {
      console.error("Failed to create store:", err);
      throw err;
    }
  },
  
  updateStore: async (id, data) => {
    try {
      const updatedStore = await request(`/stores/${id}`, "PUT", data);

      if (!updatedStore || !updatedStore.id) {
        throw new Error("Invalid response from server on update");
      }

      set((state) => ({
        stores: state.stores.map((store) =>
          store.id === id ? updatedStore : store
        ),
        error: null,
      }));

      return updatedStore;
    } catch (err) {
      console.error("Failed to update store:", err);
      throw err;
    }
  },

  deleteStore: async (id) => {
    try {
      await request(`/stores/${id}`, "DELETE");
      set((state) => ({
        stores: state.stores.filter((store) => store.id !== id),
        error: null,
      }));
      return true;
    } catch (err) {
      console.error("Failed to delete store:", err);
      throw err;
    }
  },
}));
