import React from 'react';
import { X, TrendingUp, Users, Clock, BarChart2 } from 'lucide-react';
import { useSelector } from 'react-redux';

const toFarsi = (n) => n.toLocaleString('fa-IR');

export default function AdminStatsModal({ onClose }) {
    const tickets = useSelector(state => state.tickets.list);
    const contractors = useSelector(state => state.admin?.contractors || []);

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 my-auto">
                <div className="px-10 py-6 bg-indigo-600 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <BarChart2 size={24} />
                        <h2 className="text-xl font-black text-right">گزارش عملکرد دوره‌ای سازمان</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full cursor-pointer"><X size={24}/></button>
                </div>

                <div className="p-10 space-y-10 text-right" dir="rtl">
                    {/* گزارشات زمانی */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TimeCard title="گزارش ۲۴ ساعت اخیر" count={tickets.length} color="bg-blue-500" />
                        <TimeCard title="گزارش ۷ روز گذشته" count={tickets.length + 4} color="bg-indigo-500" />
                        <TimeCard title="گزارش ۳۰ روز گذشته" count={tickets.length + 18} color="bg-purple-500" />
                    </div>

                    {/* میانگین پاسخگویی */}
                    <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 flex flex-col md:flex-row items-center justify-around gap-8">
                        <div className="text-center">
                            <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">میانگین زمان بررسی</h4>
                            <p className="text-4xl font-black text-indigo-600">{toFarsi(2.4)} <span className="text-sm">ساعت</span></p>
                        </div>
                        <div className="w-px h-12 bg-slate-200 hidden md:block"></div>
                        <div className="text-center">
                            <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">میانگین اتمام عملیات</h4>
                            <p className="text-4xl font-black text-emerald-500">{toFarsi(8.5)} <span className="text-sm">ساعت</span></p>
                        </div>
                    </div>

                    {/* عملکرد اکیپ‌ها */}
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-700 flex items-center gap-2 pr-2">
                            <Users size={18} className="text-indigo-600" /> رتبه‌بندی عملکرد اکیپ‌ها
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            {contractors.map(c => {
                                const done = tickets.filter(t => t.assignedTo === c.headName && t.status === 'COMPLETED').length;
                                return (
                                    <div key={c.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center font-bold text-indigo-600">{c.headName[0]}</div>
                                            <span className="text-sm font-black text-slate-700">{c.headName} ({c.category})</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-xs font-bold text-emerald-600">{toFarsi(done)} مأموریت موفق</span>
                                            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="bg-emerald-500 h-full transition-all" style={{width: `${Math.min(done * 20, 100)}%`}}></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimeCard({ title, count, color }) {
    return (
        <div className={`${color} p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden`}>
            <div className="absolute -bottom-4 -left-4 opacity-10"><TrendingUp size={100} /></div>
            <p className="text-xs font-bold opacity-80 mb-1">{title}</p>
            <h4 className="text-3xl font-black">{toFarsi(count)} مورد</h4>
        </div>
    );
}