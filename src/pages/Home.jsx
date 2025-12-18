import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [gw, setGw] = useState('');
  const [teamId, setTeamId] = useState('');
  const [showLegal, setShowLegal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedId = localStorage.getItem('fpl_team_id');
    if (savedId) { setInputValue(savedId); setTeamId(savedId); }
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    const urlMatch = val.match(/entry\/(\d+)(?:\/event\/(\d+))?/);
    if (urlMatch) {
      setTeamId(urlMatch[1]);
      if (urlMatch[2]) setGw(urlMatch[2]);
    } else {
      setTeamId(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (teamId && gw) {
      localStorage.setItem('fpl_team_id', teamId);
      navigate(`/wrapped/${teamId}/${gw}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-hidden flex flex-col">
      
      {/* 1. AMOLED Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

      {/* 2. Subtle Football Animation */}
      <div className="absolute top-20 left-0 w-full h-40 overflow-hidden pointer-events-none opacity-50">
        {/* Goal Post */}
        <div className="absolute right-10 top-10 w-24 h-24 border-r-4 border-t-4 border-white/20 rounded-tr-xl"></div>
        {/* Ball Path */}
        <motion.div 
          className="absolute left-[-50px] top-24 text-4xl"
          animate={{ x: "100vw", rotate: 360, y: [0, -40, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          ⚽
        </motion.div>
        {/* Confetti (Only appears when ball nears goal - simulated via timing) */}
        <motion.div 
          className="absolute right-12 top-12 text-2xl"
          animate={{ opacity: [0, 0, 1, 0], scale: [0, 1, 1.5] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.8, 0.9, 1] }}
        >
          🎉
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-6xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
            FPL RECAP
          </h1>
          <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">
            The reality check you didn't ask for.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-6">
          <div className="group">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2 block group-focus-within:text-green-500 transition-colors">Team ID or URL</label>
            <input 
              type="text" 
              placeholder="e.g. 105045" 
              value={inputValue} 
              onChange={handleInputChange}
              className="w-full bg-[#121212] border border-gray-800 rounded-xl p-4 text-white font-bold text-lg focus:outline-none focus:border-green-500 transition-all shadow-xl placeholder:text-gray-700"
            />
          </div>
          <div className="group">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-2 block group-focus-within:text-green-500 transition-colors">Gameweek</label>
            <input 
              type="number" 
              placeholder="e.g. 12" 
              value={gw} 
              onChange={(e) => setGw(e.target.value)}
              className="w-full bg-[#121212] border border-gray-800 rounded-xl p-4 text-white font-bold text-lg focus:outline-none focus:border-green-500 transition-all shadow-xl placeholder:text-gray-700"
            />
          </div>
          <button 
            type="submit" 
            className="mt-4 bg-white text-black font-black py-4 rounded-xl text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            ROAST MY TEAM
          </button>
        </form>
      </div>

      {/* Footer & Legal */}
      <footer className="w-full p-6 flex flex-col items-center gap-4 text-gray-600 text-xs relative z-10">
        <p>Not affiliated with Fantasy Premier League.</p>
        <button onClick={() => setShowLegal(true)} className="underline hover:text-gray-400">
          Policy & Legal
        </button>
      </footer>

      {/* Legal Modal */}
      {showLegal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-gray-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-white">Legal & Privacy</h2>
            
            <div className="space-y-4 text-gray-400 text-sm">
              <div>
                <h3 className="font-bold text-white mb-1">1. Terms of Service</h3>
                <p>Disclaimer: FPL Recap is a fan-made project and is not affiliated, endorsed, or sponsored by the Premier League or Fantasy Premier League. All data is fetched via public APIs.</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">2. Privacy Policy</h3>
                <p>Public Data Only: We only access data that is already publicly available on your FPL profile. We do not store your personal data or passwords.</p>
              </div>
            </div>

            <button 
              onClick={() => setShowLegal(false)}
              className="mt-8 w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
