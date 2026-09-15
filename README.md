# 🪙 CoinPulse — Crypto Market Dashboard

[![Snyk Security](https://snyk.io/test/github/AristeidisTriantafyllidis/cryptos/badge.svg)](https://snyk.io/test/github/AristeidisTriantafyllidis/cryptos)

A React web application for tracking live cryptocurrency market data. Browse the top coins, follow trending picks, dive into per-coin price charts, and keep a personal watchlist — all backed by CoinGecko data through a Vercel API proxy.

## ✨ Features

- **Market Overview**: Browse the top cryptocurrencies with live price, market cap, and 24h change. Top Coins by Market Cap uses server-side pagination — click Load More to fetch the next 20 coins.
- **Trending Coins**: See which coins are trending right now.
- **Deep-Dive Charts**: Click into any coin for detailed stats and interactive price history charts.
- **Watchlist**: Save coins you care about and remove them just as easily.
- **Resilient Fetching**: Requests are proxied through Vercel serverless functions with retry logic to avoid CoinGecko rate-limit/CORS issues.
- **Loading Skeletons & Error Boundaries**: Polished loading states and graceful error handling throughout.

## 🛠️ Tech Stack & Tools

- ⚛️ React
- 🎨 Tailwind CSS
- 📈 Chart.js / Lightweight Charts
- 🎬 Motion (animations)
- ▲ Vercel (hosting + serverless API proxy)
- 🃏 Jest & React Testing Library
- 🔁 GitHub Actions (CI: lint, test, build)

## 🚀 Live Deployment

🌐 Live Demo: [coinpulse-five.vercel.app](https://coinpulse-five.vercel.app/)

## 💻 Local Development

Clone the repository:

```bash
git clone https://github.com/AristeidisTriantafyllidis/cryptos.git
```

Navigate into the project directory:

```bash
cd cryptos
```

Install the required dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm start
```

The app will automatically open in your browser at http://localhost:3000.

Run the test suite (Jest):

```bash
npm test
```
