import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { LayoutDashboard, Menu, Settings } from 'lucide-react';
import MobileSidebar from './MobileSidebar';

export default function CitizenHeader() {
    const { user } = useSelector((state) => state.auth);
    const [dateTime, setDateTime] = useState(new Date());
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatter = new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const parts = formatter.formatToParts(dateTime);
    const persianDate = `${parts.find(p => p.type === 'weekday').value}، ${parts.find(p => p.type === 'day').value} ${parts.find(p => p.type === 'month').value} ${parts.find(p => p.type === 'year').value}`;
    const persianTime = dateTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return (
        <>
            <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-xs">
                <div className="max-w-7xl mx-auto flex justify-between items-center">

                    {/* سمت راست: لوگو */}
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg">
                            <LayoutDashboard size={20} />
                        </div>
                        <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">نبض شهر</h1>
                    </div>

                    {/* سمت چپ: دیتای کاربر، تاریخ و تنظیمات */}
                    <div className="flex items-center gap-6">

                        {/* بخش مخصوص دسکتاپ */}
                        <div className="hidden md:flex items-center gap-8">

                            {/* تاریخ و ساعت مهندسی شده */}
                            <div className="flex items-center gap-3 bg-slate-50/50 px-4 py-2 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                                    <span className="text-[10px] font-black text-blue-600/60 uppercase">امروز:</span>
                                    <span className="text-xs font-black text-slate-700 whitespace-nowrap">{persianDate}</span>
                                </div>
                                {/* باکس ساعت متمایز */}
                                <div className="bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 shadow-sm shadow-blue-50">
                                    <span className="text-blue-600 text-[11px] font-black tabular-nums tracking-widest">
                                        {persianTime}
                                    </span>
                                </div>
                            </div>

                            {/* پیام خوش‌آمدگویی  */}
                            <div className="flex items-center">
                            <span className="text-sm font-black text-slate-700 whitespace-nowrap">

                             <span className="text-blue-600">{user?.name || user?.identifier || 'کاربر'}</span> عزیز، خوش آمدید
                            </span>
                            </div>

                            {/* دکمه تنظیمات (بازکننده منو) */}
                            <button
                                onClick={() => setIsMenuOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 rounded-xl transition-all cursor-pointer border border-slate-200 shadow-xs group"
                            >
                                <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                                <span className="text-xs font-black">تنظیمات</span>
                            </button>
                        </div>

                        {/* دکمه همبرگری (موبایل) */}
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="md:hidden p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-600 rounded-xl border border-slate-200 cursor-pointer shadow-xs"
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <MobileSidebar
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                user={user}
                persianDate={persianDate}
                persianTime={persianTime}
            />
        </>
    );
}