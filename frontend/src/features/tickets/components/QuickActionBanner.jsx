import React, { useState } from 'react';
import { Plus, ShieldAlert } from 'lucide-react';
import { useSelector } from 'react-redux';

export default function QuickActionBanner({ onOpenModal }) {
    const { user } = useSelector(state => state.auth);
    // گرفتن لیست شهروندان از ادمین برای چک کردن وضعیت لحظه‌ای
    const citizens = useSelector(state => state.admin?.citizens || []);

    // پیدا کردن کاربر فعلی در لیست ادمین بر اساس شماره تماس (identifier)
    const currentCitizen = citizens.find(c => c.phone === user?.identifier || c.phone === user?.phone);
    const isBlocked = currentCitizen?.status === 'BLOCKED';

    const [showToast, setShowToast] = useState(false);

    const handleBtnClick = () => {
        if (isBlocked) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
            return;
        }
        onOpenModal();
    };

    return (
        <div className="relative">
            {showToast && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[500] animate-in slide-in-from-top-10 duration-500 w-[90%] max-w-md">
                    <div className="bg-red-600 text-white p-5 rounded-[2rem] shadow-2xl flex items-start gap-4 border-4 border-white/20 backdrop-blur-md">
                        <ShieldAlert size={40} className="shrink-0 animate-bounce" />
                        <div>
                            <p className="font-black text-sm mb-1">دسترسی مسدود شده است</p>
                            <p className="text-[10px] leading-5 opacity-90">حساب کاربری شما به دلیل تخلف توسط مدیریت مسدود شده است. امکان ثبت درخواست جدید وجود ندارد.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className={`bg-linear-to-l from-blue-600 to-blue-800 rounded-4xl p-8 text-white mb-8 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 ${isBlocked ? 'grayscale opacity-70' : ''}`}>
                <div className="text-right">
                    <h2 className="text-2xl font-black mb-2">گزارش مشکل شهری</h2>
                    <p className="text-blue-100 text-sm opacity-90">درخواست‌های شما مستقیماً به واحد عملیاتی ارجاع می‌شود.</p>
                </div>

                <button
                    onClick={handleBtnClick}
                    className={`relative z-10 py-4 px-10 rounded-2xl flex items-center gap-2 text-lg font-black transition-all
                    ${isBlocked
                        ? 'bg-slate-500 text-slate-300 cursor-not-allowed'
                        : 'bg-amber-400 hover:bg-amber-300 text-blue-900 cursor-pointer hover:scale-105 active:scale-95'}`}
                >
                    <Plus size={24} />
                    <span>{isBlocked ? 'حساب مسدود است' : 'ثبت درخواست جدید'}</span>
                </button>
            </div>
        </div>
    );
}