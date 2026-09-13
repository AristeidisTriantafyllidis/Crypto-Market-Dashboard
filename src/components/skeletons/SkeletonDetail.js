import Skeleton from "react-loading-skeleton";

const STAT_ROWS = 5;

export default function DetailSkeletonPlaceholder() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 pb-16 pt-8 dark:[--base-color:#1e293b] dark:[--highlight-color:#334155] sm:px-6">
      <div className="mb-5">
        <Skeleton width={80} height={14} />
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Skeleton circle width={48} height={48} />
          <div>
            <Skeleton width={140} height={18} />
            <div className="mt-2 flex items-center gap-2">
              <Skeleton width={90} height={22} />
              <Skeleton width={70} height={22} borderRadius={999} />
            </div>
          </div>
        </div>
        <Skeleton width={90} height={30} borderRadius={999} />
      </div>

      <div className="mt-6">
        <Skeleton width={190} height={40} borderRadius={12} />
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <Skeleton height={220} />
        <div className="mt-4 flex gap-1">
          {["1d", "7d", "30d", "1Y"].map((label) => (
            <Skeleton key={label} width={48} height={30} borderRadius={999} />
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <Skeleton width={110} height={16} />
        </div>
        {Array.from({ length: STAT_ROWS }).map((_, index) => (
          <div
            key={index}
            className="flex items-baseline justify-between border-b border-slate-100 px-5 py-3.5 last:border-b-0 dark:border-slate-800/80"
          >
            <Skeleton width={110} height={12} />
            <Skeleton width={80} height={12} />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Skeleton width={160} height={16} />
        <div className="mt-3 space-y-2">
          <Skeleton />
          <Skeleton />
          <Skeleton width="80%" />
        </div>
      </div>
    </div>
  );
}
