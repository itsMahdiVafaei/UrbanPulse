import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Mail } from 'lucide-react';
import Input from '../../../components/ui/Input';

const SKILLS = [
    "اکیپ آسفالت و لکه‌گیری",
    "تأسیسات برق و روشنایی معابر",
    "فضای سبز و باغبانی",
    "خدمات پسماند و جمع‌آوری زباله",
    "عمران، بنایی و جدول‌گذاری",
    "فوریت‌های آب و فاضلاب",
    "کنترل حیوانات و بهداشت محیط"
];

export default function ContractorFormModal({ onClose, onSave, initialData = null }) {
    const [formData, setFormData] = useState({
        headName: '',
        nationalCode: '',
        phone: '',
        email: '', // فیلد ایمیل در استیت
        password: '',
        category: '',
        memberCount: 1,
        status: 'FREE',
        members: []
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                // اگر بک‌اند لیست اعضا رو نمی‌فرسته، حداقل یک آرایه خالی بذار تا برنامه کرش نکنه
                members: initialData.members || []
            });
        }
    }, [initialData]);

    const handleTotalMembersChange = (count) => {
        const total = parseInt(count) || 1;
        const additionalNeeded = total - 1;
        let newMembers = [...formData.members];

        if (additionalNeeded > newMembers.length) {
            for (let i = newMembers.length; i < additionalNeeded; i++) {
                newMembers.push({ id: Date.now() + i, name: '', nationalCode: '' });
            }
        } else {
            newMembers = newMembers.slice(0, additionalNeeded);
        }
        setFormData(prev => ({ ...prev, memberCount: total, members: newMembers }));
    };

    const validate = () => {
        let e = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.headName) e.headName = "نام سرپرست الزامی است";
        if (!/^\d{10}$/.test(formData.nationalCode)) e.nationalCode = "کد ملی باید ۱۰ رقم عدد باشد";
        if (!/^09\d{9}$/.test(formData.phone)) e.phone = "شماره همراه معتبر نیست";

        // اعتبارسنجی ایمیل (اجباری)
        if (!formData.email) {
            e.email = "وارد کردن ایمیل الزامی است";
        } else if (!emailRegex.test(formData.email)) {
            e.email = "فرمت پست الکترونیک معتبر نیست";
        }

        if (!formData.category) e.category = "رسته مهارتی را انتخاب کنید";

        formData.members.forEach((m, i) => {
            if (!m.name) e[`m_name_${i}`] = "نام عضو الزامی است";
            if (!/^\d{10}$/.test(m.nationalCode)) e[`m_code_${i}`] = "کد ملی ۱۰ رقمی الزامی است";
        });

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave({ ...formData, id: initialData?.id || Date.now() });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-auto">

                {/* Header */}
                <div className="px-10 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
                            <UserPlus size={24}/>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800">{initialData ? 'ویرایش اطلاعات اکیپ' : 'ثبت اکیپ پیمانکاری جدید'}</h2>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">UrbanPulse Management</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all cursor-pointer">
                        <X size={24}/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8 text-right" dir="rtl">

                    {/* بخش اول: اطلاعات سرپرست و تماس */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-black text-indigo-600 flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            مشخصات سرپرست و راه‌های ارتباطی
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <Input
                                    label="نام و نام خانوادگی سرپرست"
                                    placeholder="نفر اول اکیپ"
                                    value={formData.headName}
                                    onChange={e => setFormData({...formData, headName: e.target.value})}
                                />
                                {errors.headName && <p className="text-[10px] text-red-500 font-bold mt-1 pr-2">{errors.headName}</p>}
                            </div>
                            <div>
                                <Input
                                    label="کد ملی سرپرست"
                                    maxLength={10}
                                    placeholder="۱۰ رقم عدد"
                                    value={formData.nationalCode}
                                    onChange={e => setFormData({...formData, nationalCode: e.target.value.replace(/\D/g, '')})}
                                />
                                {errors.nationalCode && <p className="text-[10px] text-red-500 font-bold mt-1 pr-2">{errors.nationalCode}</p>}
                            </div>
                            <div>
                                <Input
                                    label="شماره تماس"
                                    maxLength={11}
                                    placeholder="۰۹..."
                                    value={formData.phone}
                                    onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                                />
                                {errors.phone && <p className="text-[10px] text-red-500 font-bold mt-1 pr-2">{errors.phone}</p>}
                            </div>
                            <div>
                                <Input
                                    label="رمز عبور پنل اکیپ"
                                    type="password"
                                    placeholder="یک رمز برای اکیپ تعیین کنید"
                                    value={formData.password}
                                    onChange={e => setFormData({...formData, password: e.target.value})}
                                />
                            </div>
                            {/* فیلد ایمیل جدید */}
                            <div>
                                <Input
                                    label="پست الکترونیک (ایمیل)"
                                    placeholder="example@mail.com"
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({...formData, email: e.target.value})}
                                />
                                {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 pr-2">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 pr-1 block mb-1.5">حوزه تخصصی (رسته)</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:border-indigo-500 cursor-pointer"
                                    value={formData.category}
                                    onChange={e => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="">انتخاب رسته فعالیت...</option>
                                    {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                {errors.category && <p className="text-[10px] text-red-500 font-bold mt-1 pr-2">{errors.category}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 pr-1 block mb-1.5">تعداد کل نفرات اکیپ</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm font-bold outline-none focus:border-indigo-500 cursor-pointer text-indigo-600"
                                    value={formData.memberCount}
                                    onChange={e => handleTotalMembersChange(e.target.value)}
                                >
                                    {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} نفر (سرپرست + {n-1} عضو)</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* بخش دوم: اعضای تیم */}
                    <div className="space-y-6 border-t border-slate-50 pt-8">
                        <h3 className="text-sm font-black text-indigo-600 flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                            مشخصات سایر اعضای تیم
                        </h3>

                        {formData.members.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                                {formData.members.map((member, idx) => (
                                    <div key={idx} className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                                        <div className="absolute -right-2 -top-2 bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-lg border-4 border-white">
                                            {idx + 2}
                                        </div>
                                        <div>
                                            <Input
                                                placeholder={`نام و نام خانوادگی عضو ${idx + 2}`}
                                                value={member.name}
                                                onChange={e => {
                                                    const m = [...formData.members]; m[idx].name = e.target.value;
                                                    setFormData({...formData, members: m});
                                                }}
                                            />
                                            {errors[`m_name_${idx}`] && <p className="text-[9px] text-red-500 font-bold mt-1 pr-2">{errors[`m_name_${idx}`]}</p>}
                                        </div>
                                        <div>
                                            <Input
                                                placeholder={`کد ملی عضو ${idx + 2}`}
                                                maxLength={10}
                                                value={member.nationalCode}
                                                onChange={e => {
                                                    const m = [...formData.members]; m[idx].nationalCode = e.target.value.replace(/\D/g, '');
                                                    setFormData({...formData, members: m});
                                                }}
                                            />
                                            {errors[`m_code_${idx}`] && <p className="text-[9px] text-red-500 font-bold mt-1 pr-2">{errors[`m_code_${idx}`]}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-50 p-6 rounded-2xl text-center border border-dashed border-slate-200">
                                <p className="text-xs text-slate-400 font-bold text-center">اکیپ تک‌نفره (فقط سرپرست)</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-4 pt-6">
                        <button type="button" onClick={onClose} className="flex-1 py-4 text-sm font-bold text-slate-400 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer">
                            انصراف
                        </button>
                        <button type="submit" className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                            <Save size={20}/>
                            {initialData ? 'ذخیره تغییرات نهایی' : 'تایید و ثبت اکیپ در سیستم'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}