"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { CardBenefit } from "@/lib/types"
import { useExpenseStore } from "@/lib/store"

interface AddBenefitFormProps {
  isOpen: boolean
  onClose: () => void
  cardId: string
}

const daysOfWeek = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
]

export function AddBenefitForm({ isOpen, onClose, cardId }: AddBenefitFormProps) {
  const { updateCreditCard, creditCards } = useExpenseStore()
  const [formData, setFormData] = useState({
    description: "",
    dayOfWeek: "",
    merchant: "",
    discountPercentage: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description) return

    const card = creditCards.find((c) => c.id === cardId)
    if (!card) return

    const newBenefit: CardBenefit = {
      id: Date.now().toString(),
      card_id: cardId,
      description: formData.description,
      day_of_week: formData.dayOfWeek ? Number.parseInt(formData.dayOfWeek) : undefined,
      merchant: formData.merchant || undefined,
      discount_percentage: formData.discountPercentage ? Number.parseFloat(formData.discountPercentage) : undefined,
    }

    updateCreditCard(cardId, {
      benefits: [...card.benefits, newBenefit],
    })

    onClose()

    // Reset form
    setFormData({
      description: "",
      dayOfWeek: "",
      merchant: "",
      discountPercentage: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Beneficio</DialogTitle>
          <DialogDescription>
            Agrega un nuevo beneficio o descuento a tu tarjeta de crédito.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descripción del Beneficio *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ej: 25% descuento en Farmacity"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Día de la Semana (Opcional)</Label>
            <Select
              value={formData.dayOfWeek}
              onValueChange={(value) => setFormData({ ...formData, dayOfWeek: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar día" />
              </SelectTrigger>
              <SelectContent>
                {daysOfWeek.map((day) => (
                  <SelectItem key={day.value} value={day.value.toString()}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchant">Comercio/Tienda (Opcional)</Label>
            <Input
              id="merchant"
              value={formData.merchant}
              onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
              placeholder="Ej: Farmacity, Coto, YPF"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountPercentage">Porcentaje de Descuento (Opcional)</Label>
            <Input
              id="discountPercentage"
              type="number"
              min="0"
              max="100"
              value={formData.discountPercentage}
              onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
              placeholder="25"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={!formData.description}>
              Agregar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
