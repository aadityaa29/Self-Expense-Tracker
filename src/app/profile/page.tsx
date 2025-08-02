"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import MonthSelector from "@/component/MonthSelector";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { motion } from "framer-motion";

function getMonthRange(start: string, end: string) {
  const [startY, startM] = start.split("-").map(Number);
  const [endY, endM] = end.split("-").map(Number);
  const range = [];
  for (let y = startY; y <= endY; y++) {
    const mStart = y === startY ? startM : 1;
    const mEnd = y === endY ? endM : 12;
    for (let m = mStart; m <= mEnd; m++) {
      range.push(`${y}-${String(m).padStart(2, "0")}`);
    }
  }
  return range;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [startMonth, setStartMonth] = useState("2025-01");
  const [endMonth, setEndMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [monthlyTotals, setMonthlyTotals] = useState<{ month: string; total: number }[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchMonthlyData = async () => {
      const months = getMonthRange(startMonth, endMonth);
      const results: { month: string; total: number }[] = [];

      for (const month of months) {
        const q = query(
          collection(db, "expenses"),
          where("uid", "==", user.uid),
          where("month", "==", month)
        );
        const snap = await getDocs(q);
        const total = snap.docs.reduce((sum, doc) => sum + (doc.data().amount || 0), 0);
        results.push({ month, total });
      }
      setMonthlyTotals(results);
    };

    fetchMonthlyData();
  }, [user, startMonth, endMonth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white text-black">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-8"
        >
          Profile Summary
        </motion.h2>

        <motion.div
          className="flex flex-wrap gap-6 justify-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-full sm:w-64">
            <label className="text-sm font-medium text-gray-600 block mb-1">From:</label>
            <MonthSelector selectedMonth={startMonth} onChange={setStartMonth} />
          </div>
          <div className="w-full sm:w-64">
            <label className="text-sm font-medium text-gray-600 block mb-1">To:</label>
            <MonthSelector selectedMonth={endMonth} onChange={setEndMonth} />
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-xl border border-gray-200"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-center text-blue-600">
            Monthly Expenses Overview
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyTotals}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#f9fafb", borderRadius: "8px" }}
                labelStyle={{ fontWeight: "bold", color: "#1f2937" }}
              />
              <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
