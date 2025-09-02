import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Expense, CreditCard } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: "ARS" | "USD" = "ARS"): string {
  const symbol = currency === "ARS" ? "$" : "US$"
  return `${symbol}${amount.toLocaleString("es-AR")}`
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - dateObj.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return "Hoy"
  if (diffDays === 2) return "Ayer"
  if (diffDays <= 7) return `Hace ${diffDays - 1} días`

  return dateObj.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  })
}

export function getCardPaymentDaysLeft(card: CreditCard): number {
  const today = new Date()
  const currentDay = today.getDate()
  const paymentDay = card.payment_day

  if (currentDay <= paymentDay) {
    return paymentDay - currentDay
  } else {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, paymentDay)
    const diffTime = nextMonth.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}

export function getCardClosingDaysLeft(card: CreditCard): number {
  const today = new Date()
  const currentDay = today.getDate()
  const closingDay = card.closing_day

  if (currentDay <= closingDay) {
    return closingDay - currentDay
  } else {
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, closingDay)
    const diffTime = nextMonth.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }
}

export function getCardStatusColor(daysLeft: number): string {
  if (daysLeft <= 3) return "text-red-500"
  if (daysLeft <= 7) return "text-yellow-500"
  return "text-green-500"
}

export function getDayOfWeekName(dayIndex: number): string {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  return days[dayIndex]
}

export function getTodaysBenefits(cards: CreditCard[]): Array<{ card: CreditCard; benefit: any }> {
  const today = new Date().getDay()
  const benefits: Array<{ card: CreditCard; benefit: any }> = []

  cards.forEach((card) => {
    card.benefits.forEach((benefit) => {
      if (benefit.day_of_week === today) {
        benefits.push({ card, benefit })
      }
    })
  })

  return benefits
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    Comida: "🍕",
    Transporte: "🚗",
    Entretenimiento: "🎬",
    Salud: "🏥",
    Compras: "🛍️",
    Servicios: "💡",
    Educación: "📚",
    Otros: "📦",
  }
  return icons[category] || "📦"
}

export function getExpenseTypeLabel(expense: Expense): string {
  if (expense.expense_type === "installment" && expense.installment_data) {
    return `Cuota ${expense.installment_data.current_installment}/${expense.installment_data.total_installments}`
  }
  if (expense.expense_type === "subscription") {
    return "sub"
  }
  if (expense.is_shared) {
    return "👥"
  }
  return ""
}
