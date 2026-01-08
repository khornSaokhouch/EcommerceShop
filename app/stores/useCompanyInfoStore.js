import { create } from "zustand";
import { request } from "../util/request";

export const useCompanyInfoStore = create((set) => ({
  companies: [],
  company: null,
  loading: false,
  error: null,

  setFieldValue: (field, value) =>
    set((state) => ({
      company: {
        ...state.company,
        [field]: value,
      },
    })),

  handleInputChange: (e) => {
    const { name, value, files, type } = e.target;
    set((state) => ({
      company: {
        ...state.company,
        [name]: type === "file" ? files?.[0] ?? null : value,
      },
    }));
  },

  fetchCompanies: async () => {
    set({ loading: true, error: null });
    try {
      const res = await request("/companies", "GET");
      set({
        companies: Array.isArray(res?.companies) ? res.companies : [],
        loading: false,
      });
    } catch (err) {
      set({
        error: err.message || "Failed to fetch companies",
        loading: false,
      });
    }
  },

  fetchCompanyByUserId: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await request(`/companies/${id}`, "GET");
      set({ company: res, loading: false });
    } catch (err) {
      set({
        error: err.message || "Failed to fetch company",
        loading: false,
      });
    }
  },

  createCompany: async (data) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const res = await request("/companies", "POST", formData);
      set({ company: res.company ?? res, loading: false });
    } catch (err) {
      set({
        error: err.message || "Failed to create company",
        loading: false,
      });
    }
  },

  updateCompany: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "company_image") {
          if (value instanceof File) formData.append(key, value);
        } else if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      formData.append("_method", "PUT");

      const res = await request(`/companies/${id}`, "POST", formData);
      set({ company: res.company, loading: false });
    } catch (err) {
      set({
        error: err.message || "Failed to update company",
        loading: false,
      });
    }
  },

  deleteCompany: async (id) => {
    set({ loading: true, error: null });
    try {
      await request(`/companies/${id}`, "DELETE");
      set({ loading: false });
    } catch (err) {
      set({
        error: err.message || "Failed to delete company",
        loading: false,
      });
    }
  },
}));
