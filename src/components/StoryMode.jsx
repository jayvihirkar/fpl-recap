import React from 'react';
import Stories from 'react-insta-stories';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from './CountUp';
import Background from './Background'; // Ensure you created this!

const StoryMode = ({ data }) => {
  const navigate = useNavigate();

  // --- iOS ANIMATION PHYSICS ---
  const springTransition = { type: "spring", stiffness: 90, damping: 15 };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { ...springTransition, staggerChildren: 0.1 } }
  };

  // --- REUSABLE CARD WRAPPER ---
  const SlideWrapper = ({ children, theme }) => (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden font-sans text-white">
      <Background theme={theme} />
      <motion.div 
        className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6"
        initial="hidden" animate="visible" variants={fadeInUp}
      >
        {children}
      </motion.div>
    </div>
  );

  // --- STORIES ---
  const stories = [

    // 1. INTRO
    {
      content: () => (
        <SlideWrapper theme="default">
          <motion.div variants={fadeInUp} className="text-6xl mb-6 drop-shadow-lg">🧑‍🍳</motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl font-bold tracking-tight text-center mb-2">
            Let's see what <br/> you cooked.
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-white/60 font-medium tracking-wide uppercase text-sm bg-white/10 px-4 py-1 rounded-full backdrop-blur-md">
            Gameweek {data.meta.gw}
          </motion.p>
        </SlideWrapper>
      )
    },

    // 2. SNAPSHOT (Apple Wallet Style)
    {
      content: () => (
        <SlideWrapper theme={data.meta.rankArrow === 'green' ? 'green' : 'red'}>
          <motion.div variants={fadeInUp} className="w-full max-w-xs bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 shadow-2xl flex flex-col items-center">
            <p className="text-white/60 font-semibold uppercase tracking-wider text-xs mb-4">GW Performance</p>
            
            <div className="text-[7rem] font-bold leading-none tracking-tighter mb-4 drop-shadow-2xl">
              <CountUp to={data.meta.points} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-xs text-white/50 font-bold uppercase">Total</p>
                <p className="text-2xl font-bold tracking-tight"><CountUp to={data.meta.totalPoints} /></p>
              </div>
              <div className="text-center">
                 <p className="text-xs text-white/50 font-bold uppercase">Rank</p>
                 <div className="flex items-center justify-center gap-1">
                   <p className="text-xl font-bold tracking-tight">#{data.meta.rank.toLocaleString()}</p>
                   <span className="text-lg">{data.meta.rankArrow === 'green' ? '↗' : '↘'}</span>
                 </div>
              </div>
            </div>
          </motion.div>
        </SlideWrapper>
      )
    },

    // 3. CAPTAINCY (Hero Card)
    {
      content: () => (
        <SlideWrapper theme="gold">
          <motion.p variants={fadeInUp} className="text-yellow-200 font-bold uppercase tracking-widest text-xs mb-6">The Armband</motion.p>
          
          <motion.div variants={fadeInUp} className="relative w-full max-w-xs aspect-[3/4] rounded-[2.5rem] bg-gradient-to-b from-yellow-500/20 to-orange-600/20 border border-yellow-400/30 backdrop-blur-md flex flex-col items-center justify-between p-8 shadow-[0_0_40px_rgba(234,179,8,0.2)]">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight leading-none mb-1">{data.captain.name}</h1>
              <div className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                data.captain.verdict === 'hero' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'
              }`}>
                {data.captain.verdict}
              </div>
            </div>

            <div className="text-center">
               <span className="text-[6rem] font-bold tracking-tighter leading-none text-yellow-300 drop-shadow-lg">
                 <CountUp to={data.captain.totalPoints} />
               </span>
               <p className="text-yellow-100/60 font-bold text-sm -mt-2">POINTS</p>
            </div>

            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: `${Math.min(data.captain.totalPoints * 2, 100)}%` }} 
                 className="h-full bg-yellow-400" 
               />
            </div>
          </motion.div>
        </SlideWrapper>
      )
    },

    // 4. TRANSFER (Nemesis / VS Style)
    data.transfer ? {
      content: () => (
        <SlideWrapper theme="dark">
           <motion.h2 variants={fadeInUp} className="text-white/50 font-bold uppercase tracking-widest text-xs mb-8">Transfer Market</motion.h2>

           <div className="flex w-full items-center justify-center gap-2 mb-8 relative">
              {/* SOLD CARD */}
              <motion.div variants={fadeInUp} className="flex-1 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex flex-col items-center backdrop-blur-md">
                 <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-xl mb-2">👋</div>
                 <p className="text-[10px] font-bold text-red-300 uppercase">Sold</p>
                 <p className="font-bold text-lg leading-tight text-center">{data.transfer.out.name}</p>
                 <p className="text-3xl font-bold text-red-400 mt-1">{data.transfer.out.points}</p>
              </motion.div>

              <div className="absolute text-2xl font-black italic opacity-30 z-20">VS</div>

              {/* BOUGHT CARD */}
              <motion.div variants={fadeInUp} className="flex-1 bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex flex-col items-center backdrop-blur-md">
                 <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-xl mb-2">🤝</div>
                 <p className="text-[10px] font-bold text-green-300 uppercase">Bought</p>
                 <p className="font-bold text-lg leading-tight text-center">{data.transfer.in.name}</p>
                 <p className="text-3xl font-bold text-green-400 mt-1">{data.transfer.in.points}</p>
              </motion.div>
           </div>

           <motion.div variants={fadeInUp} className="px-6 py-2 bg-white/10 rounded-full backdrop-blur-xl border border-white/10">
              <p className="font-bold text-lg">{data.transfer.verdict}</p>
           </motion.div>
        </SlideWrapper>
      )
    } : { content: () => <SlideWrapper theme="dark">No Transfers</SlideWrapper> },

    // 5. BENCH REGRET (Split)
    data.benchRegret ? {
      content: () => (
        <div className="relative w-full h-full flex font-sans">
           {/* Split BG */}
           <div className="w-1/2 h-full bg-slate-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-noise opacity-30"></div>
           </div>
           <div className="w-1/2 h-full bg-orange-600 relative overflow-hidden">
               <div className="absolute inset-0 bg-noise opacity-30"></div>
           </div>

           {/* Content Overlay */}
           <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">
              <motion.h2 
                 initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} 
                 className="text-white font-black uppercase tracking-widest text-lg mb-8 drop-shadow-md"
              >
                Bench Regret
              </motion.h2>

              <motion.div 
                initial={{scale: 0.9, opacity:0}} animate={{scale:1, opacity:1}} 
                className="flex w-full bg-black/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
              >
                 {/* Left */}
                 <div className="flex-1 p-6 flex flex-col items-center justify-center border-r border-white/10">
                    <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Started</p>
                    <p className="text-lg font-bold text-white text-center leading-tight mb-2">{data.benchRegret.started.name}</p>
                    <p className="text-4xl font-bold text-slate-200">{data.benchRegret.started.points}</p>
                 </div>
                 {/* Right */}
                 <div className="flex-1 p-6 flex flex-col items-center justify-center bg-orange-500/20">
                    <p className="text-[10px] font-bold uppercase text-orange-200 mb-2">Benched</p>
                    <p className="text-lg font-bold text-white text-center leading-tight mb-2">{data.benchRegret.benched.name}</p>
                    <p className="text-4xl font-bold text-yellow-300">{data.benchRegret.benched.points}</p>
                 </div>
              </motion.div>

              <motion.div 
                 initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} delay={0.3}
                 className="mt-8 bg-black/60 px-6 py-3 rounded-full border border-orange-500/50 backdrop-blur-md"
              >
                 <p className="text-white font-bold text-sm">Cost you <span className="text-orange-400">{data.benchRegret.diff} pts</span></p>
              </motion.div>
           </div>
        </div>
      )
    } : { content: () => <SlideWrapper theme="green">Bench Perfect</SlideWrapper> },

    // 6. FINAL SUMMARY
    {
      content: () => (
        <SlideWrapper theme="default">
           <motion.p variants={fadeInUp} className="text-white/50 font-bold uppercase tracking-widest text-xs mb-8">Summary</motion.p>
           
           <motion.h1 variants={fadeInUp} className="text-5xl font-black text-center leading-tight tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-pink-200 mb-10">
             {data.summary.type}
           </motion.h1>

           <motion.button
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="bg-white text-black font-bold py-4 px-10 rounded-full shadow-xl tracking-tight text-lg"
           >
             Roast Another Team
           </motion.button>
        </SlideWrapper>
      )
    }

  ].filter(Boolean);

  return (
    <div className="fixed inset-0 bg-[#000] flex justify-center items-center">
      <div className="w-full h-full sm:max-w-[430px] sm:h-[88vh] sm:rounded-[40px] overflow-hidden shadow-[0_0_80px_rgba(100,100,100,0.1)] border-[8px] border-[#1a1a1a] relative bg-black">
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
