import React from "react";
import { format } from "date-fns";
import { Pencil, Trash } from "lucide-react";

interface ExpenseItemProps {
  title: string;
  amount: number;
  date: string;
  category?: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({
  title,
  amount,
  date,
  category,
  onEdit,
  onDelete,
}) => {
  const formattedDate = format(new Date(date), "dd MMM yyyy");

  return (
    <div className="flex justify-between items-center bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ease-in-out mb-3">
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-semibold text-gray-800">{title}</span>
          {category && (
            <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-medium">
              {category}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-500">{formattedDate}</div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-lg font-bold text-emerald-600">₹{amount}</span>
        <button
          onClick={onEdit}
          className="p-2 rounded-full hover:bg-blue-200 transition"
          aria-label="Edit"
        >
          <Pencil size={18} className="text-blue-600" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-full hover:bg-red-200 transition"
          aria-label="Delete"
        >
          <Trash size={18} className="text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default ExpenseItem;
