"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Login from "@/component/Login";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import BudgetCard from "@/component/BudgetCard";
import ExpenseForm from "@/component/ExpenseForm";
import ExpenseList from "@/component/ExpenseList";
import MonthPrompt from "@/component/MonthPrompt";
import MonthSelector from "@/component/MonthSelector";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy
} from "firebase/firestore";
import { motion } from "framer-motion";

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  createdAt: string;
  uid: string;
  month: string;
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [budget, setBudget] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isMonthPromptOpen, setIsMonthPromptOpen] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => getCurrentMonth());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    let ignore = false;
    setLoading(true);
    const fetchBudget = async () => {
      try {
        const ref = doc(db, "budgets", `${user.uid}_${selectedMonth}`);
        const snap = await getDoc(ref);
        if (!ignore) {
          setBudget(snap.exists() ? snap.data().budget : null);
        }
      } catch (error) {
        if (!ignore) {
          setBudget(null);
        }
        console.error("Error fetching budget:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBudget();
    return () => { ignore = true; };
  }, [user, selectedMonth]);

  async function handleBudgetSubmit(newBudget: number) {
    if (!user) return;
    setBudget(newBudget);
    setIsMonthPromptOpen(false);
    try {
      const ref = doc(db, "budgets", `${user.uid}_${selectedMonth}`);
      await setDoc(ref, {
        budget: newBudget,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error saving budget:", error);
    }
  }

  useEffect(() => {
    if (!user) return;
    let ignore = false;
    setLoading(true);
    const fetchExpenses = async () => {
      try {
        const q = query(
          collection(db, "expenses"),
          where("uid", "==", user.uid),
          where("month", "==", selectedMonth),
          orderBy("date", "asc")
        );
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(docSnap => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            title: d.title,
            amount: d.amount,
            date: d.date,
            createdAt: d.createdAt ?? "",
            uid: d.uid,
            month: d.month,
          };
        });
        if (!ignore) setExpenses(fetched);
      } catch (error) {
        if (!ignore) setExpenses([]);
        console.error("Error loading expenses from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
    return () => { ignore = true; };
  }, [user, selectedMonth]);

  useEffect(() => {
    const today = new Date();
    const isFirstDay = today.getDate() === 1;
    const currentMonth = getCurrentMonth();
    if (budget === null && isFirstDay && selectedMonth === currentMonth) {
      setIsMonthPromptOpen(true);
    }
  }, [budget, selectedMonth]);

  async function handleAddExpense(exp: { title: string; amount: number; date?: string }) {
    if (!user) return;
    const now = new Date();
    const dateStr = exp.date || now.toISOString().split("T")[0];
    const newExpense = {
      title: exp.title,
      amount: Number(exp.amount),
      date: dateStr,
      createdAt: now.toISOString(),
      uid: user.uid,
      month: selectedMonth,
    };
    try {
      const ref = await addDoc(collection(db, "expenses"), newExpense);
      setExpenses(curr => [
        ...curr,
        { ...newExpense, id: ref.id }
      ]);
    } catch (error) {
      console.error("Failed to store expense:", error);
    }
  }

  async function handleUpdateExpense(exp: { title: string; amount: number; date?: string }) {
    const expense = expenses.find(e => e.id === editingExpenseId);
    if (!expense || !user) return;
    const updateData = {
      title: exp.title,
      amount: Number(exp.amount),
      date: exp.date || expense.date
    };
    try {
      const ref = doc(db, "expenses", expense.id);
      await updateDoc(ref, updateData);
      setExpenses(curr =>
        curr.map(item =>
          item.id === expense.id ? { ...item, ...updateData } : item
        )
      );
      setEditingExpenseId(null);
    } catch (error) {
      console.error("Failed to update expense:", error);
    }
  }

  async function handleDeleteExpense(id: string) {
    try {
      await deleteDoc(doc(db, "expenses", id));
      setExpenses(curr => curr.filter(e => e.id !== id));
    } catch (error) {
      console.error("Could not delete expense:", error);
    }
  }

  function handleEditExpense(id: string) {
    setEditingExpenseId(id);
  }

  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const editingExpense = editingExpenseId
    ? expenses.find(e => e.id === editingExpenseId)
    : undefined;

  if (!user) return <Login />;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 animate-gradient-x">
      <Header />
      <motion.main
        className="flex-1 max-w-3xl mx-auto w-full px-4 py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div className="bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-6 mb-6 border border-gray-200" whileHover={{ scale: 1.02 }}>
          <MonthSelector selectedMonth={selectedMonth} onChange={setSelectedMonth} />
        </motion.div>

        <motion.div className="bg-indigo-50 border border-indigo-200 shadow-xl rounded-3xl p-6 mb-6" whileHover={{ scale: 1.02 }}>
          <BudgetCard
  totalBudget={budget || 0}
  totalSpent={totalSpent}
  onEditBudget={() => setIsMonthPromptOpen(true)} 
/>

          <MonthPrompt
  isOpen={isMonthPromptOpen}
  onSubmit={handleBudgetSubmit}
  onClose={() => setIsMonthPromptOpen(false)}
/>
        </motion.div>

        <motion.div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-6 mb-6 border border-gray-200" whileHover={{ scale: 1.02 }}>
          <ExpenseForm
            initialData={editingExpense ? {
              title: editingExpense.title,
              amount: editingExpense.amount,
              date: editingExpense.date,
            } : undefined}
            onSubmit={editingExpenseId ? handleUpdateExpense : handleAddExpense}
            onCancel={editingExpenseId ? () => setEditingExpenseId(null) : undefined}
          />
        </motion.div>

        <motion.div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-3xl p-6 border border-gray-200" whileHover={{ scale: 1.01 }}>
          <ExpenseList
            expenses={expenses}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        </motion.div>

        {loading && (
          <div className="text-center text-gray-400 py-8 animate-pulse">Loading...</div>
        )}
      </motion.main>
      <Footer />
    </div>
  );
}