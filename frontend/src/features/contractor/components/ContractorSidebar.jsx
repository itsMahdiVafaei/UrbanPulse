import React, { useState } from 'react';
import { X, HardHat, LogOut, Settings, Info, ClipboardList } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/authSlice';
import UserSettingsModal from '../../tickets/components/UserSettingsModal';

export default function ContractorSidebar({ isOpen, onClose, user }) {
    const dispatch = useDispatch();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar Content */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white z-[160] shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>

                {/* Header: Contractor Info */}
                <div className="p-8 bg-linear-to-br from-amber-500 to-amber-700 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mt-16"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                            <HardHat size={32} />
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl cursor-pointer text-white">
                            <X size={24} />
                        </button>
                    </div>
                    <p className="text-xs opacity-80 mb-1 font-bold">پنل عملیاتی اکیپ،</p>
                    <h3 className="font-black text-xl tracking-tight truncate">{user?.name || user?.identifier}</h3>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto" dir="rtl">
                    <button className="w-full flex items-center gap-3 p-4 text-amber-600 bg-amber-50 rounded-2xl font-black text-sm cursor-default">
                        <ClipboardList size={20} />
                        <span>لیست مأموریت‌های جاری</span>
                    </button>

                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="w-full flex items-center gap-3 p-4 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all font-bold text-sm cursor-pointer group"
                    >
                        <Settings size={20} className="text-slate-400 group-hover:text-slate-600" />
                        <span>تنظیمات حساب کاربری</span>
                    </button>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-slate-100">
                    <button
                        onClick={() => { dispatch(logout()); onClose(); }}
                        className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-sm cursor-pointer group"
                    >
                        <LogOut size={20} />
                        خروج از پنل عملیاتی
                    </button>
                </div>
            </div>

            {isSettingsOpen && <UserSettingsModal user={user} onClose={() => setIsSettingsOpen(false)} />}
        </>
    );
}