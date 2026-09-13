import React from "react";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-negative/10 dark:bg-negative-dark/10">
          <svg
            className="h-6 w-6 text-negative dark:text-negative-dark"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 8.5v4.25M12 15.75h.008"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.75"
            />
          </svg>
        </div>

        <h1 className="mt-5 text-lg font-bold text-slate-900 dark:text-slate-100">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          An unexpected error occurred. Reloading the page usually fixes it.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-accent-hover dark:bg-accent-dark dark:hover:bg-accent-darkhover"
        >
          Reload page
        </button>
        <button
          type="button"
          onClick={() => (window.location.href = "/")}
          className="mt-2.5 w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          Go to home page
        </button>
      </div>
    </div>
  );
}
