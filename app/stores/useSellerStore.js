import { create } from "zustand";
import { request } from "../util/request"; // Make sure it can handle FormData

export const useSellerStore = create((set) => ({
  form: {
    fullName: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    streetAddress: "",
    countryRegion: "",
    document: null,
  },
  loading: false,
  error: null,
  success: null,

  // 🔹 Handle text input changes
  handleChange: (e) => {
    const { name, value } = e.target;
    set((state) => ({
      form: {
        ...state.form,
        [name]: value,
      },
      error: null,
      success: null,
    }));
  },

  // 🔹 Handle file input (PDF/Word)
  handleFileChange: (e) => {
    const file = e.target.files[0];
    set((state) => ({
      form: {
        ...state.form,
        document: file,
      },
      error: null,
      success: null,
    }));
  },

  // 🔹 Submit form with file to Laravel backend
  submitForm: async () => {
    set({ loading: true, error: null, success: null });

    try {
      const { form } = useSellerStore.getState();

      // ✅ Use FormData to handle text + file upload
      const formData = new FormData();
      formData.append("name", form.fullName);
      formData.append("company_name", form.companyName);
      formData.append("email", form.email);
      formData.append("phone_number", form.phoneNumber);
      formData.append("street_address", form.streetAddress);
      formData.append("country_region", form.countryRegion);
      if (form.document) {
        formData.append("document", form.document);
      }

      // ✅ Send to backend (Laravel)
      const res = await request("/sellers", "POST", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Success feedback
      set({
        success: res.message || "Your seller request has been submitted successfully!",
        loading: false,
        error: null,
        form: {
          fullName: "",
          companyName: "",
          email: "",
          phoneNumber: "",
          streetAddress: "",
          countryRegion: "",
          document: null,
        },
      });
    } catch (error) {
      console.error("Seller request error:", error);

      let message = "Something went wrong. Please try again.";

      // ✅ Handle Laravel validation or "already exists" messages
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      set({
        error: message,
        loading: false,
      });
    }
  },
}));
