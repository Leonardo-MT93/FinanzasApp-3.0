"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RotateCcw, AlertTriangle } from "lucide-react"
import { useExpenseStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import type { Expense } from "@/lib/types"

export function ResetMonthDialog() {
  const { expenses, resetMonth } = useExpenseStore()
  const [isOpen, setIsOpen] = useState(false)

  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    const now = new Date()
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()
  })

  const expensesToKeep: Expense[] = []
  const expensesToRemove: Expense[] = []

  currentMonthExpenses.forEach((expense) => {
    if (expense.expense_type === "subscription" && expense.subscription_data?.is_active) {
      expensesToKeep.push(expense)
    } else if (
      expense.expense_type === "installment" &&
      expense.installment_data &&
      expense.installment_data.current_installment < expense.installment_data.total_installments
    ) {
      expensesToKeep.push(expense)
    } else {
      expensesToRemove.push(expense)
    }
  })

  const totalToRemove = expensesToRemove.reduce((sum, expense) => sum + expense.amount, 0)
  const totalToKeep = expensesToKeep.reduce((sum, expense) => sum + expense.amount, 0)

  const handleReset = () => {
    resetMonth()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-24 right-4 rounded-full w-14 h-14 shadow-lg bg-background border-2"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Reiniciar Mes
          </DialogTitle>
          <DialogDescription>
            Esta acción eliminará gastos únicos pero mantendrá suscripciones activas y cuotas pendientes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Se mantendrán ({expensesToKeep.length})</h4>
            <ul className="text-sm text-green-800 space-y-1">
              {expensesToKeep.slice(0, 3).map((expense) => (
                <li key={expense.id} className="flex justify-between">
                  <span>{expense.description}</span>
                  <span>{formatCurrency(expense.amount, expense.currency)}</span>
                </li>
              ))}
              {expensesToKeep.length > 3 && <li className="text-xs">...y {expensesToKeep.length - 3} más</li>}
            </ul>
            <p className="text-sm font-medium text-green-900 mt-2">Total mensual: {formatCurrency(totalToKeep)}</p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-medium text-red-900 mb-2">Se eliminarán ({expensesToRemove.length})</h4>
            <ul className="text-sm text-red-800 space-y-1">
              {expensesToRemove.slice(0, 3).map((expense) => (
                <li key={expense.id} className="flex justify-between">
                  <span>{expense.description}</span>
                  <span>{formatCurrency(expense.amount, expense.currency)}</span>
                </li>
              ))}
              {expensesToRemove.length > 3 && <li className="text-xs">...y {expensesToRemove.length - 3} más</li>}
            </ul>
            <p className="text-sm font-medium text-red-900 mt-2">Liberará: {formatCurrency(totalToRemove)}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleReset}>
            Confirmar Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
