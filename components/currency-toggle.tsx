"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Currency } from "@/lib/types"

interface CurrencyToggleProps {
  currency: Currency
  onCurrencyChange: (currency: Currency) => void
}

export function CurrencyToggle({ currency, onCurrencyChange }: CurrencyToggleProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Moneda</label>
      <div className="flex rounded-lg border border-border p-1 bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onCurrencyChange("ARS")}
          className={cn(
            "flex-1 h-8 text-sm font-medium transition-all",
            currency === "ARS"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          ARS
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onCurrencyChange("USD")}
          className={cn(
            "flex-1 h-8 text-sm font-medium transition-all",
            currency === "USD"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          USD
        </Button>
      </div>
    </div>
  )
}
