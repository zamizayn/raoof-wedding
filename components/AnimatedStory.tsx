import React, { useState, useEffect } from 'react';

const scenes = [
    {
        image: "https://images.unsplash.com/photo-1484863137850-59afccd319ba?auto=format&fit=crop&q=80&w=2000",
        text: "Every story begins on an ordinary day... until life decides otherwise.",
        subtext: "Raoof finishes another day at work, unaware that destiny has already planned his next step."
    },
    {
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000",
        text: "Dressed sharper than usual, Raoof is driven not to a bank...",
        subtext: "But to a place glowing with warmth, elegance, and quiet anticipation. 'This is the bank,' they say — 'where you invest your life.'"
    },
    {
        image: "https://images.unsplash.com/photo-1519225421980-715cb30af504?auto=format&fit=crop&q=80&w=2000",
        text: "Inside, Fahmida waits. One glance. One moment. Time slows.",
        subtext: "Over a simple cup of tea, surprise turns into comfort, and comfort quietly becomes connection."
    },
    {
        image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=2000",
        text: "What began as an unexpected meeting unfolds into something beautiful, meaningful, and forever.",
        subtext: "With hearts aligned and families smiling, a promise is made."
    },
    {
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=2000",
        text: "Raoof & Fahmida begin their journey together.",
        subtext: "February 14, 2026. Save the Date."
    }
];

const AnimatedStory: React.FC = () => {
    const [currentScene, setCurrentScene] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            nextScene();
        }, 6000);
        return () => clearInterval(interval);
    }, [currentScene]);

    const nextScene = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentScene((prev) => (prev + 1) % scenes.length);
            setIsTransitioning(false);
        }, 1000);
    };

    return (
        <section className="relative h-screen w-full overflow-hidden bg-emerald-950">
            {/* Background Image with Ken Burns Effect */}
            {scenes.map((scene, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentScene ? 'opacity-100' : 'opacity-0'}`}
                >
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <img
                        src={scene.image}
                        alt="Story Scene"
                        className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-linear ${index === currentScene ? 'scale-110 translate-x-4' : 'scale-100 translate-x-0'}`}
                    />
                </div>
            ))}

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center px-6">
                <div className={`max-w-4xl text-center transition-all duration-1000 ${isTransitioning ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`}>
                    <span className="text-[#D4AF37] text-sm md:text-base uppercase tracking-[0.5em] mb-6 block drop-shadow-lg">Our Poem</span>
                    <h2 className="text-3xl md:text-6xl font-serif text-white mb-8 leading-tight drop-shadow-2xl">
                        {scenes[currentScene].text}
                    </h2>
                    <p className="text-emerald-100/80 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed italic drop-shadow-lg">
                        {scenes[currentScene].subtext}
                    </p>
                </div>
            </div>

            {/* Progress Indicators */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                {scenes.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setIsTransitioning(true);
                            setTimeout(() => {
                                setCurrentScene(index);
                                setIsTransitioning(false);
                            }, 500);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-500 ${index === currentScene ? 'w-12 bg-[#D4AF37]' : 'w-4 bg-white/30 hover:bg-white/50'}`}
                    />
                ))}
            </div>

            {/* Decorative Overlay */}
            <div className="absolute inset-0 pointer-events-none z-15">
                <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
        </section>
    );
};

export default AnimatedStory;
