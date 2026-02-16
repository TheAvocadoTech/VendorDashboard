import { useState } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link } from "react-router";

// ── Vendor data — replace with your API/props/context as needed ────────────
const vendorData = {
  name: "Musharof Chowdhury",
  email: "randomuser@pimjo.com",
  avatar: "/images/user/owner.jpg",
  shopName: "Pimjo Store",
  shopCategory: "Electronics & Gadgets",
  shopStatus: "active", // "active" | "inactive"
  rating: 4.8,
  totalOrders: 1240,
  memberSince: "Jan 2022",
};

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      {/* ── Trigger button ─────────────────────────────────────────────── */}
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        {/* <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <img src={vendorData.avatar} alt="User" />
        </span> */}
        <span className="block mr-1 font-medium text-theme-sm">Store Name</span>
       
      </button>

      {/* ── Dropdown panel ─────────────────────────────────────────────── */}
      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[300px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >

        {/* ── VENDOR HEADER ──────────────────────────────────────────────── */}
       

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
                <p className="truncate text-sm font-semibold text-gray-800 dark:text-white">
                  {vendorData.shopName}
                </p>
                <p className="truncate text-[11px] text-gray-400 dark:text-gray-500">
                  {vendorData.shopCategory}
                </p>
              </div>
            </div>

            {/* Active / Inactive badge */}
            <span
              className={[
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                vendorData.shopStatus === "active"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
              ].join(" ")}
            >
              {vendorData.shopStatus === "active" ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Stats row */}
          <div className="mt-3 grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800">
            {/* Rating */}
            <div className="flex flex-col items-center px-2">
              <span className="flex items-center gap-0.5 text-sm font-bold text-gray-800 dark:text-white">
                <svg className="h-3.5 w-3.5 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {vendorData.rating}
              </span>
              <span className="mt-0.5 text-[10px] text-gray-400">Rating</span>
            </div>

            {/* Orders */}
            <div className="flex flex-col items-center px-2">
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                {vendorData.totalOrders.toLocaleString()}
              </span>
              <span className="mt-0.5 text-[10px] text-gray-400">Orders</span>
            </div>

            {/* Member since */}
            <div className="flex flex-col items-center px-2">
              <span className="text-sm font-bold text-gray-800 dark:text-white">
                {vendorData.memberSince}
              </span>
              <span className="mt-0.5 text-[10px] text-gray-400">Since</span>
            </div>
          </div>
        </div>

        {/* ── MENU ITEMS ─────────────────────────────────────────────────── */}
        <ul className="flex flex-col gap-1 pt-3 pb-3 border-b border-gray-200 dark:border-gray-800">
          {/* Edit profile */}
          

          {/* Vendor dashboard */}
         

          {/* Shop settings */}
          
        </ul>

        {/* ── SIGN OUT ───────────────────────────────────────────────────── */}
        <Link
          to="/signin"
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
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
        </Link>
      </Dropdown>
    </div>
  );
}