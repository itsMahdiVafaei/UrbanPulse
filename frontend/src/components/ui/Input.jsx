import React from 'react';

const Input = ({ label, className = "", ...props }) => {
    return (
        <div className="flex flex-col gap-1.5 w-full text-right">
            {label && (
                <label className="text-xs font-bold text-slate-600 pr-1">
                    {label}
                </label>
            )}
            <input
                className={`border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 bg-slate-50/50 w-full ${className}`}
                {...props}
            />
        </div>
    );
};

export default Input;