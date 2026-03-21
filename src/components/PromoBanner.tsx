import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const PromoBanner = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const isClosed = localStorage.getItem('promo-banner-closed');
        if (isClosed === 'true') {
            setIsVisible(false);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        localStorage.setItem('promo-banner-closed', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="bg-[#dcf65b] text-[#558600] px-4 py-1.5 text-center text-[11px] font-bold tracking-wide uppercase relative z-[100] border-b border-[#558600]/10 flex justify-center items-center">
            <span>We are free till 31 March 2026</span>
            <button
                onClick={handleClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#558600] hover:text-[#3a5e00] transition-colors p-1"
                aria-label="Close banner"
            >
                <X size={14} strokeWidth={2.5} />
            </button>
        </div>
    );
};
