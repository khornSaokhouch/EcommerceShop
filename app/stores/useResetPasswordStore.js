import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { request } from '../util/request';

export const useResetPasswordStore = create(
  persist(
    (set, get) => ({
      loading: false,
      error: null,
      message: null,

      // Send reset link
      sendResetLink: async (email) => {
        set({ loading: true, error: null, message: null });
        try {
          const res = await request('/password/forgot', 'POST', { email });
          set({ message: res.message });
          return res;
        } catch (err) {
          const msg = err?.response?.data?.message || err.message || 'Failed to send reset link';
          set({ error: msg });
          throw new Error(msg);
        } finally {
          set({ loading: false });
        }
      },

      // Reset password
      resetPassword: async ({ token, email, password, password_confirmation }) => {
        set({ loading: true, error: null, message: null });
        try {
          const res = await request('/password/reset', 'POST', { token, email, password, password_confirmation });
          set({ message: res.message });
          return res;
        } catch (err) {
          const msg = err?.response?.data?.message || err.message || 'Password reset failed';
          set({ error: msg });
          throw new Error(msg);
        } finally {
          set({ loading: false });
        }
      }
    }),
    {
      name: 'reset-password-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ message: state.message })
    }
  )
);
