import React from 'react';

export default function StatCard({ title, count, icon }) {
    // تبدیل عدد به فارسی (حتی اگر استرینگ باشد)
    const farsiCount = Number(count).toLocaleString('fa-IR');

    return (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between transition-hover hover:shadow-md">
            <div className="flex flex-col text-right">
                <span className="text-slate-400 text-xs font-bold mb-1">{title}</span>
                <span className="text-2xl font-black text-slate-800">{farsiCount}</span>
            </div>
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                {icon}
            </div>
        </div>
    );
}