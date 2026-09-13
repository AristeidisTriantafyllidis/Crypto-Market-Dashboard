import React from "react";
import { useNavigate } from "react-router-dom";

export default function Watchlist(props) {
  const navigate = useNavigate();

  const handleClick = (crypto) => {
    const id = crypto.id || crypto.coin_id || crypto.item?.id;
    props.findId(id);
    navigate(`/coins/${id}`);
  };

  const deleteCryptoFromWatchlist = (e, cryptoId) => {
    e.stopPropagation();
    const updateWatchlist = props?.watchlistData?.filter(
      (crypto) => crypto.id !== cryptoId,
    );
    props.setWatchlistData(updateWatchlist);
  };

  let watchlistPage = props?.watchlistData.map((crypto) => {
    return (
      <div
        key={crypto.id}
        onClick={() => handleClick(crypto)}
        className="relative flex cursor-pointer flex-col items-start gap-2.5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-accent hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-accent-dark"
      >
        <button
          onClick={(e) => deleteCryptoFromWatchlist(e, crypto.id)}
          aria-label={`Delete ${crypto?.name} from watchlist`}
          className="absolute right-2.5 top-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-negative/10 hover:text-negative dark:text-slate-500 dark:hover:bg-negative-dark/10 dark:hover:text-negative-dark"
        >
          ✕
        </button>
        <img className="h-8 w-8 rounded-full" src={crypto.image} alt="" />
        <p className="m-0 font-semibold">{crypto?.name}</p>
        <p className="m-0 text-sm text-slate-500 dark:text-slate-400">
          Current price {crypto.price} $
        </p>
        <p
          className={
            crypto.percentage24h > 0
              ? "m-0 text-sm font-semibold text-positive dark:text-positive-dark"
              : "m-0 text-sm font-semibold text-negative dark:text-negative-dark"
          }
        >
          Daily percentage: {crypto.percentage24h} %
        </p>
      </div>
    );
  });

  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-8 sm:px-6">
      <button
        onClick={() => navigate("/")}
        className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-accent-dark dark:hover:text-accent-dark"
      >
        <span aria-hidden="true">←</span> Go to home page
      </button>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {watchlistPage}
      </div>
    </div>
  );
}
