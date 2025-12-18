import React from 'react';
import Stories from 'react-insta-stories';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import CountUp from './CountUp';

const StoryMode = ({ data }) => {
  const navigate = useNavigate();

  // --- 3D TILT LOGIC ---
  const TiltCard = ({ children, className = "" }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    function handleMouseMove(event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      x.set(event.clientX - centerX);
      y.set(event.clientY - centerY);
    }

    return (
      <motion.div
        style={{ perspective: 1000 }}
        className="w-full max-w-sm flex justify-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
      >
        <motion.div
          style={{ rotateX, rotateY }}
          className={`relative transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${className}`}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  };

  // --- STYLES ---
  const SlideBg = ({ children }) => (
    <div className="w-full h-full bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative font-sans overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      {children}
    </div>
  );

  const GlassCard = ({ children, className="" }) => (
    <div className={`bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full shadow-2xl ${className}`}>
      {children}
    </div>
  );

  // --- STORIES ---
  const stories = [
    // 1. INTRO
    {
      content: () => (
        <SlideBg>
          <motion.h1 initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-5xl font-black text-center uppercase leading-tight tracking-tighter">
            Let's see what <span className="text-red-500">blunders</span> you made this GW.
          </motion.h1>
          <div className="mt-8 text-7xl animate-bounce">🤡</div>
        </SlideBg>
      )
    },

    // 2. RANK VERDICT
    {
      content: () => (
        <SlideBg>
          <TiltCard>
            <GlassCard>
              <h2 className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mb-6 text-center">Verdict</h2>
              <div className="text-center space-y-4">
                 <div className="text-6xl font-black">{data.meta.points}<span className="text-lg text-gray-500">pts</span></div>
                 <div className="h-px bg-white/10 w-full"></div>
                 <p className="text-xl font-bold leading-relaxed">
                   "{data.meta.rankVerdict}"
                 </p>
              </div>
            </GlassCard>
          </TiltCard>
        </SlideBg>
      )
    },

    // 3. CAPTAINCY PUNCHLINE
    {
      content: () => (
        <SlideBg>
           <TiltCard>
             <GlassCard className="text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-500 to-amber-600"></div>
               <p className="text-yellow-500 text-xs font-bold uppercase tracking-widest mb-4">Captain Choice</p>
               <h1 className="text-4xl font-black uppercase mb-2">{data.captain.name}</h1>
               <p className="text-6xl font-black text-white mb-6"><CountUp to={data.captain.totalPoints} /> pts</p>
               
               <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                 <p className="text-lg font-bold italic text-gray-300">"{data.captain.punchline}"</p>
               </div>
             </GlassCard>
           </TiltCard>
        </SlideBg>
      )
    },

    // 4. TRANSFER VERDICT
    data.transfer ? {
      content: () => (
        <SlideBg>
          <TiltCard>
            <GlassCard className="text-center">
              <h2 className="text-xs font-bold uppercase tracking-widest mb-6">Transfer Moves</h2>
              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-red-900/20 border border-red-500/30 p-3 rounded-xl">
                   <p className="text-[10px] uppercase text-red-400">Sold</p>
                   <p className="font-bold">{data.transfer.out.name}</p>
                   <p className="text-2xl font-black text-red-400">{data.transfer.out.points}</p>
                </div>
                <div className="flex-1 bg-green-900/20 border border-green-500/30 p-3 rounded-xl">
                   <p className="text-[10px] uppercase text-green-400">Bought</p>
                   <p className="font-bold">{data.transfer.in.name}</p>
                   <p className="text-2xl font-black text-green-400">{data.transfer.in.points}</p>
                </div>
              </div>
              <p className="text-xl font-black uppercase">{data.transfer.verdict}</p>
            </GlassCard>
          </TiltCard>
        </SlideBg>
      )
    } : null,

    // 5. BENCH COMPARISON
    data.benchRegret ? {
      content: () => (
        <SlideBg>
          <TiltCard>
            <GlassCard className="relative overflow-hidden !p-0 flex flex-col">
               <div className="flex-1 bg-[#0f172a] p-6 flex flex-col items-center justify-center border-b border-white/10">
                  <p className="text-[10px] uppercase text-gray-400 mb-1">You Started</p>
                  <h3 className="text-2xl font-black">{data.benchRegret.started.name}</h3>
                  <p className="text-4xl font-black text-gray-500">{data.benchRegret.started.points}</p>
               </div>
               <div className="flex-1 bg-[#7c2d12] p-6 flex flex-col items-center justify-center">
                  <p className="text-[10px] uppercase text-orange-200 mb-1">You Benched</p>
                  <h3 className="text-2xl font-black">{data.benchRegret.benched.name}</h3>
                  <p className="text-4xl font-black text-orange-400">{data.benchRegret.benched.points}</p>
               </div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-4 py-1 rounded-full border border-gray-700 shadow-xl z-10">
                 <p className="text-xs font-bold uppercase">Clown Move</p>
               </div>
            </GlassCard>
          </TiltCard>
        </SlideBg>
      )
    } : null,

    // 6. CARDIO KING
    data.cardioKing ? {
      content: () => (
        <SlideBg>
           <TiltCard>
             <GlassCard className="text-center border-red-500/20">
               <div className="text-6xl mb-4">🏃‍♂️</div>
               <h2 className="text-2xl font-black uppercase mb-2 text-red-500">Cardio King</h2>
               <p className="text-sm text-gray-400 mb-6">Played {data.cardioKing.minutes} mins. Did absolutely nothing.</p>
               <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20">
                 <h3 className="text-3xl font-black">{data.cardioKing.name}</h3>
                 <p className="text-xl font-bold mt-2">{data.cardioKing.points} pts</p>
               </div>
             </GlassCard>
           </TiltCard>
        </SlideBg>
      )
    } : null,

    // 7. CHEAP BEAST
    data.cheapBeast ? {
      content: () => (
        <SlideBg>
           <TiltCard>
             <GlassCard className="text-center border-green-500/20">
               <div className="text-6xl mb-4">🦄</div>
               <h2 className="text-2xl font-black uppercase mb-2 text-green-400">Cheap Beast</h2>
               <p className="text-sm text-gray-400 mb-6">Cost £{data.cheapBeast.price}m. Outscored your stars.</p>
               <div className="bg-green-500/10 p-4 rounded-2xl border border-green-500/20">
                 <h3 className="text-3xl font-black">{data.cheapBeast.name}</h3>
                 <p className="text-xl font-bold mt-2">{data.cheapBeast.points} pts</p>
               </div>
             </GlassCard>
           </TiltCard>
        </SlideBg>
      )
    } : null,

    // 8. 3 BEST PLAYERS
    {
      content: () => (
        <SlideBg>
          <TiltCard>
            <GlassCard>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-6 text-center text-gold">MVP Podium</h2>
              <div className="space-y-4">
                {data.top3.map((p, i) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className={`font-black text-lg w-6 ${i===0 ? 'text-yellow-400': i===1 ? 'text-gray-300' : 'text-orange-400'}`}>#{i+1}</span>
                      <span className="font-bold">{p.name}</span>
                    </div>
                    <span className="font-black text-xl">{p.points}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </TiltCard>
        </SlideBg>
      )
    },

    // 9. AUTO SUB HERO
    data.autoSub ? {
      content: () => (
        <SlideBg>
           <TiltCard>
             <GlassCard className="text-center border-purple-500/20">
               <div className="text-6xl mb-4">🦸‍♂️</div>
               <h2 className="text-2xl font-black uppercase mb-2 text-purple-400">Auto-Sub Hero</h2>
               <p className="text-sm text-gray-400 mb-6">You forgot to set your team. He saved you.</p>
               <div className="bg-purple-500/10 p-4 rounded-2xl border border-purple-500/20">
                 <h3 className="text-3xl font-black">{data.autoSub.in.name}</h3>
                 <p className="text-xl font-bold mt-2">{data.autoSub.in.points} pts</p>
               </div>
             </GlassCard>
           </TiltCard>
        </SlideBg>
      )
    } : null,

    // 10. BUTTONS & EXPORT
    {
      content: () => (
        <SlideBg>
           <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="w-full max-w-sm text-center">
             <h1 className="text-3xl font-black uppercase mb-2">Share the Pain</h1>
             <p className="text-xs text-gray-500 uppercase tracking-widest mb-8">FPL RECAP • GW {data.meta.gw}</p>

             <div className="grid grid-cols-1 gap-3">
               <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-transform">
                 📸 Instagram Story
               </button>
               <button className="flex items-center justify-center gap-2 bg-black border border-gray-700 py-3 rounded-xl font-bold hover:bg-gray-900 transition-colors">
                 🐦 Post on X
               </button>
               <button className="flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                 📋 Copy Link
               </button>
               
               <div className="h-px bg-gray-800 my-2"></div>
               
               <button onClick={() => navigate('/')} className="text-gray-500 text-xs font-bold uppercase hover:text-white transition-colors">
                 Roast Another Team
               </button>
             </div>
             
             <p className="mt-8 text-[10px] text-gray-700 font-bold uppercase tracking-widest">FPL Recap • Not Affiliated</p>
           </motion.div>
        </SlideBg>
      )
    }

  ].filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center">
      <div className="w-full h-full sm:max-w-[430px] sm:h-[88vh] sm:rounded-[32px] overflow-hidden shadow-2xl border border-gray-800 relative bg-[#050505]">
        <Stories
          stories={stories}
          defaultInterval={6000}
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default StoryMode;
