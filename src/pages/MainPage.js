import React from "react";
import { useState, useEffect } from "react";
import { LineGraph } from "../components/Chart";
import { useNavigate } from "react-router-dom";

export default function MainPage(props) {
  const [top20Cryptos, setTop20Cryptos] = useState([]);
  const [trendingCryptos, setTrendingCoins] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.coins) {
      setTop20Cryptos(props.coins);
    }
    if (props.trendingCoins) {
      setTrendingCoins(props.trendingCoins);
    }
  }, [props.coins, props.trendingCoins]);

  const handleClick = (crypto) => {
    const id = crypto.id || crypto.coin_id || crypto.item?.id;
    props.findId(id);
    navigate(`/coins/${id}`);
  };
  const formatPrice = (price) => {
    return (price = new Intl.NumberFormat("en-us", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 1,
    }).format(price));
  };

  const trending = trendingCryptos.map((crypto) => {
    const pricePercentageDaily = Number(
      crypto.item.data.price_change_percentage_24h.usd,
    );
    let percentageText = "";
    if (pricePercentageDaily > 0) {
      percentageText = "+" + pricePercentageDaily.toFixed(2);
    } else {
      percentageText = pricePercentageDaily.toFixed(2);
    }

    return (
      <div
        key={crypto.item.coin_id}
        onClick={() => handleClick(crypto.item)}
        className="flex w-24 flex-shrink-0 flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-accent-dark sm:w-28"
      >
        <p className="m-0 text-sm font-semibold">
          {crypto.item.symbol?.toUpperCase()}
        </p>
        <p
          className={
            pricePercentageDaily > 0
              ? "m-0 text-xs font-semibold text-positive dark:text-positive-dark"
              : "m-0 text-xs font-semibold text-negative dark:text-negative-dark"
          }
        >
          {percentageText}%
        </p>
      </div>
    );
  });

  let topCryptos = top20Cryptos.map((crypto, index) => {
    const pricePercentageDaily = Number(crypto?.price_change_percentage_24h);
    let percentageText = "";
    if (pricePercentageDaily > 0) {
      percentageText = "+" + pricePercentageDaily.toFixed(2);
    } else {
      percentageText = pricePercentageDaily.toFixed(2);
    }
    const cryptoPrices = crypto?.sparkline_in_7d.price;
    const formatCryptoPrice = formatPrice(crypto?.current_price);
    return (
      <tr
        key={crypto.id}
        onClick={() => handleClick(crypto)}
        className="cursor-pointer border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50 dark:border-slate-800/80 dark:hover:bg-slate-800/50"
      >
        <td className="w-8 px-4 py-3.5 text-sm text-slate-400 dark:text-slate-500 sm:px-5">
          {index + 1}
        </td>
        <td className="px-4 py-3.5 sm:px-5">
          <div className="flex items-center gap-2">
            <img
              className="h-4 w-4 rounded-full"
              alt="crypto logo "
              src={crypto.image}
            />
            <p className="m-0 font-semibold">{crypto.name}</p>
          </div>
        </td>
        <td className="px-4 py-3.5 text-sm sm:px-5">{formatCryptoPrice} </td>
        <td
          className={
            pricePercentageDaily > 0
              ? "px-4 py-3.5 text-sm font-semibold text-positive dark:text-positive-dark sm:px-5"
              : "px-4 py-3.5 text-sm font-semibold text-negative dark:text-negative-dark sm:px-5"
          }
        >
          {percentageText} %
        </td>
        <td className="px-4 py-3.5 sm:px-5">
          <LineGraph priceArray={cryptoPrices} width={160} height={56} />
        </td>
      </tr>
    );
  });

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-8 sm:px-6">
      <p className="mb-4 text-base font-semibold">Trending 🔥</p>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto py-1.5 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent dark:[&::-webkit-scrollbar-thumb]:bg-slate-600">
          {trending}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-950" />
      </div>

      <p className="mb-4 mt-10 text-base font-semibold">
        Top Coins by Market Cap
      </p>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              <th className="border-b border-slate-200 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:px-5">
                #
              </th>
              <th className="border-b border-slate-200 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:px-5">
                Coin
              </th>
              <th className="border-b border-slate-200 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:px-5">
                Price
              </th>
              <th className="border-b border-slate-200 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:px-5">
                24h %
              </th>
              <th className="border-b border-slate-200 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:px-5">
                7d Chart
              </th>
            </tr>
          </thead>
          <tbody>{topCryptos}</tbody>
        </table>
      </div>
      {props.loadMoreError && (
        <p className="mt-4 text-center text-sm text-negative dark:text-negative-dark">
          {props.loadMoreError}
        </p>
      )}
      {props.hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={props.onLoadMore}
            disabled={props.loadingMore}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 dark:bg-accent-dark dark:hover:bg-accent-darkhover"
          >
            {props.loadingMore
              ? "Loading…"
              : props.loadMoreError
                ? "Try again"
                : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
