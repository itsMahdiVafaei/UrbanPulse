import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateTicketStatus } from '../../tickets/ticketSlice';
import { MapPin, Image as ImageIcon, CheckCircle, PlayCircle, FileText } from 'lucide-react';
import MapViewerModal from '../../tickets/components/MapViewerModal';
import ImageViewerModal from '../../tickets/components/ImageViewerModal';
import TicketDetailsModal from '../../tickets/components/TicketDetailsModal';

const toFarsi = (n) => n?.toString().replace(/\d/g, x => "۰۱۲۳۴۵۶۷۸۹"[x]);

export default function ContractorTaskTable({ tasks }) {
    const dispatch = useDispatch();
    const [selectedTask, setSelectedTask] = useState(null);
    const [activeModal, setActiveModal] = useState(null);

    // تغییر وضعیت به "در حال انجام"
    const handleStart = (id) => {
        if (window.confirm("آیا مأموریت را دریافت کرده و آماده شروع عملیات هستید؟")) {
            dispatch(updateTicketStatus({ id, newStatus: 'IN_PROGRESS', adminComment: "اکیپ عملیاتی مأموریت را تایید و کار را آغاز کرد." }));
        }
    };

    // تغییر وضعیت به "انجام شده"
    const handleFinish = (id) => {
        if (window.confirm("آیا عملیات با موفقیت به پایان رسیده است؟")) {
            dispatch(updateTicketStatus({ id, newStatus: 'COMPLETED', adminComment: "عملیات توسط اکیپ اعزامی با موفقیت به پایان رسید." }));
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-[1100px] w-full text-right border-collapse">
                    <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase">
                        <th className="px-6 py-5">ردیف</th>
                        <th className="px-6 py-5">کد رهگیری</th>
                        <th className="px-6 py-5">موضوع گزارش</th>
                        <th className="px-6 py-5 text-center">مشاهده محل / عکس</th>
                        <th className="px-6 py-5 text-center">وضعیت فعلی</th>
                        <th className="px-6 py-5 text-center">اقدام عملیاتی</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                    {tasks.map((task, idx) => (
                        <tr key={task.id} className="hover:bg-amber-50/20 transition-colors group font-bold">
                            <td className="px-6 py-5 text-slate-300 text-xs">{toFarsi(idx + 1)}</td>
                            <td className="px-6 py-5">
                                <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">{task.trackingCode}</span>
                            </td>
                            <td className="px-6 py-5 flex flex-col">
                                <span className="text-sm text-slate-800 font-black">{task.subCategory}</span>
                                <span className="text-[10px] text-slate-400 truncate max-w-[200px]">{task.description}</span>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => {setSelectedTask(task); setActiveModal('map');}} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer border border-slate-200"><MapPin size={16}/></button>
                                    <button onClick={() => {setSelectedTask(task); setActiveModal('images');}} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all cursor-pointer border border-slate-200"><ImageIcon size={16}/></button>
                                    <button onClick={() => {setSelectedTask(task); setActiveModal('details');}} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-indigo-600 hover:text-white transition-all cursor-pointer border border-slate-200"><FileText size={16}/></button>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black border ${task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                        {task.status === 'COMPLETED' ? 'انجام شده' : 'در انتظار اقدام'}
                                    </span>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex justify-center">
                                    {task.status === 'REGISTERED' || task.status === 'REVIEWED' ? (
                                        <button onClick={() => handleStart(task.id)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all cursor-pointer active:scale-95">
                                            <PlayCircle size={14}/> تایید و شروع عملیات
                                        </button>
                                    ) : task.status === 'IN_PROGRESS' ? (
                                        <button onClick={() => handleFinish(task.id)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-2xl text-[10px] font-black shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all cursor-pointer active:scale-95">
                                            <CheckCircle size={14}/> ثبت پایان مأموریت
                                        </button>
                                    ) : (
                                        <span className="text-emerald-500 text-[10px] font-black flex items-center gap-1">
                                                <CheckCircle size={14}/> مأموریت با موفقیت انجام شد
                                            </span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {activeModal === 'map' && <MapViewerModal position={selectedTask.location} onClose={() => setActiveModal(null)} />}
            {activeModal === 'images' && <ImageViewerModal images={selectedTask.images} onClose={() => setActiveModal(null)} />}
            {activeModal === 'details' && <TicketDetailsModal ticket={selectedTask} onClose={() => setActiveModal(null)} />}
        </div>
    );
}