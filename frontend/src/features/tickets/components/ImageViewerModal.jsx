import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Maximize2, Download } from 'lucide-react';

export default function ImageViewerModal({ images, onClose }) {
    // اگر عکسی وجود نداشت، مودال را نباید باز کرد یا پیامی داد
    if (!images || images.length === 0) return null;

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={onClose}
        >
            {/* Toolbar - هدر گالری */}
            <div className="flex items-center justify-between p-6 z-10">
                <div className="flex flex-col gap-1">
                    <h3 className="text-white font-black text-lg">مستندات تصویری</h3>
                    <p className="text-slate-400 text-xs font-bold">
                        تصویر {currentIndex + 1} از {images.length}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* دکمه دانلود (فقط برای نمایش در فرانت) */}
                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all cursor-pointer border border-white/10">
                        <Download size={20} />
                    </button>
                    {/* دکمه بستن */}
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/10 hover:bg-red-500 rounded-2xl text-white transition-all cursor-pointer border border-white/10"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Main Stage - نمایشگر اصلی */}
            <div className="flex-1 relative flex items-center justify-center p-4">
                {/* دکمه قبلی */}
                {images.length > 1 && (
                    <button
                        onClick={nextImage} // چون راست‌چین هستیم، بعدی به سمت راست (فارسی)
                        className="absolute right-6 z-20 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white cursor-pointer transition-all border border-white/5 backdrop-blur-sm"
                    >
                        <ChevronRight size={32} />
                    </button>
                )}

                {/* تصویر اصلی با انیمیشن */}
                <div
                    className="relative max-w-5xl w-full h-full flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()}
                >
                    <img
                        key={currentIndex} // برای اعمال مجدد انیمیشن هنگام تغییر تصویر
                        src={images[currentIndex]}
                        className="max-h-[75vh] max-w-full object-contain rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500"
                        alt="Selected documentary"
                    />
                </div>

                {/* دکمه بعدی */}
                {images.length > 1 && (
                    <button
                        onClick={prevImage}
                        className="absolute left-6 z-20 p-4 bg-white/5 hover:bg-white/10 rounded-full text-white cursor-pointer transition-all border border-white/5 backdrop-blur-sm"
                    >
                        <ChevronLeft size={32} />
                    </button>
                )}
            </div>

            {/* Thumbnails Bar - پیش‌نمایش‌های کوچک پایین */}
            {images.length > 1 && (
                <div
                    className="p-8 flex justify-center gap-4 bg-gradient-to-t from-black/50 to-transparent"
                    onClick={(e) => e.stopPropagation()}
                >
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`
                                relative w-20 h-20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2
                                ${currentIndex === idx ? 'border-blue-500 scale-110 shadow-lg shadow-blue-500/20' : 'border-white/10 opacity-40 hover:opacity-100'}
                            `}
                        >
                            <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}