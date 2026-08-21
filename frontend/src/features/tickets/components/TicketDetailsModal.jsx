import React from 'react';
import {
    X, Printer, User, Phone, Tag, Hash, Calendar,
    AlertCircle, XCircle, CheckCircle2, ShieldCheck
} from 'lucide-react';

// تابع کمکی تبدیل عدد به فارسی
const toPersianDigits = (n) => n?.toString().replace(/\d/g, x => "۰۱۲۳۴۵۶۷۸۹"[x]);

export default function TicketDetailsModal({ ticket, onClose }) {
    if (!ticket) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-500">

                {/* Header */}
                <div className="px-10 py-8 bg-linear-to-br from-slate-50 to-white border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">جزئیات درخواست هوشمند</h2>
                        <div className="flex items-center gap-2 mt-1 text-slate-400 font-bold text-xs">
                            <Calendar size={14} />
                            <span>ثبت شده در تاریخ: {toPersianDigits(ticket.createdAt)}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all cursor-pointer">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="p-10 overflow-y-auto max-h-[65vh] space-y-6 text-right" dir="rtl">

                    {/* بخش اول: اطلاعات متقاضی */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50/50 p-6 rounded-[2rem] border border-blue-100/50">
                        <InfoItem icon={<User size={16}/>} label="نام متقاضی" value={ticket.name} />
                        <InfoItem icon={<Phone size={16}/>} label="شماره تماس" value={toPersianDigits(ticket.phone || '---')} />
                        <InfoItem icon={<Hash size={16}/>} label="کد رهگیری" value={ticket.trackingCode} isCode />
                        <InfoItem icon={<Tag size={16}/>} label="نوع درخواست" value={ticket.category} />
                    </div>

                    {/* بخش دوم: شرح مشکل */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 pr-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <h3 className="font-black text-slate-700 text-sm">شرح گزارش شهروندی:</h3>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 relative">
                            <span className="absolute -top-3 right-8 bg-white px-3 text-[10px] font-black text-blue-600 border border-blue-100 rounded-full">
                                {ticket.subCategory}
                            </span>
                            <p className="text-sm leading-8 text-slate-600 text-justify font-medium">
                                {ticket.description}
                            </p>
                        </div>
                    </div>

                    {/* --- بخش جدید: علت رد درخواست (فقط برای وضعیت REJECTED) --- */}
                    {ticket.status === 'REJECTED' && (
                        <div className="space-y-3 pt-2 animate-in fade-in duration-500">
                            <div className="flex items-center gap-2 pr-2 text-red-600">
                                <AlertCircle size={18} />
                                <h3 className="font-black text-sm">علت عدم تایید (رد درخواست):</h3>
                            </div>
                            <div className="bg-red-50 border-2 border-red-100 p-6 rounded-[2rem] relative overflow-hidden group">
                                <div className="absolute -top-6 -left-6 text-red-200/30 rotate-12">
                                    <XCircle size={100} />
                                </div>
                                <p className="relative z-10 text-sm leading-8 text-red-700 font-bold text-justify">
                                    {ticket.adminComment || "دلیل خاصی ثبت نشده است. جهت پیگیری با پشتیبانی تماس بگیرید."}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* --- بخش جدید: وضعیت ارجاع (برای وضعیت در حال انجام) --- */}
                    {ticket.status === 'IN_PROGRESS' && ticket.assignedTo && (
                        <div className="space-y-3 pt-2 animate-in fade-in duration-500">
                            <div className="flex items-center gap-2 pr-2 text-amber-600">
                                <CheckCircle2 size={18} />
                                <h3 className="font-black text-sm">وضعیت ارجاع عملیاتی:</h3>
                            </div>
                            <div className="bg-amber-50 border border-amber-100 p-5 rounded-[2rem] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-white p-2 rounded-xl shadow-sm"><ShieldCheck size={18} className="text-amber-500"/></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-amber-400">اکیپ اعزامی مسئول:</span>
                                        <span className="text-sm font-black text-amber-900">{ticket.assignedTo}</span>
                                    </div>
                                </div>
                                <span className="text-[9px] font-black text-amber-600 bg-white/50 px-3 py-1 rounded-lg border border-amber-100">در حال اقدام فنی</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="px-10 py-6 bg-slate-50 border-t flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex gap-2">
                        <button onClick={onClose} className="px-8 py-3 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-xl font-bold text-xs cursor-pointer">بستن</button>
                       </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ icon, label, value, isCode }) {
    return (
        <div className="flex items-center gap-3 p-2">
            <div className="text-blue-500 bg-white p-2 rounded-xl shadow-xs border border-blue-50">{icon}</div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400">{label}</span>
                <span className={`text-sm font-black ${isCode ? 'text-blue-600 font-mono tracking-widest' : 'text-slate-700'}`}>{value}</span>
            </div>
        </div>
    );
}