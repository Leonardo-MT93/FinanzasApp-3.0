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
import { useExpenseStore } from "@/lib/store"
import type { Currency, Expense } from "@/lib/types"

interface SubscriptionFormProps {
  onSubmit: (expense: Omit<Expense, "id" | "user_id" | "created_at" | "updated_at">) => void
}

const popularServices = [
  "Netflix",
  "Spotify",
  "Disney+",
  "Amazon Prime",
  "YouTube Premium",
  "Apple Music",
  "HBO Max",
  "Paramount+",
  "Crunchyroll",
  "Twitch",
]

export function SubscriptionForm({ onSubmit }: SubscriptionFormProps) {
  const { creditCards } = useExpenseStore()
  const [formData, setFormData] = useState({
    serviceName: "",
    amount: "",
    currency: "ARS" as Currency,
    billingDay: "",
    category: "Entretenimiento",
    cardId: "",
    isActive: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.serviceName || !formData.amount || !formData.cardId) return

    const expense: Omit<Expense, "id" | "user_id" | "created_at" | "updated_at"> = {
      description: formData.serviceName,
      amount: Number.parseFloat(formData.amount),
      currency: formData.currency,
      category: formData.category,
      expense_type: "subscription",
      payment_method: "credit",
      card_id: formData.cardId,
      date: new Date(),
      is_shared: false,
      subscription_data: {
        service_name: formData.serviceName,
        billing_day: formData.billingDay ? Number.parseInt(formData.billingDay) : undefined,
        is_active: formData.isActive,
      },
    }

    onSubmit(expense)

    // Reset form
    setFormData({
      serviceName: "",
      amount: "",
      currency: "ARS",
      billingDay: "",
      category: "Entretenimiento",
      cardId: "",
      isActive: true,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="serviceName">Servicio *</Label>
        <Input
          id="serviceName"
          value={formData.serviceName}
          onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
          placeholder="Ej: Netflix, Spotify, etc."
          list="services"
          required
        />
        <datalist id="services">
          {popularServices.map((service) => (
            <option key={service} value={service} />
          ))}
        </datalist>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Monto Mensual *</Label>
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

      <CurrencyToggle
        currency={formData.currency}
        onCurrencyChange={(currency) => setFormData({ ...formData, currency })}
      />

      <div className="space-y-2">
        <Label htmlFor="billingDay">Día de Facturación (Opcional)</Label>
        <Select value={formData.billingDay} onValueChange={(value) => setFormData({ ...formData, billingDay: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar día" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <SelectItem key={day} value={day.toString()}>
                Día {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            {creditCards.map((card) => (
              <SelectItem key={card.id} value={card.id}>
                {card.name} - {card.bank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="active">Suscripción Activa</Label>
        <Switch
          id="active"
          checked={formData.isActive}
          onCheckedChange={(isActive) => setFormData({ ...formData, isActive })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={!formData.serviceName || !formData.amount || !formData.cardId}>
        Guardar Suscripción
      </Button>
    </form>
  )
}
