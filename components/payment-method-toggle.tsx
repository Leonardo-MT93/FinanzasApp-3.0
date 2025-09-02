"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { PaymentMethod } from "@/lib/types"

interface PaymentMethodToggleProps {
  paymentMethod: PaymentMethod
  onPaymentMethodChange: (method: PaymentMethod) => void
}

export function PaymentMethodToggle({ paymentMethod, onPaymentMethodChange }: PaymentMethodToggleProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Método de Pago</label>
      <div className="flex rounded-lg border border-border p-1 bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onPaymentMethodChange("credit")}
          className={cn(
            "flex-1 h-8 text-sm font-medium transition-all",
            paymentMethod === "credit"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Crédito
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onPaymentMethodChange("debit")}
          className={cn(
            "flex-1 h-8 text-sm font-medium transition-all",
            paymentMethod === "debit"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Débito
        </Button>
      </div>
    </div>
  )
}
