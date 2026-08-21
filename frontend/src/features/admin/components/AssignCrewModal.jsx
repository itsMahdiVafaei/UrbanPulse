import React, { useState } from 'react';
import { X, HardHat, CheckCircle2, ListOrdered } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateTicketStatus } from '../../tickets/ticketSlice';
import { fetchContractors } from '../adminSlice';

export default function AssignCrewModal({ ticket, onClose }) {
    const dispatch = useDispatch();

    // نمایش تمام پیمانکاران بدون در نظر گرفتن وضعیت (برای تشکیل صف)
    const contractors = useSelector(state => state.admin?.contractors || []);
    const allTickets = useSelector(state => state.tickets?.list || []);

    const [selectedCrewName, setSelectedCrewName] = useState('');

    // تابع کمکی برای پیدا کردن تعداد کارهای فعلی یک اکیپ
    const getActiveTasksCount = (crewName) => {
        return allTickets.filter(t => t.assignedTo === crewName && t.status === 'IN_PROGRESS').length;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCrewName) return alert("لطفاً یک اکیپ را انتخاب کنید");

        const crew = contractors.find(c => c.headName === selectedCrewName);

        // ۱. آپدیت وضعیت تیکت و اضافه کردن نام اکیپ به تیکت
        dispatch(updateTicketStatus({
            id: ticket.id,
            newStatus: 'IN_PROGRESS',
            assignedTo: crew.phone,
            adminComment: `پرونده به اکیپ "${crew.headName}" ارجاع شد.`
        })).then(() => dispatch(fetchContractors()));

        alert(`درخواست با موفقیت به صف وظایف "${crew.headName}" اضافه شد.`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 my-auto">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg"><ListOrdered size={20}/></div>
                        <h2 className="font-black text-slate-800 text-sm">ارجاع به صف وظایف</h2>
                    </div>
                    <button onClick={onClose} className="cursor-pointer text-slate-400 hover:text-red-500 transition-colors"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 text-right" dir="rtl">
                    <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-right">
                        <p className="text-[10px] font-bold text-blue-400 mb-1">موضوع گزارش:</p>
                        <p className="text-xs font-black text-blue-700 leading-relaxed">{ticket.subCategory}</p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-slate-500 pr-1">انتخاب اکیپ پیمانکار</label>
                        <select
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-sm font-bold outline-none focus:border-indigo-500 cursor-pointer"
                            value={selectedCrewName}
                            onChange={(e) => setSelectedCrewName(e.target.value)}
                        >
                            <option value="">لیست تمام اکیپ‌های فعال...</option>
                            {contractors.map(c => {
                                const taskCount = getActiveTasksCount(c.headName);
                                return (
                                    <option key={c.id} value={c.headName}>
                                        {c.headName} ({c.category}) — {taskCount > 0 ? `${taskCount} کار در صف` : 'بدون کار'}
                                    </option>
                                );
                            })}
                        </select>
                        <p className="text-[9px] text-slate-400 px-1 italic">شما می‌توانید به اکیپ‌های مشغول نیز درخواست جدید ارسال کنید.</p>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-4 text-xs font-bold text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">انصراف</button>
                        <button type="submit" className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-xs shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
                            <CheckCircle2 size={18}/> تایید و افزودن به صف
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}