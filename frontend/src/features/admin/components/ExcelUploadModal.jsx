import React, { useState } from 'react';
import { X, FileSpreadsheet, AlertTriangle, CheckCircle2, Trash2, UploadCloud } from 'lucide-react';

export default function ExcelUploadModal({ onClose }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (!selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
                return alert("فقط فایل‌های Excel مجاز هستند");
            }
            setFile(selectedFile);
        }
    };

    return (
        <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-emerald-50/30">
                    <div className="flex items-center gap-3">
                        <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600"><FileSpreadsheet size={20}/></div>
                        <h2 className="font-black text-slate-800">وارد کردن اکیپ‌ها از اکسل</h2>
                    </div>
                    <button onClick={onClose} className="cursor-pointer text-slate-400 hover:text-red-500"><X size={20}/></button>
                </div>

                <div className="p-8 space-y-6 text-right" dir="rtl">
                    {/* هشدار امنیتی */}
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                        <AlertTriangle className="text-amber-600 shrink-0" size={20} />
                        <p className="text-[10px] font-bold text-amber-800 leading-5">
                            مطمئن شوید فایل اکسل شما دقیقاً طبق فرمت استاندارد سامانه (نام سرپرست، کد ملی، شماره تماس، رسته و تعداد اعضا) تنظیم شده باشد.
                        </p>
                    </div>

                    {!file ? (
                        <label className="border-2 border-dashed border-slate-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 bg-slate-50/50 hover:bg-emerald-50/30 hover:border-emerald-200 transition-all cursor-pointer group">
                            <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                                <UploadCloud size={40} className="text-slate-300 group-hover:text-emerald-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-black text-slate-500">فایل اکسل را اینجا رها کنید</p>
                                <p className="text-[10px] text-slate-400 mt-1">یا برای انتخاب فایل کلیک کنید</p>
                            </div>
                            <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
                        </label>
                    ) : (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between animate-in fade-in">
                            <div className="flex items-center gap-3">
                                <FileSpreadsheet className="text-emerald-600" size={24} />
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-slate-700 truncate max-w-[150px]">{file.name}</span>
                                    <span className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
                                </div>
                            </div>
                            <button onClick={() => setFile(null)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all cursor-pointer"><Trash2 size={18} /></button>
                        </div>
                    )}

                    <div className="pt-4 flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:bg-slate-50 rounded-xl cursor-pointer">انصراف</button>
                        <button disabled={!file} className="flex-[2] bg-emerald-600 disabled:opacity-30 hover:bg-emerald-700 text-white py-3 rounded-xl font-black text-sm shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer">
                            <CheckCircle2 size={18}/> شروع فرآیند بارگذاری
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}