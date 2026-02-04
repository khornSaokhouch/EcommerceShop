import { create } from 'zustand';
import { request } from '../util/request'; // adjust path if needed

export const useColorStore = create((set, get) => ({
  colors: [],
  loading: false,
  error: null,
  selectedColor: null,

  /* =========================
     Fetch all colors
     ========================= */
  fetchColors: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request('/colors', 'GET');
      set({ colors: data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch colors',
        loading: false,
      });
    }
  },

  /* =========================
     Fetch single color
     ========================= */
  fetchColor: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/colors/${id}`, 'GET');
      set({ selectedColor: data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch color',
        loading: false,
      });
    }
  },

  /* =========================
     Create / Update color
     ========================= */
  saveColor: async (color) => {
    set({ loading: true, error: null });
    try {
      let url = '/colors';
      let method = 'POST';

      if (color.id) {
        url = `/colors/${color.id}`;
        method = 'PUT';
      }

      await request(url, method, color);
      await get().fetchColors();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to save color',
        loading: false,
      });
      throw err;
    }
  },

  /* =========================
     Delete color
     ========================= */
  deleteColor: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/colors/${id}`, 'DELETE');
      await get().fetchColors();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete color',
        loading: false,
      });
      throw err;
    }
  },
}));
