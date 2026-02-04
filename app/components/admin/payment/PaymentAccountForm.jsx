"use client"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const PaymentAccountForm = ({ isOpen, onClose, editingPayment, onSave }) => {
  const [accountName, setAccountName] = useState("")
  const [accountId, setAccountId] = useState("")
  const [typeValue, setTypeValue] = useState("")
  const [accountCity, setAccountCity] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [status, setStatus] = useState(true)

  useEffect(() => {
    if (editingPayment) {
      setAccountName(editingPayment.account_name || "");
      setAccountId(editingPayment.account_id || "");
      setTypeValue(editingPayment.type_value || "");
      setAccountCity(editingPayment.account_city || "");
      setCurrency(editingPayment.currency || "USD");
      setStatus(!!editingPayment.status);
    } else {
      setAccountName(""); 
      setAccountId(""); 
      setTypeValue(""); 
      setAccountCity(""); 
      setCurrency("USD"); 
      setStatus(true);
    }
  }, [editingPayment, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] w-full max-w-2xl relative z-10 shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto">
          
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editingPayment ? "Update Payment Account" : "Add Payment Account"}</h2>
             <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20}/></button>
          </div>

          <form onSubmit={(e) => { 
            e.preventDefault(); 
            onSave({ 
              id: editingPayment?.id, 
              account_name: accountName, 
              account_id: accountId, 
              type_value: typeValue, 
              account_city: accountCity, 
              currency, 
              status 
            }); 
          }} className="p-8 space-y-4">
            
            {/* Account Name */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">Account Name</label>
              <input 
                type="text" 
                value={accountName} 
                onChange={(e) => setAccountName(e.target.value)} 
                required 
                placeholder="e.g. Main Bakong Account"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
              />
            </div>

            {/* Account ID */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">Account ID</label>
              <input 
                type="text" 
                value={accountId} 
                onChange={(e) => setAccountId(e.target.value)} 
                required 
                placeholder="e.g. merchant@bakong"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
              />
            </div>

            {/* Type Value */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">Payment Type</label>
              <input 
                type="text" 
                value={typeValue} 
                onChange={(e) => setTypeValue(e.target.value)} 
                required 
                placeholder="e.g. BAKONG, VISA, MASTERCARD"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
              />
            </div>

            {/* Account City */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">City (Optional)</label>
              <input 
                type="text" 
                value={accountCity} 
                onChange={(e) => setAccountCity(e.target.value)} 
                placeholder="e.g. Phnom Penh"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
              />
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">Currency</label>
              <select
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)} 
                required
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
              >
                <option value="USD">USD</option>
                <option value="KHR">KHR</option>
              </select>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div>
                  <p className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">Account Status</p>
                  <p className="text-[11px] font-medium text-slate-400 uppercase">Set account as {status ? 'Active' : 'Disabled'}</p>
               </div>
               <button
                  type="button"
                  onClick={() => setStatus(!status)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${status ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-300'}`}
               >
                  <span className={`${status ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out underline-none`} />
               </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <button type="button" onClick={onClose} className="py-4 bg-slate-50 text-slate-400 rounded-2xl text-[13px] font-bold uppercase tracking-widest hover:bg-slate-100">Cancel</button>
               <button type="submit" className="py-4 bg-slate-900 text-white rounded-2xl text-[13px] font-bold uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all">
                  {editingPayment ? "Update Account" : "Create Account"}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default PaymentAccountForm
