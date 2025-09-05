"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Filter, Search } from "lucide-react"
import { useExpenseStore } from "@/lib/store"

interface ExpenseFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  dateRange: { start: string; end: string }
  onDateRangeChange: (range: { start: string; end: string }) => void
  amountRange: { min: string; max: string }
  onAmountRangeChange: (range: { min: string; max: string }) => void
}

export function ExpenseFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  dateRange,
  onDateRangeChange,
  amountRange,
  onAmountRangeChange,
}: ExpenseFiltersProps) {
  const { categories } = useExpenseStore()
  const [isOpen, setIsOpen] = useState(false)

  const clearFilters = () => {
    onSearchChange("")
    onCategoryChange("")
    onDateRangeChange({ start: "", end: "" })
    onAmountRangeChange({ min: "", max: "" })
  }

  const hasActiveFilters = selectedCategory || dateRange.start || dateRange.end || amountRange.min || amountRange.max

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar gastos..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filtros
              {hasActiveFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Filtros de Gastos</DialogTitle>
              <DialogDescription>
                Filtra tus gastos por categoría, fecha y monto.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Fecha desde</Label>
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha hasta</Label>
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>Monto mínimo</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={amountRange.min}
                    onChange={(e) => onAmountRangeChange({ ...amountRange, min: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Monto máximo</Label>
                  <Input
                    type="number"
                    placeholder="Sin límite"
                    value={amountRange.max}
                    onChange={(e) => onAmountRangeChange({ ...amountRange, max: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={clearFilters} className="flex-1 bg-transparent">
                  Limpiar
                </Button>
                <Button onClick={() => setIsOpen(false)} className="flex-1">
                  Aplicar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
