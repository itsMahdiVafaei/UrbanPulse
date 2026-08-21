import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Filter, RotateCcw, ShieldAlert, History, UserCheck, ChevronRight, ChevronLeft, Users } from 'lucide-react';
import { toggleCitizenStatus } from '../adminSlice';
import CitizenHistoryModal from '../components/CitizenHistoryModal';

const toFarsi = (n) => n?.toLocaleString('fa-IR');

export default function AdminCitizensTab() {
    const dispatch = useDispatch();
    const citizens = useSelector(state => state.admin?.citizens || []);

    // --- States ---
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [sortDate, setSortDate] = useState('newest');

    const [selectedCitizen, setSelectedCitizen] = useState(null);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // --- Logic: Filtering & Sorting ---
    const filtered = useMemo(() => {
        let result = citizens.filter(c =>
            (c.name.includes(searchTerm) || c.phone.includes(searchTerm)) &&
            (filterStatus === 'ALL' || c.status === filterStatus)
        );
        return result.sort((a, b) => sortDate === 'newest' ? b.id - a.id : a.id - b.id);
    }, [citizens, searchTerm, filterStatus, sortDate]);

    // --- Logic: Pagination ---
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const isPaginationEnabled = filtered.length > 5;
    const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleBlock = (c) => {
        const actionText = c.status === 'ACTIVE' ? 'مسدود' : 'فعال';
        if (window.confirm(`آیا از ${actionText} سازی حساب کاربری "${c.name}" اطمینان دارید؟`)) {
            dispatch(toggleCitizenStatus(c.phone));
        }
    };

    return (
        <div className="space-y-6 text-right" dir="rtl">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-2">
                <div className="flex items-center gap-3">
                    <h3 className="font-black text-slate-700 text-lg">مدیریت کاربران شهروندی</h3>
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-3 py-1.5 rounded-xl">
                        {toFarsi(filtered.length)} شهروند ثبت‌نامی
                    </span>
                </div>

                <div className="w-full lg:w-auto grid grid-cols-2 lg:flex items-center gap-3">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-xs transition-all cursor-pointer border
                        ${isFilterOpen ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                        <Filter size={16} /> فیلتر هوشمند
                    </button>

                    <div className="flex items-center justify-center gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400">نمایش:</span>
                        <select value={itemsPerPage} onChange={(e) => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="text-xs font-black text-indigo-600 outline-none bg-transparent cursor-pointer">
                            {[5, 10, 50, 100].map(n => <option key={n} value={n}>{toFarsi(n)}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            <div className={`overflow-hidden transition-all duration-500 ${isFilterOpen ? 'max-h-[400px] mb-6' : 'max-h-0'}`}>
                <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-xl shadow-indigo-50/50 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 pr-1">نام یا شماره تماس</label>
                        <input onChange={e => setSearchTerm(e.target.value)} placeholder="جستجو..." className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-indigo-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 pr-1">وضعیت حساب</label>
                        <select onChange={e => setFilterStatus(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 text-xs font-bold outline-none">
                            <option value="ALL">همه موارد</option>
                            <option value="ACTIVE">فعال</option>
                            <option value="BLOCKED">مسدود شده</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 pr-1">ترتیب زمان عضویت</label>
                        <select onChange={e => setSortDate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 text-xs font-bold outline-none">
                            <option value="newest">جدیدترین‌ها</option>
                            <option value="oldest">قدیمی‌ترین‌ها</option>
                        </select>
                    </div>
                    <div className="flex items-end pb-1">
                        <button onClick={() => {setSearchTerm(''); setFilterStatus('ALL');}} className="flex items-center gap-2 text-xs font-black text-red-400 hover:text-red-600 cursor-pointer"><RotateCcw size={14}/> ریست</button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[1000px] text-right border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100 font-black text-[11px] text-slate-400 uppercase">
                        <tr>
                            <th className="px-6 py-5">ردیف</th>
                            <th className="px-6 py-5">نام شهروند</th>
                            <th className="px-6 py-5">تماس / ایمیل</th>
                            <th className="px-6 py-5">تاریخ عضویت</th>
                            <th className="px-6 py-5">تعداد کل درخواست</th>
                            <th className="px-6 py-5">وضعیت حساب</th>
                            <th className="px-6 py-5 text-center">عملیات</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                        {paginatedItems.map((c, idx) => (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-5 text-slate-300">{toFarsi((currentPage-1)*itemsPerPage + idx + 1)}</td>
                                <td className="px-6 py-5">{c.name}</td>
                                <td className="px-6 py-5">
                                    <div className="flex flex-col">
                                        <span className="text-indigo-600 font-mono text-xs">{toFarsi(c.phone)}</span>
                                        <span className="text-[10px] text-slate-400">{c.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-xs text-slate-500">{c.regDate}</td>
                                <td className="px-6 py-5 text-indigo-600 font-black">{toFarsi(c.ticketCount)} درخواست</td>
                                <td className="px-6 py-5">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black border ${c.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                            {c.status === 'ACTIVE' ? 'حساب فعال' : 'مسدود شده'}
                                        </span>
                                </td>
                                <td className="px-6 py-5">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => {setSelectedCitizen(c); setIsHistoryOpen(true);}}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black hover:bg-indigo-600 hover:text-white transition-all cursor-pointer shadow-xs"
                                        >
                                            <History size={14}/> مشاهده سوابق
                                        </button>
                                        <button
                                            onClick={() => handleBlock(c)}
                                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer shadow-xs
                                                ${c.status === 'ACTIVE' ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
                                        >
                                            {c.status === 'ACTIVE' ? <ShieldAlert size={14}/> : <UserCheck size={14}/>}
                                            {c.status === 'ACTIVE' ? 'مسدود سازی' : 'رفع مسدودیت'}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className={`flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 bg-white w-full sm:w-fit mx-auto px-6 py-4 rounded-[2rem] border border-slate-200 shadow-sm transition-opacity ${!isPaginationEnabled ? 'opacity-50' : 'opacity-100'}`}>
                <div className="flex items-center gap-4">
                    <button disabled={!isPaginationEnabled || currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2.5 rounded-xl border border-slate-100 disabled:opacity-20 cursor-pointer hover:bg-slate-50 transition-all text-slate-600"><ChevronRight size={20} /></button>
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button key={i} disabled={!isPaginationEnabled} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${!isPaginationEnabled ? 'bg-slate-50 text-slate-300 cursor-not-allowed' : (currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 cursor-pointer' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 cursor-pointer')}`}>{toFarsi(i + 1)}</button>
                        ))}
                    </div>
                    <button disabled={!isPaginationEnabled || currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2.5 rounded-xl border border-slate-100 disabled:opacity-20 cursor-pointer hover:bg-slate-50 transition-all text-slate-600"><ChevronLeft size={20} /></button>
                </div>
            </div>

            {isHistoryOpen && <CitizenHistoryModal citizen={selectedCitizen} onClose={() => setIsHistoryOpen(false)} />}
        </div>
    );
}