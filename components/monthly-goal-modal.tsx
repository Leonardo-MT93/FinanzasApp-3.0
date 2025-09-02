"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Target, TrendingUp, TrendingDown } from "lucide-react"
import { useExpenseStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"
import type { MonthlyGoal } from "@/lib/types"

export function MonthlyGoalModal() {
  const { monthlyGoals, setMonthlyGoal, expenses, user } = useExpenseStore()
  const [isOpen, setIsOpen] = useState(false)
  const [goalAmount, setGoalAmount] = useState("")

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const currentGoal = monthlyGoals.find((goal) => goal.month === currentMonth && goal.year === currentYear)

  const currentMonthExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  const handleSetGoal = () => {
    if (!goalAmount || !user) return

    const goal: MonthlyGoal = {
      id: Date.now().toString(),
      user_id: user.id,
      month: currentMonth,
      year: currentYear,
      target_amount: Number.parseFloat(goalAmount),
      current_amount: currentMonthExpenses,
    }

    setMonthlyGoal(goal)
    setGoalAmount("")
    setIsOpen(false)
  }

  const getProgressData = () => {
    if (!currentGoal) return null

    const progress = (currentMonthExpenses / currentGoal.target_amount) * 100
    const remaining = currentGoal.target_amount - currentMonthExpenses
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
    const daysRemaining = daysInMonth - now.getDate()
    const dailyBudget = remaining / Math.max(daysRemaining, 1)

    return {
      progress: Math.min(progress, 100),
      remaining,
      daysRemaining,
      dailyBudget,
      isOverBudget: currentMonthExpenses > currentGoal.target_amount,
    }
  }

  const progressData = getProgressData()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start h-auto p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-900 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <p className="font-medium">Objetivo Mensual</p>
              <p className="text-sm text-green-700">{currentGoal ? "Ver progreso" : "Establecer objetivo"}</p>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Objetivo Mensual</DialogTitle>
        </DialogHeader>

        {!currentGoal ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Establece un objetivo de gastos para este mes y mantén el control de tu presupuesto.
            </p>
            <div className="space-y-2">
              <Label htmlFor="goalAmount">Objetivo de Gastos Mensual</Label>
              <Input
                id="goalAmount"
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="Ej: 50000"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1 bg-transparent">
                Cancelar
              </Button>
              <Button onClick={handleSetGoal} className="flex-1" disabled={!goalAmount}>
                Establecer
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Progress Overview */}
            <Card className="p-4">
              <div className="text-center space-y-2">
                <h3 className="font-semibold">Objetivo del Mes</h3>
                <p className="text-2xl font-bold text-primary">{formatCurrency(currentGoal.target_amount)}</p>
                <p className="text-sm text-muted-foreground">
                  Gastado: {formatCurrency(currentMonthExpenses)} (
                  {((currentMonthExpenses / currentGoal.target_amount) * 100).toFixed(1)}%)
                </p>
              </div>
            </Card>

            {/* Progress Bar */}
            {progressData && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span className={progressData.isOverBudget ? "text-red-500" : "text-green-600"}>
                    {progressData.progress.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      progressData.isOverBudget ? "bg-red-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(progressData.progress, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Status Cards */}
            {progressData && (
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      {progressData.remaining >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {progressData.remaining >= 0 ? "Disponible" : "Excedido"}
                    </p>
                    <p className={`font-semibold ${progressData.remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(Math.abs(progressData.remaining))}
                    </p>
                  </div>
                </Card>

                <Card className="p-3">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Presupuesto diario</p>
                    <p className="font-semibold text-accent">{formatCurrency(Math.max(progressData.dailyBudget, 0))}</p>
                    <p className="text-xs text-muted-foreground">{progressData.daysRemaining} días restantes</p>
                  </div>
                </Card>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setGoalAmount(currentGoal.target_amount.toString())
                  // Reset goal to allow editing
                  const updatedGoal = { ...currentGoal, target_amount: 0 }
                  setMonthlyGoal(updatedGoal)
                }}
                className="flex-1 bg-transparent"
              >
                Editar
              </Button>
              <Button onClick={() => setIsOpen(false)} className="flex-1">
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
