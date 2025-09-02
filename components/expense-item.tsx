"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import type { Expense } from "@/lib/types"
import { formatCurrency, getCategoryIcon, getExpenseTypeLabel } from "@/lib/utils"
import { useExpenseStore } from "@/lib/store"

interface ExpenseItemProps {
  expense: Expense
  onEdit?: (expense: Expense) => void
  onOpenDetail?: (expense: Expense) => void // Added onOpenDetail prop
}

export function ExpenseItem({ expense, onEdit, onOpenDetail }: ExpenseItemProps) {
  const { deleteExpense } = useExpenseStore()

  const handleDelete = () => {
    deleteExpense(expense.id)
  }

  const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date)

  return (
    <Card
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onOpenDetail?.(expense)} // Added click handler to open detail modal
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-xl">
            {getCategoryIcon(expense.category)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-xs text-foreground truncate">{expense.description} - {expenseDate.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "numeric",
              })}</h3>

            </div>
            <div className="flex items-center gap-2 mt-1">
              {/* <p className="text-sm text-muted-foreground">{expense.category}</p> */}
              {getExpenseTypeLabel(expense) && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">
                  {getExpenseTypeLabel(expense)}
                </span>
              )}
            </div>
            {/* <p className="text-xs text-muted-foreground mt-1">
              {expenseDate.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "numeric",
              })}
            </p> */}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="font-semibold text-foreground">{formatCurrency(expense.amount, expense.currency)}</p>
            <p className="text-xs text-muted-foreground capitalize ">{expense.is_shared && <span className="text-xs text-accent">👥 - </span>}
            {expense.payment_method}</p>
          </div>

          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            {" "}
            {/* Added stopPropagation to prevent modal opening when clicking buttons */}
            {/* <Button variant="ghost" size="sm" onClick={() => onEdit?.(expense)} className="h-8 w-8 p-0">
              <Edit className="w-4 h-4" />
            </Button> */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
