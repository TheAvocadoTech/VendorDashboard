import { useState, useEffect, Component } from "react";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import AnalyticsChart from "../../components/ecommerce/Analytic";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";

// ── ErrorBoundary — prevents any child crash from blanking the page ────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-800/40 dark:bg-red-900/20">
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            ⚠️ Component failed to render
          </p>
          <p className="mt-1 font-mono text-xs text-red-500">{this.state.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function Home() {
  const [isAccepting, setIsAccepting] = useState(() => {
    try {
      const saved = localStorage.getItem("vendor_accepting_orders");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [showConfirm, setShowConfirm] = useState(false);

// Persist toggle state across page reloads
  useEffect(() => {
    try {
      localStorage.setItem("vendor_accepting_orders", JSON.stringify(isAccepting));
    } catch {
      // ignore if storage unavailable (e.g. private browsing)
    }
  }, [isAccepting]);

  // The state it will become after confirming
  const nextState = !isAccepting;

  const handleToggle = () => setShowConfirm(true);

  const confirmToggle = () => {
    setIsAccepting(nextState);
    setShowConfirm(false);
  };

  const cancelToggle = () => setShowConfirm(false);

  return (
    <>
      {/* Keyframes injected before any animated element */}
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <PageMeta
        title="React.js Ecommerce Dashboard |"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />

      {/* ── ORDER ACCEPTANCE CONTROL BAR ─────────────────────────────────── */}
      <div
        className={[
          "relative mb-6 flex flex-col gap-3 overflow-hidden rounded-2xl px-5 py-4",
          "sm:flex-row sm:items-center sm:justify-between shadow-lg transition-all duration-500",
          isAccepting
            ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
            : "bg-gradient-to-r from-red-500 to-red-600",
        ].join(" ")}
      >
        {/* Shimmer overlay */}
        <span
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-y-0 left-0 w-1/3
                     animate-[shimmer_3s_linear_infinite]
                     bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        {/* Left — pulse dot + text */}
        <div className="relative flex items-center gap-3">
          <span className="relative flex h-3.5 w-3.5 shrink-0">
            {isAccepting && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200 opacity-60" />
            )}
            <span
              className={[
                "relative inline-flex h-3.5 w-3.5 rounded-full",
                isAccepting ? "bg-emerald-100" : "bg-red-200",
              ].join(" ")}
            />
          </span>

          <div>
            <p className="text-sm font-bold leading-tight text-white">
              {isAccepting ? "Accepting Orders" : "Not Accepting Orders Currently"}
            </p>
            <p className="mt-0.5 text-xs text-white/75">
              {isAccepting
                ? "Customers can place new orders right now."
                : "Order is stopped — no new orders will be accepted."}
            </p>
          </div>

          {/* LIVE / STOPPED pill */}
          <span className="hidden sm:inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-white">
            {isAccepting ? "LIVE" : "STOPPED"}
          </span>
        </div>

        {/* Right — toggle switch */}
        <div className="relative flex items-center gap-3 self-end sm:self-auto">
          <span className="text-xs font-medium text-white/80">
            {isAccepting ? "Stop Orders" : "Start Orders"}
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={isAccepting}
            onClick={handleToggle}
            className={[
              "relative inline-flex h-7 w-[52px] cursor-pointer items-center rounded-full",
              "border-2 border-white/30 transition-colors duration-300",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white",
              isAccepting ? "bg-white/30" : "bg-black/20",
            ].join(" ")}
          >
            <span
              className={[
                "inline-block h-5 w-5 transform rounded-full bg-white shadow-md",
                "transition-transform duration-300 ease-in-out",
                isAccepting ? "translate-x-6" : "translate-x-1",
              ].join(" ")}
            />
          </button>
        </div>
      </div>

      {/* ── STOPPED BANNER (only shown when orders are paused) ───────────── */}
      {!isAccepting && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800/50 dark:bg-red-900/20">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">
              Vendor is not accepting orders currently
            </p>
            <p className="mt-0.5 text-xs text-red-500">
              Orders are stopped. Turn on the toggle above to resume accepting orders.
            </p>
          </div>
        </div>
      )}

      {/* ── CONFIRMATION DIALOG ──────────────────────────────────────────── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm animate-[fadeUp_0.2s_ease] rounded-2xl bg-white p-7 shadow-2xl dark:bg-gray-900">

            {/* Top colour bar */}
            <div
              className={[
                "-mx-7 -mt-7 mb-5 h-1 rounded-t-2xl",
                nextState
                  ? "bg-gradient-to-r from-emerald-400 to-emerald-600"
                  : "bg-gradient-to-r from-red-400 to-red-600",
              ].join(" ")}
            />

            {/* Icon circle */}
            <div
              className={[
                "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full",
                nextState
                  ? "bg-emerald-100 dark:bg-emerald-900/30"
                  : "bg-red-100 dark:bg-red-900/30",
              ].join(" ")}
            >
              {nextState ? (
                <svg className="h-7 w-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ) : (
                <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              )}
            </div>

            <h3 className="mb-2 text-center text-lg font-bold text-gray-900 dark:text-white">
              {nextState ? "Start Accepting Orders?" : "Stop Accepting Orders?"}
            </h3>
            <p className="mb-6 text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              {nextState
                ? "Customers will immediately be able to place new orders again."
                : "Customers will not be able to place new orders. Existing orders are unaffected."}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelToggle}
                className="flex-1 rounded-xl border border-gray-200 bg-transparent py-2.5 text-sm
                           font-semibold text-gray-700 transition-colors hover:bg-gray-50
                           dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmToggle}
                className={[
                  "flex-1 rounded-xl py-2.5 text-sm font-semibold text-white",
                  "transition-opacity hover:opacity-90 active:opacity-80",
                  nextState
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                    : "bg-gradient-to-r from-red-500 to-red-600",
                ].join(" ")}
              >
                {nextState ? "Yes, Start Orders" : "Yes, Stop Orders"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DASHBOARD GRID ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">

        <div className="col-span-12 space-y-6 xl:col-span-7">
          <ErrorBoundary><EcommerceMetrics /></ErrorBoundary>
          <ErrorBoundary><MonthlySalesChart /></ErrorBoundary>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <ErrorBoundary><MonthlyTarget /></ErrorBoundary>
        </div>

        <div className="col-span-12">
          <ErrorBoundary><AnalyticsChart /></ErrorBoundary>
        </div>

        <div className="col-span-12 xl:col-span-5">
          <ErrorBoundary><DemographicCard /></ErrorBoundary>
        </div>

        <div className="col-span-12 xl:col-span-7">
          <ErrorBoundary><RecentOrders /></ErrorBoundary>
        </div>

      </div>
    </>
  );
}