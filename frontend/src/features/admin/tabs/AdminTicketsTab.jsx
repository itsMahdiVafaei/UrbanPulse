import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import TicketManagementTable from '../components/TicketManagementTable';
import { ChevronRight, ChevronLeft, Filter, Search, RotateCcw } from 'lucide-react';

const toFarsi = (n) => n?.toLocaleString('fa-IR');

export default function AdminTicketsTab() {
    const tickets = useSelector(state => state.tickets.list);

    // --- States ---
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    // استیت مقادیر فیلتر
    const [filters, setFilters] = useState({
        trackingCode: '',
        name: '',
        phone: '',
        status: 'ALL'
    });

    // --- Logic: Filtering ---
    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            const matchCode = ticket.trackingCode.toLowerCase().includes(filters.trackingCode.toLowerCase());
            const matchName = ticket.name.toLowerCase().includes(filters.name.toLowerCase());
            const matchPhone = (ticket.phone || '').includes(filters.phone);
            const matchStatus = filters.status === 'ALL' || ticket.status === filters.status;

            return matchCode && matchName && matchPhone && matchStatus;
        });
    }, [tickets, filters]);

    // --- Logic: Pagination ---
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage) || 1;
    const isPaginationEnabled = filteredTickets.length > 5; // فعال شدن فقط برای بیش از ۵ مورد

    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredTickets.slice(start, start + itemsPerPage);
    }, [filteredTickets, currentPage, itemsPerPage]);

    // تابع کمکی آپدیت فیلتر
    const updateFilter = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setFilters({ trackingCode: '', name: '', phone: '', status: 'ALL' });
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6 text-right" dir="rtl">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                <div className="flex items-center gap-3">
                    <h3 className="font-black text-slate-700">درخواست‌های کاربران</h3>
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-indigo-200">
                        {toFarsi(filteredTickets.length)} درخواست یافت شد
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* تنظیمات نمایش */}
                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="text-xs font-bold text-slate-400">نمایش:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="text-xs font-black text-indigo-600 outline-none cursor-pointer bg-transparent"
                        >
                            {[5, 10, 50, 100].map(n => <option key={n} value={n}>{toFarsi(n)} مورد</option>)}
                        </select>
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs transition-all cursor-pointer border
                        ${isFilterOpen ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                        <Filter size={16} />
                        فیلتر پیشرفته
                    </button>
                </div>
            </div>

            {/* پنل فیلتر کشویی */}
            <div className={`overflow-hidden transition-all duration-500 ${isFilterOpen ? 'max-h-[400px] mb-6' : 'max-h-0'}`}>
                <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-xl shadow-indigo-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 pr-1">کد رهگیری</label>
                            <input value={filters.trackingCode} onChange={(e) => updateFilter('trackingCode', e.target.value)} placeholder="جستجو..." className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-indigo-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 pr-1">نام شهروند</label>
                            <input value={filters.name} onChange={(e) => updateFilter('name', e.target.value)} placeholder="نام..." className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-indigo-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 pr-1">شماره تماس</label>
                            <input value={filters.phone} onChange={(e) => updateFilter('phone', e.target.value)} placeholder="۰۹..." className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-indigo-500 text-left" dir="ltr" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 pr-1">وضعیت درخواست</label>
                            <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 text-xs font-bold text-slate-600 outline-none cursor-pointer">
                                <option value="ALL">همه وضعیت‌ها</option>
                                <option value="REGISTERED">تازه ثبت شده</option>
                                <option value="REVIEWED">تایید بررسی</option>
                                <option value="IN_PROGRESS">در حال انجام</option>
                                <option value="COMPLETED">انجام شده</option>
                                <option value="REJECTED">رد شده</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6 pt-4 border-t border-slate-50">
                        <button onClick={resetFilters} className="flex items-center gap-2 text-xs font-black text-red-400 hover:text-red-600 cursor-pointer"><RotateCcw size={14} /> پاکسازی فیلترها</button>
                    </div>
                </div>
            </div>

            {/* Table */}
            {filteredTickets.length > 0 ? (
                <TicketManagementTable tickets={currentItems} />
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-20 text-center shadow-xs">
                    <p className="text-slate-400 font-black">درخواستی با این مشخصات یافت نشد.</p>
                </div>
            )}

            {/*  */}
            <div className={`flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 bg-white w-full sm:w-fit mx-auto px-6 py-4 rounded-[2rem] border border-slate-200 shadow-sm transition-opacity ${!isPaginationEnabled ? 'opacity-50' : 'opacity-100'}`}>
                <div className="flex items-center gap-4">
                    <button
                        disabled={!isPaginationEnabled || currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className={`p-2.5 rounded-xl border border-slate-100 transition-all text-slate-600 ${!isPaginationEnabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'}`}
                    >
                        <ChevronRight size={20} />
                    </button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                disabled={!isPaginationEnabled}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-xl font-black text-xs transition-all 
                                ${!isPaginationEnabled
                                    ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                                    : (currentPage === i + 1
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 cursor-pointer'
                                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100 cursor-pointer')}`}
                            >
                                {toFarsi(i + 1)}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={!isPaginationEnabled || currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className={`p-2.5 rounded-xl border border-slate-100 transition-all text-slate-600 ${!isPaginationEnabled ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}