import React from 'react';
import Stories from 'react-insta-stories';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from './CountUp';

const StoryMode = ({ data }) => {
  const navigate = useNavigate();

  // --- THEME & ANIMATION CONSTANTS ---
  const COLORS = {
    bg: '#121212', // Deep Chess.com style dark
    card: '#1a1a1a', // Slightly lighter card bg
    text: '#ffffff',
    green: '#4ade80', // Neon green for good
    red: '#f87171',   // Soft red for bad
    orange: '#fb923c', // Warning orange
    gold: '#facc15'    // Hero gold
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  // --- REUSABLE COMPONENTS ---
  
  // The base container for every slide (Mobile-first, centered)
  const Slide = ({ children, className = "" }) => (
    <div className={`w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans ${className}`} style={{ background: COLORS.bg, color: COLORS.text }}>
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      {children}
    </div>
  );

  // A "Glass" Card container
  const Card = ({ children, className = "" }) => (
    <motion.div 
      variants={scaleIn}
      className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );

  // Section Label (e.g. "ACT 1")
  const Label = ({ text, color = "text-gray-500" }) => (
    <motion.p variants={fadeInUp} className={`text-xs font-bold uppercase tracking-[0.3em] mb-4 ${color}`}>
      {text}
    </motion.p>
  );

  // --- STORIES CONFIGURATION ---
  const stories = [

    // 1. INTRO: "WHAT DID YOU COOK?"
    {
      content: () => (
        <Slide>
          <motion.div initial="hidden" animate="visible" className="text-center z-10">
            <motion.div variants={scaleIn} className="text-8xl mb-6">🧑‍🍳</motion.div>
            <Label text={`Gameweek ${data.meta.gw}`} />
            <motion.h1 variants={fadeInUp} className="text-5xl font-black uppercase leading-tight tracking-tight mb-4">
              Let's see what <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">you cooked.</span>
            </motion.h1>
          </motion.div>
        </Slide>
      )
    },

    // 2. SNAPSHOT (Points & Rank)
    {
      content: () => (
        <Slide>
          <motion.div initial="hidden" animate="visible" className="w-full max-w-sm z-10">
            <Label text="Snapshot" color="text-green-400" />
            
            <Card className="mb-4 text-center py-10">
              <p className="text-sm font-bold uppercase text-gray-500 mb-2">Your Score</p>
              <div className="text-8xl font-black leading-none mb-2">
                <CountUp to={data.meta.points} />
              </div>
              <p className="text-gray-400 text-sm">Points</p>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="text-center">
                <p className="text-[10px] uppercase font-bold text-gray-500">Global Rank</p>
                <p className="text-xl font-black mt-1">#{data.meta.rank.toLocaleString()}</p>
              </Card>
              <Card className="text-center flex items-center justify-center gap-2">
                 <span className={`text-3xl ${data.meta.rankArrow === 'green' ? 'text-green-400' : 'text-red-500'}`}>
                   {data.meta.rankArrow === 'green' ? '↗' : '↘'}
                 </span>
                 <p className="text-xs font-bold uppercase text-gray-400 leading-tight text-left">
                   {data.meta.rankArrow === 'green' ? 'Green\nArrow' : 'Red\nArrow'}
                 </p>
              </Card>
            </div>
          </motion.div>
        </Slide>
      )
    },

    // 3. CAPTAINCY VERDICT
    {
      content: () => (
        <Slide>
          <motion.div initial="hidden" animate="visible" className="w-full max-w-sm z-10 text-center">
            <Label text="The Leader" color="text-yellow-500" />
            
            <Card className="!p-0 bg-gradient-to-br from-gray-800 to-black border-yellow-500/20">
               {/* Hero Header */}
               <div className="bg-yellow-500/10 p-6 border-b border-yellow-500/10">
                 <h1 className="text-3xl font-black uppercase text-yellow-100">{data.captain.name}</h1>
                 <p className="text-yellow-500 font-bold tracking-widest text-xs mt-1">CAPTAIN</p>
               </div>
               
               {/* Points Display */}
               <div className="p-8">
                  <div className="text-7xl font-black text-white mb-2">
                    <CountUp to={data.captain.totalPoints} />
                  </div>
                  <p className="text-gray-500 text-sm font-bold uppercase">Points Scored</p>
               </div>

               {/* Verdict Footer */}
               <div className={`p-4 font-black uppercase tracking-widest text-sm ${
                 data.captain.verdict === 'hero' ? 'bg-green-500 text-black' : 
                 data.captain.verdict === 'fail' ? 'bg-red-500 text-white' : 'bg-gray-700 text-white'
               }`}>
                 Verdict: {data.captain.verdict}
               </div>
            </Card>
          </motion.div>
        </Slide>
      )
    },

    // 4. TRANSFER MARKET (The "Nemesis" Slide)
    data.transfer ? {
      content: () => (
        <Slide className="!bg-[#2a0a0a]"> {/* Dark Red Tint for Drama */}
          <motion.div initial="hidden" animate="visible" className="w-full max-w-sm z-10 text-center">
            <Label text="Transfer Dept" color="text-red-400" />
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-8 text-white">NEMESIS</h1>

            <div className="relative flex items-center justify-center gap-2 mb-8">
               {/* SOLD */}
               <motion.div variants={fadeInUp} className="flex-1 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 backdrop-blur-sm">
                 <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2 text-xl">👋</div>
                 <p className="text-[10px] font-bold text-red-300 uppercase opacity-70">Sold</p>
                 <p className="font-bold text-sm truncate">{data.transfer.out.name}</p>
                 <p className="text-2xl font-black mt-1 text-red-100">{data.transfer.out.points}</p>
               </motion.div>

               {/* VS Badge */}
               <motion.div variants={scaleIn} className="z-20">
                 <span className="text-4xl font-black italic text-red-600 opacity-60">VS</span>
               </motion.div>

               {/* BOUGHT */}
               <motion.div variants={fadeInUp} className="flex-1 bg-green-500/10 border border-green-500/30 rounded-2xl p-4 backdrop-blur-sm">
                 <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-2 text-xl">🤝</div>
                 <p className="text-[10px] font-bold text-green-300 uppercase opacity-70">Bought</p>
                 <p className="font-bold text-sm truncate">{data.transfer.in.name}</p>
                 <p className="text-2xl font-black mt-1 text-green-100">{data.transfer.in.points}</p>
               </motion.div>
            </div>

            <Card className="!py-3 !px-6 inline-block bg-black/40 border-red-500/30">
               <p className="font-bold text-lg uppercase tracking-widest text-red-100">{data.transfer.verdict}</p>
            </Card>
          </motion.div>
        </Slide>
      )
    } : null,

    // 5. PEP ROULETTE (0 Mins) / OR / CHEAP BEAST
    data.cardioKing ? {
      content: () => (
        <Slide>
          <motion.div initial="hidden" animate="visible" className="w-full max-w-sm z-10 text-center">
            <Label text="Scam Alert" color="text-orange-500" />
            <motion.div variants={scaleIn} className="text-7xl mb-6">🤡</motion.div>
            
            <Card className="border-orange-500/30 bg-orange-500/5">
              <h2 className="text-2xl font-black uppercase text-white mb-1">{data.cardioKing.name}</h2>
              <div className="h-px w-full bg-orange-500/20 my-4"></div>
              <div className="flex justify-between items-center px-4">
                 <div className="text-left">
                   <p className="text-xs font-bold uppercase text-gray-500">Minutes</p>
                   <p className="text-3xl font-mono font-bold text-orange-400">{data.cardioKing.minutes}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-bold uppercase text-gray-500">Points</p>
                   <p className="text-3xl font-mono font-bold text-white">{data.cardioKing.points}</p>
                 </div>
              </div>
            </Card>
            
            <p className="mt-8 text-sm text-gray-500 uppercase tracking-widest font-bold">
              Pep didn't even look at him.
            </p>
          </motion.div>
        </Slide>
      )
    } : null,

    // 6. BENCH PAIN (Split Screen)
    data.benchRegret ? {
      content: () => (
        <div className="w-full h-full relative font-sans flex flex-col">
          {/* Top Half (Dark) */}
          <div className="flex-1 bg-[#1e293b] flex flex-col items-center justify-center p-6 relative">
            <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="text-center z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">You Started</p>
              <h2 className="text-3xl font-black text-white mb-2">{data.benchRegret.started.name}</h2>
              <p className="text-6xl font-black text-slate-500">{data.benchRegret.started.points}</p>
            </motion.div>
          </div>

          {/* Bottom Half (Orange) */}
          <div className="flex-1 bg-[#ea580c] flex flex-col items-center justify-center p-6 relative">
            <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} delay={0.2} className="text-center z-10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-200 mb-2">You Benched</p>
              <h2 className="text-3xl font-black text-white mb-2">{data.benchRegret.benched.name}</h2>
              <p className="text-6xl font-black text-white drop-shadow-md">{data.benchRegret.benched.points}</p>
            </motion.div>

            {/* Floating Badge */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black px-6 py-2 rounded-full border border-orange-500 shadow-xl z-20 whitespace-nowrap">
              <p className="text-white font-bold text-sm uppercase tracking-widest">
                Cost you <span className="text-orange-500">{data.benchRegret.diff} pts</span>
              </p>
            </div>
          </div>
        </div>
      )
    } : null,

    // 7. AUTO-SUB HERO (If applicable)
    data.autoSub ? {
      content: () => (
        <Slide>
          <motion.div initial="hidden" animate="visible" className="text-center z-10">
             <Label text="Redemption" color="text-purple-400" />
             <div className="text-7xl mb-4">🦸‍♂️</div>
             <Card className="bg-purple-500/10 border-purple-500/30">
               <p className="text-xs font-bold uppercase text-purple-300 mb-2">Auto-Sub Hero</p>
               <h1 className="text-3xl font-black text-white">{data.autoSub.in.name}</h1>
               <p className="text-6xl font-black text-purple-200 mt-2">{data.autoSub.in.points}<span className="text-xl">pts</span></p>
             </Card>
             <p className="mt-6 text-sm opacity-60 max-w-[200px] mx-auto">
               You forgot to set your team. It worked perfectly.
             </p>
          </motion.div>
        </Slide>
      )
    } : null,

    // 8. FINAL SUMMARY
    {
      content: () => (
        <Slide>
          <motion.div initial="hidden" animate="visible" className="w-full max-w-sm z-10 text-center">
            <Label text="The Verdict" />
            
            <h1 className="text-6xl font-black uppercase leading-none tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-200 to-gray-500">
              {data.summary.type}
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 p-4 rounded-xl">
                 <p className="text-[10px] text-gray-500 uppercase font-bold">Points</p>
                 <p className="text-2xl font-black">{data.meta.points}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl">
                 <p className="text-[10px] text-gray-500 uppercase font-bold">Bench</p>
                 <p className="text-2xl font-black text-gray-400">{data.bench.totalPoints}</p>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="w-full bg-white text-black font-black py-4 rounded-full uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-shadow"
            >
              Roast Another Team
            </motion.button>
          </motion.div>
        </Slide>
      )
    }

  ].filter(Boolean); // Clean up null slides

  return (
    <div className="fixed inset-0 bg-[#000] flex justify-center items-center">
      <div className="w-full h-full sm:max-w-[430px] sm:h-[88vh] sm:rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)] border-[1px] border-white/10 relative bg-[#121212]">
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
