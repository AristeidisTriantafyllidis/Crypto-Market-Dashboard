const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  if (!process.env.COINGECKO_API_KEY) {
    return res.status(500).json({ error: "server_misconfigured" });
  }

  const query = (req.query.query || "").trim();
  if (!query) {
    return res.status(200).json([]);
  }

  let upstream;
  try {
    upstream = await fetch(
      `${COINGECKO_BASE}/search?query=${encodeURIComponent(query)}`,
      { headers: { "x-cg-demo-api-key": process.env.COINGECKO_API_KEY } },
    );
  } catch (err) {
    return res.status(502).json({ error: "upstream_unreachable" });
  }

  const body = await upstream.json();
  if (!upstream.ok) {
    return res.status(upstream.status).json({
      error: upstream.status === 429 ? "rate_limited" : "upstream_error",
      status: upstream.status,
    });
  }
  return res.status(200).json(body.coins || []);
};
