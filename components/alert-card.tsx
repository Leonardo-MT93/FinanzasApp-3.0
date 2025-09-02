"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, CreditCard } from "lucide-react"
import type { CreditCard as CreditCardType } from "@/lib/types"
import { getCardPaymentDaysLeft } from "@/lib/utils"

interface AlertCardProps {
  cards: CreditCardType[]
}

export function AlertCard({ cards }: AlertCardProps) {
  const cardsWithPaymentInfo = cards
    .map((card) => ({
      ...card,
      daysLeft: getCardPaymentDaysLeft(card),
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft)

  if (cardsWithPaymentInfo.length === 0) {
    return null
  }

  const urgentPayments = cardsWithPaymentInfo.filter((card) => card.daysLeft <= 7)
  const hasUrgentPayments = urgentPayments.length > 0

  return (
    <Card className={`p-4 ${hasUrgentPayments ? 'border-amber-200 bg-amber-50/50' : 'border-blue-200 bg-blue-50/50'}`}>
      <div className="flex items-start gap-3">
        {hasUrgentPayments ? (
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
        ) : (
          <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
        )}
        <div className="flex-1 space-y-2">
          <h3 className={`font-semibold ${hasUrgentPayments ? 'text-amber-900' : 'text-blue-900'}`}>
            {hasUrgentPayments ? 'Proximos vencimientos' : 'Estado de Tarjetas'}
          </h3>
          <div className="space-y-2">
            {cardsWithPaymentInfo.map((card) => {
              const isUrgent = card.daysLeft <= 7
              const isVeryUrgent = card.daysLeft <= 3
              
              return (
                <div key={card.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: card.color }} />
                    <span className="text-sm font-medium">{card.name}</span>
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span 
                      className={`text-xs font-medium ${
                        isVeryUrgent ? "text-red-600" : 
                        isUrgent ? "text-amber-600" : 
                        "text-blue-600"
                      }`}
                    >
                      {card.daysLeft === 0 ? "Hoy" : `${card.daysLeft} días para venc.`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Card>
  )
}
