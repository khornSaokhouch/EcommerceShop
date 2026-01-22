import { create } from 'zustand';
import { request } from '../util/request';

export const useProductStore = create((set) => ({
  products: [],
  product: null,
  loading: false,
  error: null,

  // Fetch all products
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/products', 'GET');
      set({ products: res || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message || 'Failed to fetch products', loading: false });
    }
  },

  // Fetch all products (alias)
  fetchAllProducts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request('/products', 'GET');
      set({ products: res, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message || 'Failed to fetch products', loading: false });
    }
  },

  // Fetch a single product by ID
  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/products/${id}`, 'GET');
      set({ product: res, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message || 'Failed to fetch product', loading: false });
    }
  },

  // Fetch a single product by slug
  fetchProductBySlug: async (slug) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/products?slug=${slug}`, 'GET'); // API returns product array or object
      // Assuming API returns an array, pick first
      const productData = Array.isArray(res) ? res[0] : res;
      set({ product: productData || null, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message || 'Failed to fetch product', loading: false });
    }
  },

  // Fetch products by category
  fetchProductsByCategory: async (categoryId) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/categories/${categoryId}/products`, 'GET');
      set({ products: res, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message || 'Failed to fetch products', loading: false });
    }
  },

  // Fetch products by store
  fetchProductsByStore: async (storeId) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/products?store_id=${storeId}`, 'GET');
      set({ products: data, loading: false });
    } catch (err) {
      console.error('Failed to fetch products by store:', err);
      set({ error: err.message, loading: false });
    }
  },

  // Fetch products by category and store
  fetchProductsByCategoryAndStore: async (categoryId, storeId = null) => {
    set({ loading: true, error: null });
    try {
      let url = `/categories/${categoryId}/products`;
      if (storeId && storeId !== 'all') url += `?store_id=${storeId}`;
      const data = await request(url, 'GET');
      set({ products: Array.isArray(data) ? data : [], loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to fetch products', loading: false });
    }
  },

  // Create a product
  createProduct: async (data) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) formData.append(key, data[key]);
      }
      const res = await request('/products', 'POST', formData);
      set((state) => ({ products: [...state.products, res.product], loading: false }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message || 'Failed to create product', loading: false });
    }
  },

  // Update a product
  updateProduct: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      for (const key in data) {
        if (data[key] !== null && data[key] !== undefined) {
          if (key === 'product_image' && data[key] instanceof File) {
            formData.append(key, data[key]);
          } else if (key !== 'product_image') {
            formData.append(key, data[key]);
          }
        }
      }
      formData.append('_method', 'PUT');
      const res = await request(`/products/${id}`, 'POST', formData);
      set((state) => ({
        products: state.products.map((p) => (p.id === id ? res.product : p)),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message || 'Failed to update product', loading: false });
    }
  },

  // Delete a product
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/products/${id}`, 'DELETE');
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message || 'Failed to delete product', loading: false });
    }
  },

  // Fetch a category by ID
  fetchCategoryById: async (categoryId) => {
    try {
      const data = await request(`/categories/${categoryId}`, 'GET');
      return data;
    } catch (err) {
      console.error('Failed to fetch category:', err);
      return null;
    }
  },
}));
