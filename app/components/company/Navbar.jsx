'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { 
    Bell, 
    MessageSquare, 
    Menu, 
    Settings, 
    LogOut, 
    User, 
    Send, 
    ArrowLeft, 
    ShieldCheck, 
    Clock, 
    X, 
    ChevronRight 
} from 'lucide-react';
import { useChatStore } from '../../stores/useChatStore';

// --- SUB-COMPONENT: CHAT DRAWER ---
function ChatDrawer({ user, open, setOpen, selectedId, setSelectedId, messages, chats, onSelectChat, onFetchMessages, onSend, scrollRef }) {
    const [text, setText] = useState('');
    const selectedChat = chats.find(c => c.id === selectedId);

    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={() => setOpen(false)} 
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
                    />
                    
                    {/* Drawer Panel */}
                    <motion.div 
                        initial={{ x: '100%' }} 
                        animate={{ x: 0 }} 
                        exit={{ x: '100%' }} 
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
                        className="relative w-full max-w-[350px] sm:max-w-sm bg-white h-full shadow-2xl flex flex-col border-l border-slate-100"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               {selectedId && (
                                   <button onClick={() => setSelectedId(null)} className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                                       <ArrowLeft size={16}/>
                                   </button>
                               )}
                               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                   {selectedChat ? selectedChat.name : "Communication Hub"}
                               </h3>
                            </div>
                            <button onClick={() => setOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 rounded-xl">
                                <X size={20}/>
                            </button>
                        </div>

                        {/* Content Area */}
                        {!selectedId ? (
                            /* Chat List */
                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                {chats.length === 0 ? (
                                    <div className="h-40 flex flex-col items-center justify-center opacity-40">
                                        <MessageSquare size={32} className="mb-2" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">No active nodes</p>
                                    </div>
                                ) : (
                                    chats.map(c => (
                                        <button key={c.id} onClick={() => { onSelectChat(c.id); onFetchMessages(c.id); }} className="flex items-center gap-4 w-full p-4 rounded-[20px] hover:bg-blue-50/50 transition-all border border-transparent hover:border-blue-100 group">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 p-0.5 shadow-sm">
                                                <div className="w-full h-full rounded-[14px] overflow-hidden bg-white flex items-center justify-center border-2 border-white relative">
                                                    {c.profile_image_url ? (
                                                        <img src={c.profile_image_url} alt="" className="object-cover w-full h-full" />
                                                    ) : (
                                                        <span className="text-sm font-black text-blue-600">{c.name?.[0]}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-left min-w-0 flex-1">
                                                <p className="text-xs font-black text-slate-900 uppercase truncate">{c.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-widest">Ready for link</p>
                                            </div>
                                            <ChevronRight size={14} className="text-slate-200 group-hover:text-blue-400" />
                                        </button>
                                    ))
                                )}
                            </div>
                        ) : (
                            /* Conversation View */
                            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/30">
                                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                    {messages.map((msg, idx) => {
                                        const isMe = msg.sender_id === user.id;
                                        return (
                                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] p-4 rounded-2xl text-[13px] font-bold leading-relaxed shadow-sm ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {/* Message Input */}
                                <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                                    <input 
                                        type="text" 
                                        value={text} 
                                        onChange={e => setText(e.target.value)} 
                                        onKeyDown={e => { if(e.key === 'Enter') { onSend(selectedId, text); setText(''); } }}
                                        placeholder="Transmit data..." 
                                        className="flex-1 bg-slate-50 border-none rounded-xl py-3.5 px-4 text-xs font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-600/5 transition-all" 
                                    />
                                    <button 
                                        onClick={() => { onSend(selectedId, text); setText(''); }}
                                        className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95"
                                    >
                                        <Send size={18}/>
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// --- MAIN NAV COMPONENT ---
export default function Navbar({ user, onMenuButtonClick, onLogoutClick, pageTitle }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const scrollRef = useRef(null);

    const { chats, messages, fetchChats, fetchMessages, sendMessage, subscribeToUser } = useChatStore();

    useEffect(() => {
        if (user) { fetchChats(); subscribeToUser(); }
    }, [user, fetchChats, subscribeToUser]);

    const chatMessages = useMemo(() => messages[selectedUserId] || [], [messages, selectedUserId]);

    return (
        <header className="h-20 bg-white border-b border-slate-100 px-4 sm:px-6 flex items-center justify-between shrink-0 relative z-40">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button onClick={onMenuButtonClick} className="lg:hidden p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">
                    <Menu size={22} />
                </button>
                <div>
                    <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{pageTitle || "Terminal"}</h1>
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Hub</span>
                    </div>
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Communication Toggle */}
                <button onClick={() => { setChatOpen(true); setSelectedUserId(null); }} className="relative p-2.5 text-slate-400 hover:text-blue-600 transition-all group">
                    <MessageSquare size={20} />
                    {chats.length > 0 && (
                        <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white shadow-sm" />
                    )}
                </button>

                <button className="p-2.5 text-slate-400 hover:text-blue-600 transition-colors hidden sm:flex">
                    <Bell size={20} />
                </button>

                <div className="h-8 w-px bg-slate-100 mx-1 hidden sm:block" />

                {/* Profile Node */}
                <div className="relative">
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="relative w-9 h-9 rounded-xl p-0.5 bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-sm">
                           <div className="w-full h-full rounded-[10px] overflow-hidden bg-white flex items-center justify-center border-2 border-white relative">
                              {user?.profile_image_url ? (
                                  <img src={user.profile_image_url} alt="Profile" className="object-cover w-full h-full" />
                              ) : (
                                  <span className="text-sm font-black text-blue-600">{user?.name?.[0]}</span>
                              )}
                           </div>
                        </div>
                    </button>

                    <AnimatePresence>
                        {dropdownOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                exit={{ opacity: 0, y: 10 }} 
                                className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-[28px] shadow-2xl overflow-hidden z-50"
                            >
                                <div className="p-5 bg-slate-50/50 border-b border-slate-100">
                                    <p className="text-xs font-black text-slate-900 uppercase truncate">{user?.name}</p>
                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Merchant Node</p>
                                </div>
                                <div className="p-2">
                                    <Link href="/company/profile-company" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors">
                                        <User size={16} /> Node Details
                                    </Link>
                                    <Link href="/company/edit-profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-xs uppercase tracking-widest transition-colors">
                                        <Settings size={16} /> Hub Config
                                    </Link>
                                    <div className="h-px bg-slate-50 my-1 mx-2" />
                                    <button onClick={onLogoutClick} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-500 font-bold text-xs uppercase transition-colors tracking-widest">
                                        <LogOut size={16} /> End Session
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Chat Drawer Interface */}
            <ChatDrawer 
                user={user} 
                open={chatOpen} 
                setOpen={setChatOpen} 
                selectedId={selectedUserId} 
                setSelectedId={setSelectedUserId} 
                messages={chatMessages} 
                chats={chats} 
                onSelectChat={setSelectedUserId} 
                onFetchMessages={fetchMessages} 
                onSend={sendMessage} 
                scrollRef={scrollRef} 
            />
        </header>
    );
}