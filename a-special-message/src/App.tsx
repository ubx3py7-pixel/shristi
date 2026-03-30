/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

const LYRICS = [
  { text: "Main tenu samjhawan ki", duration: 3500 },
  { text: "Na tere bina lagda ji", duration: 4500 },
  { text: "Tu ki jaane pyaar meraaa", duration: 4000 },
  { text: "Main karun intezar teraaa", duration: 4200 },
  { text: "Tu dil tui-yon jaan meri", duration: 4000 },
  { text: "Main tenu samjhawan.... ", duration: 4000 },
];

// Star background component with shooting stars
const StarBackground = () => {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; size: number; duration: string }[]>([]);
  const [shootingStars, setShootingStars] = useState<{ id: number; x: number; y: number; duration: string; delay: string }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: `${Math.random() * 3 + 2}s`,
    }));
    setStars(newStars);

    const newShootingStars = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 50,
      duration: `${Math.random() * 2 + 2}s`,
      delay: `${Math.random() * 10}s`,
    }));
    setShootingStars(newShootingStars);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            '--duration': star.duration,
          } as any}
        />
      ))}
      {shootingStars.map((sStar) => (
        <div
          key={sStar.id}
          className="shooting-star"
          style={{
            left: `${sStar.x}%`,
            top: `${sStar.y}%`,
            '--duration': sStar.duration,
            animationDelay: sStar.delay,
          } as any}
        />
      ))}
    </div>
  );
};

// Floating heart component for extra effect
const FloatingHearts = () => {
  const [hearts, setHearts] = useState<{ id: number; x: number; size: number; duration: number; delay: number; rotation: number }[]>([]);

  useEffect(() => {
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 25 + 15,
      duration: Math.random() * 6 + 4,
      delay: Math.random() * 5,
      rotation: Math.random() * 360,
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          initial={{ y: '110vh', opacity: 0, rotate: heart.rotation }}
          animate={{ 
            y: '-10vh', 
            opacity: [0, 0.6, 0],
            x: [`${heart.x}vw`, `${heart.x + (Math.random() * 15 - 7.5)}vw`],
            rotate: heart.rotation + 45
          }}
          transition={{ 
            duration: heart.duration, 
            repeat: Infinity, 
            delay: heart.delay,
            ease: "easeInOut"
          }}
          className="absolute text-pink-500/40"
          style={{ fontSize: heart.size }}
        >
          <Heart fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};

export default function App() {
  const [phase, setPhase] = useState<'initial' | 'favor' | 'lyrics' | 'final'>('initial');
  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle lyrics sequence
  useEffect(() => {
    if (phase === 'lyrics') {
      let timeout: NodeJS.Timeout;
      
      const playNextLyric = (index: number) => {
        if (index < LYRICS.length) {
          setCurrentLyricIndex(index);
          timeout = setTimeout(() => {
            playNextLyric(index + 1);
          }, LYRICS[index].duration);
        } else {
          setPhase('final');
        }
      };

      playNextLyric(0);
      return () => clearTimeout(timeout);
    }
  }, [phase]);

  const startMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    setPhase('lyrics');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4">
      <StarBackground />
      
      <audio 
        ref={audioRef} 
        src="/bgm.mp3" 
        loop 
      />

      <AnimatePresence mode="wait">
        {(phase === 'lyrics' || phase === 'final') && <FloatingHearts />}
        
        {phase === 'initial' && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            className="z-10 flex flex-col items-center text-center"
          >
            <motion.div 
              whileHover={{ scale: 1.2, rotate: 10 }}
              className="w-24 h-24 rounded-full bg-pink-500/20 flex items-center justify-center mb-10 heart-pulse cursor-pointer"
            >
              <Heart className="text-pink-500 fill-pink-500" size={48} />
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight font-bazooka">
              I want to say something <br />
              <span className="shimmer-text">to you</span>
            </h1>
            
            <p className="text-2xl md:text-3xl opacity-70 mb-12 font-handwritten">
              Just listen for a moment 🤍
            </p>
            
            <button
              onClick={() => setPhase('favor')}
              className="glow-button bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-10 py-4 rounded-full text-2xl transition-all transform hover:scale-110 active:scale-95 shadow-2xl shadow-pink-500/40 font-bold"
            >
              Open it 🤍
            </button>
          </motion.div>
        )}

        {phase === 'favor' && (
          <motion.div
            key="favor"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="z-10 flex flex-col items-center text-center"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-20 h-20 rounded-full bg-pink-500/20 flex items-center justify-center mb-8 heart-pulse"
            >
              <Heart className="text-pink-500 fill-pink-500" size={40} />
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-12 font-bazooka">
              Will you do me a favor, please?
            </h1>
            
            <button
              onClick={startMusic}
              className="glow-button bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white px-10 py-4 rounded-full text-2xl transition-all transform hover:scale-110 active:scale-95 shadow-2xl shadow-pink-500/40 font-bold"
            >
              Show me 🤍
            </button>
          </motion.div>
        )}

        {phase === 'lyrics' && (
          <motion.div
            key="lyrics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-10 flex flex-col items-center text-center w-full max-w-3xl"
          >
            <AnimatePresence mode="wait">
              {currentLyricIndex >= 0 && LYRICS[currentLyricIndex].text && (
                <motion.h2
                  key={currentLyricIndex}
                  initial={{ opacity: 0, scale: 0.5, filter: 'blur(20px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="text-5xl md:text-7xl font-bold text-white lyrics-container leading-tight"
                >
                  {LYRICS[currentLyricIndex].text}
                </motion.h2>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="z-10 flex flex-col items-center text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <motion.img
                src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcG43Nm5qOWhvcDhwMWVxM2JzODV4cWZ2MDMyZDd4ZDM1bWYwZGwxcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xR5cPyPoL5HVXSphqA/giphy.gif"
                alt="Hugging Teddy Bears"
                className="w-72 h-72 md:w-96 md:h-96 object-contain mb-10 drop-shadow-[0_0_30px_rgba(255,105,180,0.5)]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-6xl md:text-9xl font-bazooka shimmer-text"
            >
              Aailobhuuu❤️
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-8 text-pink-300/60 font-handwritten text-3xl"
            >
              Forever & Always
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 text-sm opacity-40 z-10 font-handwritten tracking-widest">
      Made with ❤️ by @j3ryy.css
      </div>
    </div>
  );
}
