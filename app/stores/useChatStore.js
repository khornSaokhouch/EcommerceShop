import { create } from "zustand";
import { request } from "../util/request"; // ✅ import your request helper
import echo from "../util/echo";
import { useAuthStore } from "./authStore";

export const useChatStore = create((set, get) => ({
  messages: {},       // { receiverId: [messages] }
  chats: [],          // chat threads
  subscribedUsers: new Set(),

  // -------------------------------
  // Fetch all chat threads
  // -------------------------------
  fetchChats: async () => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No auth token found");

      const data = await request("/chats", "GET", null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({ chats: data });
      return data;
    } catch (err) {
      console.error("Failed to fetch chats:", err);
      set({ chats: [] });
      return [];
    }
  },

  // -------------------------------
  // Fetch messages with a specific receiver
  // -------------------------------
  fetchMessages: async (receiverId) => {
    if (!receiverId) return [];

    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No auth token found");

      const data = await request(`/chat/${receiverId}`, "GET", null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        messages: { ...state.messages, [receiverId]: data },
      }));

      return data;
    } catch (err) {
      console.error(`Failed to fetch messages with ${receiverId}:`, err);
      set((state) => ({
        messages: { ...state.messages, [receiverId]: [] },
      }));
      return [];
    }
  },

  // -------------------------------
  // Send a message
  // -------------------------------
  sendMessage: async (receiverId, content) => {
    if (!receiverId || !content) return null;

    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No auth token found");

      const data = await request(
        "/chat/send",
        "POST",
        { receiver_id: receiverId, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set((state) => ({
        messages: {
          ...state.messages,
          [receiverId]: [...(state.messages[receiverId] || []), data],
        },
      }));

      return data;
    } catch (err) {
      console.error(`Failed to send message to ${receiverId}:`, err);
      return null;
    }
  },

  // -------------------------------
  // Subscribe to real-time messages for logged-in user
  // -------------------------------
  subscribeToUser: () => {
    const user = useAuthStore.getState().user;
    if (!user || get().subscribedUsers.has(user.id)) return;

    echo.private(`chat.${user.id}`).listen("MessageSent", (e) => {
      const senderId = e.message.sender_id;
      set((state) => ({
        messages: {
          ...state.messages,
          [senderId]: [...(state.messages[senderId] || []), e.message],
        },
      }));
    });

    set((state) => ({
      subscribedUsers: new Set(state.subscribedUsers).add(user.id),
    }));
  },

  // -------------------------------
  // Fetch all contacts
  // -------------------------------
  fetchContacts: async () => {
    try {
      const token = useAuthStore.getState().token;
      if (!token) throw new Error("No auth token found");

      const data = await request("/contacts", "GET", null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data;
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      return [];
    }
  },
}));
