import React from 'react';

const FloatingBackground: React.FC = () => {
    // Generate 20 random particles
    const particles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        size: Math.random() * 5 + 3, // 3px to 8px
        left: `${Math.random() * 100}%`,
        duration: `${Math.random() * 10 + 10}s`, // 10s to 20s
        delay: `${Math.random() * 5}s`,
    }));

    // Generate 6 bokeh circles
    const bokehCircles = Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        size: Math.random() * 200 + 100, // 100px to 300px
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: `${Math.random() * 20 + 20}s`, // 20s to 40s
        delay: `${Math.random() * 10}s`,
    }));

    // Generate 15 falling petals
    const petals = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        size: Math.random() * 15 + 10, // 10px to 25px
        left: `${Math.random() * 100}%`,
        duration: `${Math.random() * 15 + 10}s`, // 10s to 25s
        delay: `${Math.random() * 10}s`,
        sway: `${Math.random() * 200 - 100}px`, // Sway range -100px to 100px
        rotation: `${Math.random() * 720}deg`, // Total rotation
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
            <div className="absolute inset-0 bg-[#FFFBF0]"></div>

            {/* Falling Petals */}
            {petals.map((p) => (
                <div
                    key={`petal-${p.id}`}
                    className="absolute top-[-50px] animate-petal"
                    style={{
                        left: p.left,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        '--duration': p.duration,
                        '--delay': p.delay,
                        '--sway': p.sway,
                        '--rotation': p.rotation,
                    } as React.CSSProperties}
                >
                    <svg viewBox="0 0 24 24" fill="#D4AF37" className="opacity-30">
                        <path d="M12,2C12,2 6,8 6,12C6,15.31 8.69,18 12,18C15.31,18 18,15.31 18,12C18,8 12,2 12,2Z" />
                    </svg>
                </div>
            ))}

            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 ornament-bg opacity-20"></div>

            {/* Floating Particles */}
            {particles.map((p) => (
                <div
                    key={`particle-${p.id}`}
                    className="absolute bottom-[-20px] bg-[#D4AF37]/60 rounded-full animate-float-particle"
                    style={{
                        left: p.left,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        '--duration': p.duration,
                        '--delay': p.delay,
                    } as React.CSSProperties}
                />
            ))}

            {/* Bokeh Circles */}
            {bokehCircles.map((circle) => (
                <div
                    key={`bokeh-${circle.id}`}
                    className="absolute bg-[#D4AF37]/10 rounded-full blur-[80px] animate-drift"
                    style={{
                        left: circle.left,
                        top: circle.top,
                        width: `${circle.size}px`,
                        height: `${circle.size}px`,
                        '--duration': circle.duration,
                        '--delay': circle.delay,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};

export default FloatingBackground;
