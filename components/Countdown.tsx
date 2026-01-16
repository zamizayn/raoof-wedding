
import React, { useState, useEffect } from 'react';
import { CountdownTime } from '../types';

const Countdown: React.FC = () => {
  // Set target date to Feb 14, 2026, to ensure the timer is running
  const targetDate = new Date('February 14, 2026 11:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center px-4 py-3 bg-white/40 backdrop-blur-md rounded-xl shadow-lg border border-[#D4AF37]/30 min-w-[90px] transform hover:scale-105 transition-transform duration-300">
      <span className="text-4xl font-serif font-bold text-[#D4AF37] tabular-nums animate-pulse-slow">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-900/50 mt-1 font-semibold">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-3 md:gap-6 justify-center animate-fade-in-up delay-2">
      <TimeBlock value={timeLeft.days} label="Days" />
      <TimeBlock value={timeLeft.hours} label="Hours" />
      <TimeBlock value={timeLeft.minutes} label="Mins" />
      <TimeBlock value={timeLeft.seconds} label="Secs" />
    </div>
  );
};

export default Countdown;
