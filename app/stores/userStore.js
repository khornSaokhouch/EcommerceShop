import { create } from 'zustand';
import { request } from '../util/request';
import { useAuthStore } from './authStore';

export const useUserStore = create((set, get) => ({
  user: null, // current logged-in user
  users: [],
  loading: false,
  error: null,

  // -------------------------------
  // Fetch logged-in user's profile
  // -------------------------------
  fetchUser: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ error: 'No token found. Please log in.' });
      return null;
    }
  
    set({ loading: true, error: null });
    try {
      const res = await request('/profile', 'GET'); // interceptor adds token
      set({ user: res.user, loading: false });
      return res.user;
    } catch (err) {
      if (err.response?.status === 401) {
        // token invalid, force logout
        useAuthStore.setState({ token: null, user: null });
      }
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch user',
        loading: false,
      });
      return null;
    }
  },
  

  // -------------------------------
  // Fetch a user by ID
  // -------------------------------
  fetchUserById: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) return null; // cannot fetch without token
  
    try {
      const res = await request(`/users/${id}`, 'GET'); // token automatically added by interceptor
      return res;
    } catch (err) {
      console.error('Error fetching user:', err);
      return null;
    }
  },

  // -------------------------------
  // Fetch all users
  // -------------------------------
  fetchAllUsers: async () => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('No token found. Please log in.');

    set({ loading: true, error: null });
    try {
      const res = await request('/users', 'GET');
      set({ users: res, loading: false });
      return res;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch users',
        loading: false,
      });
      return [];
    }
  },

  // -------------------------------
  // Update user
  // -------------------------------
  updateUser: async (updatedData) => {
    const currentUser = get().user;
    if (!currentUser) throw new Error('No logged-in user');

    try {
      const data = await request(`/users/${currentUser.id}`, 'POST', updatedData, {
        // Axios automatically handles Content-Type for FormData
      });

      set({ user: data });
      set((state) => ({
        users: state.users.map((u) => (u.id === currentUser.id ? data : u)),
      }));
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Update failed');
    }
  },

  // -------------------------------
  // Delete a user
  // -------------------------------
  deleteUser: async (id) => {
    const token = useAuthStore.getState().token;
    if (!token) throw new Error('No token found. Please log in.');

    set({ loading: true, error: null });
    try {
      await request(`/users/${id}`, 'DELETE');
      set((state) => ({
        users: state.users.filter((user) => (user.user_id ?? user.id) !== id),
        loading: false,
      }));
    } catch (err) {
      console.error('Error deleting user:', err);
      set({ error: err.message || 'Failed to delete user', loading: false });
      throw err;
    }
  },

  // -------------------------------
  // Clear state
  // -------------------------------
  clearUser: () => set({ user: null, loading: false, error: null }),
  clearUsers: () => set({ users: [], loading: false, error: null }),
}));
