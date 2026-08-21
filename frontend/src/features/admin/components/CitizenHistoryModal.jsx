import React from 'react';
import { useSelector } from 'react-redux';
import { X, ClipboardList, User } from 'lucide-react';
import TicketTable from '../../tickets/components/TicketTable';

export default function CitizenHistoryModal({ citizen, onClose }) {
    // گرفتن تمام تیکت‌ها و فیلتر کردن بر اساس نام شهروند انتخابی
    const allTickets = useSelector(state => state.tickets.list);
    const userTickets = allTickets.filter(t => t.name === citizen.name);

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-6xl max-h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-4 text-right">
                        <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200">
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800">تاریخچه درخواست‌های شهروندی</h2>
                            <p className="flex items-center gap-1 text-slate-400 text-xs font-bold mt-1">
                                <User size={12}/> کاربر: {citizen.name} | {citizen.phone}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-all cursor-pointer"><X size={24}/></button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30 custom-scrollbar">
                    {userTickets.length > 0 ? (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* استفاده مجدد از جدول هوشمندی که قبلا برای شهروند ساختیم */}
                            <TicketTable tickets={userTickets} />
                        </div>
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-slate-400 font-black">این کاربر تاکنون درخواستی ثبت نکرده است.</p>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-white border-t flex justify-end">
                    <button onClick={onClose} className="px-10 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs cursor-pointer shadow-lg active:scale-95 transition-all">بستن سوابق</button>
                </div>
            </div>
        </div>
    );
}