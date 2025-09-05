"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { CreditCard, CardBrand } from "@/lib/types"
import { useExpenseStore } from "@/lib/store"

interface AddCardFormProps {
  isOpen: boolean
  onClose: () => void
}

const cardColors = [
  "#1e40af", // blue
  "#dc2626", // red
  "#059669", // green
  "#7c3aed", // purple
  "#ea580c", // orange
  "#0891b2", // cyan
  "#be123c", // rose
  "#4338ca", // indigo
  "#000000", // black
  "#6b7280", // gray
  "#f59e0b", // amber
  "#ec4899", // pink
]

export function AddCardForm({ isOpen, onClose }: AddCardFormProps) {
  const { addCreditCard, user } = useExpenseStore()
  const [formData, setFormData] = useState({
    name: "",
    bank: "",
    brand: "visa" as CardBrand,
    closingDay: "15",
    paymentDay: "5",
    creditLimit: "",
    color: cardColors[0],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.bank) return

    const newCard: CreditCard = {
      id: Date.now().toString(),
      user_id: user?.id || "1",
      name: formData.name,
      bank: formData.bank,
      brand: formData.brand,
      closing_day: Number.parseInt(formData.closingDay),
      payment_day: Number.parseInt(formData.paymentDay),
      credit_limit: formData.creditLimit ? Number.parseFloat(formData.creditLimit) : undefined,
      benefits: [],
      color: formData.color,
      last_four_digits: Math.floor(1000 + Math.random() * 9000).toString(),
      created_at: new Date(),
    }

    addCreditCard(newCard)
    onClose()

    // Reset form
    setFormData({
      name: "",
      bank: "",
      brand: "visa",
      closingDay: "15",
      paymentDay: "5",
      creditLimit: "",
      color: cardColors[0],
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Tarjeta</DialogTitle>
          <DialogDescription>
            Agrega una nueva tarjeta de crédito a tu billetera digital.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Tarjeta *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Visa Gold, Mastercard Black"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bank">Banco *</Label>
            <Input
              id="bank"
              value={formData.bank}
              onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
              placeholder="Ej: BBVA, Santander, Galicia"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Marca *</Label>
            <Select
              value={formData.brand}
              onValueChange={(value: CardBrand) => setFormData({ ...formData, brand: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visa">Visa</SelectItem>
                <SelectItem value="mastercard">Mastercard</SelectItem>
                <SelectItem value="amex">American Express</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Día de Cierre *</Label>
              <Select
                value={formData.closingDay}
                onValueChange={(value) => setFormData({ ...formData, closingDay: value })}
              >
                <SelectTrigger>
                  <SelectValue />
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

            <div className="space-y-2">
              <Label>Día de Vencimiento *</Label>
              <Select
                value={formData.paymentDay}
                onValueChange={(value) => setFormData({ ...formData, paymentDay: value })}
              >
                <SelectTrigger>
                  <SelectValue />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="creditLimit">Límite de Crédito (Opcional)</Label>
            <Input
              id="creditLimit"
              type="number"
              value={formData.creditLimit}
              onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Color de la Tarjeta</Label>
            <div className="grid grid-cols-6 gap-2">
              {cardColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-full h-8 rounded-md border-2 transition-all ${
                    formData.color === color ? "border-primary scale-110" : "border-border"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Label htmlFor="customColor" className="text-sm">
                Color personalizado:
              </Label>
              <input
                id="customColor"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-8 h-8 rounded border border-border cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={!formData.name || !formData.bank}>
              Agregar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
