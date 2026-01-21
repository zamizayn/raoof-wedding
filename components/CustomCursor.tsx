import React, { useState, useEffect } from 'react';

const CustomCursor: React.FC = () => {
    const [position, setPosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable = target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('cursor-pointer');
            setIsHovering(isClickable);
        };

        const handleMouseOut = () => {
            setIsVisible(false);
        };

        window.addEventListener('mousemove', updatePosition);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mouseleave', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mouseleave', handleMouseOut);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <>
            {/* Main Spotlight Cursor */}
            <div
                className={`fixed pointer-events-none z-[100] transition-transform duration-300 ease-out mix-blend-screen overflow-hidden`}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: `translate(-50%, -50%) scale(${isHovering ? 2.5 : 1})`,
                    width: '60px',
                    height: '60px',
                    background: 'radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, rgba(212, 175, 55, 0) 70%)',
                    borderRadius: '50%',
                    filter: 'blur(5px)'
                }}
            />

            {/* Tiny Dot Cursor */}
            <div
                className="fixed pointer-events-none z-[101] w-1.5 h-1.5 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]"
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)',
                }}
            />

            <style>{`
                @media (hover: none) and (pointer: coarse) {
                    div[style*="z-[100]"], div[style*="z-[101]"] {
                        display: none !important;
                    }
                }
                * {
                    cursor: none !important;
                }
                a, button, [role="button"] {
                    cursor: none !important;
                }
            `}</style>
        </>
    );
};

export default CustomCursor;
