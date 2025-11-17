"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Bell, CreditCard, Shield, Trash2, ArrowLeft } from 'lucide-react';

// --- Utility Components for Styling ---

// Placeholder Switch component for toggles
const Switch = ({ enabled, setEnabled, label }) => (
  <div className="flex items-center justify-between p-4 border-b last:border-b-0">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      className={`${enabled ? 'bg-indigo-600' : 'bg-gray-200'}
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      role="switch"
      aria-checked={enabled}
    >
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-5' : 'translate-x-0'}
          pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  </div>
);

// Main Section Card Wrapper
const SettingSection = ({ title, icon: Icon, children, id }) => (
    <div id={id} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 mb-10 transition duration-300 hover:shadow-lg">
        <div className="flex items-center mb-6 pb-3 border-b border-indigo-100">
            <Icon className="w-6 h-6 text-indigo-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        {children}
    </div>
);


export default function CompanySettingsPage() {
    const router = useRouter();
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [emailNotification, setEmailNotification] = useState(true);

    // Mock handler for password change
    const handleChangePassword = (e) => {
        e.preventDefault();
        // Add password change logic here
        alert("Password change form submitted (Placeholder)");
    };

  return (
    <div className="min-h-screen  p-6 sm:p-10">
      <div className="max-w-full mx-auto">
        
        {/* Header and Back Button */}
        <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">
                Company Settings
            </h1>
            <button
                onClick={() => router.push("/company/profile-company")}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 rounded-full border border-gray-300 hover:bg-gray-100 transition"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Profile
            </button>
        </div>

        {/* Quick Navigation / Table of Contents */}
        <nav className="flex space-x-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100 mb-10">
            <a href="#security" className="text-indigo-600 font-medium hover:text-indigo-800 transition text-sm">Security</a>
            <a href="#billing" className="text-indigo-600 font-medium hover:text-indigo-800 transition text-sm">Subscription & Billing</a>
            <a href="#notifications" className="text-indigo-600 font-medium hover:text-indigo-800 transition text-sm">Notifications</a>
            <a href="#danger" className="text-red-600 font-medium hover:text-red-800 transition text-sm">Danger Zone</a>
        </nav>

        {/* 1. Account Security */}
        <SettingSection title="Account Security" icon={Shield} id="security">
            
            {/* Change Password Form */}
            <form onSubmit={handleChangePassword} className="space-y-6">
                <p className="text-gray-600 text-sm mb-4">Manage your login credentials for enhanced security.</p>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input type="password" required className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input type="password" required className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input type="password" required className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                
                <div className="pt-4">
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-full border border-transparent bg-indigo-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition"
                    >
                        Update Password
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Two-Factor Authentication (2FA)</h3>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-2">
                    <Switch 
                        enabled={twoFactorEnabled} 
                        setEnabled={setTwoFactorEnabled} 
                        label="Enable authentication app login" 
                    />
                    <p className="text-xs text-gray-500 px-4 pt-1">
                        Two-factor authentication adds an extra layer of security to your account.
                    </p>
                </div>
            </div>
            
        </SettingSection>

        {/* 2. Billing & Subscription */}
        <SettingSection title="Subscription & Billing" icon={CreditCard} id="billing">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Plan</h3>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 flex justify-between items-center mb-6">
                <div>
                    <p className="text-sm font-medium text-indigo-700">Professional Plan</p>
                    <p className="text-xs text-indigo-600 mt-1">
                        $99/month - Billed annually. Renews on Jan 1, 2025.
                    </p>
                </div>
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-800">
                    Active
                </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3 pt-4 border-t border-gray-100">Payment Information</h3>
            <p className="text-gray-600 text-sm mb-4">
                All billing information is managed securely by our payment provider.
            </p>
            <button
                className="inline-flex items-center rounded-full border border-transparent bg-gray-800 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-gray-900 transition"
            >
                Manage Billing Portal
            </button>
            
        </SettingSection>

        {/* 3. Notifications */}
        <SettingSection title="Notification Preferences" icon={Bell} id="notifications">
            <p className="text-gray-600 text-sm mb-4">
                Control how you receive updates regarding new leads, status changes, and platform announcements.
            </p>

            <div className="bg-white rounded-lg border border-gray-200">
                <Switch 
                    enabled={emailNotification} 
                    setEnabled={setEmailNotification} 
                    label="Receive emails for critical alerts" 
                />
                <Switch 
                    enabled={true} 
                    setEnabled={() => {}} // Disabled switch for demonstration
                    label="Marketing and promotional emails" 
                />
                <Switch 
                    enabled={false} 
                    setEnabled={() => {}} 
                    label="Push notifications on mobile (requires app login)" 
                />
            </div>
        </SettingSection>

        {/* 4. Danger Zone */}
        <SettingSection title="Danger Zone" icon={Trash2} id="danger">
            <div className="p-6 border-2 border-red-300 bg-red-50 rounded-xl flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-red-800 mb-1">Delete Company Account</h3>
                    <p className="text-sm text-red-700">
                        Permanently remove your company profile and all associated data. This action is irreversible.
                    </p>
                </div>
                <button
                    className="inline-flex items-center rounded-full border border-transparent bg-red-600 py-2 px-6 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition flex-shrink-0"
                >
                    Delete Account
                </button>
            </div>
        </SettingSection>

      </div>
    </div>
  );
}