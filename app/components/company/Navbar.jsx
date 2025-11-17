'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, MessageSquare, Menu, Settings, LogOut, User } from 'lucide-react';
import { useChatStore } from '../../stores/useChatStore';
// import { useAuthStore } from '../stores/authStore';

const getInitials = (name) => {
  if (!name) return 'U';
  const words = name.split(' ');
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

export default function Navbar({ user, loadingUser, onMenuButtonClick, onLogoutClick, pageTitle, profileLink }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const scrollRef = useRef(null);

  const { chats, messages, fetchChats, fetchMessages, sendMessage, subscribeToUser } = useChatStore();

  // -------------------------------
  // Fetch chats on mount
  // -------------------------------
  useEffect(() => {
    if (user) {
      fetchChats();
      subscribeToUser();
    }
  }, [user]);

  // -------------------------------
  // Messages for the selected chat
  // -------------------------------
  const chatMessages = useMemo(() => messages[selectedUserId] || [], [messages, selectedUserId]);

  // -------------------------------
  // Scroll to bottom when new message arrives
  // -------------------------------
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // -------------------------------
  // Handle selecting a chat
  // -------------------------------
  const handleSelectChat = async (userId) => {
    setSelectedUserId(userId);
    await fetchMessages(userId);
    setChatOpen(true);
  };

  // -------------------------------
  // Send a new message
  // -------------------------------
  const handleSendMessage = async () => {
    if (!newMessage || !selectedUserId) return;
    await sendMessage(selectedUserId, newMessage);
    setNewMessage('');
  };

  return (
    <>
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuButtonClick}
              className="md:hidden text-slate-600 hover:text-slate-800"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-slate-800">{pageTitle || 'Dashboard'}</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Chat Button */}
            <button
              onClick={() => setChatOpen(true)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
              {chats.length > 0 && (
                <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-semibold uppercase"
              >
                {loadingUser ? (
                  <div className="w-10 h-10 bg-slate-300 rounded-full animate-pulse" />
                ) : user?.profile_image_url ? (
                  <img
                    src={user.profile_image_url}
                    alt={user.name || 'User'}
                    className="w-10 h-10 object-cover rounded-full"
                  />
                ) : (
                  <span>{getInitials(user?.name)}</span>
                )}
              </button>

              <AnimatePresence>
  {dropdownOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg z-20 overflow-hidden ring-1 ring-slate-900/5"
      onMouseLeave={() => setDropdownOpen(false)}
    >
      <div className="p-2">
        <div className="px-2 py-2 text-left">
          <p className="text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>
        <div className="h-px bg-slate-200 my-1" />

        {/* Existing buttons */}
        <Link
          href={profileLink}
          className="flex items-center gap-3 w-full px-2 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100"
        >
          <User className="w-5 h-5" />Company Profile
        </Link>

        <Link
           href="/company/edit-profile"
          className="flex items-center gap-3 w-full px-2 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100"
        >
          <Settings className="w-5 h-5" /> Edit Profile Company
        </Link>

        <Link
          href="/company/support"
          className="flex items-center gap-3 w-full px-2 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100"
        >
          <Bell className="w-5 h-5" /> Support
        </Link>

        <button
          onClick={onLogoutClick}
          className="flex items-center gap-3 w-full px-2 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </motion.div>
  )}
</AnimatePresence>

            </div>
          </div>
        </div>
      </header>

      {/* Chat Drawer */}
      <AnimatePresence>
        {chatOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setChatOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 z-50 h-full w-96 bg-white shadow-xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h3 className="text-lg font-semibold">Messages</h3>
                <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-slate-800 font-bold">
                  ×
                </button>
              </div>

              {/* Chat Content */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Chat List */}
                {selectedUserId === null ? (
                  chats.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">No chats</p>
                  ) : (
                    chats.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => handleSelectChat(c.id)}
                        className="flex items-center gap-3 w-full p-2 rounded hover:bg-gray-100 text-left"
                      >
                        <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                          {getInitials(c.name)}
                        </div>
                        <span>{c.name}</span>
                      </button>
                    ))
                  )
                ) : chatMessages.length === 0 ? (
                  <p className="text-xs text-gray-500 text-center py-4">No messages</p>
                ) : (
                  chatMessages.map((msg) => {
                    const isMe = msg.sender_id === user.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {/* Avatar */}
                        {!isMe && (
                          <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
                            {getInitials(msg.sender?.name)}
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`max-w-xs p-2 rounded-lg ${
                            isMe ? 'bg-blue-500 text-white text-right' : 'bg-gray-200 text-left'
                          }`}
                        >
                          {!isMe && <p className="text-sm font-semibold text-slate-800">{msg.sender?.name}</p>}
                          <p className="text-sm">{msg.content}</p>
                          <span className={`text-xs ${isMe ? 'text-white/80' : 'text-gray-400'}`}>{msg.created_at}</span>
                        </div>

                        {/* Empty space for right alignment */}
                        {isMe && <div className="w-10 h-10 flex-shrink-0" />}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input */}
              {selectedUserId && (
                <div className="p-4 border-t border-slate-200 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
                  >
                    Send
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
