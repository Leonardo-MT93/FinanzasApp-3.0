"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategorySelector } from "./category-selector"
import { useExpenseStore } from "@/lib/store"
import type { Expense } from "@/lib/types"

interface InstallmentFormProps {
  onSubmit: (expense: Omit<Expense, "id" | "user_id" | "created_at" | "updated_at">) => void
}

export function InstallmentForm({ onSubmit }: InstallmentFormProps) {
  const { creditCards } = useExpenseStore()
  const [formData, setFormData] = useState({
    description: "",
    totalAmount: "",
    installmentValue: "",
    totalInstallments: "12",
    firstPaymentDate: new Date().toISOString().split("T")[0],
    category: "",
    cardId: "",
    amountType: "total" as "total" | "installment",
  })

  const calculateValues = () => {
    if (formData.amountType === "total" && formData.totalAmount && formData.totalInstallments) {
      const total = Number.parseFloat(formData.totalAmount)
      const installments = Number.parseInt(formData.totalInstallments)
      if (installments > 0) {
        return {
          totalAmount: total,
          installmentValue: total / installments,
        }
      }
    } else if (formData.amountType === "installment" && formData.installmentValue && formData.totalInstallments) {
      const installmentValue = Number.parseFloat(formData.installmentValue)
      const installments = Number.parseInt(formData.totalInstallments)
      if (installments > 0 && installmentValue > 0) {
        return {
          totalAmount: installmentValue * installments,
          installmentValue,
        }
      }
    }
    return { totalAmount: 0, installmentValue: 0 }
  }

  const { totalAmount, installmentValue } = calculateValues()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.cardId || !formData.category || totalAmount === 0) return

    const expense: Omit<Expense, "id" | "user_id" | "created_at" | "updated_at"> = {
      description: formData.description,
      amount: installmentValue,
      currency: "ARS",
      category: formData.category,
      expense_type: "installment",
      payment_method: "credit",
      card_id: formData.cardId,
      date: new Date(formData.firstPaymentDate),
      is_shared: false,
      installment_data: {
        total_amount: totalAmount,
        installment_value: installmentValue,
        total_installments: Number.parseInt(formData.totalInstallments),
        current_installment: 1,
        first_payment_date: new Date(formData.firstPaymentDate),
      },
    }

    onSubmit(expense)

    // Reset form
    setFormData({
      description: "",
      totalAmount: "",
      installmentValue: "",
      totalInstallments: "12",
      firstPaymentDate: new Date().toISOString().split("T")[0],
      category: "",
      cardId: "",
      amountType: "total",
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description">Descripción *</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Ej: iPhone 15, Notebook, etc."
          required
        />
      </div>

      <div className="space-y-3">
        <Label>Tipo de Monto</Label>
        <div className="flex rounded-lg border border-border p-1 bg-muted/50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setFormData({ ...formData, amountType: "total", installmentValue: "" })}
            className={`flex-1 h-8 text-sm font-medium transition-all ${
              formData.amountType === "total"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monto Total
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setFormData({ ...formData, amountType: "installment", totalAmount: "" })}
            className={`flex-1 h-8 text-sm font-medium transition-all ${
              formData.amountType === "installment"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Valor Cuota
          </Button>
        </div>
      </div>

      {formData.amountType === "total" ? (
        <div className="space-y-2">
          <Label htmlFor="totalAmount">Monto Total *</Label>
          <Input
            id="totalAmount"
            type="number"
            step="0.01"
            min="0"
            value={formData.totalAmount}
            onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="installmentValue">Valor por Cuota *</Label>
          <Input
            id="installmentValue"
            type="number"
            step="0.01"
            min="0"
            value={formData.installmentValue}
            onChange={(e) => setFormData({ ...formData, installmentValue: e.target.value })}
            placeholder="0.00"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label>Número de Cuotas</Label>
        <Select
          value={formData.totalInstallments}
          onValueChange={(value) => setFormData({ ...formData, totalInstallments: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 47 }, (_, i) => i + 2).map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num} cuotas
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="firstPaymentDate">Fecha Primer Pago</Label>
        <Input
          id="firstPaymentDate"
          type="date"
          value={formData.firstPaymentDate}
          onChange={(e) => setFormData({ ...formData, firstPaymentDate: e.target.value })}
        />
      </div>

      <CategorySelector
        selectedCategory={formData.category}
        onCategoryChange={(category) => setFormData({ ...formData, category })}
      />

      <div className="space-y-2">
        <Label>Tarjeta de Crédito *</Label>
        <Select value={formData.cardId} onValueChange={(cardId) => setFormData({ ...formData, cardId })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar tarjeta" />
          </SelectTrigger>
          <SelectContent>
            {creditCards.length === 0 ? (
              <SelectItem value="" disabled>
                No hay tarjetas disponibles
              </SelectItem>
            ) : (
              creditCards.map((card) => (
                <SelectItem key={card.id} value={card.id}>
                  {card.name} - {card.bank}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {totalAmount > 0 && installmentValue > 0 && (
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm font-medium text-primary">
            Vista Previa: {formData.totalInstallments} cuotas de $
            {installmentValue.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Total: ${totalAmount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={
          !formData.description ||
          !formData.cardId ||
          !formData.category ||
          totalAmount === 0 ||
          creditCards.length === 0
        }
      >
        Guardar Cuotas
      </Button>
    </form>
  )
}
