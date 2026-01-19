import React, { useEffect, useState } from 'react';
import { JourneyMilestone } from '../types';

const Journey: React.FC = () => {
    const [milestones, setMilestones] = useState<JourneyMilestone[]>([]);

    useEffect(() => {
        fetch('/api/journey')
            .then(res => res.json())
            .then(data => setMilestones(data))
            .catch(err => console.error('Error fetching journey:', err));
    }, []);

    return (
        <section id="journey" className="py-24 px-6 bg-white relative overflow-hidden">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-20 relative flex flex-col items-center">
                    <div className="flex items-center justify-center gap-8 mb-4">
                        {/* Groom SVG */}
                        <div className="transition-transform hover:scale-110 duration-500">
                            <svg width="100" height="100" viewBox="0 0 100 100" className="text-emerald-900">
                                <circle cx="50" cy="50" r="48" fill="#FFFBF0" stroke="#D4AF37" strokeWidth="2" />
                                <path d="M50 30c-8 0-15 6-15 15 0 6 4 11 10 14 -5 5-10 12-10 21h30c0-9-5-16-10-21 6-3 10-8 10-14 0-9-7-15-15-15z" fill="currentColor" />
                                <path d="M35 45c0-8 7-15 15-15s15 7 15 15c0 8-7 15-15 15S35 53 35 45z" fill="white" />
                                <path d="M42 38l8-2 8 2M45 42h10M48 45h4" stroke="#D4AF37" strokeWidth="1" fill="none" />
                            </svg>
                        </div>

                        <div className="text-center">
                            <span className="text-[#D4AF37] text-sm uppercase tracking-[0.4em] font-bold block mb-2">Our Story</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-emerald-950">How We Met</h2>
                        </div>

                        {/* Bride SVG */}
                        <div className="transition-transform hover:scale-110 duration-500">
                            <svg width="100" height="100" viewBox="0 0 100 100" className="text-[#D4AF37]">
                                <circle cx="50" cy="50" r="48" fill="#FFFBF0" stroke="currentColor" strokeWidth="2" />
                                <path d="M50 25c-10 0-18 8-18 18 0 7 4 13 10 16 -6 6-12 14-12 25h40c0-11-6-19-12-25 6-3 10-9 10-16 0-10-8-18-18-18z" fill="currentColor" />
                                <path d="M32 43c0-10 8-18 18-18s18 8 18 18c0 10-8 18-18 18S32 53 32 43z" fill="white" />
                                <circle cx="50" cy="35" r="2" fill="white" />
                                <path d="M40 65q10 10 20 0" stroke="white" strokeWidth="1" fill="none" />
                            </svg>
                        </div>
                    </div>
                    <div className="w-24 h-1 bg-[#D4AF37] rounded-full"></div>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/20 to-[#D4AF37] md:-translate-x-1/2"></div>

                    <div className="space-y-24">
                        {milestones.map((milestone, index) => (
                            <div key={milestone.id} className={`relative flex flex-col md:flex-row items-start md:items-center scroll-reveal ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Badge/Circle */}
                                <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center z-10">
                                    <div className="w-4 h-4 rounded-full bg-[#D4AF37] ring-8 ring-[#D4AF37]/10"></div>
                                </div>

                                {/* Content Side */}
                                <div className={`w-full md:w-[45%] pl-20 md:pl-0 ${index % 2 !== 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                                    <div className="space-y-4">
                                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold tracking-widest uppercase">
                                            {milestone.date}
                                        </span>
                                        <h3 className="text-3xl font-serif text-emerald-900">{milestone.title}</h3>
                                        <p className="text-emerald-800/70 leading-relaxed italic">
                                            "{milestone.description}"
                                        </p>
                                    </div>
                                </div>

                                {/* Image Side */}
                                <div className={`w-full md:w-[45%] pl-20 md:pl-0 mt-8 md:mt-0 ${index % 2 !== 0 ? 'md:pl-16' : 'md:pr-16'}`}>
                                    <div className="relative group">
                                        <div className="absolute -inset-2 bg-[#D4AF37]/10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="relative rounded-[2rem] overflow-hidden aspect-video shadow-lg group-hover:shadow-2xl transition-all duration-700">
                                            <img
                                                src={milestone.image}
                                                alt={milestone.title}
                                                className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Journey;
