import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { User, Expense, CreditCard, MonthlyGoal, Category } from "./types"

interface ExpenseStore {
  // User state
  user: User | null
  setUser: (user: User) => void

  // Expenses state
  expenses: Expense[]
  addExpense: (expense: Expense) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  deleteExpense: (id: string) => void

  // Credit cards state
  creditCards: CreditCard[]
  addCreditCard: (card: CreditCard) => void
  updateCreditCard: (id: string, card: Partial<CreditCard>) => void
  deleteCreditCard: (id: string) => void
  addBenefit: (cardId: string, benefit: any) => void

  // Goals state
  monthlyGoals: MonthlyGoal[]
  setMonthlyGoal: (goal: MonthlyGoal) => void

  // Categories state
  categories: Category[]
  setCategories: (categories: Category[]) => void

  // UI state
  activeTab: string
  setActiveTab: (tab: string) => void

  // Reset month functionality
  resetMonth: () => void
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      expenses: [],
      creditCards: [],
      monthlyGoals: [],
      categories: [
        { id: "1", name: "Comida", icon: "🍕", color: "#f59e0b" },
        { id: "2", name: "Transporte", icon: "🚗", color: "#3b82f6" },
        { id: "3", name: "Entretenimiento", icon: "🎬", color: "#8b5cf6" },
        { id: "4", name: "Salud", icon: "🏥", color: "#10b981" },
        { id: "5", name: "Compras", icon: "🛍️", color: "#ef4444" },
        { id: "6", name: "Servicios", icon: "💡", color: "#f97316" },
        { id: "7", name: "Educación", icon: "📚", color: "#06b6d4" },
        { id: "8", name: "Otros", icon: "📦", color: "#6b7280" },
      ],
      activeTab: "/",

      // Actions
      setUser: (user) => set({ user }),

      addExpense: (expense) =>
        set((state) => ({
          expenses: [
            ...state.expenses,
            { ...expense, date: expense.date instanceof Date ? expense.date : new Date(expense.date) },
          ],
        })),

      updateExpense: (id, updatedExpense) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === id
              ? {
                  ...expense,
                  ...updatedExpense,
                  date: updatedExpense.date
                    ? updatedExpense.date instanceof Date
                      ? updatedExpense.date
                      : new Date(updatedExpense.date)
                    : expense.date,
                }
              : expense,
          ),
        })),

      deleteExpense: (id) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        })),

      addCreditCard: (card) =>
        set((state) => ({
          creditCards: [...state.creditCards, card],
        })),

      updateCreditCard: (id, updatedCard) =>
        set((state) => ({
          creditCards: state.creditCards.map((card) => (card.id === id ? { ...card, ...updatedCard } : card)),
        })),

      deleteCreditCard: (id) =>
        set((state) => ({
          creditCards: state.creditCards.filter((card) => card.id !== id),
        })),

      addBenefit: (cardId, benefit) =>
        set((state) => ({
          creditCards: state.creditCards.map((card) =>
            card.id === cardId ? { ...card, benefits: [...card.benefits, benefit] } : card,
          ),
        })),

      setMonthlyGoal: (goal) =>
        set((state) => ({
          monthlyGoals: state.monthlyGoals
            .filter((g) => !(g.month === goal.month && g.year === goal.year))
            .concat(goal),
        })),

      setCategories: (categories) => set({ categories }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      resetMonth: () =>
        set((state) => ({
          expenses: state.expenses
            .filter((expense) => {
              // Keep active subscriptions
              if (expense.expense_type === "subscription" && expense.subscription_data?.is_active) {
                return true
              }

              // Keep pending installments (advance by 1)
              if (
                expense.expense_type === "installment" &&
                expense.installment_data &&
                expense.installment_data.current_installment < expense.installment_data.total_installments
              ) {
                return true
              }

              // Remove single expenses
              return false
            })
            .map((expense) => {
              // Advance installments
              if (expense.expense_type === "installment" && expense.installment_data) {
                return {
                  ...expense,
                  installment_data: {
                    ...expense.installment_data,
                    current_installment: expense.installment_data.current_installment + 1,
                  },
                }
              }
              return expense
            }),
        })),
    }),
    {
      name: "expense-tracker-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        expenses: state.expenses,
        creditCards: state.creditCards,
        monthlyGoals: state.monthlyGoals,
        categories: state.categories,
        // No persistir activeTab para que siempre inicie en "/"
      }),
      // Configurar rehidratación para manejar fechas
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convertir strings de fecha a objetos Date
          if (state.user?.created_at && typeof state.user.created_at === 'string') {
            state.user.created_at = new Date(state.user.created_at)
          }
          if (state.user?.updated_at && typeof state.user.updated_at === 'string') {
            state.user.updated_at = new Date(state.user.updated_at)
          }
          
          // Convertir fechas en gastos
          state.expenses = state.expenses.map(expense => ({
            ...expense,
            date: new Date(expense.date),
            created_at: new Date(expense.created_at),
            updated_at: new Date(expense.updated_at),
            installment_data: expense.installment_data ? {
              ...expense.installment_data,
              first_payment_date: new Date(expense.installment_data.first_payment_date)
            } : undefined
          }))
          
          // Convertir fechas en tarjetas
          state.creditCards = state.creditCards.map(card => ({
            ...card,
            created_at: new Date(card.created_at)
          }))
        }
      },
    },
  ),
)
