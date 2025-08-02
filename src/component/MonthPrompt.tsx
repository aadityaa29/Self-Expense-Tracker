import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface MonthPromptProps {
  isOpen: boolean;
  onSubmit: (budget: number) => void;
  onClose: () => void;
}

const MonthPrompt: React.FC<MonthPromptProps> = ({ isOpen, onSubmit, onClose }) => {
  const [budget, setBudget] = useState<number | "">("");
  const [isVisible, setIsVisible] = useState(false);

  // Handle mount transition
  useEffect(() => {
    if (isOpen) {
      // Allow slight delay to trigger CSS transition
      const timeout = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timeout);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // If modal is not open, don't render
  if (!isOpen) return null;

  function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  if (budget !== "" && budget > 0) {
    onSubmit(Number(budget));
    onClose(); // if you have this
  }
}

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-auto transition-opacity duration-300">
      <div
        className={`relative w-full max-w-md bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-xl shadow-2xl p-6 transform transition-all duration-300 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-semibold text-blue-900 mb-4 text-center">
          Set Your Monthly Budget
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
  type="number"
  placeholder="Enter amount (₹)"
  min={1}
  value={budget}
  onChange={(e) =>
    setBudget(e.target.value === "" ? "" : Number(e.target.value))
  }
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black bg-white"
  required
/>


          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition"
          >
            Set Budget
          </button>
        </form>
      </div>
    </div>
  );
};

export default MonthPrompt;
