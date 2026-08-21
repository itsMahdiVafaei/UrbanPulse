import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Clock, RefreshCw, CheckCircle, ClipboardList, Filter, ChevronRight, ChevronLeft } from 'lucide-react';
import CitizenHeader from './components/CitizenHeader';
import StatCard from './components/StatCard';
import QuickActionBanner from './components/QuickActionBanner';
import TicketListEmpty from './components/TicketListEmpty';
import TicketTable from './components/TicketTable';
import NewTicketModal from './components/NewTicketModal';

const toFarsi = (n) => n?.toLocaleString('fa-IR');

export default function CitizenDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- States برای پجینیشن و فیلتر ---
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'

    const tickets = useSelector(state => state.tickets?.list || []);

    // ۱. منطق مرتب‌سازی (Sort)
    const sortedTickets = useMemo(() => {
        return [...tickets].sort((a, b) => {
            return sortOrder === 'newest' ? b.id - a.id : a.id - b.id;
        });
    }, [tickets, sortOrder]);

    // ۲. منطق پجینیشن (Pagination)
    const totalPages = Math.ceil(sortedTickets.length / itemsPerPage) || 1;
    const isPaginationEnabled = sortedTickets.length > 5;

    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedTickets.slice(start, start + itemsPerPage);
    }, [sortedTickets, currentPage, itemsPerPage]);

    // آمار سریع
    const pending = tickets.filter(t => t.status === 'REGISTERED').length;
    const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length;
    const completed = tickets.filter(t => t.status === 'COMPLETED').length;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-right" dir="rtl">
            <CitizenHeader />

            <main className="max-w-7xl mx-auto p-4 sm:p-6">
                <QuickActionBanner onOpenModal={() => setIsModalOpen(true)} />

                {/* کارت‌های آمار */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard title="در انتظار بررسی" count={pending} icon={<Clock className="text-amber-500" />} />
                    <StatCard title="در حال انجام" count={inProgress} icon={<RefreshCw className="text-blue-500 animate-spin-slow" />} />
                    <StatCard title="تکمیل شده" count={completed} icon={<CheckCircle className="text-emerald-500" />} />
                    <StatCard title="کل درخواست‌ها" count={tickets.length} icon={<ClipboardList className="text-slate-500" />} />
                </div>

                {tickets.length > 0 ? (
                    <div className="space-y-4">
                        {/* نوار ابزار بالای جدول (سمت چپ) */}
                        <div className="flex justify-between items-center px-2">
                            <h3 className="font-black text-slate-700 hidden sm:block text-sm">آخرین فعالیت‌های شما</h3>

                            <div className="flex items-center gap-3 mr-auto">
                                {/* نمایش تعداد مورد */}
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
                                    <span className="text-[10px] font-bold text-slate-400">نمایش:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {setItemsPerPage(Number(e.target.value)); setCurrentPage(1);}}
                                        className="text-xs font-black text-blue-600 outline-none cursor-pointer bg-transparent"
                                    >
                                        {[5, 10, 20].map(n => <option key={n} value={n}>{toFarsi(n)}</option>)}
                                    </select>
                                </div>

                                {/* دراپ‌داون فیلتر/مرتب‌سازی */}
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
                                    <Filter size={14} className="text-slate-400" />
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="text-xs font-black text-slate-600 outline-none cursor-pointer bg-transparent"
                                    >
                                        <option value="newest">جدیدترین‌ها</option>
                                        <option value="oldest">قدیمی‌ترین‌ها</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* جدول درخواست‌ها - حالا لیست برش خورده را می‌فرستیم */}
                        <TicketTable
                            tickets={currentItems}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                        />

                        {/* نوار پجینیشن (استایل جدید) */}
                        <div className={`flex justify-center items-center gap-4 mt-8 bg-white w-full sm:w-fit mx-auto px-6 py-4 rounded-[2rem] border border-slate-200 shadow-sm transition-opacity ${!isPaginationEnabled ? 'opacity-50' : 'opacity-100'}`}>
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
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 cursor-pointer'
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
                ) : (
                    <TicketListEmpty />
                )}
            </main>

            {isModalOpen && <NewTicketModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
}