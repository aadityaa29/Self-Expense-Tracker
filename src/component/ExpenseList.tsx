import React from "react";
import ExpenseItem from "./ExpenseItem";
import { format } from "date-fns";

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category?: string;
}

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function groupByDay(expenses: Expense[]) {
  const byDay: { [date: string]: Expense[] } = {};
  expenses.forEach(exp => {
    if (!byDay[exp.date]) byDay[exp.date] = [];
    byDay[exp.date].push(exp);
  });
  return byDay;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onEdit,
  onDelete,
}) => {
  const grouped = groupByDay(expenses);
  const dates = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      {dates.map((date, idx) => {
        const dayExpenses = grouped[date];
        const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
        const formattedDate = format(new Date(date), "dd MMM yyyy");

        return (
          <div
            key={date}
            className="p-4 rounded-xl bg-gradient-to-br from-white via-blue-50 to-blue-100 shadow transition-all animate-fade-in"
          >
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-blue-800">
                Day {idx + 1} — {formattedDate}
              </h3>
              <p className="text-sm text-gray-600">Total Spent: ₹{dayTotal}</p>
            </div>

            <div className="space-y-2">
              {dayExpenses.map(exp => (
                <ExpenseItem
                  key={exp.id}
                  title={exp.title}
                  amount={exp.amount}
                  date={exp.date}
                  category={exp.category}
                  onEdit={() => onEdit(exp.id)}
                  onDelete={() => onDelete(exp.id)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {dates.length === 0 && (
        <div className="text-gray-400 mt-12 text-center text-sm animate-fade-in-slow">
          No expenses yet for this month. Start tracking now! 💸
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
