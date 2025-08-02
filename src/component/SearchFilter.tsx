"use client";

import React, { useState, useEffect } from "react";

type FilterState = {
  startDate: string;
  endDate: string;
  category: string;
  minAmount: string;
  maxAmount: string;
  keyword: string;
};

type Props = {
  onFilter: (filters: FilterState) => void;
  categories: string[];
};

export default function SearchFilter({ onFilter, categories }: Props) {
  const [filters, setFilters] = useState<FilterState>({
    startDate: "",
    endDate: "",
    category: "",
    minAmount: "",
    maxAmount: "",
    keyword: "",
  });

  useEffect(() => {
  onFilter(filters);
}, [filters, onFilter]);


  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <input
        type="date"
        value={filters.startDate}
        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
        className="p-2 border rounded"
        placeholder="Start Date"
      />
      <input
        type="date"
        value={filters.endDate}
        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        className="p-2 border rounded"
        placeholder="End Date"
      />
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        className="p-2 border rounded"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <input
        type="number"
        value={filters.minAmount}
        onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
        className="p-2 border rounded"
        placeholder="Min Amount"
      />
      <input
        type="number"
        value={filters.maxAmount}
        onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
        className="p-2 border rounded"
        placeholder="Max Amount"
      />
      <input
        type="text"
        value={filters.keyword}
        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
        className="p-2 border rounded"
        placeholder="Search Description"
      />
    </div>
  );
}
