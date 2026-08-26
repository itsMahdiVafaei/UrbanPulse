import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({ label, type = 'text', className = '', ...props }) {
    // استیت برای مدیریت نمایش یا مخفی بودن پسورد
    const [showPassword, setShowPassword] = useState(false);

    // اگر نوع فیلد پسورد است و کاربر روی چشم کلیک کرده، نوع فیلد را موقتاً به text تغییر بده
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
        <div className="flex flex-col space-y-1 relative w-full">
            {/* رندر کردن لیبل در صورت وجود */}
            {label && (
                <label className="text-xs font-black text-slate-500 pr-1 block mb-1.5">
                    {label}
                </label>
            )}

            <div className="relative w-full">
                <input
                    type={inputType}
                    // اگر فیلد پسورد است، از سمت چپ پدینگ بیشتری می‌دهیم تا متن زیر آیکون چشم نرود (pl-11)
                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-indigo-500 transition-colors ${type === 'password' ? 'pl-11' : ''} ${className}`}
                    {...props}
                />

                {/* دکمه چشم فقط زمانی رندر می‌شود که type پاس داده شده password باشد */}
                {type === 'password' && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer p-1"
                        tabIndex="-1" // جلوگیری از فوکوس شدن با دکمه تب کیبورد
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
        </div>
    );
}