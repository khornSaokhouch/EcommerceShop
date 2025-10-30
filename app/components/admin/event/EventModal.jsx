// components/EventModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EventModal({ isOpen, onClose, event, onSave }) {
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Reset form when modal opens/closes or event changes
  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        start_date: event.start_date ? event.start_date.slice(0, 16) : "",
        end_date: event.end_date ? event.end_date.slice(0, 16) : "",
      });
      setImagePreview(event.event_image_url || null);
    } else {
      setFormData({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        event_image: null,
      });
      setImagePreview(null);
    }
  }, [event, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "event_image" && files && files[0]) {
      setFormData((prev) => ({ ...prev, event_image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    if (formData.name) data.append("name", formData.name);
    if (formData.description) data.append("description", formData.description);
    if (formData.start_date) data.append("start_date", formData.start_date);
    if (formData.end_date) data.append("end_date", formData.end_date);
    if (formData.event_image) data.append("event_image", formData.event_image);

    onSave(data, event ? event.id : null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0  bg-opacity-75 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg m-4"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {event ? "Edit Event" : "Add New Event"}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description || ""}
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                  ></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      name="start_date"
                      value={formData.start_date || ""}
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date (Optional)
                    </label>
                    <input
                      type="datetime-local"
                      name="end_date"
                      value={formData.end_date || ""}
                      onChange={handleChange}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Image
                  </label>
                  <input
                    type="file"
                    name="event_image"
                    onChange={handleChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <div className="mt-4 flex items-center space-x-3">
                      <img
                        src={imagePreview}
                        alt="Image Preview"
                        className="w-24 h-24 object-cover rounded-md border border-gray-200"
                      />
                      <span className="text-gray-600 text-sm">Current Image</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200 shadow-md"
                >
                  {event ? "Save Changes" : "Add Event"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
