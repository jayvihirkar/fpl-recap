// src/services/fplApi.js

// We now point to our single serverless function file
const PROXY_URL = '/api/proxy'; 

// Helper function to build the correct URL with query params
const getUrl = (endpoint) => `${PROXY_URL}?endpoint=${endpoint}`;

export const fetchFPLData = async (teamId, gw) => {
  try {
    // We send the desired FPL path as the 'endpoint' query parameter
    const bootstrapRes = await fetch(getUrl('bootstrap-static'));
    const picksRes = await fetch(getUrl(`entry/${teamId}/event/${gw}/picks`));
    const historyRes = await fetch(getUrl(`entry/${teamId}/history`));
    const detailsRes = await fetch(getUrl(`entry/${teamId}`));
    const liveRes = await fetch(getUrl(`event/${gw}/live`));
    const transfersRes = await fetch(getUrl(`entry/${teamId}/transfers`)); 

    // Check for errors
    if (!bootstrapRes.ok || !picksRes.ok || !historyRes.ok || !liveRes.ok || !detailsRes.ok || !transfersRes.ok) {
      throw new Error("Failed to fetch FPL data.");
    }

    // Parse all JSON in parallel
    const [bootstrap, picks, history, details, live, transfers] = await Promise.all([
      bootstrapRes.json(),
      picksRes.json(),
      historyRes.json(),
      detailsRes.json(),
      liveRes.json(),
      transfersRes.json()
    ]);

    return { bootstrap, picks, history, details, live, transfers };

  } catch (error) {
    console.error("Error fetching FPL data:", error);
    throw error;
  }
};
