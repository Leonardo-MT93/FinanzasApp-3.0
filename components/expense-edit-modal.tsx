"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Plus, Minus } from "lucide-react"
import type { Expense } from "@/lib/types"
import { useExpenseStore } from "@/lib/store"
import { CategorySelector } from "./category-selector"
import { CurrencyToggle } from "./currency-toggle"
import { PaymentMethodToggle } from "./payment-method-toggle"

interface ExpenseEditModalProps {
  expense: Expense | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExpenseEditModal({ expense, open, onOpenChange }: ExpenseEditModalProps) {
  const { updateExpense, creditCards } = useExpenseStore()

  // Form state
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [currency, setCurrency] = useState<"ARS" | "USD">("ARS")
  const [paymentMethod, setPaymentMethod] = useState<"debit" | "credit">("debit")
  const [selectedCard, setSelectedCard] = useState("")
  const [isShared, setIsShared] = useState(false)
  const [installments, setInstallments] = useState(1)
  const [date, setDate] = useState("")

  // Initialize form with expense data
  useEffect(() => {
    if (expense) {
      setDescription(expense.description)
      setAmount(expense.amount.toString())
      setCategory(expense.category)
      setCurrency(expense.currency)
      setPaymentMethod(expense.payment_method)
      setSelectedCard(expense.card_id || "")
      setIsShared(expense.is_shared)
      setInstallments(expense.installment_data?.total_installments || 1)

      const expenseDate = expense.date instanceof Date ? expense.date : new Date(expense.date)
      setDate(expenseDate.toISOString().split("T")[0])
    }
  }, [expense])

  if (!expense) return null

  const handleSave = () => {
    const updatedExpense: Expense = {
      ...expense,
      description,
      amount: Number(amount),
      category,
      currency,
      payment_method: paymentMethod,
      card_id: paymentMethod === "credit" ? selectedCard : undefined,
      is_shared: isShared,
      date: new Date(date),
      expense_type: installments > 1 ? "installment" : "single",
      installment_data: installments > 1 ? {
        total_installments: installments,
        total_amount: Number(amount) * installments,
        installment_value: Number(amount),
        current_installment: expense.installment_data?.current_installment || 1,
        first_payment_date: expense.installment_data?.first_payment_date || new Date(date),
      } : undefined,
    }

    updateExpense(expense.id, updatedExpense)
    onOpenChange(false)
  }

  const incrementInstallments = () => {
    setInstallments((prev) => prev + 1)
  }

  const decrementInstallments = () => {
    setInstallments((prev) => Math.max(1, prev - 1))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-sm mx-auto max-h-[90vh] overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Editar Gasto</DialogTitle>
          <DialogDescription>
            Modificar los detalles del gasto seleccionado
          </DialogDescription>
        </VisuallyHidden>
        <div className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-background flex-shrink-0">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-8 w-8 p-0">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h2 className="font-semibold">Editar Gasto</h2>
            </div>
            <Button onClick={handleSave} size="sm" className="bg-primary text-primary-foreground">
              Guardar
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descripción del gasto"
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Categoría</Label>
              <CategorySelector selectedCategory={category} onCategoryChange={setCategory} />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label>Moneda</Label>
              <CurrencyToggle currency={currency} onCurrencyChange={setCurrency} />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label>Método de Pago</Label>
              <PaymentMethodToggle paymentMethod={paymentMethod} onPaymentMethodChange={setPaymentMethod} />
            </div>

            {/* Credit Card Selection */}
            {paymentMethod === "credit" && (
              <div className="space-y-2">
                <Label>Tarjeta de Crédito</Label>
                <Select value={selectedCard} onValueChange={setSelectedCard}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tarjeta" />
                  </SelectTrigger>
                  <SelectContent>
                    {creditCards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.bank} - {card.brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Installments */}
            <div className="space-y-2">
              <Label>Cantidad de Cuotas</Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={decrementInstallments}
                  disabled={installments <= 1}
                  className="h-10 w-10 p-0 bg-transparent"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <div className="flex-1 text-center">
                  <span className="text-lg font-semibold">{installments}</span>
                  <p className="text-xs text-muted-foreground">{installments === 1 ? "pago único" : "cuotas"}</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={incrementInstallments}
                  className="h-10 w-10 p-0 bg-transparent"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {installments > 1 && (
                <p className="text-sm text-muted-foreground text-center">
                  Total:{" "}
                  {(Number(amount) * installments).toLocaleString("es-AR", {
                    style: "currency",
                    currency: currency === "ARS" ? "ARS" : "USD",
                  })}
                </p>
              )}
            </div>

            {/* Shared Expense */}
            <div className="flex items-center justify-between">
              <Label htmlFor="shared">Gasto Compartido</Label>
              <Switch id="shared" checked={isShared} onCheckedChange={setIsShared} />
            </div>

            <div className="pb-4" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
