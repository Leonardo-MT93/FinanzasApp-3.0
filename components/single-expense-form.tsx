"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CategorySelector } from "./category-selector"
import { CurrencyToggle } from "./currency-toggle"
import { PaymentMethodToggle } from "./payment-method-toggle"
import { useExpenseStore } from "@/lib/store"
import type { Currency, PaymentMethod, Expense } from "@/lib/types"

interface SingleExpenseFormProps {
  onSubmit: (expense: Omit<Expense, "id" | "user_id" | "created_at" | "updated_at">) => void
}

export function SingleExpenseForm({ onSubmit }: SingleExpenseFormProps) {
  const { creditCards } = useExpenseStore()
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    currency: "ARS" as Currency,
    paymentMethod: "debit" as PaymentMethod,
    cardId: "",
    isShared: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.category) return

    const expense: Omit<Expense, "id" | "user_id" | "created_at" | "updated_at"> = {
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      currency: formData.currency,
      category: formData.category,
      expense_type: "single",
      payment_method: formData.paymentMethod,
      card_id: formData.paymentMethod === "credit" ? formData.cardId : undefined,
      date: new Date(formData.date),
      is_shared: formData.isShared,
    }

    onSubmit(expense)

    // Reset form
    setFormData({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
      currency: "ARS",
      paymentMethod: "debit",
      cardId: "",
      isShared: false,
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
          placeholder="Ej: Supermercado, Uber, etc."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Monto *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          placeholder="0.00"
          required
        />
      </div>

      <CategorySelector
        selectedCategory={formData.category}
        onCategoryChange={(category) => setFormData({ ...formData, category })}
      />

      <div className="space-y-2">
        <Label htmlFor="date">Fecha</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      <CurrencyToggle
        currency={formData.currency}
        onCurrencyChange={(currency) => setFormData({ ...formData, currency })}
      />

      <PaymentMethodToggle
        paymentMethod={formData.paymentMethod}
        onPaymentMethodChange={(paymentMethod) => setFormData({ ...formData, paymentMethod, cardId: "" })}
      />

      {formData.paymentMethod === "credit" && (
        <div className="space-y-2">
          <Label>Tarjeta de Crédito</Label>
          <Select value={formData.cardId} onValueChange={(cardId) => setFormData({ ...formData, cardId })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar tarjeta" />
            </SelectTrigger>
            <SelectContent>
              {creditCards.map((card) => (
                <SelectItem key={card.id} value={card.id}>
                  {card.name} - {card.bank}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {formData.paymentMethod === "debit" && (
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">Se descontará del balance disponible</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Label htmlFor="shared">Gasto Compartido</Label>
        <Switch
          id="shared"
          checked={formData.isShared}
          onCheckedChange={(isShared) => setFormData({ ...formData, isShared })}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!formData.description || !formData.amount || !formData.category}
      >
        Guardar Gasto
      </Button>
    </form>
  )
}
