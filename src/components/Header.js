import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header({
  searchCrypto,
  setSearchCrypto,
  backgroundColor,
  setBackgroundColor,
}) {
  const navigate = useNavigate();
  const isDark = backgroundColor === "black";

  return (
    <header className="sticky top-0 z-10 mb-4 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 transition-colors sm:gap-6 sm:px-6 dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        className="flex flex-shrink-0 items-center gap-2 rounded-md text-base font-bold text-slate-900 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:text-slate-100"
        onClick={() => navigate("/")}
        aria-label="CoinPulse home"
      >
        <img
          className="h-9 w-9 rounded-md object-contain"
          src="/logoImage.png"
          alt=""
          width={200}
          height={100}
        />
        <span className="hidden sm:inline">CoinPulse</span>
      </button>

      <div className="relative order-3 w-full flex-1 sm:order-none sm:w-auto sm:max-w-[420px]">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
          <line
            x1="14"
            y1="14"
            x2="18"
            y2="18"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
        <input
          className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-900 transition-colors placeholder:text-slate-400 focus:border-accent focus:bg-white focus:outline-none focus:ring-2 focus:ring-accent/30 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-accent-dark dark:focus:bg-slate-900"
          placeholder="Search crypto..."
          type="text"
          value={searchCrypto}
          onChange={(e) => setSearchCrypto(e.target.value)}
          aria-label="Search cryptocurrencies"
        />
      </div>

      <div className="ml-auto flex flex-shrink-0 items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-full border border-transparent px-4 text-sm font-semibold transition-colors hover:border-slate-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:hover:border-slate-700 dark:hover:bg-slate-800"
          onClick={() => navigate("/watchlist")}
          aria-label="Go to watchlist"
          title="Watchlist"
        >
          Watchlist
        </button>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-transparent text-lg transition-colors hover:border-slate-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:hover:border-slate-700 dark:hover:bg-slate-800"
          onClick={() => setBackgroundColor(isDark ? "white" : "black")}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
