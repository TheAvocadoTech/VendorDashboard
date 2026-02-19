import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { Dropdown } from "../ui/dropdown/Dropdown";
import { useAuth } from "../../context/AuthContext";

export default function UserDropdown() {
  const { vendor, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() { setIsOpen(!isOpen); }
  function closeDropdown()  { setIsOpen(false);  }

  // ── Logout: clear auth state + redirect to signin ──────────────────────────
  function handleSignOut() {
    logout();
    navigate("/signin");
  }

  return (
    <div className="relative">
      {/* ── Trigger button ─────────────────────────────────────────────── */}
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="block mr-1 font-medium text-theme-sm">
          {/* Show real storeName from auth context */}
          {vendor?.businessName ?? "Business name"}
        </span>
      </button>

      {/* ── Dropdown panel ─────────────────────────────────────────────── */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[300px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        {/* ── VENDOR SHOP CARD ───────────────────────────────────────────── */}
        <div className="mt-3 rounded-xl border border-gray-100 bg-white px-3 py-3 dark:border-gray-800 dark:bg-white/[0.03]">
          {/* Shop name + status badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Shop icon */}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-500/10">
                <svg className="h-4 w-4 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 21V12h6v9" />
                </svg>
              </span>
              <div className="min-w-0">
                {/* Real storeName and email from context */}
                <p className="truncate text-sm font-semibold text-gray-800 dark:text-white">
                  {vendor?.storeName ?? "—"}
                </p>
                <p className="truncate text-[11px] text-gray-400 dark:text-gray-500">
                  {vendor?.email ?? "—"}
                </p>
              </div>
            </div>

            {/* Status badge based on vendor.status */}
            <span
              className={[
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                vendor?.status === "ACCEPTED"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
              ].join(" ")}
            >
              {vendor?.status === "ACCEPTED" ? "Active" : "Pending"}
            </span>
          </div>
        </div>

        {/* ── MENU ITEMS ─────────────────────────────────────────────────── */}
        <ul className="flex flex-col gap-1 pt-3 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <Link
              to="/UpdateVendorDetails"
              onClick={closeDropdown}
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            >
              Account Settings
            </Link>
          </li>
        </ul>

        {/* ── SIGN OUT ───────────────────────────────────────────────────── */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 mt-3 w-full font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          <svg
            className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
            width="20" height="20" viewBox="0 0 24 24" fill="none"
          >
            <path
              fillRule="evenodd" clipRule="evenodd"
              d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007Z"
            />
          </svg>
          Sign Out
        </button>
      </Dropdown>
    </div>
  );
}