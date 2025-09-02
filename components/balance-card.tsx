"use client"

import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"

interface BalanceCardProps {
  balance: number
  currency: "ARS" | "USD"
  trend?: "up" | "down"
  trendPercentage?: number
}

export function BalanceCard({ balance, currency, trend, trendPercentage }: BalanceCardProps) {
  const [displayBalance, setDisplayBalance] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayBalance(balance)
    }, 100)
    return () => clearTimeout(timer)
  }, [balance])

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 via-card to-accent/5 border-primary/10">
      <div className="text-center space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Balance Disponible</p>
        <div className="space-y-2">
          <p className="text-4xl font-bold text-primary animate-count-up">{formatCurrency(displayBalance, currency)}</p>
          {trend && trendPercentage && (
            <div className="flex items-center justify-center gap-1">
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {trendPercentage}% vs mes anterior
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
