import { create } from 'zustand';
import { request } from '../util/request'; // adjust path if needed

export const useTypeStore = create((set, get) => ({
  types: [],
  loading: false,
  error: null,
  search: '',
  selectedCategoryId: null,

  /* =========================
     Fetch all types
     ========================= */
  fetchTypes: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request('/types', 'GET', null, false);
      set({ types: data, loading: false });
    } catch (e) {
      set({
        error: e.response?.data?.message || e.message || 'Failed to fetch types',
        loading: false,
      });
    }
  },

  /* =========================
     Fetch types by category
     ========================= */
  fetchTypesByCategory: async (categoryId) => {
    set({ loading: true, error: null, selectedCategoryId: categoryId });
    try {
      const data = await request(`/categories/${categoryId}/types`, 'GET', null, false);
      set({ types: data, loading: false });
    } catch (e) {
      set({
        error:
          e.response?.data?.message ||
          e.message ||
          'Failed to fetch types by category',
        loading: false,
      });
    }
  },

  /* =========================
     Search
     ========================= */
  setSearch: (value) => set({ search: value }),

  /* =========================
     Create / Update type
     ========================= */
  saveType: async (type) => {
    try {
      let url = '/types';
      let method = 'POST';

      // Update uses POST /types/{id} (per your route)
      if (type.id) {
        url = `/types/${type.id}`;
        method = 'POST';
      }

      const payload = {
        name: type.name,
        category_id: type.category_id,
        status: type.status ? 1 : 0,
      };

      await request(url, method, payload);

      // refresh list
      if (get().selectedCategoryId) {
        await get().fetchTypesByCategory(get().selectedCategoryId);
      } else {
        await get().fetchTypes();
      }
    } catch (err) {
      throw err;
    }
  },

  /* =========================
     Delete type
     ========================= */
  deleteType: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/types/${id}`, 'DELETE');
      await get().fetchTypes();
      set({ loading: false });
    } catch (err) {
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          'Failed to delete type',
        loading: false,
      });
      throw err;
    }
  },

  /* =========================
     Toggle status
     ========================= */
  toggleTypeStatus: async (id) => {
    try {
      await request(`/types/${id}/toggle-status`, 'PATCH');
      await get().fetchTypes();
    } catch (err) {
      console.error('Failed to toggle type status:', err);
      throw err;
    }
  },
}));
