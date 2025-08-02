// BudgetCard.tsx

import React from "react";
import { PencilIcon } from "lucide-react"; // Optional: use your icon lib

interface BudgetCardProps {
  totalBudget: number;
  totalSpent: number;
  onEditBudget?: () => void; // NEW: callback to trigger editing
}

const BudgetCard: React.FC<BudgetCardProps> = ({ totalBudget, totalSpent, onEditBudget }) => {
  const percent = Math.min((totalSpent / totalBudget) * 100, 100);
  const remaining = totalBudget - totalSpent;

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-gradient-to-r from-cyan-100 to-blue-100 text-gray-800 transition hover:shadow-xl relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-900">Monthly Budget Overview</h2>
        {onEditBudget && (
          <button
            onClick={onEditBudget}
            className="text-sm text-blue-700 hover:underline flex items-center gap-1"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-sm sm:text-base">
        <div className="bg-white/70 px-4 py-2 rounded-xl shadow text-center">
          <p className="text-gray-500">Budget</p>
          <p className="font-bold text-blue-800">₹{totalBudget}</p>
        </div>
        <div className="bg-white/70 px-4 py-2 rounded-xl shadow text-center">
          <p className="text-gray-500">Spent</p>
          <p className="font-bold text-red-500">₹{totalSpent}</p>
        </div>
        <div className="bg-white/70 px-4 py-2 rounded-xl shadow text-center">
          <p className="text-gray-500">Remaining</p>
          <p className="font-bold text-green-600">₹{remaining}</p>
        </div>
      </div>

      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1 text-gray-600 font-medium">
          <span>0%</span>
          <span>{percent.toFixed(0)}%</span>
          <span>100%</span>
        </div>
        <div className="w-full bg-white/50 h-4 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-in-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
