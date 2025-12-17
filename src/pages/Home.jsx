import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [inputValue, setInputValue] = useState(''); // Can be ID or URL
  const [gw, setGw] = useState('');
  const [teamId, setTeamId] = useState(''); // The actual clean ID
  const navigate = useNavigate();

  // 1. Load saved ID on startup
  useEffect(() => {
    const savedId = localStorage.getItem('fpl_team_id');
    if (savedId) {
      setInputValue(savedId);
      setTeamId(savedId);
    }
  }, []);

  // 2. The Smart Logic: Detect if user pasted a URL
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    // Regex to find ".../entry/XXXXXX/event/XX"
    const urlMatch = val.match(/entry\/(\d+)(?:\/event\/(\d+))?/);

    if (urlMatch) {
      // It's a URL! Auto-fill everything
      const extractedId = urlMatch[1];
      const extractedGw = urlMatch[2]; // Might be undefined if they pasted history link

      setTeamId(extractedId);
      if (extractedGw) {
        setGw(extractedGw);
      }
      
      // UX: feedback that we found it
      console.log(`Detected ID: ${extractedId}, GW: ${extractedGw}`);
    } else {
      // It's just a normal number (or they are typing manually)
      setTeamId(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (teamId && gw) {
      // 3. Save to LocalStorage
      localStorage.setItem('fpl_team_id', teamId);
      
      // Navigate
      navigate(`/wrapped/${teamId}/${gw}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-4 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
          FPL GW Wrapped
        </h1>
        <p className="text-gray-400">Paste your URL. Get Roasted.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
        
        {/* Smart Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Team ID <span className="text-gray-500 font-normal">(or paste full URL)</span>
          </label>
          <input 
            type="text" 
            placeholder="e.g. 105045 OR https://fantasy.premierleague.com/..." 
            value={inputValue}
            onChange={handleInputChange}
            className="p-3 rounded-lg bg-white text-black font-bold text-lg focus:ring-4 focus:ring-green-500/50 outline-none transition truncate"
          />
          {/* Visual Confirmation if ID was extracted from URL */}
          {inputValue.includes('http') && teamId && (
            <p className="text-green-400 text-xs font-mono">
              ✓ ID extracted: {teamId}
            </p>
          )}
        </div>

        {/* Gameweek Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Gameweek</label>
          <input 
            type="number" 
            placeholder="e.g. 12" 
            value={gw}
            onChange={(e) => setGw(e.target.value)}
            className="p-3 rounded-lg bg-white text-black font-bold text-lg focus:ring-4 focus:ring-green-500/50 outline-none transition"
          />
        </div>

        <button 
          type="submit" 
          disabled={!teamId || !gw}
          className="mt-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black py-4 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          GENERATE WRAPPED
        </button>
      </form>
      
      <p className="mt-6 text-xs text-gray-500 max-w-xs text-center">
        Tip: Go to your "Points" tab on FPL, copy the link from the browser, and paste it above.
      </p>
    </div>
  );
};

export default Home;