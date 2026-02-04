import { create } from 'zustand';
import { request } from '../util/request'; // adjust path if needed

export const useBrandStore = create((set, get) => ({
  brands: [],
  loading: false,
  error: null,
  selectedBrand: null,

  /* =========================
     Fetch all brands
     ========================= */
  fetchBrands: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request('/brands', 'GET', null, false);
      set({ brands: data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch brands',
        loading: false,
      });
    }
  },

  /* =========================
     Fetch single brand
     ========================= */
  fetchBrand: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/brands/${id}`, 'GET', null, false);
      set({ selectedBrand: data.brand || data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch brand',
        loading: false,
      });
    }
  },

  /* =========================
     Create / Update brand
     ========================= */
  saveBrand: async (brand) => {
    set({ loading: true, error: null });
    try {
      let url = '/brands';
      let method = 'POST';

      // Update uses POST /brands/{id} (per your route)
      if (brand.id) {
        url = `/brands/${brand.id}`;
        method = 'POST';
      }

      // Use FormData if there is an image
      const formData = new FormData();
      formData.append('name', brand.name);
      formData.append('status', brand.status ? 1 : 0);

      if (brand.image instanceof File) {
        formData.append('image', brand.image);
      }

      await request(url, method, formData, true); // true = send FormData

      // Refresh list
      await get().fetchBrands();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to save brand',
        loading: false,
      });
      throw err;
    }
  },

  /* =========================
     Delete brand
     ========================= */
  deleteBrand: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/brands/${id}`, 'DELETE');
      await get().fetchBrands();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete brand',
        loading: false,
      });
      throw err;
    }
  },

  /* =========================
     Toggle status
     ========================= */
  toggleBrandStatus: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/brands/${id}/toggle-status`, 'PATCH');
      await get().fetchBrands();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to toggle status',
        loading: false,
      });
      throw err;
    }
  },
}));
