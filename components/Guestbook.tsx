import React, { useEffect, useState } from 'react';
import { GuestbookMessage } from '../types';

const Guestbook: React.FC = () => {
    const [messages, setMessages] = useState<GuestbookMessage[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/guestbook');
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            console.error('Error fetching guestbook:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('');

        try {
            const res = await fetch('/api/guestbook', {
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
        }
    };

    return (
        <section id="guestbook" className="py-24 px-6 bg-[#FEFCF8] relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 scroll-reveal">
                    <span className="text-sm uppercase tracking-[0.4em] text-[#D4AF37] font-semibold block mb-4">Digital Guestbook</span>
                    <h2 className="text-4xl md:text-5xl font-serif text-emerald-950 mb-6">Wishes & Blessings</h2>
                    <div className="w-24 h-px bg-[#D4AF37] mx-auto opacity-50"></div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    {/* Submission Form */}
                    <div className="lg:col-span-1 bg-white p-8 rounded-[2rem] shadow-xl border border-emerald-50 scroll-reveal">
                        <h3 className="text-2xl font-serif text-emerald-900 mb-6">Leave a Message</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-emerald-900 tracking-widest uppercase mb-2">Your Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all"
                                    placeholder="e.g. Rahul & Neha"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-emerald-900 tracking-widest uppercase mb-2">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-emerald-100 focus:ring-2 focus:ring-[#D4AF37] outline-none transition-all resize-none"
                                    placeholder="Write your well wishes here..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-emerald-950 text-[#D4AF37] font-bold rounded-xl hover:bg-emerald-900 transition-all shadow-md disabled:opacity-50"
                            >
                                {isSubmitting ? 'Sending...' : 'Post Blessing'}
                            </button>
                            {status && (
                                <p className={`text-center text-sm pt-2 ${status.includes('Thank') ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {status}
                                </p>
                            )}
                        </form>
                    </div>

                    {/* Messages Display */}
                    <div className="lg:col-span-2 space-y-6 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar scroll-reveal">
                        {messages.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {messages.map((msg) => (
                                    <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50 relative group hover:border-[#D4AF37]/30 transition-all duration-300">
                                        <div className="absolute top-4 right-6 text-4xl text-emerald-50 group-hover:text-[#D4AF37]/10 transition-colors">"</div>
                                        <p className="text-emerald-800/80 italic mb-4 leading-relaxed relative z-10">
                                            {msg.message}
                                        </p>
                                        <div className="flex justify-between items-center border-t border-emerald-50 pt-4">
                                            <span className="font-serif text-emerald-950 font-semibold">{msg.name}</span>
                                            <span className="text-[10px] uppercase tracking-wider text-emerald-800/40">
                                                {new Date(msg.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-emerald-800/40 italic">
                                No messages yet. Be the first to leave a blessing! ✨
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Guestbook;
