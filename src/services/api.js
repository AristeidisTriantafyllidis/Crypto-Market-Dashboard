export async function fetchData(page = 1, signal) {
  const response = await fetch(`/api/coingecko/markets?page=${page}`, {
    signal,
  });

  if (!response.ok) {
    const error = new Error(`Response status: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function fetchTrendingCryptos(signal) {
  const url = "/api/coingecko/trending";
  const response = await fetch(url, { method: "GET", signal });
  if (!response.ok) {
    const error = new Error(`Response status: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function fetchSpecificCrypto(id, signal) {
  const url = `/api/coingecko/coin/${id}`;
  const response = await fetch(url, { method: "GET", signal });
  if (!response.ok) {
    const error = new Error(`Response status: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function fetchDataForChart(id, days, signal) {
  const url = `/api/coingecko/chart/${id}?days=${days}`;
  const response = await fetch(url, { method: "GET", signal });
  if (!response.ok) {
    const error = new Error(`Response status: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export async function fetchSearchedCoins(query, signal) {
  const url = `/api/coingecko/search?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, { method: "GET", signal });
  if (!response.ok) {
    const error = new Error(`Response status: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}
