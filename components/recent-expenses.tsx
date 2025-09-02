"use client"

import { Card } from "@/components/ui/card"
import type { Expense } from "@/lib/types"
import { formatCurrency, formatDate, getCategoryIcon, getExpenseTypeLabel } from "@/lib/utils"

interface RecentExpensesProps {
  expenses: Expense[]
}

export function RecentExpenses({ expenses }: RecentExpensesProps) {
  const recentExpenses = expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-foreground mb-4">Últimos 5 gastos</h3>
      <div className="space-y-3">
        {recentExpenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-lg">
                {getCategoryIcon(expense.category)}
              </div>
              <div>
                <p className="font-medium text-sm">{expense.description}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{expense.category}</p>
                  {getExpenseTypeLabel(expense) && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {getExpenseTypeLabel(expense)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm">{formatCurrency(expense.amount, expense.currency)}</p>
              <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
