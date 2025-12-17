// src/services/fplApi.js

const BASE_URL = '/api/fpl'; 

export const fetchFPLData = async (teamId, gw) => {
  try {
    const bootstrapRes = await fetch(`${BASE_URL}/bootstrap-static/`);
    const picksRes = await fetch(`${BASE_URL}/entry/${teamId}/event/${gw}/picks/`);
    const historyRes = await fetch(`${BASE_URL}/entry/${teamId}/history/`);
    const detailsRes = await fetch(`${BASE_URL}/entry/${teamId}/`);
    const liveRes = await fetch(`${BASE_URL}/event/${gw}/live/`);
    
    // --- NEW: Fetch Transfers ---
    const transfersRes = await fetch(`${BASE_URL}/entry/${teamId}/transfers/`); 

    if (!bootstrapRes.ok || !picksRes.ok || !historyRes.ok || !liveRes.ok || !detailsRes.ok || !transfersRes.ok) {
      throw new Error("Failed to fetch FPL data.");
    }

    const [bootstrap, picks, history, details, live, transfers] = await Promise.all([
      bootstrapRes.json(),
      picksRes.json(),
      historyRes.json(),
      detailsRes.json(),
      liveRes.json(),
      transfersRes.json() // <--- Return this
    ]);

    return { bootstrap, picks, history, details, live, transfers };

  } catch (error) {
    console.error("Error fetching FPL data:", error);
    throw error;
  }
};