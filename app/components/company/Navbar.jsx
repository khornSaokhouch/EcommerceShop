'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, MessageSquare, Menu, Settings, LogOut, User, Send, ArrowLeft } from 'lucide-react'; // Added ArrowLeft for back button
import { useChatStore } from '../../stores/useChatStore';

const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0][0] + words[words.length - 1][0]).toUpperCase(); // Improved initial calculation
};

// Component to handle the chat drawer UI
const ChatDrawer = ({ user, chatOpen, setChatOpen, selectedUserId, setSelectedUserId, chatMessages, chats, handleSelectChat, handleSendMessage, newMessage, setNewMessage, scrollRef }) => {
    
    // Derived state for the name of the currently selected chat partner
    const selectedChat = chats.find(c => c.id === selectedUserId);
    const selectedChatName = selectedChat ? selectedChat.name : 'Messages';

    // Simple transition for view switching
    const viewTransition = { type: 'tween', duration: 0.3, ease: 'easeInOut' };

    return (
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
                        className="fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-xl flex flex-col overflow-hidden" // Increased max-w for better display
                    >
                        
                        {/* ------------------------------------- */}
                        {/* Chat List View (Always visible if no chat selected) */}
                        {/* ------------------------------------- */}
                        <motion.div 
                            initial={false}
                            animate={{ x: selectedUserId ? '-100%' : '0%' }}
                            transition={viewTransition}
                            className={`absolute inset-0 flex flex-col transition-transform duration-300`}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-slate-200">
                                <h3 className="text-xl font-bold text-slate-800">Chat List ({chats.length})</h3>
                                <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-slate-800">
                                    <span className="text-2xl font-bold">×</span>
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {chats.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-8">No active conversations yet.</p>
                                ) : (
                                    chats.map((c) => (
                                      <button
                                      key={c.id}
                                      onClick={() => handleSelectChat(c.id)}
                                      className="flex items-center gap-4 w-full p-3 rounded-lg hover:bg-slate-100 text-left transition-colors"
                                  >
                                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 overflow-hidden bg-gray-200">
                                          {c.profile_image_url ? (
                                              <img
                                                  src={c.profile_image_url}
                                                  alt={c.name}
                                                  className="object-cover w-full h-full rounded-full"
                                              />
                                          ) : (
                                              <span>{getInitials(c.name)}</span>
                                          )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                          <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                                          <p className="text-xs text-slate-500 truncate">Last message content...</p>
                                      </div>
                                  </button>
                                    ))
                                )}
                            </div>
                        </motion.div>

                        {/* ------------------------------------- */}
                        {/* Conversation View (Slides in when a chat is selected) */}
                        {/* ------------------------------------- */}
                        <motion.div
                            initial={false}
                            animate={{ x: selectedUserId ? '0%' : '100%' }}
                            transition={viewTransition}
                            className={`absolute inset-0 flex flex-col bg-white transition-transform duration-300`}
                        >
                            {/* Conversation Header */}
                            <div className="flex items-center p-4 border-b border-slate-200 shadow-sm">
                                <button onClick={() => setSelectedUserId(null)} className="text-slate-500 hover:text-slate-800 mr-3">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h3 className="text-lg font-semibold truncate">{selectedChatName}</h3>
                                <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-slate-800 ml-auto">
                                    <span className="text-2xl font-bold">×</span>
                                </button>
                            </div>
                            
                            {/* Message Area */}
                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {chatMessages.length === 0 ? (
                                    <p className="text-sm text-gray-500 text-center py-10">Start a new conversation!</p>
                                ) : (
                                    chatMessages.map((msg) => {
                                        const isMe = msg.sender_id === user.id;
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex items-start ${isMe ? 'justify-end' : 'justify-start'}`}
                                            >
                                                
                                                {/* Message Bubble */}
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className={`max-w-[80%] p-3 rounded-xl shadow-sm ${
                                                        isMe 
                                                            ? 'bg-blue-600 text-white rounded-br-none' 
                                                            : 'bg-white text-slate-800 rounded-tl-none border border-gray-200'
                                                    }`}
                                                >
                                                    <p className="text-sm break-words">{msg.content}</p>
                                                    <span className={`block mt-1 text-[10px] ${isMe ? 'text-blue-200' : 'text-gray-400'} text-right`}>
                                                        {msg.created_at} {/* Time will need formatting */}
                                                    </span>
                                                </motion.div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-slate-200 flex gap-3 bg-white">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <motion.button
                                    onClick={handleSendMessage}
                                    disabled={!newMessage.trim()}
                                    className="bg-indigo-600 text-white w-12 h-12 flex items-center justify-center rounded-xl hover:bg-indigo-700 transition disabled:bg-indigo-400"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Send className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </motion.div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Main Navbar Component
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
    }, [user, fetchChats, subscribeToUser]); // Added dependencies for clarity

    // -------------------------------
    // Messages for the selected chat
    // -------------------------------
    const chatMessages = useMemo(() => messages[selectedUserId] || [], [messages, selectedUserId]);

    // -------------------------------
    // Scroll to bottom when new message arrives
    // -------------------------------
    useEffect(() => {
        if (scrollRef.current) {
            // Using requestAnimationFrame ensures the scroll happens after render
            requestAnimationFrame(() => {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            });
        }
    }, [chatMessages, selectedUserId]);

    // -------------------------------
    // Handle selecting a chat
    // -------------------------------
    const handleSelectChat = async (userId) => {
        setSelectedUserId(userId);
        // Pre-fetch messages but keep chatOpen true
        await fetchMessages(userId); 
    };

    // -------------------------------
    // Send a new message
    // -------------------------------
    const handleSendMessage = async () => {
        const trimmedMessage = newMessage.trim();
        if (!trimmedMessage || !selectedUserId) return;
        
        await sendMessage(selectedUserId, trimmedMessage);
        setNewMessage('');
    };

    return (
        <>
            {/* Navbar */}
            <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200"> {/* Slight opacity change */}
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onMenuButtonClick}
                            className="lg:hidden text-slate-600 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold text-slate-800">{pageTitle || 'Dashboard'}</h1>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        
                        {/* Chat Button */}
                        <button
                            onClick={() => {
                                setChatOpen(true);
                                setSelectedUserId(null); // Reset to chat list when opening
                            }}
                            className="relative w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            <MessageSquare className="w-5 h-5" />
                            {chats.length > 0 && ( // Assuming chats.length or a specific unread count indicates new activity
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
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-semibold uppercase ring-2 ring-indigo-500/50 hover:ring-indigo-500 transition-all duration-200"
                            >
                                {loadingUser ? (
                                    <div className="w-full h-full bg-slate-300 rounded-full animate-pulse" />
                                ) : user?.profile_image_url ? (
                                    <img
                                        src={user.profile_image_url}
                                        alt={user.name || 'User'}
                                        className="w-full h-full object-cover rounded-full"
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
                                        className="absolute right-0 mt-3 w-60 origin-top-right bg-white rounded-xl shadow-2xl z-20 overflow-hidden ring-1 ring-slate-900/5"
                                        onMouseLeave={() => setDropdownOpen(false)}
                                    >
                                        <div className="p-3">
                                            <div className="px-2 py-2 text-left mb-1 border-b border-slate-100">
                                                <p className="text-base font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
                                                <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                                            </div>

                                            {/* Menu Items */}
                                            <Link
                                                href={profileLink}
                                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <User className="w-4 h-4 text-indigo-500" />Company Profile
                                            </Link>

                                            <Link
                                                href="/company/edit-profile"
                                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <Settings className="w-4 h-4 text-indigo-500" /> Edit Profile
                                            </Link>

                                            <Link
                                                href="/company/support"
                                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                                            >
                                                <Bell className="w-4 h-4 text-indigo-500" /> Support
                                            </Link>
                                            
                                            <div className="h-px bg-slate-200 my-2" />

                                            <button
                                                onClick={onLogoutClick}
                                                className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" /> Logout
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Drawer Component */}
            <ChatDrawer 
                user={user}
                chatOpen={chatOpen} 
                setChatOpen={setChatOpen} 
                selectedUserId={selectedUserId} 
                setSelectedUserId={setSelectedUserId} 
                chatMessages={chatMessages} 
                chats={chats} 
                handleSelectChat={handleSelectChat} 
                handleSendMessage={handleSendMessage} 
                newMessage={newMessage} 
                setNewMessage={setNewMessage} 
                scrollRef={scrollRef} 
            />
        </>
    );
}