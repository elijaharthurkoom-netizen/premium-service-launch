
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WaitlistModal from './components/WaitlistModal';
import Marquee from './components/Marquee';

const THREE_HOURS_IN_MS = 3 * 60 * 60 * 1000;
const STORAGE_KEY = 'elite_timer_remaining_ms';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    // Initialize from localStorage or default to 3 hours
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : THREE_HOURS_IN_MS;
  });

  // Use a ref to keep track of time for the interval without causing excessive re-renders
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const nextValue = Math.max(0, prev - 1000);
        // Persist the exact remaining time to localStorage
        localStorage.setItem(STORAGE_KEY, nextValue.toString());
        return nextValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .join(":");
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Background circles as seen in sketch */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-circle-gradient rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-circle-gradient rounded-full pointer-events-none" />

      <main className="relative z-10 w-full max-w-4xl mx-auto px-6 py-24 text-center">
        {/* Scarcity Headline with Timer */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <span className="text-gold tracking-[0.4em] text-[10px] font-bold uppercase border border-gold/40 px-6 py-2 rounded-full inline-block backdrop-blur-md">
            CONFIDENTIAL ENROLLMENT: WINDOW CLOSES IN {formatTime(timeLeft)}
          </span>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 flex flex-col items-center"
        >
          <h1 className="text-7xl md:text-9xl font-serif font-black text-white tracking-tighter leading-[0.85] uppercase">
            WHAT YOU
          </h1>
          <div className="gold-gradient-bg px-10 py-2 mt-2 shadow-2xl">
            <h1 className="text-7xl md:text-9xl font-serif font-black text-white tracking-tighter uppercase">
              GET
            </h1>
          </div>
        </motion.div>

        {/* Paragraph */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed mb-20"
        >
          An elite, one-month performance partnership dedicated to scaling your revenue to seven figures. Guaranteed $3k return upon purchase. Confidential execution only.
        </motion.p>

        {/* Bulletins of Benefits */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid gap-y-6 text-left mb-24 max-w-lg mx-auto border-t border-b border-white/5 py-12"
        >
          {[
            "Fully Managed High-Ticket Funnel",
            "Omnichannel Ad Strategy (FB, Google, YT)",
            "Proprietary Lead Qualification Engine",
            "24/7 Concierge Level Support",
            "Custom Creative & Copywriting Suite",
            "Weekly Performance Deep-Dives",
            "Advanced CRM & Automation Sync",
            "Exclusive Network Mastermind Access"
          ].map((benefit, idx) => (
            <div key={idx} className="flex items-center space-x-4 group">
              <span className="text-gold text-lg transition-transform group-hover:scale-125">✦</span>
              <span className="text-gray-200 text-lg font-medium tracking-tight">{benefit}</span>
            </div>
          ))}
        </motion.div>

        {/* Primary CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="gold-gradient-bg text-onyx px-16 py-6 rounded-full font-black text-xl gold-border-glow shadow-2xl mb-32 tracking-wider transition-all"
        >
          JOIN THE ELITE WAITLIST
        </motion.button>

        {/* Visualization Section */}
        <div className="mb-32">
          <h3 className="text-gold text-xs font-bold tracking-[0.5em] uppercase mb-12">OUR PROCESS</h3>
          <div className="relative group">
            {/* Dashed layout guide from sketch - rendered as a stylish border */}
            <div className="absolute -inset-4 border border-dashed border-gold/20 rounded-3xl pointer-events-none" />
            <Marquee />
          </div>
        </div>

        {/* Secondary CTA Button */}
        <motion.button
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(212, 175, 55, 0.1)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="border-2 border-gold text-gold px-16 py-6 rounded-full font-black text-xl tracking-wider transition-all"
        >
          RESERVE YOUR CONFIDENTIAL SPOT
        </motion.button>

        <footer className="mt-40 mb-10 text-gray-700 text-xs tracking-widest font-medium">
          © 2026 ELITE GROWTH CONCIERGE. ONE-MONTH INTENSIVE. SPOTS ARE STRICTLY CONFIDENTIAL.
        </footer>
      </main>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <WaitlistModal onClose={() => setIsModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
