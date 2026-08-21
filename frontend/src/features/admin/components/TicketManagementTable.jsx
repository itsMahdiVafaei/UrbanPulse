import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTicketStatus } from '../../tickets/ticketSlice';
import { MapPin, Image as ImageIcon, FileText, CheckCircle2, Clock, XCircle, Eye } from 'lucide-react';
import MapViewerModal from '../../tickets/components/MapViewerModal';
import ImageViewerModal from '../../tickets/components/ImageViewerModal';
import TicketDetailsModal from '../../tickets/components/TicketDetailsModal';
import AssignCrewModal from './AssignCrewModal';

const toFarsi = (n) => n?.toString().replace(/\d/g, x => "۰۱۲۳۴۵۶۷۸۹"[x]);

const STATUS_CONFIG = {
    REGISTERED: { label: 'تازه ثبت شده', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    REVIEWED: { label: 'تایید بررسی', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    IN_PROGRESS: { label: 'در حال انجام', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    COMPLETED: { label: 'انجام شده', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    REJECTED: { label: 'رد شده', color: 'bg-red-50 text-red-700 border-red-200' },
};

export default function TicketManagementTable({ tickets }) {
    const dispatch = useDispatch();
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    const handleAction = (ticket, newStatus, label) => {
        if (window.confirm(`آیا از تغییر وضعیت به "${label}" اطمینان دارید؟`)) {
            let comment = ticket.adminComment || "";

            if (newStatus === 'REJECTED') {
                const reason = prompt("علت رد درخواست را بنویسید:");
                if (!reason) return;
                comment = reason;
            }

            dispatch(updateTicketStatus({ id: ticket.id, newStatus: newStatus, adminComment: comment }));

        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-[1200px] w-full text-right border-collapse">
                    <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase">
                        <th className="px-6 py-5">ردیف</th>
                        <th className="px-6 py-5">کد رهگیری</th>
                        <th className="px-6 py-5">اطلاعات شهروند</th>
                        <th className="px-6 py-5 text-center">محل و رسانه</th>
                        <th className="px-6 py-5">وضعیت فعلی</th>
                        <th className="px-6 py-5 text-center">عملیات مدیریت</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {tickets.map((ticket, index) => (
                        <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-5 text-xs font-bold text-slate-400">{toFarsi(index + 1)}</td>
                            <td className="px-6 py-5 font-mono font-bold text-indigo-600 text-sm">{ticket.trackingCode}</td>
                            <td className="px-6 py-5">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-slate-800">{ticket.name}</span>
                                    <span className="text-[10px] text-slate-400 font-bold">{toFarsi(ticket.phone || '---')}</span>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => {setSelectedTicket(ticket); setActiveModal('map');}} className="p-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer border border-blue-100 hover:bg-blue-600 hover:text-white transition-all"><MapPin size={14}/></button>
                                    <button onClick={() => {setSelectedTicket(ticket); setActiveModal('images');}} className="p-2 bg-slate-100 text-slate-600 rounded-lg cursor-pointer border border-slate-200 hover:bg-slate-600 hover:text-white transition-all"><ImageIcon size={14}/></button>
                                    <button onClick={() => {setSelectedTicket(ticket); setActiveModal('details');}} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg cursor-pointer border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all"><FileText size={14}/></button>
                                </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap">
    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black border shadow-xs ${STATUS_CONFIG[ticket.status]?.color || 'bg-slate-100'}`}>
        {STATUS_CONFIG[ticket.status]?.label || ticket.status}
    </span>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => handleAction(ticket, 'REVIEWED', 'تأیید بررسی')} className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-xl text-[10px] font-black border border-purple-100 cursor-pointer hover:bg-purple-600 hover:text-white transition-all">تایید بررسی</button>
                                    <button onClick={() => {setSelectedTicket(ticket); setActiveModal('assign');}} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl text-[10px] font-black border border-amber-100 cursor-pointer hover:bg-amber-500 hover:text-white transition-all">ارجاع به اکیپ</button>
                                    <button onClick={() => handleAction(ticket, 'COMPLETED', 'انجام شده')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-black border border-emerald-100 cursor-pointer hover:bg-emerald-600 hover:text-white transition-all">انجام شده</button>
                                    <button onClick={() => handleAction(ticket, 'REJECTED', 'رد درخواست')} className="px-3 py-1.5 bg-red-50 text-red-700 rounded-xl text-[10px] font-black border border-red-100 cursor-pointer hover:bg-red-600 hover:text-white transition-all">رد درخواست</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* مودال‌ها */}
            {activeModal === 'map' && <MapViewerModal position={selectedTicket.location} onClose={() => setActiveModal(null)} />}
            {activeModal === 'images' && <ImageViewerModal images={selectedTicket.images} onClose={() => setActiveModal(null)} />}
            {activeModal === 'details' && <TicketDetailsModal ticket={selectedTicket} onClose={() => setActiveModal(null)} />}
            {activeModal === 'assign' && <AssignCrewModal ticket={selectedTicket} onClose={() => setActiveModal(null)} />}
        </div>
    );
}