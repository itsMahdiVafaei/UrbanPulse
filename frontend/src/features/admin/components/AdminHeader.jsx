import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LayoutDashboard, Menu, Settings, ShieldCheck } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

export default function AdminHeader() {
    const { user } = useSelector((state) => state.auth);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [timeStrings, setTimeStrings] = useState({ date: '', time: '' });

    useEffect(() => {
        const formatter = new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        const update = () => {
            const now = new Date();
            const parts = formatter.formatToParts(now);
            setTimeStrings({
                date: `${parts.find(p => p.type === 'weekday').value}، ${parts.find(p => p.type === 'day').value} ${parts.find(p => p.type === 'month').value} ${parts.find(p => p.type === 'year').value}`,
                time: now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            });
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-xs">
                <div className="max-w-7xl mx-auto flex justify-between items-center">

                    <div className="flex items-center gap-3 shrink-0">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg">
                            <ShieldCheck size={20} />
                        </div>
                        <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">پنل مدیریت</h1>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="hidden md:flex items-center gap-8">
                            {/* ساعت و تاریخ دسکتاپ */}
                            <div className="flex items-center gap-3 bg-slate-50/50 px-4 py-2 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                                    <span className="text-[10px] font-black text-blue-600/60">امروز:</span>
                                    <span className="text-xs font-black text-slate-700 whitespace-nowrap">{timeStrings.date}</span>
                                </div>
                                <div className="bg-blue-100/50 px-2.5 py-1 rounded-lg border border-blue-200 shadow-xs">
                                    <span className="text-blue-700 text-[11px] font-black tabular-nums tracking-widest">{timeStrings.time}</span>
                                </div>
                            </div>

                            {/* خوش‌آمدگویی مدیر */}
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">مدیر سامانه</span>
                                <span className="text-sm font-black text-slate-700 whitespace-nowrap">
                                    <span className="text-indigo-600">{user?.name || user?.identifier || 'مدیر'}</span> عزیز، خوش آمدید
    </span>
                            </div>

                            {/* دکمه تنظیمات */}
                            <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-indigo-600 rounded-xl transition-all cursor-pointer border border-slate-200 shadow-xs group">
                                <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                                <span className="text-xs font-black">تنظیمات</span>
                            </button>
                        </div>

                        {/* دکمه همبرگری فقط در موبایل */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="md:hidden p-2.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-200 cursor-pointer"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <AdminSidebar
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                user={user}
                persianDate={timeStrings.date}
                persianTime={timeStrings.time}
            />
        </>
    );
}