import React, { useState } from 'react';
import { X, ShieldCheck, BarChart3, Settings, LogOut, Calendar, Clock } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/authSlice';
import UserSettingsModal from '../../tickets/components/UserSettingsModal';
import AdminStatsModal from './AdminStatsModal';

export default function AdminSidebar({ isOpen, onClose, user, persianDate, persianTime }) {
    const dispatch = useDispatch();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isStatsOpen, setIsStatsOpen] = useState(false);

    return (
        <>
            <div className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

            <div className={`fixed top-0 right-0 h-full w-80 bg-white z-[160] shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>

                <div className="p-8 bg-linear-to-br from-indigo-600 to-indigo-900 text-white">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10"><ShieldCheck size={32} /></div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl cursor-pointer"><X size={24} /></button>
                    </div>
                    <p className="text-xs opacity-80 mb-1 font-bold">مدیر سامانه نبض شهر</p>
                    <h3 className="font-black text-xl tracking-tight truncate">{user?.name || user?.identifier}</h3>
                </div>

                <nav className="flex-1 p-4 space-y-2" dir="rtl">
                    <button onClick={() => setIsStatsOpen(true)} className="w-full flex items-center gap-3 p-4 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all font-bold text-sm cursor-pointer group">
                        <BarChart3 size={20} className="text-slate-400 group-hover:text-indigo-600" />
                        <span>گزارشات و آمار تحلیلی</span>
                    </button>

                    <button onClick={() => setIsSettingsOpen(true)} className="w-full flex items-center gap-3 p-4 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all font-bold text-sm cursor-pointer group">
                        <Settings size={20} className="text-slate-400 group-hover:text-indigo-600" />
                        <span>تنظیمات پنل مدیریت</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <button onClick={() => { dispatch(logout()); onClose(); }} className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-sm cursor-pointer">
                        <LogOut size={20} /> خروج از مدیریت
                    </button>
                </div>
            </div>

            {isSettingsOpen && <UserSettingsModal user={user} onClose={() => setIsSettingsOpen(false)} />}
            {isStatsOpen && <AdminStatsModal onClose={() => setIsStatsOpen(false)} />}
        </>
    );
}