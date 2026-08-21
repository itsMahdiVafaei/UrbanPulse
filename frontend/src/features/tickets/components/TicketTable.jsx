import React, { useState } from 'react';
import { MapPin, Image as ImageIcon, Copy, FileText } from 'lucide-react';
import MapViewerModal from './MapViewerModal';
import ImageViewerModal from './ImageViewerModal';
import TicketDetailsModal from './TicketDetailsModal';

// تابع کمکی برای تبدیل اعداد به فارسی
const toPersianDigits = (n) => {
    if (n === undefined || n === null) return "۰";
    return n.toString().replace(/\d/g, x => "۰۱۲۳۴۵۶۷۸۹"[x]);
};

const STATUS_MAP = {
    REGISTERED: { label: 'ثبت شده', color: 'bg-blue-50 text-blue-700 border-blue-100' },
    REVIEWED: { label: 'تایید بررسی', color: 'bg-purple-50 text-purple-700 border-purple-100' },
    IN_PROGRESS: { label: 'در حال انجام', color: 'bg-amber-50 text-amber-700 border-amber-100' },
    COMPLETED: { label: 'انجام شده', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    REJECTED: { label: 'رد شده', color: 'bg-red-50 text-red-700 border-red-100' },
};

export default function TicketTable({ tickets, currentPage, itemsPerPage }) {
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    const handleCopy = (code) => {
        navigator.clipboard.writeText(code);
        alert(`کد رهگیری ${code} کپی شد`);
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-[1100px] w-full text-right border-collapse">
                    <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-tighter">
                        <th className="px-6 py-5 whitespace-nowrap text-right">ردیف</th>
                        <th className="px-6 py-5 whitespace-nowrap">کد رهگیری</th>
                        <th className="px-6 py-5 whitespace-nowrap">نام شهروند</th>
                        <th className="px-6 py-5 whitespace-nowrap">موضوع درخواست</th>
                        <th className="px-6 py-5 whitespace-nowrap">محل وقوع</th>
                        <th className="px-6 py-5 whitespace-nowrap">مستندات</th>
                        <th className="px-6 py-5 whitespace-nowrap">وضعیت</th>
                        <th className="px-6 py-5 text-center whitespace-nowrap">عملیات</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {tickets.map((ticket, index) => {
                        // محاسبه فرمول مهندسی شماره ردیف متوالی
                        const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;

                        return (
                            <tr key={ticket.id} className="hover:bg-blue-50/30 transition-colors group">
                                {/* ستون ردیف اصلاح شده */}
                                <td className="px-6 py-5 text-slate-300 font-bold text-xs whitespace-nowrap">
                                    {toPersianDigits(rowNumber)}
                                </td>

                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div
                                        onClick={() => handleCopy(ticket.trackingCode)}
                                        className="flex items-center gap-2 w-fit bg-slate-100 text-blue-700 px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-blue-600 hover:text-white transition-all group/code"
                                    >
                                            <span className="font-mono font-bold text-sm tracking-widest">
                                                {ticket.trackingCode}
                                            </span>
                                        <Copy size={12} className="text-current transition-colors opacity-100" />
                                    </div>
                                </td>

                                <td className="px-6 py-5 font-bold text-slate-700 text-sm whitespace-nowrap">
                                    {ticket.name}
                                </td>

                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-800">{ticket.category}</span>
                                        <span className="text-[10px] text-slate-400 font-bold">{ticket.subCategory}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-5 whitespace-nowrap">
                                    <button
                                        onClick={() => { setSelectedTicket(ticket); setActiveModal('map'); }}
                                        className="flex items-center gap-1.5 text-blue-500 font-black text-xs cursor-pointer bg-blue-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-blue-200 transition-all"
                                    >
                                        <MapPin size={14} /> مشاهده
                                    </button>
                                </td>

                                <td className="px-6 py-5 whitespace-nowrap">
                                    <button
                                        onClick={() => { setSelectedTicket(ticket); setActiveModal('images'); }}
                                        className="flex items-center gap-1.5 text-slate-500 font-black text-xs cursor-pointer bg-slate-100 px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-300 transition-all"
                                    >
                                        <ImageIcon size={14} /> {toPersianDigits(ticket.images?.length || 0)} تصویر
                                    </button>
                                </td>

                                <td className="px-6 py-5 whitespace-nowrap">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border ${STATUS_MAP[ticket.status]?.color || 'bg-slate-100'}`}>
                                            {STATUS_MAP[ticket.status]?.label || 'ثبت شده'}
                                        </span>
                                </td>

                                <td className="px-6 py-5 text-center whitespace-nowrap">
                                    <button
                                        onClick={() => { setSelectedTicket(ticket); setActiveModal('details'); }}
                                        className="flex items-center gap-2 mx-auto text-blue-600 font-black text-xs hover:bg-blue-600 hover:text-white px-4 py-2 rounded-xl transition-all cursor-pointer border border-blue-100 shadow-xs active:scale-95"
                                    >
                                        <FileText size={14} /> مشاهده جزئیات
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            {/* مودال‌ها */}
            {activeModal === 'map' && selectedTicket && (
                <MapViewerModal position={selectedTicket.location} onClose={() => setActiveModal(null)} />
            )}
            {activeModal === 'images' && selectedTicket && (
                <ImageViewerModal images={selectedTicket.images} onClose={() => setActiveModal(null)} />
            )}
            {activeModal === 'details' && selectedTicket && (
                <TicketDetailsModal ticket={selectedTicket} onClose={() => setActiveModal(null)} />
            )}
        </div>
    );
}