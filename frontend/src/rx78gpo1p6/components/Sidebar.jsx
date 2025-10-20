// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import {
  LogOut,
  Home,
  Users,
  List,
  MessageCircle,
  FileText,
  Menu,
  X,
  Clock,
  LayoutDashboard,
} from "lucide-react";
import clsx from "clsx";
import { toast } from "react-toastify";

const STORAGE_KEY = "admin_sidebar_collapsed";

const Sidebar = () => {
  // Drawer mobile
  const [open, setOpen] = useState(false);
  // Collapsed state (persist)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "false");
    } catch {
      return false;
    }
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed));
  }, [collapsed]);

  const handleConfirmLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("🚪 Berhasil logout");
    navigate("/rx78gpo1p6/login");
  };

  // Struktur menu per grup
  const menuGroups = [
    {
      title: "Main",
      items: [
        { label: "Dashboard", icon: Home, path: "/rx78gpo1p6/dashboard" },
      ],
    },
    {
      title: "Manajemen",
      items: [
        { label: "Data User", icon: Users, path: "/rx78gpo1p6/users" },
        { label: "Manajemen CV User", icon: FileText, path: "/rx78gpo1p6/cv" },
      ],
    },
    {
      title: "Lainnya",
      items: [
        { label: "Log Aktivitas", icon: List, path: "/rx78gpo1p6/logs" },
        {
          label: "Pesan",
          icon: MessageCircle,
          path: "/rx78gpo1p6/announcement",
        },
        {
          label: "Payment History",
          icon: Clock,
          path: "/rx78gpo1p6/payment-history",
        },
      ],
    },
  ];

  // width sidebar saat desktop
  const desktopWidth = collapsed ? "md:w-20" : "md:w-64";

  return (
    <>
      {/* Toggle (Mobile) */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-[60] p-2 rounded-lg bg-white/90 backdrop-blur shadow md:hidden border border-gray-200"
        aria-label={open ? "Tutup menu" : "Buka menu"}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Overlay Mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 h-screen border-r border-gray-200 bg-white/95 backdrop-blur-xl shadow-sm",
          "transition-all duration-300 ease-out",
          // mobile slide
          open ? "translate-x-0 w-64" : "-translate-x-full w-64",
          // desktop
          "md:translate-x-0",
          desktopWidth
        )}
        aria-expanded={!collapsed}
      >
        {/* Header / Brand */}
        <div
          className={clsx(
            "flex items-center justify-between gap-2 px-4 py-4 border-b",
            collapsed && "md:px-3"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center rounded-xl bg-gray-900 text-white w-9 h-9">
              <LayoutDashboard size={18} />
            </div>
            {!collapsed && (
              <div className="hidden md:block">
                <div className="text-sm font-semibold tracking-wide text-gray-900">
                  CV BUILDER
                </div>
                <div className="text-[11px] text-gray-500">Admin Panel</div>
              </div>
            )}
          </div>

          {/* Collapse toggle (desktop) */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={clsx(
              "hidden md:inline-flex items-center justify-center rounded-lg border text-gray-700 hover:bg-gray-50",
              "transition-colors px-2 py-1"
            )}
            title={collapsed ? "Perlebar sidebar" : "Perkecil sidebar"}
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* NAV */}
        <nav className="h-[calc(100vh-160px)] overflow-y-auto px-3 py-3 space-y-4">
          {menuGroups.map((group) => (
            <div key={group.title}>
              {/* Group Title */}
              {!collapsed && (
                <div className="px-2 pb-2 text-[11px] uppercase tracking-wider text-gray-500">
                  {group.title}
                </div>
              )}

              {/* Items */}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path} className="group relative">
                      <NavLink
                        to={item.path}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          clsx(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                            "focus:outline-none focus:ring-2 focus:ring-gray-300",
                            isActive
                              ? "bg-gray-900 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          )
                        }
                        title={collapsed ? item.label : undefined}
                      >
                        <span
                          className={clsx(
                            "inline-flex items-center justify-center rounded-lg",
                            "w-9 h-9",
                            "bg-white shadow-sm border border-gray-200",
                            "group-[.active]:bg-white"
                          )}
                        >
                          <Icon size={18} />
                        </span>

                        {/* Label */}
                        {!collapsed && (
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                        )}
                      </NavLink>

                      {/* Tooltip saat collapsed */}
                      {collapsed && (
                        <span
                          className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 whitespace-nowrap
                                     rounded-md bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100
                                     transition-opacity shadow-lg"
                        >
                          {item.label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={clsx("mt-auto border-t px-3 py-3")}>
          <button
            onClick={() => setShowLogoutModal(true)}
            className={clsx(
              "w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
            )}
          >
            <span className="inline-flex items-center justify-center rounded-lg w-9 h-9 bg-white border border-gray-200">
              <LogOut size={18} />
            </span>
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>

          {!collapsed && (
            <div className="mt-3 px-1">
              <div className="text-[11px] text-gray-500">v2.0 • JECA</div>
              <div className="text-[11px] text-gray-400">
                © {new Date().getFullYear()} All rights reserved
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Modal Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2">Konfirmasi Logout</h2>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin logout dari admin panel?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
