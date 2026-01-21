import React, { useEffect, useState, useRef } from 'react';
import { GuestbookMessage } from '../types';

const Guestbook: React.FC = () => {
    const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
    const [messages, setMessages] = useState<GuestbookMessage[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submittingRef = useRef(false);
    const [status, setStatus] = useState('');
    const [selectedWish, setSelectedWish] = useState<GuestbookMessage | null>(null);

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
                setStatus('Failed to send message. Please try again.');
            }
        } catch (err) {
            setStatus('Error connecting to server.');
        } finally {
            setIsSubmitting(false);
            submittingRef.current = false;
        }
    };

    // Duplicate messages for infinite scroll effect
    const marqueeMessages = [...messages, ...messages];

    return (
        <section id="guestbook" className="py-16 px-6 bg-[#FEFCF8] relative overflow-hidden text-emerald-950">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-10 scroll-reveal">
                    <span className="text-sm uppercase tracking-[0.4em] text-[#D4AF37] font-semibold block mb-3">Digital Guestbook</span>
                    <h2 className="text-3xl md:text-5xl font-serif mb-3">Wishes & Blessings</h2>

                    {/* Wishes Count Indicator */}
                    <div className="inline-flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-900">
                            {messages.length} {messages.length === 1 ? 'Wish' : 'Wishes'} Received
                        </span>
                    </div>

                    <div className="w-20 h-px bg-[#D4AF37] mx-auto opacity-50"></div>
                </div>

                <div className="flex flex-col gap-12">
                    {/* Submission Form */}
                    <div className="max-w-xl mx-auto w-full bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-emerald-50 scroll-reveal">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-serif mb-1">Leave a Blessing</h3>
                            <p className="text-emerald-800/50 text-xs">Your words will become a part of our journey.</p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-emerald-900 tracking-[0.2em] uppercase mb-1.5 ml-1">Your Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all bg-emerald-50/30 text-sm"
                                        placeholder="Name"
                                    />
                                </div>
                                <div className="flex flex-col justify-end">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3 bg-emerald-950 text-[#D4AF37] font-bold rounded-xl hover:bg-emerald-900 transition-all shadow-md disabled:opacity-50 tracking-widest text-[10px] uppercase"
                                    >
                                        {isSubmitting ? 'Posting...' : 'Post Blessing'}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-emerald-900 tracking-[0.2em] uppercase mb-1.5 ml-1">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    rows={2}
                                    className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all resize-none bg-emerald-50/30 text-sm"
                                    placeholder="Write your well wishes here..."
                                />
                            </div>
                            {status && (
                                <p className={`text-center text-xs ${status.includes('Thank') ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {status}
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Infinite Marquee Section */}
                    <div className="relative -mx-6 md:-mx-12 overflow-hidden py-6 group">
                        {messages.length > 0 ? (
                            <div className="animate-marquee hover:[animation-play-state:paused] flex gap-6 whitespace-nowrap">
                                {marqueeMessages.map((msg, idx) => (
                                    <div
                                        key={`${msg.id}-${idx}`}
                                        className="flex-none w-[280px] md:w-[350px] whitespace-normal cursor-pointer"
                                        onClick={() => setSelectedWish(msg)}
                                    >
                                        <div className="h-full bg-white p-6 rounded-[1.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-emerald-50 relative transition-all duration-500 hover:border-[#D4AF37]/30 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between">
                                            <div className="absolute top-4 right-6 text-4xl text-emerald-50 pointer-events-none font-serif">"</div>

                                            <div className="relative z-10">
                                                <p className="text-emerald-800/80 italic mb-6 leading-relaxed text-base font-serif line-clamp-3">
                                                    {msg.message}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 pt-4 border-t border-emerald-50">
                                                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-900 font-bold text-xs">
                                                    {msg.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-serif font-semibold text-sm">{msg.name}</span>
                                                    <span className="text-[8px] uppercase tracking-widest text-[#D4AF37] font-bold">
                                                        {new Date(msg.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white/50 rounded-[2rem] border border-dashed border-emerald-100 text-emerald-800/30 italic mx-6 text-sm">
                                No blessings captured yet. Be the first to grace this page! ✨
                            </div>
                        )}

                        {/* Side Fades for Seamless Marquee */}
                        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#FEFCF8] to-transparent pointer-events-none z-20"></div>
                        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#FEFCF8] to-transparent pointer-events-none z-20"></div>
                    </div>
                </div>
            </div>

            {/* Wish Modal */}
            {selectedWish && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center px-6 md:px-0"
                    onClick={() => setSelectedWish(null)}
                >
                    <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-md animate-in fade-in duration-300"></div>
                    <div
                        className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 border border-emerald-50 animate-in zoom-in-95 fade-in duration-300 pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedWish(null)}
                            className="absolute top-8 right-8 w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-900 hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
                        >
                            ✕
                        </button>

                        <div className="text-center">
                            <div className="text-6xl text-emerald-100 font-serif mb-8 select-none">"</div>
                            <p className="text-2xl md:text-3xl font-serif italic text-emerald-900 leading-relaxed mb-12">
                                {selectedWish.message}
                            </p>

                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-2xl font-bold text-emerald-900 border-2 border-[#D4AF37]/20">
                                    {selectedWish.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-serif font-bold text-emerald-950">{selectedWish.name}</span>
                                    <span className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold mt-1">
                                        {new Date(selectedWish.date).toLocaleDateString(undefined, {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Guestbook;
