import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LineGraphForDetailPage } from "../components/Chart";

export default function DetailPage(props) {
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.specificCoin) {
      setCoin(props.specificCoin);
    }
    if (props.chartData?.prices) {
      setChartData(props.chartData.prices.map((item) => item[1]));
    }
  }, [props.specificCoin, props.chartData]);

  const pricePercentageDaily =
    coin?.market_data.market_cap_change_percentage_24h;

  let percentageText = "";
  if (pricePercentageDaily > 0) {
    percentageText = "+" + pricePercentageDaily?.toFixed(2);
  } else {
    percentageText = pricePercentageDaily?.toFixed(2);
  }
  const formatCryptoPrice = (price) => {
    return (price = new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 2,
    }).format(price));
  };
  const formatNumber = (number) => {
    return (number = new Intl.NumberFormat("en-us", {
      notation: "compact",
      compactDisplay: "short",
    }).format(number));
  };
  const formatPrice = (number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 7,
    }).format(number);
  };

  const marketCap = formatCryptoPrice(coin?.market_data.market_cap?.usd);
  const dailyVolume = formatCryptoPrice(coin?.market_data.total_volume?.usd);
  const circulatingSupply = formatNumber(coin?.market_data?.circulating_supply);
  const allTimeHigh = formatCryptoPrice(coin?.market_data?.ath?.usd);
  const allTimeLow = formatCryptoPrice(coin?.market_data?.atl?.usd);
  const dateAth = coin?.market_data?.ath_date?.usd?.split("T");
  const formatDateAth = dateAth
    ? dateAth[0]?.split("-").reverse().join("-")
    : "";
  const dateAtl = coin?.market_data?.atl_date?.usd?.split("T");
  const formatDateAtl = dateAtl
    ? dateAtl[0]?.split("-").reverse().join("-")
    : "";
  const accuratePrice = formatPrice(coin?.market_data?.current_price?.usd);

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-8 sm:px-6">
      <div>
        <button
          onClick={() => navigate("/")}
          className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-accent dark:text-slate-400 dark:hover:text-accent-dark"
        >
          <span aria-hidden="true">←</span> Go back
        </button>
      </div>
      {props.detailError ? (
        <div className="rounded-2xl bg-negative/10 p-6 text-negative dark:bg-negative-dark/10 dark:text-negative-dark">
          <h2 className="mt-0">Unable to load coin</h2>
          <p className="mb-0">{props.detailError}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <img
                className="h-12 w-12 rounded-full"
                src={coin?.image.small}
                alt={coin?.name}
              />
              <div>
                <p className="m-0 text-lg font-bold">
                  {coin?.name}{" "}
                  <span className="text-sm font-medium uppercase text-slate-400 dark:text-slate-500">
                    {coin?.symbol}
                  </span>
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-xl font-bold tabular-nums">
                    {accuratePrice} $
                  </span>
                  <span
                    className={
                      pricePercentageDaily > 0
                        ? "inline-flex items-center whitespace-nowrap rounded-full bg-positive/10 px-2.5 py-1 text-sm font-semibold text-positive dark:bg-positive-dark/10 dark:text-positive-dark"
                        : "inline-flex items-center whitespace-nowrap rounded-full bg-negative/10 px-2.5 py-1 text-sm font-semibold text-negative dark:bg-negative-dark/10 dark:text-negative-dark"
                    }
                  >
                    {percentageText}% (24h)
                  </span>
                </div>
              </div>
            </div>
            <span className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              Rank #{coin?.market_cap_rank}
            </span>
          </div>

          <div className="mt-6">
            <button
              className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-accent-hover dark:bg-accent-dark dark:hover:bg-accent-darkhover"
              onClick={() => {
                if (coin) {
                  props.handleAddtoWatchlist({
                    id: coin.id,
                    name: coin.name,
                    image: coin.image?.small,
                    price: coin.market_data?.current_price?.usd,
                    percentage24h:
                      coin.market_data?.market_cap_change_percentage_24h,
                  });
                }
              }}
            >
              Add this coin to watchlist
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div>
              {props.chartError ? (
                <div className="rounded-xl bg-negative/10 p-5 text-negative dark:bg-negative-dark/10 dark:text-negative-dark">
                  <h3 className="mt-0">Unable to load chart</h3>
                  <p className="mb-0">{props.chartError}</p>
                </div>
              ) : (
                <LineGraphForDetailPage
                  priceArray={chartData}
                  days={props.daysForChart}
                />
              )}
            </div>
            <div className="mt-4 inline-flex gap-1 rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
              <button
                onClick={() => props.setDaysForChart(1)}
                className={
                  props.daysForChart === 1
                    ? "rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white dark:bg-accent-dark"
                    : "rounded-full px-4 py-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }
              >
                1d
              </button>
              <button
                onClick={() => props.setDaysForChart(7)}
                className={
                  props.daysForChart === 7
                    ? "rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white dark:bg-accent-dark"
                    : "rounded-full px-4 py-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }
              >
                7d
              </button>
              <button
                onClick={() => props.setDaysForChart(30)}
                className={
                  props.daysForChart === 30
                    ? "rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white dark:bg-accent-dark"
                    : "rounded-full px-4 py-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }
              >
                30d
              </button>
              <button
                onClick={() => props.setDaysForChart(365)}
                className={
                  props.daysForChart === 365
                    ? "rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-white dark:bg-accent-dark"
                    : "rounded-full px-4 py-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }
              >
                1Y
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="m-0 border-b border-slate-200 px-5 py-4 text-base font-semibold dark:border-slate-800">
              Market Stats
            </h2>
            <p className="flex items-baseline justify-between border-b border-slate-100 px-5 py-3.5 text-sm dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400">
                Market Cap
              </span>
              <span className="font-semibold tabular-nums">{marketCap}</span>
            </p>
            <p className="flex items-baseline justify-between border-b border-slate-100 px-5 py-3.5 text-sm dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400">
                24h Volume
              </span>
              <span className="font-semibold tabular-nums">{dailyVolume}</span>
            </p>
            <p className="flex items-baseline justify-between border-b border-slate-100 px-5 py-3.5 text-sm dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400">
                Circulating Supply
              </span>
              <span className="font-semibold tabular-nums">
                {circulatingSupply} {coin?.symbol}
              </span>
            </p>
            <p className="flex items-baseline justify-between border-b border-slate-100 px-5 py-3.5 text-sm dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400">
                All time High
              </span>
              <span className="font-semibold tabular-nums">
                {allTimeHigh} AT {formatDateAth}
              </span>
            </p>
            <p className="flex items-baseline justify-between px-5 py-3.5 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                All time Low
              </span>
              <span className="font-semibold tabular-nums">
                {allTimeLow} AT : {formatDateAtl}
              </span>
            </p>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-base font-semibold">
              {" "}
              About {coin?.name}
            </h2>
            <p className="leading-relaxed text-slate-500 dark:text-slate-400">
              {coin?.description?.en
                ? coin.description.en
                : "No information about this coin"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
