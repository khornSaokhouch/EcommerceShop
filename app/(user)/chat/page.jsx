"use client";

import { useEffect, useState, useMemo } from "react";
import { useChatStore } from "../../stores/useChatStore";
import { useAuthStore } from "../../stores/authStore";

export default function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const { chats, messages, fetchChats, fetchMessages, sendMessage, subscribeToUser } =
    useChatStore();

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [content, setContent] = useState("");

  // Memoized messages to prevent unnecessary re-renders
  const chatMessages = useMemo(() => messages[selectedUserId] || [], [messages, selectedUserId]);

  // -------------------------------
  // Subscribe to real-time messages for logged-in user
  // -------------------------------
  useEffect(() => {
    if (user) subscribeToUser();
  }, [user]);

  // -------------------------------
  // Fetch all chat threads on mount
  // -------------------------------
  useEffect(() => {
    if (!user) return;
    fetchChats();
  }, [user]);

  // -------------------------------
  // Fetch messages when selecting a user
  // -------------------------------
  useEffect(() => {
    if (!selectedUserId) return;
    fetchMessages(selectedUserId);
  }, [selectedUserId]);

  // -------------------------------
  // Send a new message
  // -------------------------------
  const handleSend = async () => {
    if (!content || !selectedUserId) return;
    await sendMessage(selectedUserId, content);
    setContent("");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 flex gap-4">
      {/* Chat List */}
      <div className="w-1/3 border rounded p-2 h-[600px] overflow-y-auto">
        <h2 className="font-bold mb-2">Chats</h2>
        {chats?.length ? (
          chats.map((c) => (
            <div
              key={c.id}
              className={`p-2 mb-1 rounded cursor-pointer ${
                c.id === selectedUserId ? "bg-blue-500 text-white" : "bg-gray-100"
              }`}
              onClick={() => setSelectedUserId(c.id)}
            >
              {c.name}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No chats yet</p>
        )}
      </div>

      {/* Chat Conversation */}
      <div className="w-2/3 border rounded p-2 flex flex-col">
        {selectedUserId ? (
          <>
            <h2 className="text-xl font-bold mb-2">
              Chat with {chats.find((c) => c.id === selectedUserId)?.name || "User"}
            </h2>

            <div className="flex-1 h-[500px] overflow-y-auto mb-2 border p-2">
              {chatMessages.length ? (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2 mb-1 rounded ${
                      msg.sender_id === user?.id
                        ? "bg-blue-500 text-white text-right"
                        : "bg-gray-200 text-left"
                    }`}
                  >
                    <strong>{msg.sender?.name || "Unknown"}:</strong> {msg.content}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center mt-10">No messages yet</p>
              )}
            </div>

            <div className="flex">
              <input
                type="text"
                className="flex-1 border rounded p-2"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type a message"
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="ml-2 bg-blue-500 text-white p-2 rounded"
                onClick={handleSend}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 mt-10">Select a chat to start</div>
        )}
      </div>
    </div>
  );
}
