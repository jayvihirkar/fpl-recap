import React from 'react';
import Stories from 'react-insta-stories';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from './CountUp'; // Ensure you created this file from the previous step!

const StoryMode = ({ data }) => {
  const navigate = useNavigate();

  // --- ANIMATION VARIANTS ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };
  
  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 120 } }
  };

  const slideContainer = "w-full h-full flex flex-col items-center justify-center relative overflow-hidden font-sans text-center";

  // --- STORIES CONFIG ---
  const stories = [

    // 1. INTRO: "WHAT HAVE YOU COOKED?"
    {
      content: () => (
        <motion.div 
          className={`${slideContainer} bg-black text-white`}
          initial="hidden" animate="visible"
        >
          <motion.div variants={scaleIn} className="text-8xl mb-8">👨‍🍳</motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl font-black uppercase mb-4 leading-tight px-4">
             Let's see what you cooked
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-gray-400 text-lg uppercase tracking-widest">
            Gameweek {data.meta.gw}
          </motion.p>
        </motion.div>
      )
    },

    // 2. SNAPSHOT: POINTS & RANK
    {
      content: () => (
        <motion.div 
          className={`${slideContainer} bg-gradient-to-br from-gray-900 to-gray-800 text-white`}
          initial="hidden" animate="visible"
        >
          <motion.p variants={fadeInUp} className="text-xs font-bold uppercase tracking-[0.2em] text-fpl-green mb-8">
            Performance Review
          </motion.p>
          
          {/* Main Points */}
          <motion.div variants={scaleIn} className="mb-12">
            <div className="text-[10rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
              <CountUp to={data.meta.points} />
            </div>
            <p className="text-xl font-bold text-gray-400 mt-2">Points</p>
          </motion.div>

          {/* Rank Card */}
          <motion.div variants={fadeInUp} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-3/4 max-w-xs">
            <p className="text-xs uppercase opacity-60 mb-1">Global Rank</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-black">#{data.meta.rank.toLocaleString()}</span>
              <span className={`text-2xl ${data.meta.rankArrow === 'green' ? 'text-green-400' : 'text-red-500'}`}>
                {data.meta.rankArrow === 'green' ? '⬆' : '⬇'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )
    },

    // 3. CAPTAINCY
    {
      content: () => (
        <motion.div 
          className={`${slideContainer} bg-[#1a1a2e] text-white`}
          initial="hidden" animate="visible"
        >
          <motion.div 
            className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/en/7/7a/Premier_League_Logo_2016.svg')] bg-no-repeat bg-center bg-contain grayscale"
          />
          <motion.p variants={fadeInUp} className="relative z-10 text-yellow-400 font-bold uppercase tracking-widest mb-4">
            The Armband
          </motion.p>
          
          <motion.h1 variants={scaleIn} className="relative z-10 text-5xl font-black mb-2 px-4">
            {data.captain.name}
          </motion.h1>
          
          <motion.div variants={scaleIn} className="relative z-10 text-8xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 to-yellow-600">
            <CountUp to={data.captain.totalPoints} /> PTS
          </motion.div>

          <motion.div variants={fadeInUp} className={`relative z-10 px-6 py-2 rounded-full font-black text-xl uppercase ${
            data.captain.verdict === 'hero' ? 'bg-green-500 text-black' : 
            data.captain.verdict === 'fail' ? 'bg-red-600 text-white' : 'bg-gray-600'
          }`}>
             {data.captain.verdict}
          </motion.div>
        </motion.div>
      )
    },

    // 4. TRANSFER DEPT (NEMESIS STYLE)
    data.transfer ? {
      content: () => (
        <motion.div 
          className={`${slideContainer} bg-[#3a0000] text-white`} // Dark Red Background
          initial="hidden" animate="visible"
        >
          {/* Background Glow */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-red-600/20 to-transparent pointer-events-none" />

          <motion.h2 variants={fadeInUp} className="text-red-500 font-black uppercase tracking-[0.3em] mb-10 text-xl">
            Transfer Market
          </motion.h2>

          <div className="flex items-center justify-center w-full px-4 gap-4 mb-8">
             {/* SOLD (Left) */}
             <motion.div variants={fadeInUp} className="flex-1 flex flex-col items-center">
               <div className="w-24 h-24 rounded-full border-4 border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.6)] flex items-center justify-center bg-black mb-4">
                 <span className="text-3xl">👋</span>
               </div>
               <p className="text-xs font-bold uppercase text-red-400 mb-1">You Sold</p>
               <h3 className="text-lg font-black leading-none">{data.transfer.out.name}</h3>
               <p className="text-3xl font-black mt-1">{data.transfer.out.points}</p>
             </motion.div>

             {/* VS */}
             <motion.div variants={scaleIn} className="text-5xl font-black italic text-red-600 opacity-50">
               VS
             </motion.div>

             {/* BOUGHT (Right) */}
             <motion.div variants={fadeInUp} className="flex-1 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-4 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)] flex items-center justify-center bg-black mb-4">
                 <span className="text-3xl">🤝</span>
               </div>
               <p className="text-xs font-bold uppercase text-green-400 mb-1">You Bought</p>
               <h3 className="text-lg font-black leading-none">{data.transfer.in.name}</h3>
               <p className="text-3xl font-black mt-1">{data.transfer.in.points}</p>
             </motion.div>
          </div>

          <motion.div variants={fadeInUp} className="bg-black/40 px-6 py-3 rounded-lg border border-red-500/30">
             <p className="font-bold text-lg uppercase tracking-widest text-red-100">{data.transfer.verdict}</p>
          </motion.div>
        </motion.div>
      )
    } : { content: () => <div className="bg-gray-800 text-white p-10">No Transfers Made.</div> },

    // 5. BENCH AUDIT (SPLIT STYLE)
    data.benchRegret ? {
      content: () => (
        <motion.div 
          className="w-full h-full relative font-sans"
          initial="hidden" animate="visible"
        >
          {/* Split Background */}
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full bg-[#1e293b]"></div> {/* Dark Blue - Starter */}
            <div className="w-1/2 h-full bg-[#ea580c]"></div> {/* Orange - Bench */}
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6">
            <motion.h2 variants={fadeInUp} className="text-white font-black uppercase tracking-widest mb-10 text-2xl drop-shadow-md">
              Bench Regret
            </motion.h2>

            <motion.div variants={scaleIn} className="flex w-full max-w-sm bg-white/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20">
              
              {/* Left: Starter */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-white border-r border-white/10">
                <p className="text-[10px] font-bold uppercase opacity-70 mb-2">You Started</p>
                <h3 className="text-xl font-black leading-tight mb-2">{data.benchRegret.started.name}</h3>
                <p className="text-5xl font-black">{data.benchRegret.started.points}</p>
              </div>

              {/* Right: Bencher */}
              <div className="flex-1 p-6 flex flex-col items-center justify-center text-white bg-white/10">
                 <p className="text-[10px] font-bold uppercase opacity-70 mb-2">You Benched</p>
                <h3 className="text-xl font-black leading-tight mb-2">{data.benchRegret.benched.name}</h3>
                <p className="text-5xl font-black text-yellow-300">{data.benchRegret.benched.points}</p>
              </div>

            </motion.div>

            <motion.div variants={fadeInUp} className="mt-8 bg-black/60 px-6 py-3 rounded-full">
              <p className="text-white font-bold">
                Cost you <span className="text-orange-500 font-black text-xl">{data.benchRegret.diff}</span> points.
              </p>
            </motion.div>
          </div>
        </motion.div>
      )
    } : { content: () => <div className="bg-green-700 text-white p-10 flex flex-col items-center justify-center h-full"><h1 className="text-4xl font-bold">Bench Perfect ✅</h1></div> },

    // 6. CARDIO KING
    data.cardioKing && {
      content: () => (
        <motion.div 
          className={`${slideContainer} bg-[#ef4444] text-white`}
          initial="hidden" animate="visible"
        >
          <motion.div variants={scaleIn} className="text-7xl mb-6">🏃‍♂️</motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl font-black uppercase mb-2">Cardio King</motion.h1>
          <motion.p variants={fadeInUp} className="text-lg opacity-80 mb-10">Played 60+ mins. Did nothing.</motion.p>
          
          <motion.div variants={scaleIn} className="bg-white text-red-600 w-64 h-64 rounded-full flex flex-col items-center justify-center shadow-xl">
            <h2 className="text-3xl font-black leading-tight text-center px-4 mb-2">{data.cardioKing.name}</h2>
            <div className="w-12 h-1 bg-gray-200 mb-2"></div>
            <p className="text-black font-mono font-bold">{data.cardioKing.minutes} Mins</p>
            <p className="text-5xl font-black mt-2">{data.cardioKing.points} PTS</p>
          </motion.div>
        </motion.div>
      )
    },

    // 7. FINAL VERDICT / UNSUNG HERO
    {
      content: () => (
        <motion.div 
          className={`${slideContainer} bg-black text-white`}
          initial="hidden" animate="visible"
        >
          <motion.p variants={fadeInUp} className="text-xs font-bold uppercase text-gray-500 tracking-widest mb-6">
            Gameweek Summary
          </motion.p>
          
          <motion.h1 
            variants={scaleIn}
            className="text-6xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 leading-tight px-4"
          >
            {data.summary.type}
          </motion.h1>

          <motion.button 
            variants={fadeInUp}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 bg-white text-black font-black py-4 px-10 rounded-full shadow-lg"
            onClick={() => navigate('/')}
          >
            ROAST ANOTHER
          </motion.button>
        </motion.div>
      )
    }

  ].filter(Boolean);

  return (
    <div className="h-screen w-full bg-[#0f172a] flex justify-center items-center">
      <div className="w-full max-w-[430px] h-full sm:h-[85vh] sm:rounded-[30px] overflow-hidden shadow-2xl border-[8px] border-gray-900 relative bg-black">
        <Stories
          stories={stories}
          defaultInterval={6000} // Gave 6 seconds to read the new animations
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

export default StoryMode;