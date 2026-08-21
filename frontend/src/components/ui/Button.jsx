const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    // استایل‌های مختلف  دکمه
    const variants = {
        primary: 'bg-primary hover:bg-blue-800 text-white',
        outline: 'border-2 border-primary text-primary hover:bg-primary/10',
        danger: 'bg-danger hover:bg-red-700 text-white',
    };

    return (
        <button
            className={`px-6 py-2 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;