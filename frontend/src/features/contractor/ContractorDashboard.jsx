import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Clock, CheckCircle2, ClipboardList, AlertCircle, HardHat } from 'lucide-react';
import ContractorHeader from './components/ContractorHeader';
import ContractorTaskTable from './components/ContractorTaskTable';
import StatCard from '../tickets/components/StatCard';
import ContractorSidebar from './components/ContractorSidebar';

export default function ContractorDashboard() {
    const { user } = useSelector(state => state.auth);
    const allTickets = useSelector(state => state.tickets?.list || []);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // فیلتر مأموریت‌های مخصوص این اکیپ (بر اساس شماره تماس یا نام)
    const myTasks = useMemo(() => {
        return allTickets.filter(t =>
            t.assignedTo === user?.phone && // تطبیق با شماره موبایل پیمانکار لاگین شده
            t.status !== 'REGISTERED'       // تیکت‌های عمومی رو نمیخوام ببینه
        );
    }, [allTickets, user]);

    // محاسبات آمار جدید
    const total = myTasks.length;
    const pendingAction = myTasks.filter(t => t.status === 'REGISTERED' || t.status === 'REVIEWED').length; // مأموریت‌های جدید
    const inProgress = myTasks.filter(t => t.status === 'IN_PROGRESS').length;
    const completed = myTasks.filter(t => t.status === 'COMPLETED').length;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-right" dir="rtl">
            <ContractorHeader onOpenMenu={() => setIsMenuOpen(true)} />

            <main className="max-w-7xl mx-auto p-6">
                <div className="mb-10 flex items-center gap-4">
                    <div className="bg-amber-500 w-2 h-10 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.4)]"></div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">میز کار مأموریت‌های اکیپ</h2>
                        <p className="text-slate-400 text-xs font-bold mt-1">مدیریت پروژه‌های ابلاغی سازمان</p>
                    </div>
                </div>

                {/* کارت‌های آمار ۴ گانه اصلاح شده */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <StatCard title="مأموریت‌های جدید" count={pendingAction} icon={<AlertCircle className="text-blue-500" />} />
                    <StatCard title="در حال اجرا" count={inProgress} icon={<Clock className="text-amber-500" />} />
                    <StatCard title="پایان یافته" count={completed} icon={<CheckCircle2 className="text-emerald-500" />} />
                    <StatCard title="کل مأموریت‌ها" count={total} icon={<ClipboardList className="text-slate-500" />} />
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="font-black text-slate-700 text-lg">لیست مأموریت‌های جاری</h3>
                        <span className="bg-white px-4 py-1.5 rounded-full border border-slate-200 text-[10px] font-black text-slate-400">آپدیت زنده</span>
                    </div>

                    {myTasks.length > 0 ? (
                        <ContractorTaskTable tasks={myTasks} />
                    ) : (
                        <div className="bg-white rounded-[3rem] border border-slate-200 p-20 text-center shadow-xs">
                            <HardHat size={48} className="text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-black">مأموریت فعالی در کارتابل شما وجود ندارد.</p>
                        </div>
                    )}
                </div>
            </main>

            <ContractorSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} user={user} />
        </div>
    );
}