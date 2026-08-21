import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UserPlus, FileUp, Edit3, Trash2, Eye, Search, Filter, RotateCcw, HardHat, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { deleteContractor, addContractor, updateContractor } from '../adminSlice';
import ContractorFormModal from '../components/ContractorFormModal';
import ContractorDetailsModal from '../components/ContractorDetailsModal';
import ExcelUploadModal from '../components/ExcelUploadModal';

const toFarsi = (n) => n?.toLocaleString('fa-IR');

const SKILLS = [
    "اکیپ آسفالت و لکه‌گیری",
    "تأسیسات برق و روشنایی معابر",
    "فضای سبز و باغبانی",
    "خدمات پسماند و جمع‌آوری زباله",
    "عمران، بنایی و جدول‌گذاری",
    "فوریت‌های آب و فاضلاب",
    "کنترل حیوانات و بهداشت محیط"
];

export default function AdminContractorsTab() {
    const dispatch = useDispatch();
    const contractors = useSelector(state => state.admin?.contractors || []);
    const allTickets = useSelector(state => state.tickets?.list || []);

    // --- States ---
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterCategory, setFilterCategory] = useState('ALL');

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isExcelOpen, setIsExcelOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [selectedContractor, setSelectedContractor] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '' });

    // --- Logic: Task Queue & Toast ---
    const showMissionToast = (c, taskCount) => {
        if (taskCount === 0) return;
        const msg = `اکیپ "${c.headName}" در حال انجام ${toFarsi(taskCount)} مأموریت فعال می‌باشد.`;
        setToast({ show: true, message: msg });
        setTimeout(() => setToast({ show: false, message: '' }), 3500);
    };

    // --- Logic: Filtering ---
    const filtered = useMemo(() => {
        return contractors.filter(c => {
            const matchName = (c.headName || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = filterStatus === 'ALL' || c.status === filterStatus;
            const matchCategory = filterCategory === 'ALL' || c.category === filterCategory;
            return matchName && matchStatus && matchCategory;
        });
    }, [contractors, searchTerm, filterStatus, filterCategory]);

    // --- Logic: Pagination ---
    const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
    const isPaginationEnabled = filtered.length > 5; // فعال شدن فقط برای بیش از ۵ مورد

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filtered.slice(start, start + itemsPerPage);
    }, [filtered, currentPage, itemsPerPage]);

    const resetFilters = () => {
        setSearchTerm(''); setFilterStatus('ALL'); setFilterCategory('ALL'); setCurrentPage(1);
    };

    return (
        <div className="space-y-6 text-right relative" dir="rtl">

            {/* Toast Notification */}
            {toast.show && (
                <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-10 duration-500">
                    <div className="bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md font-black text-sm">
                        <CheckCircle size={20} />
                        {toast.message}
                    </div>
                </div>
            )}

            {/* Toolbar: Responsive 2x2 in Mobile */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 px-2">
                <div className="flex items-center gap-3">
                    <h3 className="font-black text-slate-700 text-lg">مدیریت پیمانکاران</h3>
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-3 py-1.5 rounded-xl border border-indigo-200">
                        {toFarsi(filtered.length)} اکیپ
                    </span>
                </div>

                <div className="w-full lg:w-auto grid grid-cols-2 lg:flex items-center gap-3">
                    <button onClick={() => { setSelectedContractor(null); setIsFormOpen(true); }} className="order-1 flex items-center justify-center gap-2 px-5 py-3 bg-amber-400 text-amber-950 rounded-2xl font-black text-xs hover:bg-amber-300 shadow-lg shadow-amber-500/20 transition-all cursor-pointer">
                        <UserPlus size={16} /> ثبت اکیپ
                    </button>
                    <button onClick={() => setIsExcelOpen(true)} className="order-2 flex items-center justify-center gap-2 px-5 py-3 bg-white text-slate-600 border border-slate-200 rounded-2xl font-black text-xs hover:bg-slate-50 cursor-pointer shadow-sm">
                        <FileUp size={16} className="text-emerald-500" /> بارگذاری اکسل
                    </button>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`order-3 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-black text-xs transition-all cursor-pointer border
                        ${isFilterOpen ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                        <Filter size={16} /> فیلتر
                    </button>
                    <div className="order-4 flex items-center justify-center gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs">
                        <span className="text-[10px] font-bold text-slate-400">نمایش:</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                            className="text-xs font-black text-indigo-600 outline-none bg-transparent cursor-pointer"
                        >
                            {[5, 10, 50, 100].map(n => <option key={n} value={n}>{toFarsi(n)} مورد</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Filter Panel */}
            <div className={`overflow-hidden transition-all duration-500 ${isFilterOpen ? 'max-h-[400px] mb-6' : 'max-h-0'}`}>
                <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-xl shadow-indigo-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 pr-1">نام سرپرست</label>
                            <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="جستجو..." className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 text-xs outline-none focus:border-indigo-500" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 pr-1">رسته مهارتی</label>
                            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-600 outline-none">
                                <option value="ALL">همه موارد</option>
                                {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 pr-1">وضعیت مأموریت</label>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-3 text-xs font-bold text-slate-600 outline-none">
                                <option value="ALL">همه وضعیت‌ها</option>
                                <option value="FREE">آماده‌به‌کار (آزاد)</option>
                                <option value="BUSY">در حال مأموریت</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end mt-6 pt-4 border-t border-slate-50">
                        <button onClick={resetFilters} className="flex items-center gap-2 text-xs font-black text-red-400 hover:text-red-600 cursor-pointer"><RotateCcw size={14} /> پاکسازی فیلتر</button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[1100px]">
                        <thead className="bg-slate-50/50 border-b border-slate-100 font-black text-[11px] text-slate-400 uppercase">
                        <tr>
                            <th className="px-6 py-5 text-right whitespace-nowrap">ردیف</th>
                            <th className="px-6 py-5 text-right whitespace-nowrap">سرپرست اکیپ</th>
                            <th className="px-6 py-5 text-right whitespace-nowrap text-indigo-600">تماس / ایمیل</th>
                            <th className="px-6 py-5 text-right whitespace-nowrap">رسته</th>
                            <th className="px-6 py-5 text-right whitespace-nowrap">نفرات</th>
                            <th className="px-6 py-5 text-right whitespace-nowrap">وضعیت عملیاتی</th>
                            <th className="px-6 py-5 text-center whitespace-nowrap">عملیات</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                        {paginatedItems.length > 0 ? (
                            paginatedItems.map((c, idx) => {
                                // محاسبه هوشمند تعداد کارهای در دست انجام این اکیپ
                                const activeTaskCount = allTickets.filter(t => t.assignedTo === c.headName && t.status === 'IN_PROGRESS').length;

                                return (
                                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5 text-slate-300">{toFarsi((currentPage - 1) * itemsPerPage + idx + 1)}</td>
                                        <td className="px-6 py-5 font-black">{c.headName}</td>
                                        <td className="px-6 py-5 flex flex-col gap-0.5">
                                            <span className="font-mono text-indigo-600 text-xs">{toFarsi(c.phone)}</span>
                                            <span className="text-[10px] text-slate-400">{c.email || '---'}</span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[10px] font-black">{c.category}</span>
                                        </td>
                                        <td className="px-6 py-5 text-indigo-600">{toFarsi(c.memberCount)} نفر</td>
                                        <td className="px-6 py-5">
                                            <span
                                                onClick={() => showMissionToast(c, activeTaskCount)}
                                                className={`px-3 py-1.5 rounded-full text-[10px] font-black border transition-all
                                                ${activeTaskCount === 0
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200 cursor-pointer hover:bg-amber-500 hover:text-white'}`}
                                            >
                                                {activeTaskCount === 0 ? 'آماده‌به‌کار' : `در حال مأموریت (${toFarsi(activeTaskCount)})`}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => {setSelectedContractor(c); setActiveModal('details');}} className="p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-xl cursor-pointer shadow-xs transition-all"><Eye size={16}/></button>
                                                <button onClick={() => {setSelectedContractor(c); setIsFormOpen(true);}} className="p-2 bg-slate-50 text-slate-400 hover:text-amber-600 rounded-xl cursor-pointer shadow-xs transition-all"><Edit3 size={16}/></button>
                                                <button onClick={() => { if(window.confirm(`آیا از حذف اکیپ "${c.headName}" اطمینان دارید؟`)) dispatch(deleteContractor(c.id)); }} className="p-2 bg-slate-50 text-slate-400 hover:text-red-600 rounded-xl cursor-pointer shadow-xs transition-all"><Trash2 size={16}/></button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="py-24 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <HardHat size={48} className="text-slate-200" />
                                        <p className="text-slate-400 font-black text-sm">هیچ اکیپ پیمانکاری یافت نشد.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination: Always Visible, Disabled if <= 5 items */}
            <div className={`flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 bg-white w-full sm:w-fit mx-auto px-6 py-4 rounded-[2rem] border border-slate-200 shadow-sm transition-opacity ${!isPaginationEnabled ? 'opacity-50' : 'opacity-100'}`}>
                <div className="flex items-center gap-4">
                    <button
                        disabled={!isPaginationEnabled || currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="p-2.5 rounded-xl border border-slate-100 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-50 transition-all text-slate-600"
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
                                ${!isPaginationEnabled ? 'bg-slate-50 text-slate-300' : (currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 cursor-pointer' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 cursor-pointer')}`}
                            >
                                {toFarsi(i + 1)}
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={!isPaginationEnabled || currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="p-2.5 rounded-xl border border-slate-100 disabled:cursor-not-allowed cursor-pointer hover:bg-slate-50 transition-all text-slate-600"
                    >
                        <ChevronLeft size={20} />
                    </button>
                </div>
            </div>

            {/* Modals */}
            {isFormOpen && <ContractorFormModal onClose={() => {setIsFormOpen(false); setSelectedContractor(null);}} onSave={(d) => selectedContractor ? dispatch(updateContractor(d)) : dispatch(addContractor(d))} initialData={selectedContractor} />}
            {isExcelOpen && <ExcelUploadModal onClose={() => setIsExcelOpen(false)} />}
            {activeModal === 'details' && <ContractorDetailsModal contractor={selectedContractor} onClose={() => setActiveModal(null)} />}
        </div>
    );
}