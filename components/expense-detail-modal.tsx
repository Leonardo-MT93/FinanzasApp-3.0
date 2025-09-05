"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import type { Expense } from "@/lib/types"
import { formatCurrency, getCategoryIcon } from "@/lib/utils"
import { useExpenseStore } from "@/lib/store"
import { ExpenseEditModal } from "./expense-edit-modal"

interface ExpenseDetailModalProps {
  expense: Expense | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (expense: Expense) => void
  
}

export function ExpenseDetailModal({ expense, open, onOpenChange, onEdit }: ExpenseDetailModalProps) {
  const { deleteExpense, updateExpense } = useExpenseStore()
  const [isEditingInstallments, setIsEditingInstallments] = useState(false)
  const [newInstallments, setNewInstallments] = useState("")
  const [showEditModal, setShowEditModal] = useState(false)

  if (!expense) return null

  const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date)
  const isInstallment = expense.expense_type === "installment"
  const currentInstallment = expense.installment_data?.current_installment || 1
  const totalInstallments = expense.installment_data?.total_installments || 1
  const progressPercentage = Math.round((currentInstallment / totalInstallments) * 100)

  const handleDelete = () => {
    deleteExpense(expense.id)
    onOpenChange(false)
  }

  const handleUpdateInstallments = () => {
    const newTotal = Number.parseInt(newInstallments)
    if (newTotal > 0 && newTotal !== totalInstallments) {
      updateExpense(expense.id, {
        ...expense,
        installment_data: {
          ...expense.installment_data,
          total_installments: newTotal,
          total_amount: expense.installment_data?.total_amount || expense.amount * newTotal,
          installment_value: expense.installment_data?.total_amount ? expense.installment_data.total_amount / newTotal : expense.amount,
          current_installment: expense.installment_data?.current_installment || 1,
          first_payment_date: expense.installment_data?.first_payment_date || new Date(),
        },
      })
    }
    setIsEditingInstallments(false)
    setNewInstallments("")
  }

  const handlePreviousInstallment = () => {
    if (currentInstallment > 1 && expense.installment_data) {
      updateExpense(expense.id, {
        ...expense,
        installment_data: {
          ...expense.installment_data,
          current_installment: currentInstallment - 1,
        },
      })
    }
  }

  const handleNextInstallment = () => {
    if (currentInstallment < totalInstallments && expense.installment_data) {
      updateExpense(expense.id, {
        ...expense,
        installment_data: {
          ...expense.installment_data,
          current_installment: currentInstallment + 1,
        },
      })
    }
  }

  const handleEdit = () => {
    setShowEditModal(true)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="p-0 max-w-sm mx-auto h-full max-h-screen overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>Detalle del Gasto</DialogTitle>
            <DialogDescription>
              Ver y editar los detalles del gasto seleccionado
            </DialogDescription>
          </VisuallyHidden>
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-background">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8 w-8 p-0">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <h2 className="font-semibold">Detalle del Gasto</h2>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={handleEdit} className="h-8 w-8 p-0">
                  <Edit className="w-4 h-4 mr-16" />
                </Button>
                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button> */}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Amount Display */}
              <div className="text-center space-y-2">
                <h3 className="text-sm text-muted-foreground">{expense.description}</h3>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(expense.amount, expense.currency)}
                </div>
                                   {isInstallment && (
                     <p className="text-sm text-muted-foreground">
                       Cuota mensual • Total:{" "}
                       {formatCurrency(expense.installment_data?.total_amount || expense.amount * totalInstallments, expense.currency)}
                     </p>
                   )}
              </div>

              {/* Description */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">{expense.description}</p>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <h4 className="font-semibold">Detalles</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-sm">
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Categoría</p>
                      <p className="text-sm font-medium">{expense.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">📅</div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fecha</p>
                      <p className="text-sm font-medium">
                        {/* TODO: date: dd/mm */}
                        {expenseDate.toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">💰</div>
                    <div>
                      <p className="text-xs text-muted-foreground">Moneda</p>
                      <p className="text-sm font-medium">
                        {expense.currency === "ARS" ? "Pesos (ARS)" : "Dólares (USD)"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">👤</div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tipo</p>
                      <p className="text-sm font-medium">{expense.is_shared ? "Compartido" : "Individual"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 col-span-2">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">💳</div>
                    <div>
                      <p className="text-xs text-muted-foreground">Pago</p>
                      <p className="text-sm font-medium capitalize">{expense.payment_method}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Installment Progress */}
              {isInstallment && (
                <div className="space-y-4">
                  <h4 className="font-semibold">Progreso de Cuotas</h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Cuota {currentInstallment} de {totalInstallments}
                      </span>
                      <span className="text-sm text-muted-foreground">{progressPercentage}% completado</span>
                    </div>

                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div
                        className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Iniciado:{" "}
                        {expenseDate.toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span>{totalInstallments - currentInstallment} cuotas restantes</span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        className="flex-1 text-gray-600 border-gray-200 hover:bg-gray-50 bg-transparent"
                        onClick={handlePreviousInstallment}
                        disabled={currentInstallment <= 1}
                      >
                        ← Cuota Anterior
                      </Button>
                      <Button
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={handleNextInstallment}
                        disabled={currentInstallment >= totalInstallments}
                      >
                        Cuota Siguiente →
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ExpenseEditModal expense={expense} open={showEditModal} onOpenChange={setShowEditModal} />
    </>
  )
}
