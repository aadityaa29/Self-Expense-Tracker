import React, { useState, useEffect } from 'react';

interface ExpenseFormProps {
  initialData?: {
    title: string;
    amount: number;
    date: string; // YYYY-MM-DD
  };
  onSubmit: (data: { title: string; amount: number; date?: string }) => void;
  onCancel?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [date, setDate] = useState(initialData?.date || '');

  useEffect(() => {
    if (!initialData) {
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;
    onSubmit({ title, amount, date });
    if (!initialData) {
      setTitle('');
      setAmount(0);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-r from-blue-100 to-cyan-100 shadow-lg rounded-2xl p-6 mb-6 w-full max-w-md mx-auto text-gray-800"
    >
      <h2 className="text-xl font-semibold mb-4 text-blue-900">
        {initialData ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter expense title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="number"
          placeholder="Enter amount (₹)"
          value={amount}
          min={1}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {initialData && (
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        )}

        <div className="flex justify-between gap-3 pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            {initialData ? 'Update' : 'Add Expense'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default ExpenseForm;
