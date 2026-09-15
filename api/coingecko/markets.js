const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

function parsePage(rawPage) {
  const page = Number.parseInt(rawPage, 10);
  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }
  return page;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  if (!process.env.COINGECKO_API_KEY) {
    return res.status(500).json({ error: "server_misconfigured" });
  }

  const page = parsePage(req.query.page);

  let upstream;
  try {
    upstream = await fetch(
      `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`,
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
  return res.status(upstream.status).json(body);
};
