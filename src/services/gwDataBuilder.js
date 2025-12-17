// src/services/gwDataBuilder.js

export const buildGWData = (rawData) => {
    const { bootstrap, picks, history, live, details, transfers } = rawData;
    const currentGw = Number(picks.entry_history.event);
  
    // --- Helper: Get Player Info ---
    const getPlayer = (id) => {
      const p = bootstrap.elements.find(e => e.id === id);
      if (!p) return { name: "Unknown", points: 0, price: 0, type: 0 };
      
      const livePlayer = live.elements.find(l => l.id === id);
      return {
        id: p.id,
        name: p.web_name,
        price: p.now_cost / 10,
        type: p.element_type, // 1=GKP, 2=DEF, 3=MID, 4=FWD
        points: livePlayer ? livePlayer.stats.total_points : 0,
        minutes: livePlayer ? livePlayer.stats.minutes : 0,
      };
    };
  
    // --- 1. Squad Analysis ---
    const activePicks = picks.picks.filter(p => p.multiplier > 0).map(p => getPlayer(p.element));
    const benchPicks = picks.picks.filter(p => p.multiplier === 0).map(p => getPlayer(p.element));
  
    // --- 2. Captain Analysis ---
    const captainId = picks.picks.find(p => p.is_captain)?.element;
    const captain = getPlayer(captainId);
    const captainPoints = captain.points * (picks.picks.find(p => p.is_captain)?.multiplier || 2);
    let captainVerdict = "solid";
    if (captain.points < 4) captainVerdict = "fail";
    if (captain.points >= 10) captainVerdict = "hero";
  
    // --- 3. Bench Audit (Improved Logic) ---
    let benchRegret = null;
  
    // Check A: Goalkeeper Regret (Only compare GK to GK)
    const activeGK = activePicks.find(p => p.type === 1);
    const benchGK = benchPicks.find(p => p.type === 1);
    let gkDiff = -1;
    
    if (activeGK && benchGK && benchGK.points > activeGK.points) {
      gkDiff = benchGK.points - activeGK.points;
    }
  
    // Check B: Outfield Regret (Compare Worst Starter to Best Bencher)
    // Filter out GKs from this check
    const activeOutfield = activePicks.filter(p => p.type !== 1).sort((a, b) => a.points - b.points); // Ascending (Worst first)
    const benchOutfield = benchPicks.filter(p => p.type !== 1).sort((a, b) => b.points - a.points); // Descending (Best first)
  
    let fieldDiff = -1;
    if (activeOutfield.length > 0 && benchOutfield.length > 0) {
      const worstStarter = activeOutfield[0];
      const bestBencher = benchOutfield[0];
      if (bestBencher.points > worstStarter.points) {
        fieldDiff = bestBencher.points - worstStarter.points;
      }
    }
  
    // Decide which regret is worse
    if (gkDiff > fieldDiff && gkDiff > 0) {
      benchRegret = { started: activeGK, benched: benchGK, diff: gkDiff, type: "GK Nightmare" };
    } else if (fieldDiff >= gkDiff && fieldDiff > 0) {
      benchRegret = { 
        started: activeOutfield[0], 
        benched: benchOutfield[0], 
        diff: fieldDiff, 
        type: "Bench Pain" 
      };
    }
  
    // --- 4. Cardio King ---
    const cardioKing = activePicks
      .filter(p => p.minutes >= 60 && p.points <= 2)
      .sort((a, b) => a.minutes - b.minutes)[0];
  
    // --- 5. Unsung Hero ---
    const unsungHero = activePicks
      .filter(p => p.price < 6.5 && p.points >= 6 && p.id !== captainId)
      .sort((a, b) => b.points - a.points)[0];
  
    // --- 6. Transfer Verdict ---
    const gwTransfers = transfers.filter(t => t.event === currentGw);
    let transferVerdict = null;
    if (gwTransfers.length > 0) {
      const t = gwTransfers[0]; 
      const pIn = getPlayer(t.element_in);
      const pOut = getPlayer(t.element_out);
      transferVerdict = {
        in: pIn, out: pOut,
        diff: pIn.points - pOut.points,
        verdict: (pIn.points - pOut.points) > 0 ? "Masterclass" : "Disaster"
      };
    }
  
    // --- 7. Rank & Summary ---
    const currentGwStats = history.current.find(h => h.event === currentGw);
    const prevGwStats = history.current.find(h => h.event === currentGw - 1);
    const rankArrow = (prevGwStats?.overall_rank - currentGwStats?.overall_rank) > 0 ? "green" : "red";
    const totalBenchPts = benchPicks.reduce((acc, p) => acc + p.points, 0);
  
    return {
      meta: {
        teamName: details.name,
        gw: currentGw,
        points: picks.entry_history.points,
        totalPoints: picks.entry_history.total_points,
        rank: currentGwStats ? currentGwStats.overall_rank : 0,
        rankArrow
      },
      captain: { ...captain, totalPoints: captainPoints, verdict: captainVerdict },
      benchRegret,
      cardioKing,
      unsungHero,
      transfer: transferVerdict,
      bench: { totalPoints: totalBenchPts },
      summary: {
        type: getPersonalityType(picks.entry_history.points, totalBenchPts, rankArrow, transferVerdict)
      }
    };
  };
  
  const getPersonalityType = (points, benchPts, arrow, transfer) => {
    if (points < 35) return "The Relegation Candidate";
    if (benchPts > 15) return "The Bench Warmer";
    if (transfer?.diff < -5) return "The Market Clown";
    if (arrow === "green" && points > 75) return "The Tactical Genius";
    if (points >= 50) return "Solid but Unspectacular";
    return "The NPC"; 
  };