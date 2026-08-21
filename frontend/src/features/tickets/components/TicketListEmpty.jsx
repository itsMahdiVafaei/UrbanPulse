import React from 'react';
import { ClipboardList } from 'lucide-react';

export default function TicketListEmpty() {
    return (
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <ClipboardList className="text-slate-300" size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">هنوز هیچ درخواستی ثبت نکرده‌اید</h3>
            <p className="text-slate-400 text-sm mb-6">درخواست‌های شما پس از ثبت، در این قسمت نمایش داده می‌شوند.</p>
            <button className="text-blue-600 font-black text-sm hover:underline cursor-pointer">مشاهده راهنمای استفاده از سامانه</button>
        </div>
    );
}