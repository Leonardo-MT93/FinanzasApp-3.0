"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExpenseFilters } from "@/components/expense-filters"
import { ExpenseItem } from "@/components/expense-item"
import { ExpenseDetailModal } from "@/components/expense-detail-modal" // Added import for expense detail modal
import { ResetMonthDialog } from "@/components/reset-month-dialog"
import { useExpenseStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import type { Expense } from "@/lib/types"

type FilterTab = "all" | "fixed" | "variable" | "subscriptions"

export default function ExpensesPage() {
  const { expenses } = useExpenseStore()
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [amountRange, setAmountRange] = useState({ min: "", max: "" })
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null) // Added state for selected expense
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false) // Added state for modal visibility

  const filteredExpenses = useMemo(() => {
    let filtered = expenses

    // Filter by tab
    switch (activeTab) {
      case "fixed":
        filtered = filtered.filter(
          (expense) => expense.expense_type === "installment" || expense.expense_type === "subscription",
        )
        break
      case "variable":
        filtered = filtered.filter((expense) => expense.expense_type === "single")
        break
      case "subscriptions":
        filtered = filtered.filter((expense) => expense.expense_type === "subscription")
        break
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((expense) => expense.description.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((expense) => expense.category === selectedCategory)
    }

    // Filter by date range
    if (dateRange.start) {
      filtered = filtered.filter((expense) => new Date(expense.date) >= new Date(dateRange.start))
    }
    if (dateRange.end) {
      filtered = filtered.filter((expense) => new Date(expense.date) <= new Date(dateRange.end))
    }

    // Filter by amount range
    if (amountRange.min) {
      filtered = filtered.filter((expense) => expense.amount >= Number.parseFloat(amountRange.min))
    }
    if (amountRange.max) {
      filtered = filtered.filter((expense) => expense.amount <= Number.parseFloat(amountRange.max))
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [expenses, activeTab, searchTerm, selectedCategory, dateRange, amountRange])

  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const now = new Date()
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()
  })

  const monthlyTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const dailyAverage = currentMonthExpenses.length > 0 ? monthlyTotal / new Date().getDate() : 0

  const groupExpensesByDate = (expenses: Expense[]) => {
    const groups: Record<string, Expense[]> = {}
    const now = new Date()

    expenses.forEach((expense) => {
      const expenseDate = new Date(expense.date)
      const diffTime = now.getTime() - expenseDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      let groupKey: string
      if (diffDays === 0) {
        groupKey = "Hoy"
      } else if (diffDays === 1) {
        groupKey = "Ayer"
      } else if (diffDays <= 7) {
        groupKey = "Esta semana"
      } else {
        groupKey = "Anteriores"
      }

      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(expense)
    })

    return groups
  }

  const groupedExpenses = groupExpensesByDate(filteredExpenses)

  const tabs = [
    { id: "all" as const, label: "Todos", count: expenses.length },
    {
      id: "fixed" as const,
      label: "Fijos",
      count: expenses.filter((e) => e.expense_type === "installment" || e.expense_type === "subscription").length,
    },
    { id: "variable" as const, label: "Variables", count: expenses.filter((e) => e.expense_type === "single").length },
    {
      id: "subscriptions" as const,
      label: "Suscripciones",
      count: expenses.filter((e) => e.expense_type === "subscription").length,
    },
  ]

  const handleOpenExpenseDetail = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsDetailModalOpen(true)
  }

  return (
    <div className="p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Gastos del mes</h1>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="whitespace-nowrap"
          >
            {tab.label} ({tab.count})
          </Button>
        ))}
      </div>

      {/* Summary Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Total del mes</p>
            <p className="text-lg font-bold text-primary">{formatCurrency(monthlyTotal)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Promedio diario</p>
            <p className="text-lg font-bold text-accent">{formatCurrency(dailyAverage)}</p>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <ExpenseFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        amountRange={amountRange}
        onAmountRangeChange={setAmountRange}
      />

      {/* Expenses List */}
      <div className="space-y-6">
        {Object.entries(groupedExpenses).map(([groupName, groupExpenses]) => (
          <div key={groupName} className="space-y-3">
            <h3 className="font-semibold text-foreground sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
              {groupName} ({groupExpenses.length})
            </h3>
            <div className="space-y-3">
              {groupExpenses.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  onOpenDetail={handleOpenExpenseDetail} // Added onOpenDetail prop
                />
              ))}
            </div>
          </div>
        ))}

        {filteredExpenses.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No se encontraron gastos con los filtros aplicados</p>
          </div>
        )}
      </div>

      <ResetMonthDialog />

      <ExpenseDetailModal expense={selectedExpense} open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen} />
    </div>
  )
}
