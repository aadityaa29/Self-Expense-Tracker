import React from "react";

interface MonthSelectorProps {
  selectedMonth: string;
  onChange: (month: string) => void;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({ selectedMonth, onChange }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    return `${currentYear}-${month}`;
  });

  return (
    <div className="mb-6">
      <label
        htmlFor="month"
        className="block text-sm font-medium text-zinc-700 mb-2"
      >
        Select Month
      </label>
      <div className="relative">
        <select
          id="month"
          value={selectedMonth}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full appearance-none rounded-lg bg-white px-4 py-2 pr-10 border border-gray-300 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {new Date(m + "-01").toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </option>
          ))}
        </select>

        {/* Down Arrow Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MonthSelector;
