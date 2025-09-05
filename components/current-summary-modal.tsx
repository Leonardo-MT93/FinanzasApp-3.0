"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { BarChart3, TrendingUp, TrendingDown } from "lucide-react"
import { useExpenseStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"

export function CurrentSummaryModal() {
  const { expenses, categories } = useExpenseStore()
  const [isOpen, setIsOpen] = useState(false)

  const getCurrentMonthData = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

    const currentMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })

    const previousMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === previousMonth && expenseDate.getFullYear() === previousYear
    })

    const currentTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const previousTotal = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    const categoryBreakdown = categories.map((category) => {
      const categoryExpenses = currentMonthExpenses.filter((expense) => expense.category === category.name)
      const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      return {
        ...category,
        total,
        count: categoryExpenses.length,
        percentage: currentTotal > 0 ? (total / currentTotal) * 100 : 0,
      }
    })

    const dailyAverage = currentTotal / now.getDate()
    const changeFromPrevious = previousTotal > 0 ? ((currentTotal - previousTotal) / previousTotal) * 100 : 0

    return {
      currentTotal,
      previousTotal,
      changeFromPrevious,
      categoryBreakdown: categoryBreakdown.filter((cat) => cat.total > 0).sort((a, b) => b.total - a.total),
      dailyAverage,
    }
  }

  const data = getCurrentMonthData()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start h-auto p-4 bg-gradient-to-r from-accent/10 to-secondary/10 border-accent/20">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-accent" />
            <div className="text-left">
              <p className="font-medium">Resumen Actual Detallado</p>
              <p className="text-sm text-muted-foreground">Análisis del mes en curso</p>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resumen Detallado - Mes Actual</DialogTitle>
          <DialogDescription>
            Análisis completo de tus gastos del mes en curso con comparación mensual.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Total del Mes</h3>
              <p className="text-2xl font-bold text-primary">{formatCurrency(data.currentTotal)}</p>
              <div className="flex items-center gap-1 mt-2">
                {data.changeFromPrevious >= 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )}
                <span
                  className={`text-sm font-medium ${data.changeFromPrevious >= 0 ? "text-red-500" : "text-green-500"}`}
                >
                  {Math.abs(data.changeFromPrevious).toFixed(1)}% vs mes anterior
                </span>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-2">Promedio Diario</h3>
              <p className="text-2xl font-bold text-accent">{formatCurrency(data.dailyAverage)}</p>
              <p className="text-sm text-muted-foreground mt-2">Basado en {new Date().getDate()} días</p>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Análisis por Categoría</h3>
            <div className="space-y-3">
              {data.categoryBreakdown.map((category) => (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground">({category.count} gastos)</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(category.total)}</p>
                      <p className="text-xs text-muted-foreground">{category.percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Comparison with Previous Month */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Comparación Mensual</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Mes Actual</p>
                <p className="text-lg font-bold">{formatCurrency(data.currentTotal)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mes Anterior</p>
                <p className="text-lg font-bold">{formatCurrency(data.previousTotal)}</p>
              </div>
            </div>
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">
                {data.changeFromPrevious >= 0 ? "Incremento" : "Reducción"} de{" "}
                <span className="font-semibold">
                  {formatCurrency(Math.abs(data.currentTotal - data.previousTotal))}
                </span>
              </p>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
