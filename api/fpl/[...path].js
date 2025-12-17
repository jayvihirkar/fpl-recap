export default async function handler(req, res) {
    // 1. Get the path from the URL (e.g. ['bootstrap-static'] or ['entry', '123'])
    const { path } = req.query;
    const endpoint = path.join('/'); 
    
    // 2. Construct the real FPL URL
    const fplUrl = `https://fantasy.premierleague.com/api/${endpoint}/`;
    
    try {
      // 3. Fetch data from FPL with a browser-like User-Agent (helps avoid blocks)
      const response = await fetch(fplUrl, {
          headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
          }
      });
      
      if (!response.ok) {
          throw new Error(`FPL API responded with ${response.status}`);
      }
  
      const data = await response.json();
      
      // 4. Return the clean JSON to your frontend
      res.status(200).json(data);
      
    } catch (error) {
      console.error("Proxy Error:", error);
      res.status(500).json({ error: "Failed to fetch data from FPL" });
    }
  }