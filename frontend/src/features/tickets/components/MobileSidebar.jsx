import React, { useState } from 'react';
import { X, User, ShieldCheck, LogOut, Calendar, Clock, Info, Settings } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../auth/authSlice';
import UserSettingsModal from './UserSettingsModal';

export default function MobileSidebar({ isOpen, onClose, user, persianDate, persianTime }) {
    const dispatch = useDispatch();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    return (
        <>
            {/* لایه تیره پشت منو (Overlay) */}
            <div
                className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* بدنه اصلی منوی کشویی */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-white z-[160] shadow-2xl transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>

                {/* بخش بالایی: پروفایل کاربر */}
                <div className="p-8 bg-linear-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
                    {/* المان تزیینی پشت زمینه */}
                    <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mt-16"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                            <User size={32} />
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="relative z-10">
                        <h3 className="font-black text-xl tracking-tight truncate">
                            {user?.name || user?.identifier || 'کاربر گرامی'}
                        </h3>
                        <p className="text-xs opacity-80 mb-1 font-bold">به نبض شهر خوش آمدید.</p>
                    </div>
                </div>

                {/* بخش تاریخ و ساعت (نمایش مخصوص موبایل) */}
                <div className="md:hidden p-5 bg-slate-50 border-b border-slate-100 flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-slate-500">
                        <div className="bg-white p-1.5 rounded-lg shadow-xs border border-slate-100"><Calendar size={14} /></div>
                        <span className="text-[11px] font-bold">{persianDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-blue-600">
                        <div className="bg-blue-50 p-1.5 rounded-lg border border-blue-100"><Clock size={14} /></div>
                        <span className="text-[11px] font-black tracking-widest tabular-nums">{persianTime}</span>
                    </div>
                </div>

                {/* لیست منوها */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto" dir="rtl">
                    <button
                        onClick={() => { setIsSettingsOpen(true); }}
                        className="w-full flex items-center gap-3 p-4 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all font-bold text-sm cursor-pointer group"
                    >
                        <div className="text-slate-400 group-hover:text-blue-500 transition-colors"><Settings size={20} /></div>
                        <span>تنظیمات حساب کاربری</span>
                    </button>

                    <button
                        onClick={() => setIsAboutOpen(true)}
                        className="w-full flex items-center gap-3 p-4 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all font-bold text-sm cursor-pointer group"
                    >
                        <div className="text-slate-400 group-hover:text-blue-500 transition-colors"><Info size={20} /></div>
                        <span>درباره سامانه نبض شهر</span>
                    </button>
                </nav>

                {/* بخش خروج (پایین‌ترین بخش) */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={() => { dispatch(logout()); onClose(); }}
                        className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-sm cursor-pointer group"
                    >
                        <div className="p-2 bg-red-50 group-hover:bg-red-100 rounded-xl transition-colors">
                            <LogOut size={20} />
                        </div>
                        خروج از حساب کاربری
                    </button>
                </div>
            </div>

            {/* --- فراخوانی مودال تنظیمات --- */}
            {isSettingsOpen && (
                <UserSettingsModal
                    user={user}
                    onClose={() => setIsSettingsOpen(false)}
                />
            )}

            {/* --- مودال درباره ما (ساده) --- */}
            {isAboutOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 text-center animate-in zoom-in-95 duration-300">
                        <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-200 font-black text-2xl">N</div>
                        <h2 className="text-xl font-black text-slate-800">نبض شهر</h2>
                        <p className="text-xs text-slate-400 font-bold mb-6">نسخه ۱.۰.۰ (Frontend Edition)</p>
                        <p className="text-sm text-slate-600 leading-7 text-justify" dir="rtl">
                            این سامانه بستری هوشمند برای تعامل مستقیم شهروندان با شهرداری است. هدف ما ارتقای کیفیت خدمات شهری و شفافیت در رسیدگی به مشکلات شماست.
                        </p>
                        <button onClick={() => setIsAboutOpen(false)} className="mt-8 w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-sm transition-all cursor-pointer">بستن</button>
                    </div>
                </div>
            )}
        </>
    );
}