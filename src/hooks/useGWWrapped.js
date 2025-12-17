import { useState, useEffect } from 'react';
import { fetchFPLData } from '../services/fplApi';
import { buildGWData } from '../services/gwDataBuilder';

export const useGWWrapped = (teamId, gw) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If IDs are missing, don't attempt fetch
    if (!teamId || !gw) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch the raw data from FPL (via our proxy)
        const rawData = await fetchFPLData(teamId, gw);
        
        // 2. Process the data using our Builder logic (Roasts, calculations, etc.)
        const processedData = buildGWData(rawData);
        
        // 3. Save the clean data to state
        setData(processedData);
        
      } catch (err) {
        console.error("Hook Error:", err);
        setError(err.message || "Failed to generate Wrapped");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [teamId, gw]);

  return { data, loading, error };
};