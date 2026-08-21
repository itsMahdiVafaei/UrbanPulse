import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addTicketThunk } from '../ticketSlice';
import { X, MapPin, Camera, Trash2, CheckCircle2, Plus, AlertCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import Input from '../../../components/ui/Input';
import 'leaflet/dist/leaflet.css';

// تنظیم آیکون مارکر نقشه (استفاده از لینک مستقیم برای جلوگیری از خطای تصویر در Vite)
const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const CATEGORIES = {
    URBAN_ISSUE: {
        label: "ثبت مشکلات خدمات شهری و معابر",
        sub: ["بهسازی و آسفالت", "روشنایی معابر", "زباله و نخاله", "ساخت‌وساز غیرمجاز", "فاضلاب شهری", "حیوانات ولگرد", "فضای سبز", "علائم رانندگی"]
    },
    COMPLAINT: {
        label: "ثبت شکایات شهروندی",
        sub: ["تأخیر در رسیدگی", "عملکرد پیمانکاران", "سوء برخورد پرسنل", "سد معبر اصناف"]
    },
    TECHNICAL_REPORT: {
        label: "گزارش خطای فنی در سامانه",
        sub: ["کد رهگیری", "آپلود تصاویر", "اطلاعات پروفایل"]
    }
};

// تابع کمکی تبدیل اعداد به فارسی
const toFarsi = (n) => n?.toString().replace(/\d/g, x => "۰۱۲۳۴۵۶۷۸۹"[x]);

export default function NewTicketModal({ onClose }) {
    const dispatch = useDispatch();

    // استیت‌های اصلی فرم
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [mainCat, setMainCat] = useState('');
    const [subCat, setSubCat] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [position, setPosition] = useState([35.6892, 51.3890]); // پیش‌فرض تهران
    const [errors, setErrors] = useState({});

    // --- ناپدید شدن خطاها بعد از ۲ ثانیه ---
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const timer = setTimeout(() => {
                setErrors({});
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    // پاک کردن دستی خطا هنگام تایپ
    const clearFieldError = (field) => {
        if (errors[field]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    // کامپوننت داخلی مارکر نقشه
    function LocationMarker() {
        useMapEvents({
            click(e) {
                setPosition([e.latlng.lat, e.latlng.lng]);
                clearFieldError('location');
            },
        });
        return <Marker position={position} icon={DefaultIcon} />;
    }

    // مدیریت آپلود تصاویر (حداکثر ۳ تا)
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 3) {
            alert("حداکثر ۳ تصویر مجاز است");
            return;
        }

        const validFiles = files.filter(file => {
            if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
                alert("فقط فرمت JPG مجاز است");
                return false;
            }
            if (file.size > 2 * 1024 * 1024) {
                alert("حجم هر عکس نباید بیش از ۲ مگابایت باشد");
                return false;
            }
            return true;
        }).map(file => ({
            id: Math.random(),
            file,
            preview: URL.createObjectURL(file)
        }));

        const updatedImages = [...images, ...validFiles];
        setImages(updatedImages);
        if (updatedImages.length >= 2) clearFieldError('images');
    };

    // تابع اعتبارسنجی حرفه‌ای
    const validate = () => {
        let e = {};
        if (name.trim().length < 3) e.name = "نام و نام خانوادگی را کامل وارد کنید";
        if (!/^09\d{9}$/.test(phone)) e.phone = "شماره تماس ۱۱ رقمی (۰۹...) الزامی است";
        if (!mainCat) e.mainCat = "نوع درخواست را انتخاب کنید";
        if (!subCat) e.subCat = "جزئیات موضوع را مشخص کنید";
        if (description.length < 70) e.description = `توضیحات کوتاه است (حداقل ۷۰ کاراکتر الزامی)`;
        if (images.length < 2) e.images = "ارسال حداقل ۲ تصویر مستند الزامی است";

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('name', name);
            fd.append('phone', phone);
            fd.append('category', CATEGORIES[mainCat].label);
            fd.append('subCategory', subCat);
            fd.append('description', description);
            fd.append('lat', position[0]);
            fd.append('lng', position[1]);
            images.forEach(img => fd.append('images', img.file));

            const result = await dispatch(addTicketThunk(fd)).unwrap();
            alert(`درخواست شما با کد ${result.trackingCode} ثبت شد.`);
            onClose();
        } catch (err) {
            setErrors({ general: err.message || 'ثبت درخواست با خطا مواجه شد. دوباره تلاش کنید.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 my-auto">

                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3 text-right">
                        <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg"><Plus size={20} /></div>
                        <h2 className="text-xl font-black text-slate-800">سامانه ثبت گزارش‌های مردمی</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors cursor-pointer"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 custom-scrollbar text-right" dir="rtl">
                    {errors.general && <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold text-center">{errors.general}</div>}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

                        {/* ستون اول: فیلدهای متنی */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Input
                                        label="نام و نام خانوادگی"
                                        value={name}
                                        onChange={(e) => { setName(e.target.value); clearFieldError('name'); }}
                                        className={errors.name ? 'border-red-400 bg-red-50' : ''}
                                    />
                                    {errors.name && <ErrorMsg msg={errors.name} />}
                                </div>
                                <div className="space-y-1">
                                    <Input
                                        label="شماره تماس"
                                        maxLength={11}
                                        value={phone}
                                        onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '')); clearFieldError('phone'); }}
                                        className={errors.phone ? 'border-red-400 bg-red-50' : ''}
                                    />
                                    {errors.phone && <ErrorMsg msg={errors.phone} />}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-black text-slate-500 pr-1 block mb-1">نوع درخواست</label>
                                <select
                                    className={`w-full border rounded-2xl px-4 py-3.5 text-sm font-bold outline-none transition-all ${errors.mainCat ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-blue-500 bg-slate-50/50 cursor-pointer'}`}
                                    onChange={(e) => { setMainCat(e.target.value); setSubCat(''); clearFieldError('mainCat'); }}
                                >
                                    <option value="">انتخاب دسته‌بندی...</option>
                                    {Object.keys(CATEGORIES).map(key => <option key={key} value={key}>{CATEGORIES[key].label}</option>)}
                                </select>
                                {errors.mainCat && <ErrorMsg msg={errors.mainCat} />}
                            </div>

                            {mainCat && (
                                <div className="space-y-1 animate-in slide-in-from-top-2">
                                    <label className="text-xs font-black text-slate-500 pr-1 block mb-1">جزئیات موضوع گزارش</label>
                                    <select
                                        className={`w-full border rounded-2xl px-4 py-3.5 text-sm font-bold outline-none transition-all ${errors.subCat ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-blue-500 bg-slate-50/50 cursor-pointer'}`}
                                        onChange={(e) => { setSubCat(e.target.value); clearFieldError('subCat'); }}
                                    >
                                        <option value="">دقیقاً چه موردی رخ داده؟</option>
                                        {CATEGORIES[mainCat].sub.map((item, idx) => <option key={idx} value={item}>{item}</option>)}
                                    </select>
                                    {errors.subCat && <ErrorMsg msg={errors.subCat} />}
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-black text-slate-500">توضیحات تکمیلی (حداقل ۷۰ کاراکتر)</label>
                                    <span className={`text-[10px] font-bold ${description.length < 70 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                        {toFarsi(description.length)} / ۷۰
                                    </span>
                                </div>
                                <textarea
                                    className={`w-full border rounded-2xl px-4 py-4 text-sm font-medium outline-none transition-all min-h-[160px] resize-none leading-relaxed ${errors.description ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-blue-500 bg-slate-50/50'}`}
                                    placeholder="لطفاً شرح کامل مشکل را بنویسید..."
                                    value={description}
                                    onChange={(e) => { setDescription(e.target.value); if(e.target.value.length >= 70) clearFieldError('description'); }}
                                />
                                {errors.description && <ErrorMsg msg={errors.description} />}
                            </div>
                        </div>

                        {/* ستون دوم: نقشه و عکس */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 flex items-center gap-1"><MapPin size={14} className="text-blue-600"/> موقعیت روی نقشه</label>
                                <div className="h-64 rounded-[2rem] overflow-hidden border-2 border-slate-100 z-10 shadow-inner">
                                    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationMarker />
                                    </MapContainer>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 flex items-center gap-1"><Camera size={14} className="text-blue-600"/> مستندات (حداقل ۲ عکس)</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {images.map((img) => (
                                        <div key={img.id} className="relative h-28 rounded-2xl overflow-hidden border border-slate-200 group">
                                            <img src={img.preview} className="w-full h-full object-cover" alt="Preview" />
                                            <button type="button" onClick={() => {
                                                const newList = images.filter(i => i.id !== img.id);
                                                setImages(newList);
                                                if(newList.length < 2) setErrors(prev => ({...prev, images: "ارسال حداقل ۲ عکس الزامی است"}));
                                            }} className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-inner"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                    {images.length < 3 && (
                                        <label className={`h-28 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer ${errors.images ? 'border-red-400 bg-red-50 text-red-400' : 'border-slate-200 bg-slate-50 hover:bg-blue-50 text-slate-400'}`}>
                                            <Plus size={24} />
                                            <span className="text-[9px] font-black mt-1">افزودن عکس</span>
                                            <input type="file" className="hidden" accept=".jpg,.jpeg" multiple onChange={handleImageChange} />
                                        </label>
                                    )}
                                </div>
                                {errors.images && <ErrorMsg msg={errors.images} />}
                            </div>
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-10 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all cursor-pointer">انصراف</button>
                        <button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-2xl font-black text-sm shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                            <CheckCircle2 size={20} /> {isSubmitting ? 'در حال ثبت...' : 'تایید و ثبت گزارش نهایی'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// کامپوننت داخلی نمایش خطا
function ErrorMsg({ msg }) {
    return (
        <div className="flex items-center gap-1 text-red-500 text-[10px] font-bold mt-1 pr-1 animate-in fade-in slide-in-from-right-1">
            <AlertCircle size={10} />
            <span>{msg}</span>
        </div>
    );
}