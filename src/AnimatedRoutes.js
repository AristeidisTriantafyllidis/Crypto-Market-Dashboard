import React, { useEffect } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import MainPage from "./pages/MainPage";
import DetailPage from "./pages/DetailPage";
import Watchlist from "./pages/Watchlist";
import Header from "./components/Header";
import SkeletonPlaceholder from "./components/skeletons/SkeletonMain";
import DetailSkeletonPlaceholder from "./components/skeletons/SkeletonDetail";
import "react-loading-skeleton/dist/skeleton.css";

export function PageTransition({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.main>
  );
}

function DetailRoute({
  findId,
  detailLoading,
  specificCoin,
  chartData,
  daysForChart,
  setDaysForChart,
  watchlistData,
  setWatchlistData,
  handleAddtoWatchlist,
  chartError,
  detailError,
}) {
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      findId(id);
    }
  }, [id, findId]);

  return (
    <PageTransition>
      {detailLoading ? (
        <DetailSkeletonPlaceholder />
      ) : (
        <DetailPage
          specificCoin={specificCoin}
          chartData={chartData}
          daysForChart={daysForChart}
          setDaysForChart={setDaysForChart}
          watchlistData={watchlistData}
          setWatchlistData={setWatchlistData}
          handleAddtoWatchlist={handleAddtoWatchlist}
          findId={findId}
          chartError={chartError}
          detailError={detailError}
        />
      )}
    </PageTransition>
  );
}

export default function AnimatedRoutes({
  loading,
  coins,
  trendingCoins,
  detailLoading,
  specificCoin,
  chartData,
  daysForChart,
  setDaysForChart,
  watchlistData,
  setWatchlistData,
  handleAddtoWatchlist,
  chartError,
  detailError,
  findId,
  searchCrypto,
  setSearchCrypto,
  backgroundColor,
  setBackgroundColor,
  filteredCryptos,
  searchLoading,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchResultClick = (crypto) => {
    const id = crypto.id || crypto.coin_id || crypto.item?.id;
    findId(id);
    setSearchCrypto("");
    navigate(`/coins/${id}`);
  };

  const handleResultKeyDown = (e, crypto) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSearchResultClick(crypto);
    }
  };

  let searchPage;
  if (searchCrypto !== "") {
    searchPage =
      filteredCryptos.length > 0 ? (
        filteredCryptos.map((crypto) => (
          <div
            key={crypto.id || crypto.name}
            role="button"
            tabIndex={0}
            className="mx-auto max-w-[1100px] cursor-pointer border-b border-slate-200 px-6 py-3.5 font-semibold transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset dark:border-slate-800 dark:hover:bg-slate-800/60"
            onClick={() => handleSearchResultClick(crypto)}
            onKeyDown={(e) => handleResultKeyDown(e, crypto)}
          >
            <div className="flex items-center gap-3">
              <img
                className="h-6 w-6 rounded-full"
                src={crypto.thumb}
                alt="Crypto thumb"
              />
              <span>{crypto.name}</span>
              {crypto.symbol && (
                <span className="text-sm font-normal uppercase text-slate-500 dark:text-slate-400">
                  {crypto.symbol}
                </span>
              )}
              {crypto.market_cap_rank && (
                <span className="ml-auto text-sm font-normal text-slate-400 dark:text-slate-500">
                  #{crypto.market_cap_rank}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="px-6 py-10 text-center text-slate-400 dark:text-slate-500">
          {searchLoading ? "Searching…" : "No crypto found"}
        </div>
      );
  }

  return (
    <>
      <Header
        searchCrypto={searchCrypto}
        setSearchCrypto={setSearchCrypto}
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
      />
      {searchCrypto !== "" && <div className="pt-2">{searchPage}</div>}
      <div className={searchCrypto !== "" ? "hidden" : "block"}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  {loading ? (
                    <SkeletonPlaceholder />
                  ) : (
                    <MainPage
                      coins={coins}
                      trendingCoins={trendingCoins}
                      findId={findId}
                    />
                  )}
                </PageTransition>
              }
            />
            <Route
              path="/coins/:id"
              element={
                <DetailRoute
                  findId={findId}
                  detailLoading={detailLoading}
                  specificCoin={specificCoin}
                  chartData={chartData}
                  daysForChart={daysForChart}
                  setDaysForChart={setDaysForChart}
                  watchlistData={watchlistData}
                  setWatchlistData={setWatchlistData}
                  handleAddtoWatchlist={handleAddtoWatchlist}
                  chartError={chartError}
                  detailError={detailError}
                />
              }
            />
            <Route
              path="/watchlist"
              element={
                <PageTransition>
                  <Watchlist
                    watchlistData={watchlistData}
                    findId={findId}
                    setWatchlistData={setWatchlistData}
                  />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}
