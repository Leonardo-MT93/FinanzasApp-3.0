"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import type { Expense } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

interface SubscriptionsCardProps {
  expenses: Expense[]
}

export function SubscriptionsCard({ expenses }: SubscriptionsCardProps) {
  const activeSubscriptions = expenses.filter(
    (expense) => expense.expense_type === "subscription" && expense.subscription_data?.is_active,
  )

  const totalMonthly = activeSubscriptions.reduce((sum, expense) => sum + expense.amount, 0)

  const serviceLogos: Record<string, string> = {
    Netflix: "🎬",
    Spotify: "🎵",
    "Disney+": "🏰",
    "Amazon Prime": "📦",
    YouTube: "📺",
    "Apple Music": "🎵",
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Suscripciones Activas</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          Ver todas
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="text-center p-4 bg-gradient-to-r from-accent/5 to-primary/5 rounded-lg">
          <p className="text-2xl font-bold text-primary">{activeSubscriptions.length}</p>
          <p className="text-sm text-muted-foreground">servicios activos</p>
          <p className="text-lg font-semibold text-foreground mt-1">{formatCurrency(totalMonthly)} / mes</p>
        </div>

        {activeSubscriptions.length > 0 && (
          <div className="grid grid-cols-4 gap-3">
            {activeSubscriptions.slice(0, 4).map((subscription) => (
              <div key={subscription.id} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-card-foreground/5 flex items-center justify-center text-2xl mb-2 mx-auto">
                  {serviceLogos[subscription.subscription_data?.service_name || ""] || "📱"}
                </div>
                <p className="text-xs font-medium truncate">
                  {subscription.subscription_data?.service_name || subscription.description}
                </p>
                <p className="text-xs text-muted-foreground">{formatCurrency(subscription.amount)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
