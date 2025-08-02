"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyles, setDropdownStyles] = useState<React.CSSProperties>({});

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node) &&
      toggleRef.current &&
      !toggleRef.current.contains(e.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsDropdownOpen(false);
      toggleRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!isDropdownOpen) return;

    const toggleEl = toggleRef.current;
    const dropdownEl = dropdownRef.current;
    if (!toggleEl || !dropdownEl) return;

    const toggleRect = toggleEl.getBoundingClientRect();
    const dropdownRect = dropdownEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    let left = toggleRect.right - dropdownRect.width;
    let top = toggleRect.bottom + 6;

    if (left < 8) left = 8;
    if (left + dropdownRect.width > viewportWidth - 8) {
      left = viewportWidth - dropdownRect.width - 8;
    }

    setDropdownStyles({
      position: "fixed",
      top: top,
      left: left,
      zIndex: 9999,
      willChange: "transform, opacity",
    });
  }, [isDropdownOpen]);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md border-b border-gray-200 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between h-16">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold tracking-wide text-indigo-600 select-none sm:text-3xl sm:font-extrabold"
        >
          <span className="sm:block hidden">Self Expense Tracker</span>
          {user && (
            <span className="block sm:hidden">
              Hello, <span className="font-bold text-lg text-indigo-700">{user.displayName?.split(" ")[0]}</span>
            </span>
          )}
        </motion.h1>

        {user && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative flex items-center gap-3"
          >
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-gray-700 font-semibold select-text transition-all">
                Hello, <span className="text-indigo-600">{user.displayName?.split(" ")[0]}</span>
              </span>
              <button
                ref={toggleRef}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                aria-controls="user-menu"
                className="flex items-center gap-1 focus:outline-none rounded-full"
                title="User menu"
              >
                <motion.img
                  src={user.photoURL || "/default-avatar.png"}
                  alt="User avatar"
                  className="w-10 h-10 rounded-full shadow-md border-2 border-indigo-500"
                  draggable={false}
                  whileHover={{ scale: 1.05 }}
                />
                <ChevronDown
                  className={`w-5 h-5 text-indigo-600 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  aria-hidden="true"
                />
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              className="sm:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-label="Menu"
              ref={toggleRef}
            >
              <svg
                className={`w-6 h-6 text-indigo-600 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-90" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  ref={dropdownRef}
                  id="user-menu"
                  role="menu"
                  aria-label="User menu"
                  tabIndex={-1}
                  style={dropdownStyles}
                  className="w-48 rounded-lg bg-white backdrop-blur-sm bg-opacity-90 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    role="menuitem"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/profile");
                    }}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-indigo-50 transition-colors text-gray-700 rounded-t-lg"
                  >
                    <User className="w-5 h-5 text-indigo-600" />
                    View Profile
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    role="menuitem"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/settings");
                    }}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-indigo-50 transition-colors text-gray-700"
                  >
                    <Settings className="w-5 h-5 text-indigo-600" />
                    Settings
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-red-600 font-semibold rounded-b-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;