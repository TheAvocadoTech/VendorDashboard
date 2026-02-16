import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

const navItems = [
  {
    name: "Dashboard",
    subItems: [{ name: "Analytics", path: "/", pro: false }],
  },
];

const othersItems = [
  {
    name: "Vendor Analytics",
    subItems: [
      { name: "Sales Performance", path: "/salesperformance", pro: false },
      { name: "Customer Feedback", path: "/customerfeedback", pro: false },
    ],
  },
  {
    name: "Account Settings",
    subItems: [
      { name: "Update store Details", path: "/updatevendordetails", pro: false },
      { name: "Manage Operation hours", path: "/manageoperationhours", pro: false },
      { name: "Update contact information", path: "/updatecontactinformation", pro: false },
    ],
  },
  {
    name: "Communication",
    subItems: [
      { name: "View Admin Notification", path: "/viewadminnotification", pro: false },
      { name: "Support Request", path: "/supportrequest", pro: false },
      { name: "Platform Announcement", path: "/platformannouncement", pro: false },
    ],
  },
  {
    name: "Order Management",
    subItems: [
      { name: "View New Orders", path: "/viewneworders", pro: false },
      { name: "View Order History", path: "/vieworderhistory", pro: false },
      { name: "Track Current Orders", path: "/trackcurrentorder", pro: false },
    ],
  },
];

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;

    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            submenuMatched = true;
          }
        });
      }
    });

    if (!submenuMatched) {
      othersItems.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    }

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  // Check if any sub-item in a group is active (to highlight parent)
  const isParentActive = (nav) => {
    return nav.subItems?.some((subItem) => isActive(subItem.path));
  };

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => {
        const isSubmenuOpen =
          openSubmenu?.type === menuType && openSubmenu?.index === index;
        const parentActive = isParentActive(nav);

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={[
                  "w-full flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                  // Parent: red when its child is active, black otherwise
                  parentActive
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200",
                  !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start",
                ].join(" ")}
              >
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="flex-1 text-left">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span
                    className={`ml-auto text-xs transition-transform duration-200 ${
                      isSubmenuOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  className={[
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                    isActive(nav.path)
                      ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      : "text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200",
                  ].join(" ")}
                >
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span>{nav.name}</span>
                  )}
                </Link>
              )
            )}

            {/* Sub-items */}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height: isSubmenuOpen
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
                }}
              >
                <ul className="mt-1 space-y-0.5 ml-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        to={subItem.path}
                        className={[
                          "flex items-center rounded-lg px-3 py-2 text-sm transition-colors duration-150",
                          isActive(subItem.path)
                            // ── ACTIVE: red background + red text (like screenshot)
                            ? "bg-red-50 text-red-600 font-semibold dark:bg-red-500/10 dark:text-red-400"
                            // ── DEFAULT: black/gray text
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-200",
                        ].join(" ")}
                      >
                        {/* Left dot — red when active, gray otherwise */}
                        <span
                          className={[
                            "mr-2.5 h-1.5 w-1.5 rounded-full shrink-0",
                            isActive(subItem.path)
                              ? "bg-red-500"
                              : "bg-gray-300 dark:bg-gray-600",
                          ].join(" ")}
                        />

                        {subItem.name}

                        {/* Badges */}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={[
        "fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0",
        "bg-white dark:bg-gray-900 dark:border-gray-800",
        "text-gray-900 h-screen transition-all duration-300 ease-in-out",
        "z-50 border-r border-gray-200",
        isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
          ? "w-[290px]"
          : "w-[90px]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
      ].join(" ")}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <img
              className="dark:hidden"
              src="https://www.minutos.in/minitos.png"
              alt="Logo"
              width={150}
              height={40}
              // style={{
              //   filter:
              //     "invert(23%) sepia(97%) saturate(7495%) hue-rotate(-1deg) brightness(104%) contrast(101%)",
              // }}
            />
          ) : (
            <img
              src="/images/logo/minitos-White.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      {/* Nav */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">

            {/* Menu section */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 dark:text-gray-500 font-semibold tracking-widest ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : "···"}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            {/* Others section */}
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 dark:text-gray-500 font-semibold tracking-widest ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Others" : "···"}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>

          </div>
        </nav>
        {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
      </div>
    </aside>
  );
};

export default AppSidebar;