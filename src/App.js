import React from "react";
import {
  fetchData,
  fetchTrendingCryptos,
  fetchSpecificCrypto,
  fetchDataForChart,
  fetchSearchedCoins,
} from "./services/api";
import { useState, useEffect, useCallback, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import AnimatedRoutes from "./AnimatedRoutes";

const RETRY_DELAYS_SECONDS = [30, 60, 90];
const PAGE_SIZE = 20;

function isRateLimitError(error) {
  return error.status === 429;
}

function App() {
  const [coins, setCoins] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadMoreError, setLoadMoreError] = useState(null);
  const loadMoreControllerRef = useRef(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [, setError] = useState();
  const [trendingCoins, setTrendingCoins] = useState(null);
  const [specificCoin, setSpecificCoin] = useState(null);
  const [id, setId] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [daysForChart, setDaysForChart] = useState(1);
  const [backgroundColor, setBackgroundColor] = useState(() => {
    return localStorage.getItem("backgroundColor") || "white";
  });
  const [searchedCoins, setSearchedCoins] = useState(null);
  const [watchlistData, setWatchlistData] = useState(() => {
    const savedWatchlist = localStorage.getItem("cryptoWatchlist");
    if (!savedWatchlist) return [];

    try {
      return JSON.parse(savedWatchlist);
    } catch (error) {
      console.error("Failed to parse saved watchlist:", error);
      return [];
    }
  });
  const [detailError, setDetailError] = useState(null);
  const [chartError, setChartError] = useState(null);
  const [searchCrypto, setSearchCrypto] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function getTrending() {
      try {
        const trending = await fetchTrendingCryptos(controller.signal);
        if (cancelled) return;
        setTrendingCoins(trending);
      } catch (error) {
        if (error.name === "AbortError" || cancelled) return;
        setError(() => {
          throw error;
        });
      }
    }

    getTrending();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function getCoins() {
      try {
        const coins = await fetchData(1, controller.signal);
        if (cancelled) return;
        setCoins(coins);
        if (coins.length < PAGE_SIZE) {
          setHasMore(false);
        }
      } catch (error) {
        if (error.name === "AbortError" || cancelled) return;
        setError(() => {
          throw error;
        });
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    getCoins();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (id !== null) {
      const controller = new AbortController();
      let cancelled = false;
      let retryTimeoutId;
      let countdownIntervalId;

      async function getSpecificCrypto(attempt = 0) {
        setDetailLoading(true);
        if (attempt === 0) {
          setSpecificCoin(null);
        }
        setDetailError(null);

        try {
          const result = await fetchSpecificCrypto(id, controller.signal);
          if (cancelled) return;
          setSpecificCoin(result);
        } catch (error) {
          if (error.name === "AbortError" || cancelled) return;

          if (
            isRateLimitError(error) &&
            attempt < RETRY_DELAYS_SECONDS.length
          ) {
            let secondsLeft = RETRY_DELAYS_SECONDS[attempt];
            setDetailError(
              `You've reached CoinGecko's rate limit. Retrying in ${secondsLeft}s...`,
            );

            countdownIntervalId = setInterval(() => {
              secondsLeft -= 1;
              if (cancelled) return;
              if (secondsLeft > 0) {
                setDetailError(
                  `You've reached CoinGecko's rate limit. Retrying in ${secondsLeft}s...`,
                );
              } else {
                clearInterval(countdownIntervalId);
              }
            }, 1000);

            retryTimeoutId = setTimeout(() => {
              clearInterval(countdownIntervalId);
              if (!cancelled) getSpecificCrypto(attempt + 1);
            }, RETRY_DELAYS_SECONDS[attempt] * 1000);
          } else if (isRateLimitError(error)) {
            setDetailError(
              "You've reached CoinGecko's rate limit. Please wait a minute and try again.",
            );
          } else {
            setDetailError("Unable to load cryptocurrency data.");
          }
        } finally {
          if (!cancelled) {
            setDetailLoading(false);
          }
        }
      }

      getSpecificCrypto();

      return () => {
        cancelled = true;
        controller.abort();
        clearTimeout(retryTimeoutId);
        clearInterval(countdownIntervalId);
      };
    }
  }, [id]);

  useEffect(() => {
    if (id !== null) {
      const controller = new AbortController();
      let cancelled = false;
      let retryTimeoutId;
      let countdownIntervalId;

      setChartData(null);

      async function getChartData(attempt = 0) {
        setChartError(null);

        try {
          const result = await fetchDataForChart(
            id,
            daysForChart,
            controller.signal,
          );
          if (cancelled) return;
          setChartData(result);
        } catch (error) {
          if (error.name === "AbortError" || cancelled) return;

          if (
            isRateLimitError(error) &&
            attempt < RETRY_DELAYS_SECONDS.length
          ) {
            let secondsLeft = RETRY_DELAYS_SECONDS[attempt];
            setChartError(
              `You've reached CoinGecko's rate limit. Retrying in ${secondsLeft}s...`,
            );

            countdownIntervalId = setInterval(() => {
              secondsLeft -= 1;
              if (cancelled) return;
              if (secondsLeft > 0) {
                setChartError(
                  `You've reached CoinGecko's rate limit. Retrying in ${secondsLeft}s...`,
                );
              } else {
                clearInterval(countdownIntervalId);
              }
            }, 1000);

            retryTimeoutId = setTimeout(() => {
              clearInterval(countdownIntervalId);
              if (!cancelled) getChartData(attempt + 1);
            }, RETRY_DELAYS_SECONDS[attempt] * 1000);
          } else if (isRateLimitError(error)) {
            setChartError(
              "You've reached CoinGecko's rate limit. Please wait a minute and try again.",
            );
          } else {
            setChartError("Unable to load chart data.");
          }
        }
      }

      getChartData();

      return () => {
        cancelled = true;
        controller.abort();
        clearTimeout(retryTimeoutId);
        clearInterval(countdownIntervalId);
      };
    }
  }, [id, daysForChart]);

  useEffect(() => {
    if (!searchCrypto.trim()) {
      setSearchedCoins(null);
      setSearchLoading(false);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;
    let debounceTimeoutId;

    setSearchLoading(true);

    const fetchCoins = async () => {
      try {
        const result = await fetchSearchedCoins(
          searchCrypto,
          controller.signal,
        );
        if (!cancelled) {
          setSearchedCoins(result);
        }
      } catch (error) {
        if (error.name !== "AbortError" && !cancelled) {
          console.error("Search error:", error);
        }
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    };

    debounceTimeoutId = setTimeout(fetchCoins, 300);

    return () => {
      cancelled = true;
      clearTimeout(debounceTimeoutId);
      controller.abort();
    };
  }, [searchCrypto]);

  useEffect(() => {
    localStorage.setItem("backgroundColor", backgroundColor);
    document.documentElement.classList.toggle(
      "dark",
      backgroundColor === "black",
    );
  }, [backgroundColor]);

  useEffect(() => {
    localStorage.setItem("cryptoWatchlist", JSON.stringify(watchlistData));
  }, [watchlistData]);

  const findId = useCallback((id) => {
    setId(id);
  }, []);

  useEffect(() => {
    return () => {
      loadMoreControllerRef.current?.abort();
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    const nextPage = page + 1;
    const controller = new AbortController();
    loadMoreControllerRef.current = controller;

    setLoadingMore(true);
    setLoadMoreError(null);

    try {
      const nextCoins = await fetchData(nextPage, controller.signal);
      setCoins((prev) => [...(prev || []), ...nextCoins]);
      setPage(nextPage);
      if (nextCoins.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      if (error.name === "AbortError") return;
      setLoadMoreError(
        isRateLimitError(error)
          ? "You've reached CoinGecko's rate limit. Please wait a minute and try again."
          : "Unable to load more coins.",
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page]);

  const filteredCryptos = searchedCoins || [];

  const handleAddtoWatchlist = (crypto) => {
    for (const item of watchlistData) {
      if (item.id === crypto.id) {
        alert("This coin already exists in your Watchlist!");
        return;
      }
    }
    setWatchlistData((prev) => [...prev, crypto]);
    alert("You successfully added this coin to your watchlist!");
  };

  return (
    <div className="App min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <BrowserRouter>
        <AnimatedRoutes
          loading={loading}
          coins={coins}
          onLoadMore={loadMore}
          loadingMore={loadingMore}
          hasMore={hasMore}
          loadMoreError={loadMoreError}
          trendingCoins={trendingCoins?.coins}
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
          findId={findId}
          searchCrypto={searchCrypto}
          setSearchCrypto={setSearchCrypto}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          filteredCryptos={filteredCryptos}
          searchLoading={searchLoading}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;
