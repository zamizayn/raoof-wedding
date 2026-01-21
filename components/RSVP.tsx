import React, { useState } from 'react';

const RSVP: React.FC = () => {
  const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dua, setDua] = useState<{ dua: string; translation: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/generate-dua`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ guestName: name }),
      });
      const result = await response.json();
      setDua(result);
    } catch (error) {
      console.error('Error getting blessing:', error);
      setDua({
        dua: "Barakallahu lakum wa baraka 'alaykum wa jama'a baynakuma fii khayr",
        translation: "May Allah bless you and shower His blessings upon you and join you in goodness."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="py-20 px-6 bg-emerald-900 text-white relative overflow-hidden">
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h2 className="text-4xl font-serif mb-6 text-[#D4AF37]">Request a Blessing</h2>
        <p className="text-emerald-100/80 mb-10">
          Share your well wishes with Raoof & Fahmida and receive a personalized wedding prayer.
        </p>

        {!dua ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-4 bg-[#D4AF37] hover:bg-[#C19A2E] text-emerald-900 font-bold rounded-full transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {isSubmitting ? 'Generating Prayer...' : 'Join the Celebration'}
            </button>
          </form>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-[#D4AF37]/30 animate-fade-in-up">
            <h3 className="text-2xl font-serif text-[#D4AF37] mb-4">A Prayer for the Couple</h3>
            <p className="text-xl italic mb-4 font-serif leading-relaxed">"{dua.dua}"</p>
            <p className="text-emerald-200 text-sm mb-6">— {dua.translation}</p>
            <button
              onClick={() => setDua(null)}
              className="text-sm text-[#D4AF37] underline underline-offset-4 hover:text-white"
            >
              Generate another blessing
            </button>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-[#D4AF37]/20 m-6 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-[#D4AF37]/20 m-6 pointer-events-none"></div>
    </section>
  );
};

export default RSVP;
