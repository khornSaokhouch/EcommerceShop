// components/EventManager.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useEventStore } from "../../stores/useEventStore";
import EventModal from "../../components/admin/event/EventModal"; // Import the new modal component
import DeleteConfirmationModal from "../../components/admin/event/DeleteConfirmationModal"; // Import delete modal
import NotificationToast from "../../components/admin/event/NotificationToast"; // Import notification component

export default function EventManager() {
  const { events, fetchEvents, saveEvent, deleteEvent, loading, error } =
    useEventStore();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null); // Use null for initial state to differentiate between new and existing
  const [eventIdToDelete, setEventIdToDelete] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchEvents();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification({ message: "", type: "" });
    }, 3000); // Notification disappears after 3 seconds
  };

  // --- Event Modal (Add/Edit) Handlers ---
  const handleOpenEventModal = (event = null) => {
    setCurrentEvent(event); // If null, it's an add operation; otherwise, it's an edit
    setIsEventModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setCurrentEvent(null);
    setIsEventModalOpen(false);
  };

  const handleSaveEvent = async (formData, eventId) => {
    try {
      const isEditing = !!eventId;
      await saveEvent(formData, eventId);
      showNotification(
        isEditing ? "Event updated successfully!" : "Event added successfully!",
        "success"
      );
      handleCloseEventModal(); // Close modal after successful save
    } catch (err) {
      console.error(err);
      showNotification("Failed to save event.", "error");
    }
  };

  // --- Delete Modal Handlers ---
  const handleOpenDeleteModal = (id) => {
    setEventIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setEventIdToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDeleteEvent = async () => {
    try {
      if (eventIdToDelete) {
        await deleteEvent(eventIdToDelete);
        showNotification("Event deleted successfully!", "success");
        handleCloseDeleteModal(); // Close modal after successful delete
      }
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete event.", "error");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Event Management
          </h1>
          <button
            onClick={() => handleOpenEventModal()}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5"
          >
            Add New Event
          </button>
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-600">
            Loading events...
          </div>
        )}
        {error && <p className="text-red-600 text-center py-4">{error}</p>}

        {!loading && events.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No events found. Start by adding a new one!
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {/* REMOVE WHITESPACE HERE */}
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
                {/* REMOVE WHITESPACE HERE */}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
  {events.map((event, index) => (
    <tr key={event.id} className="hover:bg-gray-50">
      {/* Replace event.id with index + 1 */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {index + 1}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {event.name
          ? event.name.length > 20
            ? `${event.name.substring(0, 20)}...`
            : event.name
          : "-"}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
        {event.description
          ? event.description.length > 30
            ? `${event.description.substring(0, 30)}...`
            : event.description
          : "-"}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {event.start_date.split("T")[0]}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
        {event.end_date ? event.end_date.split("T")[0] : "-"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {event.event_image_url ? (
          <img
            src={event.event_image_url}
            alt={event.name}
            className="h-10 w-10 object-cover rounded-full border border-gray-200"
          />
        ) : (
          <span className="text-gray-400 text-sm">No Image</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
        <button
          onClick={() => handleOpenEventModal(event)}
          className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors duration-200"
          title="Edit Event"
        >
          Edit
        </button>
        <button
          onClick={() => handleOpenDeleteModal(event.id)}
          className="text-red-600 hover:text-red-900 transition-colors duration-200"
          title="Delete Event"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        )}
      </div>

      {/* Event Add/Edit Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleCloseEventModal}
        event={currentEvent} // Pass the event data (null for add, object for edit)
        onSave={handleSaveEvent}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteEvent}
      />

      {/* Notification Toast */}
      <NotificationToast
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
}
