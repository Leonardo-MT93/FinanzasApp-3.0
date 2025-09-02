export type Currency = "ARS" | "USD"
export type ExpenseType = "single" | "installment" | "subscription"
export type PaymentMethod = "credit" | "debit"
export type CardBrand = "visa" | "mastercard" | "amex"

export interface User {
  id: string
  email: string
  name: string
  monthly_salary: number
  preferred_currency: Currency
  created_at: Date
  updated_at: Date
}

export interface InstallmentData {
  total_amount: number
  installment_value: number
  total_installments: number
  current_installment: number
  first_payment_date: Date
}

export interface SubscriptionData {
  service_name: string
  billing_day?: number
  is_active: boolean
}

export interface Expense {
  id: string
  user_id: string
  description: string
  amount: number
  currency: Currency
  category: string
  expense_type: ExpenseType
  payment_method: PaymentMethod
  card_id?: string
  date: Date
  is_shared: boolean
  installment_data?: InstallmentData
  subscription_data?: SubscriptionData
  created_at: Date
  updated_at: Date
}

export interface CardBenefit {
  id: string
  card_id: string
  description: string
  day_of_week?: number // 0-6
  merchant?: string
  discount_percentage?: number
}

export interface CreditCard {
  id: string
  user_id: string
  name: string
  bank: string
  brand: CardBrand
  last_four_digits: string
  closing_day: number
  payment_day: number
  credit_limit?: number
  benefits: CardBenefit[]
  color: string
  created_at: Date
}

export interface MonthlyGoal {
  id: string
  user_id: string
  month: number
  year: number
  target_amount: number
  current_amount: number
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}
