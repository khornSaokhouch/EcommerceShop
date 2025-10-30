import { create } from 'zustand';
import { request } from '../util/request'; // adjust path

export const useEventStore = create((set, get) => ({
  events: [],
  loading: false,
  error: null,
  search: '',

  // Fetch all events
  fetchEvents: async () => {
    set({ loading: true, error: null });
    try {
      const data = await request('/event', 'GET', null, false);
      set({ events: data, loading: false });
    } catch (e) {
      set({
        error: e.response?.data?.message || e.message || 'Failed to fetch events',
        loading: false,
      });
    }
  },

  // Set search term
  setSearch: (value) => set({ search: value }),

  // Create or update event
  saveEvent: async (formData, id = null) => {
    try {
      let url = '/event';
      let method = 'POST'; // Always POST

      if (id) {
        url = `/event/${id}`;
        formData.append('_method', 'PUT'); // Laravel accepts PUT via POST
      }

      await request(url, method, formData, {
        // Do NOT set Content-Type manually; browser handles multipart/form-data
      });

      await get().fetchEvents();
    } catch (err) {
      throw err;
    }
  },

  // Delete event
  deleteEvent: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/event/${id}`, 'DELETE');
      await get().fetchEvents();
      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message || 'Failed to delete event',
        loading: false,
      });
      throw err;
    }
  },
}));
