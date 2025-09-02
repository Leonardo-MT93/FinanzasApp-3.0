"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { User, Palette, Database, Info, Download, Upload, Trash2 } from "lucide-react"
import { useExpenseStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import type { Currency } from "@/lib/types"

export default function SettingsPage() {
  const { user, setUser, categories, setCategories, expenses, creditCards } = useExpenseStore()
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    monthly_salary: user?.monthly_salary?.toString() || "",
    preferred_currency: user?.preferred_currency || ("ARS" as Currency),
  })

  const handleSaveProfile = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      name: profileData.name,
      email: profileData.email,
      monthly_salary: Number.parseFloat(profileData.monthly_salary) || 0,
      preferred_currency: profileData.preferred_currency,
      updated_at: new Date(),
    }

    setUser(updatedUser)
    setEditingProfile(false)
  }

  const handleExportData = () => {
    const data = {
      user,
      expenses,
      creditCards,
      categories,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `expense-tracker-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getTotalData = () => {
    const totalExpenses = expenses.length
    const totalCards = creditCards.length
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    return { totalExpenses, totalCards, totalAmount }
  }

  const { totalExpenses, totalCards, totalAmount } = getTotalData()

  return (
    <div className="p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground">Personaliza tu experiencia</p>
      </header>

      {/* Profile Section */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Perfil</h2>
          </div>
          <Button size="sm" onClick={() => setEditingProfile(true)}>
            Editar
          </Button>
        </div>

        {!editingProfile ? (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Nombre</p>
              <p className="font-medium">{user?.name || "No configurado"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{user?.email || "No configurado"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Salario Mensual</p>
              <p className="font-medium">
                {user ? formatCurrency(user.monthly_salary, user.preferred_currency) : "No configurado"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Moneda Preferida</p>
              <p className="font-medium">{user?.preferred_currency || "ARS"}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salario Mensual</Label>
              <Input
                id="salary"
                type="number"
                value={profileData.monthly_salary}
                onChange={(e) => setProfileData({ ...profileData, monthly_salary: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Moneda Preferida</Label>
              <Select
                value={profileData.preferred_currency}
                onValueChange={(value: Currency) => setProfileData({ ...profileData, preferred_currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ARS">Pesos Argentinos (ARS)</SelectItem>
                  <SelectItem value="USD">Dólares Estadounidenses (USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditingProfile(false)} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button onClick={handleSaveProfile} className="flex-1">
                Guardar
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Categories Section */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Categorías</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((category) => (
            <div key={category.id} className="text-center p-2 rounded-lg border">
              <div className="text-2xl mb-1">{category.icon}</div>
              <p className="text-xs font-medium">{category.name}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Las categorías personalizadas estarán disponibles en una futura actualización
        </p>
      </Card>

      {/* Data Management */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Gestión de Datos</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{totalExpenses}</p>
              <p className="text-sm text-muted-foreground">Gastos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{totalCards}</p>
              <p className="text-sm text-muted-foreground">Tarjetas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary">{formatCurrency(totalAmount)}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={handleExportData} className="w-full justify-start bg-transparent" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Datos (JSON)
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" disabled>
              <Upload className="w-4 h-4 mr-2" />
              Importar Datos (Próximamente)
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full justify-start" variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpiar Todos los Datos
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>¿Estás seguro?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Esta acción eliminará permanentemente todos tus gastos, tarjetas y configuraciones. No se puede
                  deshacer.
                </p>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Cancelar
                  </Button>
                  <Button variant="destructive" className="flex-1">
                    Confirmar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </Card>

      {/* About Section */}
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Acerca de</h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Versión:</strong> 1.0.0
          </p>
          <p>
            <strong>Desarrollado con:</strong> Next.js 15, TypeScript, Tailwind CSS
          </p>
          <p>
            <strong>Características:</strong> Gestión de gastos, tarjetas de crédito, análisis y más
          </p>
        </div>
      </Card>
    </div>
  )
}
