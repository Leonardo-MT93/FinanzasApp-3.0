"use client"

import { getCardPaymentDaysLeft, getCardClosingDaysLeft, getCardStatusColor } from "@/lib/utils"
import type { CreditCard } from "@/lib/types"

interface CardStatusIndicatorProps {
  card: CreditCard
  type: "closing" | "payment"
}

export function CardStatusIndicator({ card, type }: CardStatusIndicatorProps) {
  const daysLeft = type === "closing" ? getCardClosingDaysLeft(card) : getCardPaymentDaysLeft(card)
  const colorClass = getCardStatusColor(daysLeft)
  const label = type === "closing" ? "Cierre" : "Vencimiento"

  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${daysLeft <= 3 ? "bg-red-500" : daysLeft <= 7 ? "bg-yellow-500" : "bg-green-500"}`}
      />
      <span className={`text-xs font-medium ${colorClass}`}>
        {label}: {daysLeft === 0 ? "Hoy" : `${daysLeft}d`}
      </span>
    </div>
  )
}
