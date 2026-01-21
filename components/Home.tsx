import React, { useEffect, useState } from 'react';
import Countdown from './Countdown';
import RSVP from './RSVP';
import Journey from './Journey';
import Guestbook from './Guestbook';
import AnimatedStory from './AnimatedStory';


// Static Data (will be fetched from API)

// Images (legacy)
const images = import.meta.glob('../assets/*.{jpg,jpeg,png,webp}', { eager: true });

const getImageUrl = (filename: string) => {
    // If it's a full URL (Firebase), return it as is
    if (filename.startsWith('http')) return filename;

    // 1. Try to find in built assets (handled by Vite's import.meta.glob)
    const key = `../assets/${filename}`;
    const module = images[key] as { default: string } | undefined;
    if (module?.default) return module.default;

    // 2. Fallback to public folder (served at root /assets/...)
    // This is necessary for images uploaded to public/assets but not yet part of the build bundle map
    return `/assets/${filename}`;
};

interface Compliment {
    id?: string;
    name: string;
    img: string;
}

const Home: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [compliments, setCompliments] = useState<Compliment[]>([]);
    const [gallery, setGallery] = useState<{ url: string; caption: string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Compliments
                const compRes = await fetch('/api/compliments');
                const compData = await compRes.json();
                setCompliments(compData.map((item: any) => ({
                    name: item.name,
                    img: getImageUrl(item.img),
                })));

                // Fetch Gallery
                const galleryRes = await fetch('/api/gallery');
                const galleryData = await galleryRes.json();
                setGallery(galleryData.map((item: any) => ({
                    url: getImageUrl(item.url),
                    caption: item.caption
                })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            const elements = document.querySelectorAll('.scroll-reveal');
            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.85) {
                    el.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigateToLocation = () => {
        window.open('https://www.google.com/maps/search/?api=1&query=Mukkam+Kerala', '_blank');
    };

    const shareWebsite = () => {
        if (navigator.share) {
            navigator.share({
                title: "Raoof & Fahmida's Wedding",
                text: "Join us for the wedding celebration of Raoof Subi and Fahmida Najiya on Feb 14th!",
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const timelineItems = [
        {
            time: '10:30 AM',
            event: 'Guest Arrival',
            description: 'We welcome our loved ones to share in our joy as the celebration begins.',
            icon: (
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        },
        {
            time: '11:00 AM',
            event: 'Nikah Ceremony',
            description: 'The sacred bond where two souls become one under the blessings of the Almighty.',
            icon: (
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21l-8.228-9.96a5 5 0 117.542-6.586l.686.832.686-.832a5 5 0 117.542 6.586L12 21z" />
                </svg>
            )
        },
        {
            time: '12:30 PM',
            event: 'Wedding Feast',
            description: 'Enjoy a traditional banquet prepared with love for our esteemed guests.',
            icon: (
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            )
        },
        {
            time: '02:00 PM',
            event: 'Dua & Farewell',
            description: 'Concluding with heartfelt prayers as the couple begins their new life together.',
            icon: (
                <svg className="w-6 h-6 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
                </svg>
            )
        },
    ];

    return (
        <div className="min-h-screen ornament-bg overflow-x-hidden">
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <span className="text-3xl font-cursive text-[#D4AF37] hover:scale-110 transition-transform cursor-default">R & F</span>
                    <div className="hidden md:flex gap-10 text-xs uppercase tracking-[0.2em] text-emerald-900 font-semibold">
                        <a href="#home" className="hover:text-[#D4AF37] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#D4AF37] hover:after:w-full after:transition-all">Home</a>
                        <a href="#couple" className="hover:text-[#D4AF37] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#D4AF37] hover:after:w-full after:transition-all">The Couple</a>
                        <a href="#journey" className="hover:text-[#D4AF37] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#D4AF37] hover:after:w-full after:transition-all">Our Story</a>
                        <a href="#story" className="hover:text-[#D4AF37] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#D4AF37] hover:after:w-full after:transition-all">Our Poem</a>
                        <a href="#event" className="hover:text-[#D4AF37] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#D4AF37] hover:after:w-full after:transition-all">Details</a>
                        <a href="#timeline" className="hover:text-[#D4AF37] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#D4AF37] hover:after:w-full after:transition-all">Timeline</a>
                        <a href="#gallery" className="hover:text-[#D4AF37] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#D4AF37] hover:after:w-full after:transition-all">Gallery</a>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={shareWebsite}
                            className="p-2 rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-emerald-900/40 z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80"
                        alt="Wedding Background"
                        className="w-full h-full object-cover scale-110 animate-slow-zoom"
                    />
                </div>

                <div className="relative z-20 text-center px-6">
                    <div className="scroll-reveal inline-block mb-4">
                        <span className="text-[#D4AF37] text-sm uppercase tracking-[0.4em] font-semibold">The Wedding of</span>
                    </div>
                    <h1 className="scroll-reveal text-6xl md:text-8xl font-serif text-white mb-6 drop-shadow-2xl">
                        Raoof <span className="text-[#D4AF37]">&</span> Fahmida
                    </h1>
                    <div className="scroll-reveal mb-12">
                        <Countdown />
                    </div>
                    <div className="scroll-reveal flex flex-col md:flex-row gap-6 justify-center">
                        <a href="#rsvp" className="px-10 py-4 bg-[#D4AF37] text-emerald-900 font-bold rounded-full hover:bg-white transition-all transform hover:scale-105 shadow-xl">
                            Request a Blessing
                        </a>
                        <button onClick={navigateToLocation} className="px-10 py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 font-bold rounded-full hover:bg-white/20 transition-all transform hover:scale-105">
                            View Location
                        </button>
                    </div>
                </div>
            </header>

            {/* Meet the Couple Section (Caricature) */}
            <section id="couple" className="py-24 px-6 bg-[#FFFBF0] relative">
                <div className="max-w-6xl mx-auto flex flex-col items-center">
                    <div className="scroll-reveal text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-serif text-emerald-950 mb-4">The Happy Couple</h2>
                        <p className="text-[#D4AF37] font-cursive text-2xl">Soulmates forever</p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32 scroll-reveal">
                        {/* Caricature Frame */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-full blur-2xl group-hover:bg-[#D4AF37]/30 transition-all duration-500"></div>
                            <div className="relative z-10 w-72 h-72 md:w-96 md:h-96 rounded-full border-[12px] border-white shadow-2xl overflow-hidden animate-float">
                                <img
                                    src="https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&q=80&w=800"
                                    alt="Couple Caricature Illustration"
                                    className="w-full h-full object-cover grayscale-0 group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center animate-gentle-spin">
                                <span className="text-2xl">💍</span>
                            </div>
                            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center animate-gentle-spin" style={{ animationDirection: 'reverse' }}>
                                <span className="text-2xl">🌸</span>
                            </div>
                        </div>

                        <div className="max-w-md space-y-8 text-center lg:text-left">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-serif text-emerald-900">Raoof & Fahmida</h3>
                                <p className="text-emerald-800/70 leading-relaxed italic">
                                    "In our hearts, we found a love that was written by the Most Merciful. We are excited to embark on this beautiful journey of companionship and faith together."
                                </p>
                            </div>
                            <div className="flex justify-center lg:justify-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-900/5 flex items-center justify-center text-emerald-900 border border-emerald-900/10">
                                    <span className="font-bold text-lg">R</span>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-emerald-900/5 flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/10">
                                    <span className="font-bold text-lg">&</span>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-emerald-900/5 flex items-center justify-center text-emerald-900 border border-emerald-900/10">
                                    <span className="font-bold text-lg">F</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Journey Section */}
            <Journey />

            {/* Cinematic Story Section */}
            <section id="story">
                <AnimatedStory />
            </section>

            {/* Event Details */}
            <section id="event" className="py-24 px-6 bg-white relative overflow-hidden border-t border-[#D4AF37]/10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="scroll-reveal mb-8">
                        <span className="text-4xl text-[#D4AF37]">✨</span>
                    </div>
                    <h2 className="scroll-reveal text-4xl md:text-5xl font-serif text-emerald-900 mb-12">The Celebration</h2>
                    <div className="scroll-reveal grid md:grid-cols-2 gap-12 text-left">
                        <div className="group space-y-4 p-10 rounded-[2.5rem] bg-white border border-emerald-100 shadow-[0_20px_50px_rgba(6,78,59,0.05)] hover:shadow-[0_20px_60px_rgba(6,78,59,0.1)] transition-all duration-500">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-900 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-300">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-[#D4AF37] font-semibold uppercase tracking-widest text-sm">When</h3>
                            <p className="text-2xl font-serif text-emerald-900">February 14, 2026</p>
                            <p className="text-emerald-800/70">Saturday morning at 11:00 AM onwards</p>
                        </div>
                        <div className="group space-y-4 p-10 rounded-[2.5rem] bg-white border border-emerald-100 shadow-[0_20px_50px_rgba(6,78,59,0.05)] hover:shadow-[0_20px_60px_rgba(6,78,59,0.1)] transition-all duration-500">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-900 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-300">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-[#D4AF37] font-semibold uppercase tracking-widest text-sm">Where</h3>
                            <p className="text-2xl font-serif text-emerald-900">Mukkam, Kozhikode</p>
                            <p className="text-emerald-800/70">Kerala, India - Family Residence</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modern Timeline Section */}
            <section id="timeline" className="py-24 px-6 bg-[#FFFBF0] relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl opacity-50 -ml-32 -mb-32"></div>

                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-20 scroll-reveal">
                        <h2 className="text-4xl md:text-5xl font-serif text-emerald-950 mb-4">The Wedding Program</h2>
                        <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
                    </div>

                    <div className="relative">
                        {/* The Main Decorative Line */}
                        <div className="absolute left-[30px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/30 to-[#D4AF37] md:-translate-x-1/2"></div>

                        <div className="space-y-16">
                            {timelineItems.map((item, index) => (
                                <div key={index} className={`relative flex flex-col md:flex-row items-start md:items-center scroll-reveal ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                    {/* Timeline Badge (Circle) */}
                                    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center z-10">
                                        <div className="w-[60px] h-[60px] rounded-full bg-white border-4 border-[#FFFBF0] shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                            <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            {item.icon}
                                        </div>
                                    </div>

                                    {/* Empty space for alternating layout on desktop */}
                                    <div className="hidden md:block md:w-1/2"></div>

                                    {/* Timeline Card */}
                                    <div className={`w-full md:w-[45%] pl-20 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 text-left md:text-right' : 'md:pl-12 text-left'}`}>
                                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-emerald-50 hover:border-[#D4AF37]/30 hover:shadow-[0_15px_50px_rgba(212,175,55,0.1)] transition-all duration-500 group">
                                            <div className={`flex items-center gap-3 mb-3 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                                <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold tracking-widest uppercase">
                                                    {item.time}
                                                </span>
                                            </div>
                                            <h4 className="text-2xl font-serif text-emerald-950 mb-3 group-hover:text-[#D4AF37] transition-colors">{item.event}</h4>
                                            <p className="text-emerald-800/60 leading-relaxed text-sm md:text-base">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center mt-20 scroll-reveal">
                        <p className="text-emerald-800/40 text-sm font-serif italic">"InshaAllah, we look forward to having you with us."</p>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="py-24 px-6 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 scroll-reveal">
                        <span className="text-[#D4AF37] text-sm uppercase tracking-[0.4em] font-semibold block mb-4">Capturing Moments</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-emerald-950 mb-6">Our Wedding Gallery</h2>
                        <div className="w-24 h-1 bg-[#D4AF37] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {gallery.map((photo, index) => (
                            <div key={index} className="scroll-reveal group relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lg hover:shadow-2xl transition-all duration-700">
                                <img
                                    src={photo.url}
                                    alt={photo.caption || 'Wedding Gallery'}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                    <p className="text-white font-serif text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        {photo.caption}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {gallery.length === 0 && (
                        <div className="text-center py-20 text-emerald-800/40 font-serif italic">
                            Beautiful moments are being uploaded...
                        </div>
                    )}
                </div>
            </section>

            {/* RSVP Section */}
            <RSVP />

            {/* With Best Compliments Section */}
            <section className="py-24 px-6 bg-[#FEFCF8] relative overflow-hidden">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(#D4AF37 0.8px, transparent 0.8px)',
                    backgroundSize: '32px 32px'
                }}></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-16 scroll-reveal">
                        <span className="text-sm uppercase tracking-[0.4em] text-[#D4AF37] font-semibold block mb-4">With Gratitude</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-emerald-950 mb-6">With Best Compliments</h2>
                        <div className="w-24 h-px bg-[#D4AF37] mx-auto opacity-50"></div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10 justify-center">
                        {compliments.map((person, index) => (
                            <div key={`${person.name}-${index}`} className="group relative flex flex-col items-center scroll-reveal">

                                {/* Arch Image Container */}
                                <div className="relative w-full max-w-[180px] aspect-[3/4] rounded-t-full overflow-hidden border border-[#D4AF37]/20 shadow-md group-hover:shadow-xl transition-all duration-700">
                                    <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>

                                    <img
                                        src={person.img}
                                        alt={person.name}
                                        className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                                    />

                                    {/* Inner Border for Detail */}
                                    <div className="absolute inset-3 rounded-t-full border border-white/30 pointer-events-none"></div>
                                </div>

                                {/* Name */}
                                <div className="mt-4 text-center relative z-20">
                                    <h3 className="text-lg font-serif text-emerald-950 group-hover:text-[#D4AF37] transition-colors duration-300">
                                        {person.name}
                                    </h3>
                                    <div className="w-0 group-hover:w-full h-0.5 bg-[#D4AF37] transition-all duration-500 mx-auto mt-1 opacity-0 group-hover:opacity-100"></div>
                                </div>

                                {/* Background Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#D4AF37]/5 rounded-full blur-3xl -z-10 group-hover:bg-[#D4AF37]/10 transition-colors duration-500"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Guestbook Section */}
            <Guestbook />

            {/* Footer */}
            <footer className="py-16 px-6 text-center bg-emerald-950 text-emerald-200/50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <span className="text-3xl font-cursive text-[#D4AF37] mb-6 block">R & F</span>
                    <p className="text-sm uppercase tracking-[0.3em] mb-4 text-[#D4AF37]/60">#RaoofSubiWedsFahmidaNajiya</p>
                    <div className="h-px w-20 bg-emerald-800 mx-auto mb-8"></div>
                    <p className="text-xs tracking-widest opacity-40">MAWADDAH • RAHMAH • SAKINAH</p>
                    <p className="text-[10px] mt-8 opacity-30">© 2026 Raoof & Fahmida. Created with Gemini.</p>
                </div>

                {/* Decorative footer pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="w-full h-full ornament-bg"></div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
