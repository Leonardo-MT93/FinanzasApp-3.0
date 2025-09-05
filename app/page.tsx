"use client"

import { useExpenseStore } from "@/lib/store"
import { BalanceCard } from "@/components/balance-card"
import { AlertCard } from "@/components/alert-card"
import { RecentExpenses } from "@/components/recent-expenses"
import { SubscriptionsCard } from "@/components/subscriptions-card"
import { ProfileEditModal } from "@/components/profile-edit-modal"
import { Button } from "@/components/ui/button"
import { Edit3 } from "lucide-react"

export default function HomePage() {
  const { user, expenses, creditCards } = useExpenseStore()

  const currentMonthExpenses = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date)
      const now = new Date()
      return (
        expenseDate.getMonth() === now.getMonth() &&
        expenseDate.getFullYear() === now.getFullYear() &&
        expense.payment_method === "debit"
      ) // Only count debit expenses
    })
    .reduce((sum, expense) => sum + expense.amount, 0)

  const availableBalance = (user?.monthly_salary || 0) - currentMonthExpenses

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Hola, {user?.name || "Usuario"}</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <ProfileEditModal />
      </header>

      <BalanceCard
        balance={availableBalance}
        currency={user?.preferred_currency || "ARS"}
        trend={availableBalance > 0 ? "up" : "down"}
        trendPercentage={12}
      />

      <AlertCard cards={creditCards} />

      <RecentExpenses expenses={expenses} />

      <SubscriptionsCard expenses={expenses} />
    </div>
  )
}
