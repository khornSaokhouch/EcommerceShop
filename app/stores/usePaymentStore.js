import { create } from 'zustand';
import { request } from '../util/request';

export const usePaymentStore = create((set, get) => ({
  payments: [],
  loading: false,
  error: null,
  selectedPayment: null,
  search: '',

  setSearch: (search) => set({ search }),

  /* =========================
     Fetch all payment accounts
     ========================= */
  fetchPayments: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request("/payment-accounts", "GET", null, false);
      set({ payments: data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch payment accounts',
        loading: false,
        payments: []
      });
    }
  },


  /* =========================
     Fetch single payment account
     ========================= */
  fetchPayment: async (id) => {
    set({ loading: true, error: null });
    try {
      const data = await request(`/payment-accounts/${id}`, 'GET', null, false);
      set({ selectedPayment: data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to fetch payment account',
        loading: false,
      });
    }
  },

  /* =========================
     Create / Update payment account
     ========================= */
  savePayment: async (payment) => {
    set({ loading: true, error: null });
    try {
      let url = '/payment-accounts';
      let method = 'POST';

      if (payment.id) {
        url = `/payment-accounts/${payment.id}`;
        method = 'PUT'; // assuming RESTful update
      }

      // Prepare payload (no FormData unless you have files)
      const payload = {
        account_name: payment.account_name,
        account_id: payment.account_id,
        type_value: payment.type_value,
        account_city: payment.account_city || null,
        currency: payment.currency,
        status: payment.status ?? true,
      };

      await request(url, method, payload, false);

      // Refresh list
      await get().fetchPayments();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to save payment account',
        loading: false,
      });
      throw err;
    }
  },

  /* =========================
     Delete payment account
     ========================= */
  deletePayment: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/payment-accounts/${id}`, 'DELETE');
      await get().fetchPayments();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete payment account',
        loading: false,
      });
      throw err;
    }
  },

  /* =========================
     Toggle payment account status
     ========================= */
  togglePaymentStatus: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/payment-accounts/${id}/toggle-status`, 'PATCH');
      await get().fetchPayments();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to toggle payment status',
        loading: false,
      });
      throw err;
    }
  },
}));
