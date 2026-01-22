import React, { useEffect, useState, useRef } from 'react';
import { GuestbookMessage } from '../types';

const rotations = [-2, -1, 0, 1, 2];

const Guestbook: React.FC = () => {
    const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

    const [messages, setMessages] = useState<GuestbookMessage[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submittingRef = useRef(false);
    const [status, setStatus] = useState('');
    const [selectedWish, setSelectedWish] = useState<GuestbookMessage | null>(null);

    const [showMobileWall, setShowMobileWall] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/guestbook`);
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.error('Error fetching guestbook:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting || submittingRef.current) return;

        submittingRef.current = true;
        setIsSubmitting(true);
        setStatus('');

        try {
            const res = await fetch(`${API_BASE}/api/guestbook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, message })
            });

            if (res.ok) {
                setName('');
                setMessage('');
                setStatus('Thank you for your blessing!');
                fetchMessages();
            } else {
                setStatus('Failed to send message.');
            }
        } catch {
            setStatus('Server error.');
        } finally {
            setIsSubmitting(false);
            submittingRef.current = false;
        }
    };

    return (
        <section
            id="guestbook"
            className="relative py-28 px-6 text-emerald-950 overflow-hidden"
            style={{
                backgroundImage: `
                  linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45)),
                  radial-gradient(circle at 30% 20%, rgba(255,220,160,0.25), transparent 45%),
                  url('/home-wall.png')
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* grain */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.7%22/%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]"></div>

            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div className="text-center mb-20 text-white">
                    <span className="text-sm uppercase tracking-[0.4em] text-[#FFD88A] font-semibold block mb-3">
                        Our Home
                    </span>
                    <h2 className="text-3xl md:text-5xl font-serif mb-3">
                        Memory Wall
                    </h2>
                    <p className="text-white/70 italic text-sm">
                        A corner of our home filled with love.
                    </p>
                    <div className="w-28 h-px bg-[#FFD88A] mx-auto mt-4 opacity-70"></div>
                </div>

                {/* Form */}
                <div className="max-w-xl mx-auto mb-28 bg-white/95 backdrop-blur p-10 rounded-[2.5rem] shadow-[0_30px_80px_rgba(0,0,0,0.4)] border border-white/40 animate-scale">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Your name"
                            className="w-full px-4 py-3 rounded-xl border border-emerald-100"
                        />
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            rows={3}
                            placeholder="Write a memory or blessing..."
                            className="w-full px-4 py-3 rounded-xl border border-emerald-100 resize-none"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-emerald-950 text-[#FFD88A] rounded-xl font-bold tracking-widest"
                        >
                            {isSubmitting ? 'Posting...' : 'Pin to Wall'}
                        </button>
                        {status && (
                            <p className="text-center text-sm mt-2">
                                {status}
                            </p>
                        )}
                    </form>
                </div>

                {/* Mobile toggle */}
                <div className="flex justify-center mb-10 lg:hidden">
                    <button
                        onClick={() => setShowMobileWall(!showMobileWall)}
                        className="px-6 py-3 bg-[#FFD88A] text-emerald-950 rounded-full font-bold shadow-lg"
                    >
                        {showMobileWall ? 'Hide Compliments' : 'View Compliments'}
                    </button>
                </div>

                {/* Wall */}
                <div className={`${showMobileWall ? 'block' : 'hidden'} lg:block`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-14">
                        {messages.map((msg, index) => {
                            const rotate = rotations[index % rotations.length];

                            return (
                                <div
                                    key={msg.id}
                                    onClick={() => setSelectedWish(msg)}
                                    className="cursor-pointer animate-card"
                                    style={{
                                        transform: `rotate(${rotate}deg)`,
                                        animationDelay: `${index * 120}ms`
                                    }}
                                >
                                    <div className="relative bg-[#FFFDF8] p-6 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.35)] border border-emerald-100">
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FFD88A] shadow"></div>

                                        <p className="font-serif italic text-emerald-900 leading-relaxed mb-6">
                                            {msg.message}
                                        </p>

                                        <div className="text-right text-sm">
                                            <div className="font-bold">{msg.name}</div>
                                            <div className="text-[#FFD88A] text-xs">
                                                {new Date(msg.date).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {selectedWish && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60"
                    onClick={() => setSelectedWish(null)}
                >
                    <div
                        className="bg-white max-w-xl w-full p-12 rounded-2xl shadow-2xl animate-scale"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <p className="text-2xl font-serif italic mb-6">
                            {selectedWish.message}
                        </p>
                        <div className="text-right">
                            <div className="font-bold text-lg">{selectedWish.name}</div>
                            <div className="text-sm text-[#FFD88A]">
                                {new Date(selectedWish.date).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Guestbook;
