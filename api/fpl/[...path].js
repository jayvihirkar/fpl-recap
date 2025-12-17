export default async function handler(req, res) {
  const { path } = req.query;
  
  // Safety check: ensure path exists
  if (!path) {
    return res.status(400).json({ error: "Path missing" });
  }

  // Combine the path array into a string (e.g., "entry/123/history")
  const endpoint = Array.isArray(path) ? path.join('/') : path;
  const fplUrl = `https://fantasy.premierleague.com/api/${endpoint}/`;

  console.log(`Fetching: ${fplUrl}`); // This will show up in Vercel Logs

  try {
    const response = await fetch(fplUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://fantasy.premierleague.com/',
        'Origin': 'https://fantasy.premierleague.com'
      }
    });

    if (!response.ok) {
      // Pass the error detail back to the frontend
      return res.status(response.status).json({ error: `FPL Error: ${response.statusText}` });
    }

    const data = await response.json();
    
    // Cache the response for 60 seconds to make it faster
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (error) {
    console.error("Proxy Error:", error);
    return res.status(500).json({ error: "Server Error", details: error.message });
  }
}
