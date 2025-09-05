"use client"

import { useState } from "react"
import { useExpenseStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit3 } from "lucide-react"
import type { Currency } from "@/lib/types"

export function ProfileEditModal() {
  const { user, setUser } = useExpenseStore()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<{
    name: string;
    monthly_salary: number;
    preferred_currency: Currency;
  }>({
    name: user?.name || "",
    monthly_salary: user?.monthly_salary || 0,
    preferred_currency: user?.preferred_currency || "ARS",
  })

  const handleSave = () => {
    console.log(formData)
    
    //Guarda usuario si no existe
    if (!user) {
      console.log('Creando nuevo usuario')
      const newUser = {
        id: crypto.randomUUID(),
        email: "", // Se puede agregar un campo de email en el formulario más adelante
        name: formData.name,
        monthly_salary: formData.monthly_salary,
        preferred_currency: formData.preferred_currency,
        created_at: new Date(),
        updated_at: new Date(),
      }
      setUser(newUser)
    }
    //Actualiza usuario existente
    else {
      console.log('Actualizando usuario existente')
      setUser({
        ...user,
        name: formData.name,
        monthly_salary: formData.monthly_salary,
        preferred_currency: formData.preferred_currency,
        updated_at: new Date(),
      })
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit3 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Actualiza tu información personal y configuración de moneda.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Tu nombre"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Salario Mensual</Label>
            <Input
              id="salary"
              type="number"
              value={formData.monthly_salary}
              onChange={(e) => setFormData((prev) => ({ ...prev, monthly_salary: Number(e.target.value) }))}
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Moneda Preferida</Label>
            <Select
              value={formData.preferred_currency}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, preferred_currency: value as Currency }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ARS">ARS - Peso Argentino</SelectItem>
                <SelectItem value="USD">USD - Dólar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Guardar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
