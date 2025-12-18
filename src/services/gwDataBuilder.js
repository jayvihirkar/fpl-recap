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
      fullName: `${p.first_name} ${p.second_name}`,
      price: p.now_cost / 10,
      type: p.element_type, // 1=GKP, 2=DEF, 3=MID, 4=FWD
      points: livePlayer ? livePlayer.stats.total_points : 0,
      minutes: livePlayer ? livePlayer.stats.minutes : 0,
    };
  };

  const activePicks = picks.picks.filter(p => p.multiplier > 0).map(p => getPlayer(p.element));
  const benchPicks = picks.picks.filter(p => p.multiplier === 0).map(p => getPlayer(p.element));

  // --- 1. Rank Verdict ---
  const currentGwStats = history.current.find(h => h.event === currentGw);
  const prevGwStats = history.current.find(h => h.event === currentGw - 1);
  let rankVerdict = "Rank remained unchanged.";
  
  if (currentGwStats && prevGwStats) {
    const diff = prevGwStats.overall_rank - currentGwStats.overall_rank;
    if (diff > 0) {
      rankVerdict = `Green Arrow: improved from ${prevGwStats.overall_rank.toLocaleString()} to ${currentGwStats.overall_rank.toLocaleString()}.`;
    } else if (diff < 0) {
      rankVerdict = `Red Arrow: dropped from ${prevGwStats.overall_rank.toLocaleString()} to ${currentGwStats.overall_rank.toLocaleString()}.`;
    }
  }

  // --- 2. Captaincy Punchlines ---
  const captainId = picks.picks.find(p => p.is_captain)?.element;
  const captain = getPlayer(captainId);
  const captainPoints = captain.points * (picks.picks.find(p => p.is_captain)?.multiplier || 2);
  
  let captainVerdict = "Solid Choice";
  let captainPunchline = "Didn't embarrass you, at least.";
  
  if (captain.points >= 15) {
    captainVerdict = "HERO";
    captainPunchline = "Carrying your entire season on his back.";
  } else if (captain.points >= 8) {
    captainVerdict = "Solid";
    captainPunchline = "Honest work.";
  } else if (captain.points <= 3) {
    captainVerdict = "FRAUD";
    captainPunchline = "Delete the app. Seriously.";
  }

  // --- 3. Top 3 Players ---
  const top3 = [...activePicks].sort((a, b) => b.points - a.points).slice(0, 3);

  // --- 4. Bench Audit (Strict Comparison) ---
  let benchRegret = null;
  // Compare GK
  const activeGK = activePicks.find(p => p.type === 1);
  const benchGK = benchPicks.find(p => p.type === 1);
  if (activeGK && benchGK && benchGK.points > activeGK.points) {
    benchRegret = { started: activeGK, benched: benchGK, diff: benchGK.points - activeGK.points };
  }
  // Compare Outfielders (if GK check didn't trigger or outfield diff is huge)
  if (!benchRegret) {
    const worstStarter = activePicks.filter(p => p.type !== 1).sort((a, b) => a.points - b.points)[0];
    const bestBencher = benchPicks.filter(p => p.type !== 1).sort((a, b) => b.points - a.points)[0];
    if (worstStarter && bestBencher && bestBencher.points > worstStarter.points) {
       benchRegret = { started: worstStarter, benched: bestBencher, diff: bestBencher.points - worstStarter.points };
    }
  }

  // --- 5. Transfer Verdict ---
  const gwTransfers = transfers.filter(t => t.event === currentGw);
  let transferVerdict = null;
  if (gwTransfers.length > 0) {
    const t = gwTransfers[0];
    const pIn = getPlayer(t.element_in);
    const pOut = getPlayer(t.element_out);
    const diff = pIn.points - pOut.points;
    transferVerdict = {
      in: pIn, out: pOut, diff,
      verdict: diff > 0 ? "Masterclass" : diff < 0 ? "Disaster" : "Sideways"
    };
  }

  // --- 6. Cardio King & Cheap Beast & AutoSub ---
  const cardioKing = activePicks.filter(p => p.minutes >= 60 && p.points <= 2).sort((a, b) => a.minutes - b.minutes)[0];
  const cheapBeast = activePicks.filter(p => p.price < 6.0 && p.points >= 6 && p.id !== captainId).sort((a,b) => b.points - a.points)[0];
  
  const autoSubs = picks.automatic_subs || [];
  const autoSubHero = autoSubs.length > 0 ? { in: getPlayer(autoSubs[0].element_in), out: getPlayer(autoSubs[0].element_out) } : null;

  return {
    meta: {
      teamName: details.name,
      gw: currentGw,
      points: picks.entry_history.points,
      rankVerdict
    },
    captain: { ...captain, totalPoints: captainPoints, verdict: captainVerdict, punchline: captainPunchline },
    top3,
    benchRegret,
    cardioKing,
    cheapBeast,
    transfer: transferVerdict,
    autoSub: autoSubHero,
  };
};
