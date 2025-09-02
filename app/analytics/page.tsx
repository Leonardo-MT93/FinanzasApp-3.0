"use client"

import { Card } from "@/components/ui/card"
import { FutureSummaryModal } from "@/components/future-summary-modal"
import { CurrentSummaryModal } from "@/components/current-summary-modal"
import { MonthlyGoalModal } from "@/components/monthly-goal-modal"
import { useExpenseStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"

export default function AnalyticsPage() {
  const { expenses } = useExpenseStore()

  const getMonthlyHistory = () => {
    const history: Record<string, { total: number; count: number; month: number; year: number }> = {}

    expenses.forEach((expense) => {
      const date = new Date(expense.date)
      const key = `${date.getFullYear()}-${date.getMonth()}`

      if (!history[key]) {
        history[key] = {
          total: 0,
          count: 0,
          month: date.getMonth(),
          year: date.getFullYear(),
        }
      }

      history[key].total += expense.amount
      history[key].count += 1
    })

    return Object.values(history)
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year
        return b.month - a.month
      })
      .slice(0, 6) // Last 6 months
  }

  const monthlyHistory = getMonthlyHistory()

  const getMonthName = (month: number) => {
    const months = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ]
    return months[month]
  }

  return (
    <div className="p-4 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-foreground">Análisis</h1>
        <p className="text-muted-foreground">Insights y proyecciones de tus gastos</p>
      </header>

      {/* Main Action Buttons */}
      <div className="space-y-3">
        <FutureSummaryModal />
        <CurrentSummaryModal />
        <MonthlyGoalModal />
      </div>

      {/* Monthly History */}
      <div className="space-y-4">
        <h2 className="font-semibold text-foreground">Historial Mensual</h2>
        <div className="grid gap-3">
          {monthlyHistory.map((month) => (
            <Card key={`${month.year}-${month.month}`} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">
                    {getMonthName(month.month)} {month.year}
                  </h3>
                  <p className="text-sm text-muted-foreground">{month.count} gastos</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{formatCurrency(month.total)}</p>
                  <div className="w-16 h-2 bg-muted rounded-full mt-1">
                    <div
                      className="h-2 bg-primary rounded-full transition-all"
                      style={{
                        width: `${Math.min((month.total / Math.max(...monthlyHistory.map((m) => m.total))) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {monthlyHistory.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No hay datos históricos disponibles</p>
            <p className="text-sm text-muted-foreground mt-2">
              Comienza agregando gastos para ver tu historial mensual
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
