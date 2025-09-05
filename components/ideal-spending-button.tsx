"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useExpenseStore } from "@/lib/store"
import { Plus } from "lucide-react"
import type { CreditCard } from "@/lib/types"

interface IdealSpendingButtonProps {
  card: CreditCard
}

export function IdealSpendingButton({ card }: IdealSpendingButtonProps) {
  const { addBenefit } = useExpenseStore()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    description: "",
    merchant: "",
    discount_percentage: 0,
    day_of_week: undefined as number | undefined,
  })

  const handleSubmit = () => {
    const benefit = {
      id: Date.now().toString(),
      description: formData.description,
      merchant: formData.merchant,
      discount_percentage: formData.discount_percentage,
      day_of_week: formData.day_of_week,
    }

    addBenefit(card.id, benefit)
    setIsOpen(false)
    setFormData({
      description: "",
      merchant: "",
      discount_percentage: 0,
      day_of_week: undefined,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full bg-transparent">
          <Plus className="w-4 h-4 mr-2" />
          Gasto Ideal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agregar Gasto Ideal - {card.name}</DialogTitle>
          <DialogDescription>
            Agrega un beneficio o descuento específico para esta tarjeta.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="ej: Descuento en supermercado"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchant">Comercio</Label>
            <Input
              id="merchant"
              value={formData.merchant}
              onChange={(e) => setFormData((prev) => ({ ...prev, merchant: e.target.value }))}
              placeholder="ej: Farmacity, Día"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount">Descuento (%)</Label>
            <Input
              id="discount"
              type="number"
              value={formData.discount_percentage}
              onChange={(e) => setFormData((prev) => ({ ...prev, discount_percentage: Number(e.target.value) }))}
              placeholder="25"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="day">Día de la Semana</Label>
            <Select
              value={formData.day_of_week?.toString()}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, day_of_week: Number(value) }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar día" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Domingo</SelectItem>
                <SelectItem value="1">Lunes</SelectItem>
                <SelectItem value="2">Martes</SelectItem>
                <SelectItem value="3">Miércoles</SelectItem>
                <SelectItem value="4">Jueves</SelectItem>
                <SelectItem value="5">Viernes</SelectItem>
                <SelectItem value="6">Sábado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              Agregar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
