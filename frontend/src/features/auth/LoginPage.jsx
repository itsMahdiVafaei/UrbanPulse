import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './authSlice';
import { login as apiLogin, register as apiRegister } from '../../services/api';
import {
    User, ShieldCheck, RefreshCw, ArrowRightLeft,
    UserPlus, AlertCircle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

function saveTokensAndLogin(dispatch, tokens, fallbackRole) {
    localStorage.setItem('urbanpulse_access_token', tokens.access);
    localStorage.setItem('urbanpulse_refresh_token', tokens.refresh);
    const backendUser = tokens.user || {};
    const role = backendUser.role || fallbackRole;
    dispatch(loginSuccess({
        user: {
            id: backendUser.id, name: backendUser.name, phone: backendUser.phone,
            email: backendUser.email, username: backendUser.username,
            category: backendUser.category, memberCount: backendUser.memberCount,
            status: backendUser.status,
        },
        role,
    }));
}

export default function LoginPage() {
    const dispatch = useDispatch();

    const [isCitizen, setIsCitizen] = useState(true);
    const [isRegister, setIsRegister] = useState(false);
    const [orgRole, setOrgRole] = useState('operator');

    const [formData, setFormData] = useState({
        identifier: '', email: '', phone: '', password: '', confirmPassword: '', captchaInput: ''
    });

    const [captchaCode, setCaptchaCode] = useState('');
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const generateCaptcha = () => setCaptchaCode(Math.floor(1000 + Math.random() * 9000).toString());

    useEffect(() => {
        setErrors({});
        setFormData({ identifier: '', email: '', phone: '', password: '', confirmPassword: '', captchaInput: '' });
        generateCaptcha();
    }, [isCitizen, isRegister, orgRole]);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        let e = {};
        if (isRegister) {
            if (formData.identifier.trim().length < 3) e.identifier = "نام کامل الزامی است";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "ایمیل نامعتبر است";
            if (!/^09\d{9}$/.test(formData.phone)) e.phone = "شماره همراه باید ۱۱ رقم باشد";
            if (formData.password.length < 6) e.password = "رمز عبور حداقل ۶ کاراکتر باشد";
            if (formData.password !== formData.confirmPassword) e.confirmPassword = "عدم تطابق رمز عبور";
        } else {
            if (!formData.identifier) e.identifier = "شناسه ورود الزامی است";
            if (!formData.password) e.password = "رمز عبور را وارد کنید";
        }
        if (formData.captchaInput !== captchaCode) e.captchaInput = "کد امنیتی اشتباه است";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setIsLoading(true);
        setErrors({});
        try {
            if (isRegister) {
                await apiRegister({
                    username: formData.phone, phone: formData.phone,
                    password: formData.password, first_name: formData.identifier,
                    email: formData.email,
                });
                const tokens = await apiLogin(formData.phone, formData.password);
                saveTokensAndLogin(dispatch, tokens, 'citizen');
                return;
            }
            const tokens = await apiLogin(formData.identifier, formData.password);
            saveTokensAndLogin(dispatch, tokens, isCitizen ? 'citizen' : orgRole);
        } catch (err) {
            setErrors({ general: err.message || 'اطلاعات واردشده نادرست است یا کاربر در سامانه ثبت نشده است.' });
            generateCaptcha();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 font-sans p-4 text-right" dir="rtl">
            <div className="relative w-full max-w-[420px]">
                <div className={`relative w-full transition-all duration-700 [transform-style:preserve-3d] ${!isCitizen ? '[transform:rotateY(180deg)]' : ''}`}>

                    <div className="w-full [backface-visibility:hidden] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-8 min-h-[560px] flex flex-col transition-all">
                        <CitizenForm
                            isRegister={isRegister} formData={formData} errors={errors}
                            updateField={updateField} captchaCode={captchaCode} generateCaptcha={generateCaptcha}
                            switchView={() => setIsRegister(!isRegister)} toggleRole={() => setIsCitizen(false)}
                            isLoading={isLoading} handleNext={handleNext}
                        />
                    </div>

                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white rounded-[2.5rem] shadow-2xl border border-blue-100 p-8 flex flex-col overflow-hidden">
                        <OrgForm
                            orgRole={orgRole} setOrgRole={setOrgRole} formData={formData} errors={errors}
                            updateField={updateField} captchaCode={captchaCode} generateCaptcha={generateCaptcha}
                            toggleRole={() => setIsCitizen(true)} handleAuth={handleNext} isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function CitizenForm({ isRegister, formData, errors, updateField, captchaCode, generateCaptcha, switchView, toggleRole, isLoading, handleNext }) {
    return (
        <div className="flex flex-col h-full">
            <div className="text-center mb-6 shrink-0">
                <div className="inline-flex p-3 rounded-2xl mb-3 border bg-blue-50 text-blue-600 border-blue-100">
                    {isRegister ? <UserPlus size={28}/> : <User size={28}/>}
                </div>
                <h1 className="text-2xl font-black text-slate-800">{isRegister ? 'عضویت شهروند' : 'ورود شهر'}</h1>
            </div>

            {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500 shrink-0" />
                    <span className="text-[11px] text-red-600 font-bold">{errors.general}</span>
                </div>
            )}

            <form onSubmit={handleNext} className="space-y-4 flex-1">
                {isRegister ? (
                    <>
                        <Input label="نام و نام‌خانوادگی" value={formData.identifier} onChange={e => updateField('identifier', e.target.value)} />
                        {errors.identifier && <ErrorMsg msg={errors.identifier} />}
                        <Input label="پست الکترونیک" type="email" value={formData.email} onChange={e => updateField('email', e.target.value)} />
                        {errors.email && <ErrorMsg msg={errors.email} />}
                        <Input label="شماره همراه" maxLength={11} value={formData.phone} onChange={e => updateField('phone', e.target.value.replace(/\D/g, ''))} />
                        {errors.phone && <ErrorMsg msg={errors.phone} />}
                        <Input label="رمز عبور" type="password" value={formData.password} onChange={e => updateField('password', e.target.value)} />
                        {errors.password && <ErrorMsg msg={errors.password} />}
                        <Input label="تکرار رمز عبور" type="password" value={formData.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} />
                        {errors.confirmPassword && <ErrorMsg msg={errors.confirmPassword} />}
                    </>
                ) : (
                    <>
                        <Input label="شماره همراه" maxLength={11} value={formData.identifier} onChange={e => updateField('identifier', e.target.value.replace(/\D/g, ''))} />
                        {errors.identifier && <ErrorMsg msg={errors.identifier} />}
                        <Input label="کلمه عبور" type="password" value={formData.password} onChange={e => updateField('password', e.target.value)} />
                        {errors.password && <ErrorMsg msg={errors.password} />}
                    </>
                )}
                <CaptchaSection value={formData.captchaInput} code={captchaCode} onChange={v => updateField('captchaInput', v)} onRefresh={generateCaptcha} error={errors.captchaInput} />
                <Button type="submit" disabled={isLoading} className="w-full py-4 rounded-xl bg-blue-600 text-white font-black shadow-lg cursor-pointer mt-4 disabled:opacity-60">
                    {isLoading ? 'در حال پردازش...' : 'مرحله بعد'}
                </Button>
            </form>

            <div className="mt-8 pt-4 border-t border-slate-100 text-center space-y-3">
                <button onClick={switchView} className="text-[11px] text-blue-600 font-black hover:underline cursor-pointer underline-offset-4">
                    {isRegister ? "قبلاً عضو شده‌اید؟ وارد شوید" : "حساب کاربری ندارید؟ ثبت‌نام کنید"}
                </button>
                <button onClick={toggleRole} className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 mx-auto py-2 px-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-all border border-transparent">
                    <ArrowRightLeft size={14} /> پنل سازمان و پیمانکاران
                </button>
            </div>
        </div>
    );
}

function OrgForm({ orgRole, setOrgRole, formData, updateField, errors, captchaCode, generateCaptcha, toggleRole, handleAuth, isLoading }) {
    return (
        <div className="flex flex-col h-full">
            <div className="text-center mb-6 shrink-0">
                <div className="inline-flex p-3 rounded-2xl mb-3 border bg-indigo-50 text-indigo-600 border-indigo-100"><ShieldCheck size={28}/></div>
                <h1 className="text-2xl font-black text-slate-800">ورود سازمان</h1>
            </div>

            {errors.general && <div className="mb-4 p-3 bg-red-50 text-red-600 text-[11px] font-bold rounded-xl text-center">{errors.general}</div>}

            <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
                <button onClick={() => setOrgRole('operator')} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all cursor-pointer ${orgRole === 'operator' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500'}`}>اپراتور</button>
                <button onClick={() => setOrgRole('contractor')} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all cursor-pointer ${orgRole === 'contractor' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-500'}`}>پیمانکار</button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4 flex-1">
                <Input label="شناسه کاربری / شماره همراه" value={formData.identifier} onChange={e => updateField('identifier', e.target.value)} />
                {errors.identifier && <ErrorMsg msg={errors.identifier} />}
                <Input label="رمز عبور مدیریتی" type="password" value={formData.password} onChange={e => updateField('password', e.target.value)} />
                {errors.password && <ErrorMsg msg={errors.password} />}
                <CaptchaSection value={formData.captchaInput} code={captchaCode} onChange={v => updateField('captchaInput', v)} onRefresh={generateCaptcha} error={errors.captchaInput} />
                <Button type="submit" disabled={isLoading} className={`w-full py-4 rounded-xl text-white font-black shadow-lg transition-all active:scale-95 cursor-pointer mt-4 disabled:opacity-60 ${orgRole === 'contractor' ? 'bg-amber-500 shadow-amber-200' : 'bg-indigo-600 shadow-indigo-200'}`}>
                    {isLoading ? 'در حال پردازش...' : 'تایید و ورود'}
                </Button>
            </form>

            <button onClick={toggleRole} className="mt-8 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 mx-auto py-2 px-4 rounded-xl hover:bg-slate-50 cursor-pointer transition-all border border-transparent">
                <ArrowRightLeft size={14} /> بازگشت به ورود شهروندی
            </button>
        </div>
    );
}

function CaptchaSection({ value, code, onChange, onRefresh, error }) {
    return (
        <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-600 pr-1">کد امنیتی</label>
            <div className="flex items-center gap-2 h-11">
                <input placeholder="کد" value={value} onChange={e => onChange(e.target.value.replace(/\D/g, ''))} className="flex-1 h-full border border-slate-200 rounded-xl px-4 text-sm outline-none focus:border-indigo-500 bg-slate-50/50" />
                <div className="w-24 h-full bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center gap-2 px-2">
                    <span className="text-slate-700 font-bold tracking-widest italic text-sm">{code}</span>
                    <RefreshCw size={14} className="text-slate-400 cursor-pointer hover:rotate-180 transition-all" onClick={onRefresh} />
                </div>
            </div>
            {error && <ErrorMsg msg={error} />}
        </div>
    );
}

function ErrorMsg({ msg }) {
    return <p className="text-[9px] text-red-500 font-bold pr-1 mt-1">{msg}</p>;
}
