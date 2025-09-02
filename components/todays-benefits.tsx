"use client"

import { Card } from "@/components/ui/card"
import type { CreditCard } from "@/lib/types"

interface TodaysBenefitsProps {
  cards: CreditCard[]
}

export function TodaysBenefits({ cards }: TodaysBenefitsProps) {
  const today = new Date().getDay()

  const todaysBenefits = cards.flatMap((card) =>
    card.benefits.filter((benefit) => benefit.day_of_week === today).map((benefit) => ({ ...benefit, card })),
  )

  if (todaysBenefits.length === 0) {
    return null
  }

  return (
    <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
      <h3 className="font-semibold text-green-900 mb-3">Beneficios de Hoy</h3>
      <div className="space-y-2">
        {todaysBenefits.map((benefit) => (
          <div key={benefit.id} className="flex items-center justify-between p-2 bg-white/50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: benefit.card.color }} />
              <div>
                <p className="text-sm font-medium text-green-900">{benefit.description}</p>
                <p className="text-xs text-green-700">{benefit.card.name}</p>
              </div>
            </div>
            {benefit.discount_percentage && (
              <span className="text-sm font-bold text-green-800">{benefit.discount_percentage}%</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
