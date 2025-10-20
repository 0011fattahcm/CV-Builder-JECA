// src/components/Sidebar.jsx
import React, { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useLocation,
  NavLink,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  FileEdit,
  Lock,
  LogOut,
  FilePlus2,
  Image,
} from "lucide-react";

const Sidebar = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false); // drawer
  const [showConfirm, setShowConfirm] = useState(false);

  const navItems = [
    { to: `/users/${userId}/beranda`, icon: Home, label: "Beranda" },
    { to: `/users/${userId}/choose-cv`, icon: FileEdit, label: "Edit CV" },
    {
      to: `/users/${userId}/merger-pdf`,
      icon: FilePlus2,
      label: "Gabungkan PDF",
    },
    {
      to: `/users/${userId}/jpg-convert-pdf`,
      icon: Image,
      label: "Konversi JPG ke PDF",
    },
    {
      to: `/users/${userId}/ubah-password`,
      icon: Lock,
      label: "Ubah Password",
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/users/login");
  };

  const toggleSidebar = () => setIsOpen((v) => !v);

  // auto close drawer ketika route berubah
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // helper active route
  const isActive = (to) => location.pathname.startsWith(to);

  // Animations
  const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const drawerVariants = { hidden: { x: -320 }, visible: { x: 0 } };

  return (
    <>
      {/* ===== Mobile FAB (md:hidden) ===== */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-[60] md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl
                   bg-gray-900 text-white shadow-lg ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label={isOpen ? "Tutup menu" : "Buka menu"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* ===== Collapsed Sidebar (desktop) ===== */}
      <div
        className="hidden md:flex fixed top-0 left-0 h-full w-16 bg-gray-950/95 text-white flex-col items-center py-4 z-50
                   border-r border-white/10 backdrop-blur"
        aria-hidden={isOpen}
      >
        {/* Toggle button */}
        <button
          onClick={toggleSidebar}
          className="mb-6 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10
                     ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Disabled icons (konsep asli tetap) */}
        <div className="flex flex-col gap-5">
          {navItems.map(({ icon: Icon, to }) => (
            <div
              key={to}
              className={`relative flex items-center justify-center w-10 h-10 rounded-lg
                          ${
                            isActive(to)
                              ? "bg-white/10 ring-1 ring-white/15"
                              : "opacity-40"
                          }
                          cursor-not-allowed select-none`}
              title=""
            >
              <Icon size={20} />
              {/* Active marker */}
              {isActive(to) && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r bg-blue-500" />
              )}
            </div>
          ))}
          <div className="flex items-center justify-center w-10 h-10 rounded-lg opacity-40 cursor-not-allowed">
            <LogOut size={20} />
          </div>
        </div>
      </div>

      {/* ===== Drawer (mobile & desktop) ===== */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-40"
              onClick={() => setIsOpen(false)}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              transition={{ duration: 0.18 }}
            />
            {/* Panel */}
            <motion.aside
              className="fixed top-0 left-0 h-full w-72 z-50 flex flex-col
                         bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white
                         shadow-2xl ring-1 ring-white/10"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={drawerVariants}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              aria-label="Navigasi pengguna"
            >
              {/* Header brand */}
              <div className="px-5 pt-5 pb-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 ring-1 ring-white/15">
                    <Home size={18} />
                  </div>
                  <div>
                    <div className="text-sm tracking-wide text-white/80">
                      CV Builder
                    </div>
                    <div className="text-base font-semibold">JECA</div>
                  </div>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10
                             ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  aria-label="Tutup menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Nav list */}
              <nav className="flex-1 overflow-y-auto px-3 py-4">
                <ul className="space-y-1">
                  {navItems.map(({ to, icon: Icon, label }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        className={({ isActive: act }) =>
                          `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition
                           focus:outline-none focus:ring-2 focus:ring-blue-400
                           ${
                             act
                               ? "bg-white text-gray-900 shadow-sm"
                               : "hover:bg-white/10"
                           }`
                        }
                      >
                        <span
                          className="inline-flex items-center justify-center w-10 h-10 rounded-lg
                                         bg-white/10 ring-1 ring-white/10 group-[.active]:bg-gray-100"
                        >
                          <Icon size={18} />
                        </span>
                        <span className="text-sm font-medium">{label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Footer actions */}
              <div className="px-4 pb-6 pt-3 border-t border-white/10">
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full inline-flex items-center justify-center gap-3 px-3 py-3 rounded-xl
                             bg-red-500/90 hover:bg-red-500 text-white font-medium shadow"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ===== Modal Logout ===== */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-title"
            >
              <h2
                id="logout-title"
                className="text-lg font-semibold text-gray-900 mb-2"
              >
                Keluar dari akun?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Apakah kamu yakin ingin logout sekarang?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
