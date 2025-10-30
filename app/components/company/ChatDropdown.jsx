// 'use client';
// import { AnimatePresence, motion } from 'framer-motion';

// export default function ChatPanel({ isOpen, onClose }) {
//   const messages = [
//     { sender: 'Alice', text: 'Hello!', time: '1m ago' },
//     { sender: 'Bob', text: 'Check report.', time: '5m ago' },
//     { sender: 'Charlie', text: 'Meeting 3PM', time: '10m ago' },
//   ];

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//           {/* Overlay */}
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.5 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.2 }}
//             className="fixed inset-0 bg-black z-40"
//             onClick={onClose}
//           />

//           {/* Panel */}
//           <motion.div
//             initial={{ x: '100%' }}
//             animate={{ x: 0 }}
//             exit={{ x: '100%' }}
//             transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//             className="fixed top-0 right-0 z-50 h-full w-96 bg-white shadow-xl flex flex-col"
//           >
//             {/* Header */}
//             <div className="flex items-center justify-between p-4 border-b border-slate-200">
//               <h3 className="text-lg font-semibold">Messages</h3>
//               <button
//                 onClick={onClose}
//                 className="text-slate-500 hover:text-slate-800 font-bold"
//               >
//                 ×
//               </button>
//             </div>

//             {/* Messages */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-4">
//               {messages.map((msg, i) => (
//                 <div key={i} className="flex items-start gap-3">
//                   <div className="w-10 h-10 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold">
//                     {msg.sender[0]}
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm font-semibold text-slate-800">{msg.sender}</p>
//                     <p className="text-sm text-gray-600">{msg.text}</p>
//                     <span className="text-xs text-gray-400">{msg.time}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Input */}
//             <div className="p-4 border-t border-slate-200">
//               <input
//                 type="text"
//                 placeholder="Type a message..."
//                 className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// }
