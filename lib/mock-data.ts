import type { User, Expense, CreditCard } from "./types"

export const mockUser: User = {
  id: "1",
  email: "usuario@example.com",
  name: "María García",
  monthly_salary: 150000,
  preferred_currency: "ARS",
  created_at: new Date(),
  updated_at: new Date(),
}

export const mockCreditCards: CreditCard[] = [
  {
    id: "1",
    user_id: "1",
    name: "BBVA Visa",
    bank: "BBVA",
    brand: "visa",
    closing_day: 15,
    payment_day: 5,
    credit_limit: 200000,
    benefits: [
      {
        id: "1",
        card_id: "1",
        description: "25% descuento en Farmacity",
        day_of_week: 1, // Monday
        merchant: "Farmacity",
        discount_percentage: 25,
      },
    ],
    color: "#1e40af",
    created_at: new Date(),
  },
  {
    id: "2",
    user_id: "1",
    name: "Santander Mastercard",
    bank: "Santander",
    brand: "mastercard",
    closing_day: 20,
    payment_day: 10,
    credit_limit: 150000,
    benefits: [],
    color: "#dc2626",
    created_at: new Date(),
  },
]

export const mockExpenses: Expense[] = [
  {
    id: "1",
    user_id: "1",
    description: "Supermercado Coto",
    amount: 15000,
    currency: "ARS",
    category: "Comida",
    expense_type: "single",
    payment_method: "debit",
    date: new Date(),
    is_shared: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "2",
    user_id: "1",
    description: "Netflix",
    amount: 2500,
    currency: "ARS",
    category: "Entretenimiento",
    expense_type: "subscription",
    payment_method: "credit",
    card_id: "1",
    date: new Date(Date.now() - 86400000), // Yesterday
    is_shared: true,
    subscription_data: {
      service_name: "Netflix",
      billing_day: 15,
      is_active: true,
    },
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "3",
    user_id: "1",
    description: "iPhone 15",
    amount: 120000,
    currency: "ARS",
    category: "Otros",
    expense_type: "installment",
    payment_method: "credit",
    card_id: "2",
    date: new Date(Date.now() - 172800000), // 2 days ago
    is_shared: false,
    installment_data: {
      total_amount: 120000,
      installment_value: 10000,
      total_installments: 12,
      current_installment: 3,
      first_payment_date: new Date(Date.now() - 5184000000), // 2 months ago
    },
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "4",
    user_id: "1",
    description: "Uber",
    amount: 3500,
    currency: "ARS",
    category: "Transporte",
    expense_type: "single",
    payment_method: "credit",
    card_id: "1",
    date: new Date(Date.now() - 259200000), // 3 days ago
    is_shared: false,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    id: "5",
    user_id: "1",
    description: "Spotify",
    amount: 1200,
    currency: "ARS",
    category: "Entretenimiento",
    expense_type: "subscription",
    payment_method: "credit",
    card_id: "1",
    date: new Date(Date.now() - 345600000), // 4 days ago
    is_shared: false,
    subscription_data: {
      service_name: "Spotify",
      billing_day: 10,
      is_active: true,
    },
    created_at: new Date(),
    updated_at: new Date(),
  },
]
