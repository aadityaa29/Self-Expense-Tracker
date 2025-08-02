"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import Login from "@/component/Login";
import Link from "next/link";
import { motion } from "framer-motion";
import Head from "next/head";

export default function HomePage() {
  const { user } = useAuth();

  if (!user) return <Login />;

  const userName = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="relative flex flex-col min-h-screen bg-gradient-to-br from-[#4c2884] via-[#b7259f] to-[#38b6ff] text-gray-800 font-inter overflow-hidden">
        {/* Background circles */}
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 -z-10 pointer-events-none"
        >
          <div
            style={{ filter: "blur(80px)" }}
            className="absolute -top-24 -left-24 w-72 h-72 bg-purple-500 rounded-full opacity-70 animate-pulse"
          />
          <div
            style={{ filter: "blur(100px)" }}
            className="absolute bottom-10 right-10 w-96 h-96 bg-pink-400 rounded-full opacity-60 animate-pulse"
          />
        </motion.div>

        <Header />

        <main className="flex flex-1 justify-center items-center px-4 py-16 sm:px-6 sm:py-24">
          <motion.section
            role="region"
            aria-label="Welcome panel"
            tabIndex={-1}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative w-full max-w-md sm:max-w-lg bg-white/60 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl px-6 sm:px-10 py-14 pt-24 text-center"
          >
            {/* Floating Rupee Symbol */}
            <motion.div
              aria-hidden="true"
              initial={{ scale: 0, rotate: 45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 20 }}
              className="absolute -top-5 -left-2"
            >
              <div className="bg-gradient-to-br from-pink-600 to-purple-600 rounded-full p-4 sm:p-5 shadow-xl ring-4 ring-white/50 animate-pulse">
                <span className="text-white text-3xl sm:text-4xl font-black">
                  ₹
                </span>
              </div>
            </motion.div>

            <motion.h1
              tabIndex={0}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 drop-shadow-md tracking-tight"
            >
              Welcome back,
              <span className="block underline decoration-pink-400 decoration-4 underline-offset-4">
                {userName}
              </span>
            </motion.h1>

            <motion.blockquote
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="italic font-semibold text-pink-700 mb-4 text-sm sm:text-base"
            >
              “A journey of a thousand miles begins with a single step.”
            </motion.blockquote>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="h-1 bg-gradient-to-r from-pink-400 via-sky-400 to-violet-600 rounded-full mx-auto mb-6"
            />

            <motion.p
              tabIndex={0}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-sm sm:text-base text-gray-900 font-medium mb-10 max-w-xs sm:max-w-md mx-auto"
            >
              Track your spending, control your habits, and visualize your
              monthly cash flow — all in one place.
            </motion.p>

            <motion.div
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-full flex justify-center"
            >
              <Link
                href="/dashboard"
                scroll={false}
                role="button"
                tabIndex={0}
                aria-label="Open Dashboard"
                className="w-full max-w-xs flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 to-pink-600 hover:brightness-110 hover:scale-105 hover:from-pink-600 hover:to-purple-700 focus:ring-4 focus:ring-pink-400 text-white text-sm sm:text-lg font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-300 ease-in-out relative"
              >
                <span className="relative z-10">Open Dashboard</span>

                <motion.svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 sm:w-6 sm:h-6 relative z-10"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </motion.svg>

                <span className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-10 transition-opacity pointer-events-none" />
              </Link>
            </motion.div>
          </motion.section>
        </main>

        <Footer />
      </div>
    </>
  );
}
