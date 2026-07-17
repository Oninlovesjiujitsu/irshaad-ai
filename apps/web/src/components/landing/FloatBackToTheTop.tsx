'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const SHOW_AFTER = 600;

export default function FloatBackToTheTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            {/* SVG Gradient Definition */}
            <svg width="0" height="0" className="absolute pointer-events-none">
                <defs>
                    <linearGradient id="primary-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        {/* Neon green to emerald gradient matching the branding */}
                        <stop offset="0%" stopColor="hsl(85, 100%, 50%)" />
                        <stop offset="100%" stopColor="hsl(142, 70%, 45%)" />
                    </linearGradient>
                </defs>
            </svg>

            <button
                onClick={scrollTop}
                aria-label="Back to top"
                tabIndex={visible ? 0 : -1}
                className={`fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-primary/5 hover:bg-primary/15 border border-primary/20 hover:border-primary/40 backdrop-blur-md transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_15px_rgba(133,255,0,0.15)] hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50 ${visible
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
            >
                <ArrowUp
                    size={20}
                    stroke="url(#primary-gradient)"
                    strokeWidth={2.5}
                    className="transition-transform duration-300 hover:-translate-y-0.5"
                />
            </button>
        </>
    );
}
