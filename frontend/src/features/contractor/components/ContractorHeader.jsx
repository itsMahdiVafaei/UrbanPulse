import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { HardHat, Menu, Settings } from 'lucide-react';

export default function ContractorHeader({ onOpenMenu }) {
    const { user } = useSelector((state) => state.auth);
    const [timeStrings, setTimeStrings] = useState({ date: '', time: '' });

    useEffect(() => {
        const formatter = new Intl.DateTimeFormat('fa-IR', {
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
        });

        const updateDateTime = () => {
            const now = new Date();
            const parts = formatter.formatToParts(now);
            const persianDate = `${parts.find(p => p.type === 'weekday').value}، ${parts.find(p => p.type === 'day').value} ${parts.find(p => p.type === 'month').value} ${parts.find(p => p.type === 'year').value}`;
            const persianTime = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            setTimeStrings({ date: persianDate, time: persianTime });
        };

        updateDateTime();
        const timer = setInterval(updateDateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4 sticky top-0 z-40 shadow-xs">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* سمت راست: لوگو مخصوص پیمانکار */}
                <div className="flex items-center gap-3 shrink-0">
                    <div className="bg-amber-500 p-2 rounded-xl text-white shadow-lg shadow-amber-200">
                        <HardHat size={20} />
                    </div>
                    <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">پنل عملیاتی اکیپ</h1>
                </div>

                {/* سمت چپ: اطلاعات و زمان */}
                <div className="flex items-center gap-4 sm:gap-8">

                    {/* بخش تاریخ و ساعت   */}
                    <div className="hidden md:flex items-center gap-3 bg-slate-50/50 px-4 py-2 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                            <span className="text-[10px] font-black text-amber-600/60 uppercase">امروز:</span>
                            <span className="text-xs font-black text-slate-700 whitespace-nowrap">{timeStrings.date}</span>
                        </div>
                        <div className="bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 shadow-xs">
                            <span className="text-amber-600 text-[11px] font-black tabular-nums tracking-widest">{timeStrings.time}</span>
                        </div>
                    </div>

                    {/* پیام خوش‌آمدگویی */}
                    <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-0.5">
                      رسته تخصصی: {user?.category || 'عملیاتی'}
                     </span>
                        <span className="text-sm font-black text-slate-700 whitespace-nowrap">
                       <span className="text-amber-600">{user?.headName || user?.name || user?.identifier}</span> عزیز، خوش آمدید
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* دکمه تنظیمات */}
                        <button onClick={onOpenMenu} className="hidden md:flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 hover:text-amber-600 rounded-xl transition-all cursor-pointer border border-slate-200 shadow-xs group">
                            <Settings size={18} className="group-hover:rotate-90 transition-transform duration-500" />
                            <span className="text-xs font-black">تنظیمات</span>
                        </button>

                        {/* همبرگر موبایل */}
                        <button onClick={onOpenMenu} className="md:hidden p-2.5 bg-slate-50 text-slate-600 rounded-xl border border-slate-200 cursor-pointer">
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}