export default async function handler(req, res) {
  // Instead of path logic, we just grab the query parameter
  const { endpoint } = req.query;
  
  if (!endpoint) {
    return res.status(400).json({ error: "Endpoint missing" });
  }

  const fplUrl = `https://fantasy.premierleague.com/api/${endpoint}/`;

  try {
    const response = await fetch(fplUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `FPL Error: ${response.statusText}` });
    }

    const data = await response.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Server Error", details: error.message });
  }
}
