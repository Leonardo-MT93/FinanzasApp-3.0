"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SingleExpenseForm } from "@/components/single-expense-form"
import { InstallmentForm } from "@/components/installment-form"
import { SubscriptionForm } from "@/components/subscription-form"
import { useExpenseStore } from "@/lib/store"
import type { Expense } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AddExpensePage() {
  const router = useRouter()
  const { addExpense, user } = useExpenseStore()
  const [activeTab, setActiveTab] = useState("single")

  const handleExpenseSubmit = (expenseData: Omit<Expense, "id" | "user_id" | "created_at" | "updated_at">) => {
    const expense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      user_id: user?.id || "1",
      created_at: new Date(),
      updated_at: new Date(),
    }

    addExpense(expense)
    router.push("/")
  }

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold text-foreground">Agregar Gasto</h1>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single" className="text-sm">
            Gasto Único
          </TabsTrigger>
          <TabsTrigger value="installment" className="text-sm">
            Cuotas
          </TabsTrigger>
          <TabsTrigger value="subscription" className="text-sm">
            Suscripción
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="animate-slide-up">
          <SingleExpenseForm onSubmit={handleExpenseSubmit} />
        </TabsContent>

        <TabsContent value="installment" className="animate-slide-up">
          <InstallmentForm onSubmit={handleExpenseSubmit} />
        </TabsContent>

        <TabsContent value="subscription" className="animate-slide-up">
          <SubscriptionForm onSubmit={handleExpenseSubmit} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
