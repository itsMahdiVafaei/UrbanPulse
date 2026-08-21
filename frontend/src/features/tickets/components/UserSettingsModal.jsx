import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '../../auth/authSlice';
import { updateCitizenProfile } from '../../admin/adminSlice';
import { X, User, Mail, Phone, Lock, Save, AlertCircle } from 'lucide-react';
import Input from '../../../components/ui/Input';

export default function UserSettingsModal({ user, onClose }) {
    const dispatch = useDispatch();

    // مقداردهی اولیه دقیق بر اساس دیتای موجود در ریداکس
    const [formData, setFormData] = useState({
        name: user?.name || '',          // نام و نام خانوادگی
        email: user?.email || '',        // پست الکترونیک
        phone: user?.phone || user?.identifier || '',   // شماره تماس (شناسه اصلی)
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    // تابع اعتبارسنجی فول مهندسی
    const validate = () => {
        let e = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name || formData.name.length < 3) e.name = "نام کامل الزامی است (حداقل ۳ حرف)";
        if (formData.email && !emailRegex.test(formData.email)) e.email = "فرمت پست الکترونیک صحیح نیست";

        if (formData.newPassword) {
            if (formData.newPassword.length < 6) e.newPassword = "رمز عبور جدید باید حداقل ۶ کاراکتر باشد";
            if (formData.newPassword !== formData.confirmPassword) e.confirmPassword = "تکرار رمز عبور با رمز جدید مطابقت ندارد";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (validate()) {
            const updatedData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone // شماره همراه به عنوان کلید یکتا ثابت می‌ماند
            };

            // ۱. به‌روزرسانی اطلاعات پروفایل جاری (برای هدر و سایدبار)
            dispatch(updateUserProfile(updatedData));

            // ۲. به‌روزرسانی اطلاعات در لیست کل شهروندان (برای پنل ادمین)
            dispatch(updateCitizenProfile(updatedData));

            alert("تغییرات با موفقیت در پروفایل و سوابق سیستمی شما ثبت شد.");
            onClose(); // بستن مودال بعد از موفقیت
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-auto border border-white/20">

                {/* Header */}
                <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-200">
                            <User size={20}/>
                        </div>
                        <div className="text-right">
                            <h2 className="font-black text-slate-800 text-lg leading-none">تنظیمات حساب کاربری</h2>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Account Settings</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors cursor-pointer"
                    >
                        <X size={24}/>
                    </button>
                </div>

                <form onSubmit={handleSave} className="p-10 space-y-6 text-right" dir="rtl">

                    {/* بخش اطلاعات هویتی */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <Input
                                    label="نام و نام خانوادگی"
                                    value={formData.name}
                                    onChange={e => {
                                        setFormData({...formData, name: e.target.value});
                                        if (errors.name) setErrors({...errors, name: null});
                                    }}
                                />
                                {errors.name && <ErrorText msg={errors.name} />}
                            </div>
                            <div className="space-y-1">
                                <Input
                                    label="شماره همراه (شناسه سیستمی)"
                                    value={formData.phone}
                                    readOnly
                                    className="bg-slate-50 text-slate-400 cursor-not-allowed opacity-70"
                                />
                                <p className="text-[9px] text-slate-400 pr-1 italic">تغییر شماره فقط توسط واحد IT امکان‌پذیر است.</p>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Input
                                label="آدرس پست الکترونیک (ایمیل)"
                                placeholder="example@mail.com"
                                value={formData.email}
                                onChange={e => {
                                    setFormData({...formData, email: e.target.value});
                                    if (errors.email) setErrors({...errors, email: null});
                                }}
                            />
                            {errors.email && <ErrorText msg={errors.email} />}
                        </div>
                    </div>

                    {/* بخش امنیت و رمز عبور */}
                    <div className="space-y-4 pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-2 mb-2">
                            <Lock size={14} className="text-indigo-500" />
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">تغییر کلمه عبور</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <Input
                                    label="رمز عبور جدید"
                                    type="password"
                                    placeholder="******"
                                    value={formData.newPassword}
                                    onChange={e => setFormData({...formData, newPassword: e.target.value})}
                                />
                                {errors.newPassword && <ErrorText msg={errors.newPassword} />}
                            </div>
                            <div className="space-y-1">
                                <Input
                                    label="تکرار رمز عبور جدید"
                                    type="password"
                                    placeholder="******"
                                    value={formData.confirmPassword}
                                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                                />
                                {errors.confirmPassword && <ErrorText msg={errors.confirmPassword} />}
                            </div>
                        </div>
                    </div>

                    {/* دکمه‌های عملیاتی */}
                    <div className="flex gap-4 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 text-sm font-bold text-slate-400 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100"
                        >
                            انصراف
                        </button>
                        <button
                            type="submit"
                            className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Save size={20}/> ذخیره و به‌روزرسانی نهایی
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// کامپوننت کوچک نمایش خطا
const ErrorText = ({ msg }) => (
    <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold pr-2 mt-1 animate-in fade-in slide-in-from-right-1">
        <AlertCircle size={10} />
        <span>{msg}</span>
    </div>
);