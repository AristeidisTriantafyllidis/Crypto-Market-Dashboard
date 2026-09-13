import Skeleton from "react-loading-skeleton";

const TRENDING_COUNT = 8;
const ROW_COUNT = 10;

export default function SkeletonPlaceholder() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-8 dark:[--base-color:#1e293b] dark:[--highlight-color:#334155] sm:px-6">
      <p className="mb-4 text-base font-semibold">
        <Skeleton width={90} />
      </p>
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto py-1.5">
          {Array.from({ length: TRENDING_COUNT }).map((_, index) => (
            <div
              key={index}
              className="flex w-24 flex-shrink-0 flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:w-28"
            >
              <Skeleton circle width={24} height={24} />
              <Skeleton width={36} height={12} />
              <Skeleton width={28} height={10} />
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-950" />
      </div>

      <p className="mb-4 mt-10 text-base font-semibold">
        <Skeleton width={190} />
      </p>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr>
              {["#", "Coin", "Price", "24h %", "7d Chart"].map((label) => (
                <th
                  key={label}
                  className="border-b border-slate-200 px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:px-5"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: ROW_COUNT }).map((_, index) => (
              <tr
                key={index}
                className="border-b border-slate-100 last:border-b-0 dark:border-slate-800/80"
              >
                <td className="w-8 px-4 py-3.5 sm:px-5">
                  <Skeleton width={14} />
                </td>
                <td className="px-4 py-3.5 sm:px-5">
                  <div className="flex items-center gap-2">
                    <Skeleton circle width={16} height={16} />
                    <Skeleton width={100} />
                  </div>
                </td>
                <td className="px-4 py-3.5 sm:px-5">
                  <Skeleton width={64} />
                </td>
                <td className="px-4 py-3.5 sm:px-5">
                  <Skeleton width={48} />
                </td>
                <td className="px-4 py-3.5 sm:px-5">
                  <Skeleton width={160} height={40} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
