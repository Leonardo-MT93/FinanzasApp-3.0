"use client"

import type { CreditCard } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CreditCardVisualProps {
  card: CreditCard
  isSelected?: boolean
  onClick?: () => void
}

export function CreditCardVisual({ card, isSelected, onClick }: CreditCardVisualProps) {
  const getBrandLogo = (brand: string) => {
    switch (brand) {
      case "visa":
        return "VISA"
      case "mastercard":
        return "MC"
      case "amex":
        return "AMEX"
      default:
        return brand.toUpperCase()
    }
  }

  return (
    <div
      className={cn(
        "relative w-full h-48 rounded-xl p-6 text-white cursor-pointer transition-all duration-300 shadow-lg",
        isSelected && "ring-2 ring-primary ring-offset-2 scale-105",
        onClick && "hover:scale-102 active:scale-98",
      )}
      style={{
        background: `linear-gradient(135deg, ${card.color}, ${card.color}dd)`,
      }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-sm opacity-80">{card.bank}</p>
          <p className="font-semibold text-lg">{card.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-80 font-mono">{getBrandLogo(card.brand)}</p>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs opacity-80">Cierre</p>
            <p className="font-medium">Día {card.closing_day}</p>
          </div>
          <div>
            <p className="text-xs opacity-80">Vencimiento</p>
            <p className="font-medium">Día {card.payment_day}</p>
          </div>
        </div>
      </div>

      {/* Card chip decoration */}
      <div className="absolute top-16 left-6 w-8 h-6 bg-white/20 rounded-sm" />
    </div>
  )
}
