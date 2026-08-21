import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Clock, RefreshCw, ClipboardList, CheckCircle, Users, HardHat } from 'lucide-react';
import AdminHeader from './components/AdminHeader';
import StatCard from '../tickets/components/StatCard';
import AdminTicketsTab from './tabs/AdminTicketsTab';
import AdminContractorsTab from './tabs/AdminContractorsTab';
import AdminCitizensTab from './tabs/AdminCitizensTab';

const toFarsi = (n) => n.toLocaleString('fa-IR');

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('tickets');
    const tickets = useSelector(state => state.tickets?.list || []);

    // --- محاسبات زنده آمار ادمین ---

    // ۱. درخواست‌های تازه و تایید بررسی شده
    const pending = tickets.filter(t => t.status === 'REGISTERED' || t.status === 'REVIEWED').length;

    // ۲. درخواست‌هایی که به اکیپ ارجاع شده و در حال انجام هستند
    const progress = tickets.filter(t => t.status === 'IN_PROGRESS').length;

    // ۳. درخواست‌هایی که با موفقیت به پایان رسیده‌اند
    const completedCount = tickets.filter(t => t.status === 'COMPLETED').length;

    // ۴. کل درخواست‌های ثبت شده در سیستم
    const totalCount = tickets.length;

    const tabs = [
        { id: 'tickets', label: 'درخواست‌های کاربران', icon: <ClipboardList size={18} /> },
        { id: 'contractors', label: 'مدیریت پیمانکاران', icon: <HardHat size={18} /> },
        { id: 'citizens', label: 'مدیریت شهروندان', icon: <Users size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-right" dir="rtl">
            <AdminHeader />

            <main className="max-w-7xl mx-auto p-4 sm:p-6">
                {/* بخش کارت‌های آمار ۴ گانه ادمین */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* کارت ۱: جدیدها */}
                    <StatCard title="در انتظار بررسی" count={pending} icon={<Clock className="text-amber-500" />} />

                    {/* کارت ۲: عملیاتی‌ها */}
                    <StatCard title="در حال انجام" count={progress} icon={<RefreshCw className="text-blue-500 animate-spin-slow" />} />

                    {/* کارت ۳: تکمیل شده‌ها (جدید) */}
                    <StatCard title="درخواست‌های انجام شده" count={completedCount} icon={<CheckCircle className="text-emerald-500" />} />

                    {/* کارت ۴: آمار کل */}
                    <StatCard title="کل درخواست‌های شهر" count={totalCount} icon={<ClipboardList className="text-indigo-500" />} />
                </div>

                {/* نوار تب‌های مدیریتی */}
                <div className="mb-8 overflow-x-auto pb-2">
                    <div className="flex gap-2 bg-slate-100 p-1.5 rounded-[2rem] w-max sm:w-fit border border-slate-200 shadow-inner">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 sm:px-8 py-3 rounded-[1.5rem] text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap
                                ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* محتوای تب فعال */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'tickets' && <AdminTicketsTab />}
                    {activeTab === 'contractors' && <AdminContractorsTab />}
                    {activeTab === 'citizens' && <AdminCitizensTab />}
                </div>
            </main>
        </div>
    );
}