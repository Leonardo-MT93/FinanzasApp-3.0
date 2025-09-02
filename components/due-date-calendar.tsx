"use client"

import { Card } from "@/components/ui/card"
import { getCardPaymentDaysLeft, getCardClosingDaysLeft } from "@/lib/utils"
import type { CreditCard } from "@/lib/types"

interface DueDateCalendarProps {
  cards: CreditCard[]
}

export function DueDateCalendar({ cards }: DueDateCalendarProps) {
  const upcomingDates = cards
    .flatMap((card) => [
      {
        card,
        type: "closing" as const,
        daysLeft: getCardClosingDaysLeft(card),
        day: card.closing_day,
      },
      {
        card,
        type: "payment" as const,
        daysLeft: getCardPaymentDaysLeft(card),
        day: card.payment_day,
      },
    ])
    .filter((item) => item.daysLeft <= 30)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-foreground mb-4">Calendario de Vencimientos</h3>
      <div className="space-y-3">
        {upcomingDates.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No hay vencimientos próximos</p>
        ) : (
          upcomingDates.map((item, index) => (
            <div
              key={`${item.card.id}-${item.type}-${index}`}
              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">{item.card.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.type === "closing" ? "Cierre" : "Vencimiento"} - Día {item.day}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${
                    item.daysLeft <= 3 ? "text-red-500" : item.daysLeft <= 7 ? "text-yellow-500" : "text-green-500"
                  }`}
                >
                  {item.daysLeft === 0 ? "Hoy" : `${item.daysLeft} días`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
