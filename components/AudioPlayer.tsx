import React, { useState, useRef, useEffect } from 'react';

const AudioPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Using "Tum Se Hi" from Jab We Met (Archive.org)
    const audioUrl = "https://archive.org/download/TumSeHiFullSongJabWeMetShahidKapoor/Tum%20Se%20Hi%20Full%20Song%20Jab%20We%20Met%20Shahid%20Kapoor.mp3";

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.4;
        }
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(err => console.error("Audio play failed:", err));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[60] flex items-center gap-3">
            <audio ref={audioRef} src={audioUrl} loop stroke-width="0" />

            <div className={`px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg flex items-center gap-3 transition-all duration-700 ${isPlaying ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}`}>
                <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest whitespace-nowrap">Tum Se Hi - Jab We Met</span>
                <button onClick={toggleMute} className="text-[#D4AF37] hover:scale-110 transition-transform">
                    {isMuted ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15L4 13.414V10.586L5.586 9m1.414 7.414L11 20V4L7 8H4v8h3l4 4z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15L4 13.414V10.586L5.586 9m1.414 7.414L11 20V4L7 8H4v8h3l4 4z" />
                        </svg>
                    )}
                </button>
            </div>

            <button
                onClick={togglePlay}
                className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-xl overflow-hidden transition-all duration-500 hover:scale-110 hover:bg-white/30"
            >
                <div className="absolute inset-0 bg-[#D4AF37]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {isPlaying ? (
                    <div className="flex gap-0.5 items-end h-4 transition-all duration-500">
                        <div className="w-0.5 bg-[#D4AF37] animate-[music-bar_0.8s_ease-in-out_infinite] h-full"></div>
                        <div className="w-0.5 bg-[#D4AF37] animate-[music-bar_1.2s_ease-in-out_infinite] h-3"></div>
                        <div className="w-0.5 bg-[#D4AF37] animate-[music-bar_0.9s_ease-in-out_infinite] h-4"></div>
                        <div className="w-0.5 bg-[#D4AF37] animate-[music-bar_1.1s_ease-in-out_infinite] h-2"></div>
                    </div>
                ) : (
                    <svg className="w-5 h-5 text-[#D4AF37] ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                )}
            </button>

            <style>{`
                @keyframes music-bar {
                    0%, 100% { height: 4px; }
                    50% { height: 16px; }
                }
            `}</style>
        </div>
    );
};

export default AudioPlayer;
