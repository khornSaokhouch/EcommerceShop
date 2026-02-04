import { create } from 'zustand';
import { request } from '../util/request'; // adjust path if needed

export const useSizeStore = create((set, get) => ({
  sizes: [],
  loading: false,
  error: null,
  selectedSize: null,

  /* =========================
     Fetch all sizes
     ========================= */
  fetchSizes: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request('/sizes', 'GET');
      set({ sizes: data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch sizes',
        loading: false,
      });
    }
  },

  /* =========================
     Fetch single size
     ========================= */
  fetchSize: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/sizes/${id}`, 'GET');
      set({ selectedSize: data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch size',
        loading: false,
      });
    }
  },

  /* =========================
     Create / Update size
     ========================= */
  saveSize: async (size) => {
    set({ loading: true, error: null });
    try {
      let url = '/sizes';
      let method = 'POST';

      if (size.id) {
        url = `/sizes/${size.id}`;
        method = 'PUT';
      }

      await request(url, method, size);
      await get().fetchSizes();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to save size',
        loading: false,
      });
      throw err;
    }
  },

  /* =========================
     Delete size
     ========================= */
  deleteSize: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/sizes/${id}`, 'DELETE');
      await get().fetchSizes();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete size',
        loading: false,
      });
      throw err;
    }
  },
}));
