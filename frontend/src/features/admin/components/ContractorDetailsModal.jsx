import React from 'react';
import { X, User, Users, Phone, ShieldCheck, Mail, Briefcase } from 'lucide-react';

const toFarsi = (n) => n?.toLocaleString('fa-IR');

export default function ContractorDetailsModal({ contractor, onClose }) {
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">

                {/* Header */}
                <div className="px-10 py-8 bg-linear-to-br from-indigo-50 to-white border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-200">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800">جزئیات اکیپ پیمانکاری</h2>
                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">UrbanPulse Contractor Detail</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer text-slate-400"><X size={24}/></button>
                </div>

                <div className="p-10 overflow-y-auto max-h-[70vh] space-y-8 text-right" dir="rtl">
                    {/* اطلاعات اصلی سرپرست */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full -ml-16 -mt-16"></div>
                        <DetailItem icon={<User size={18}/>} label="نام سرپرست اکیپ" value={contractor.headName} />
                        <DetailItem icon={<ShieldCheck size={18}/>} label="کد ملی سرپرست" value={toFarsi(contractor.nationalCode)} />
                        <DetailItem icon={<Phone size={18}/>} label="شماره تماس" value={toFarsi(contractor.phone)} />
                        <DetailItem icon={<Mail size={18}/>} label="ایمیل ثبت شده" value={contractor.email || 'ثبت نشده'} />
                        <DetailItem icon={<Briefcase size={18}/>} label="رسته تخصصی" value={contractor.category} highlight />
                    </div>

                    {/* لیست اعضای تیم */}
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-700 text-sm flex items-center gap-2 pr-2">
                            <div className="w-1.5 h-4 bg-amber-400 rounded-full"></div>
                            اعضای اکیپ عملیاتی ({toFarsi(contractor.members?.length || 0)} نفر)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {contractor.members?.map((member, idx) => (
                                <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-xs">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-400">
                                            {toFarsi(idx + 1)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-700">{member.name}</span>
                                            <span className="text-[9px] font-bold text-slate-400">کدملی: {toFarsi(member.nationalCode)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-10 py-6 bg-slate-50 border-t flex justify-end">
                    <button onClick={onClose} className="px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs cursor-pointer shadow-lg shadow-indigo-100 transition-all active:scale-95">متوجه شدم</button>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ icon, label, value, highlight }) {
    return (
        <div className="flex items-center gap-3">
            <div className="text-indigo-500 bg-white p-2 rounded-xl border border-slate-100">{icon}</div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400">{label}</span>
                <span className={`text-sm font-black ${highlight ? 'text-indigo-600' : 'text-slate-700'}`}>{value}</span>
            </div>
        </div>
    );
}