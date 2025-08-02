'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { Expense } from '@/types'

type Filters = {
  startDate?: Date
  endDate?: Date
  category?: string
  minAmount?: number
  maxAmount?: number
  keyword?: string
  uid: string
}

export default function useExpenseFilter(filters: Filters) {
  const [loading, setLoading] = useState(false)
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([])

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true)
      try {
        const q = query(collection(db, 'expenses'), where('uid', '==', filters.uid))

        const snapshot = await getDocs(q)
        const results: Expense[] = []

        snapshot.forEach((doc) => {
          const data = doc.data() as Expense
          const createdAt = data.createdAt?.toDate?.() || new Date()

          const matches =
            (!filters.startDate || createdAt >= filters.startDate) &&
            (!filters.endDate || createdAt <= filters.endDate) &&
            (!filters.category || data.category === filters.category) &&
            (!filters.minAmount || data.amount >= filters.minAmount) &&
            (!filters.maxAmount || data.amount <= filters.maxAmount) &&
            (!filters.keyword || data.description.toLowerCase().includes(filters.keyword.toLowerCase()))

          if (matches) {
            results.push({ id: doc.id, ...data })
          }
        })

        setFilteredExpenses(results)
      } catch (err) {
        console.error('Filter error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (filters.uid) {
      fetchFiltered()
    }
  }, [filters])

  return { filteredExpenses, loading }
}
