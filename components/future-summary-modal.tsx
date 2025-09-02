"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { useExpenseStore } from "@/lib/store"
import { formatCurrency } from "@/lib/utils"

export function FutureSummaryModal() {
  const { expenses } = useExpenseStore()
  const [isOpen, setIsOpen] = useState(false)

  const getNextMonthProjection = () => {
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    const subscriptions = expenses.filter(
      (expense) => expense.expense_type === "subscription" && expense.subscription_data?.is_active,
    )

    const pendingInstallments = expenses.filter((expense) => {
      if (expense.expense_type !== "installment" || !expense.installment_data) return false
      return expense.installment_data.current_installment < expense.installment_data.total_installments
    })

    const sharedObligations = expenses.filter((expense) => expense.is_shared && expense.expense_type === "subscription")

    return {
      subscriptions,
      pendingInstallments,
      sharedObligations,
      totalARS: [...subscriptions, ...pendingInstallments].reduce(
        (sum, expense) => sum + (expense.currency === "ARS" ? expense.amount : 0),
        0,
      ),
      totalUSD: [...subscriptions, ...pendingInstallments].reduce(
        (sum, expense) => sum + (expense.currency === "USD" ? expense.amount : 0),
        0,
      ),
    }
  }

  const projection = getNextMonthProjection()

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start h-auto p-4 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div className="text-left">
              <p className="font-medium">Ver Resumen Futuro</p>
              <p className="text-sm text-muted-foreground">Proyección del próximo mes</p>
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resumen Futuro - Próximo Mes</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="pesos" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pesos">Pesos</TabsTrigger>
            <TabsTrigger value="dolares">Dólares</TabsTrigger>
          </TabsList>

          <TabsContent value="pesos" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Total Proyectado en ARS</h3>
              <p className="text-2xl font-bold text-primary">{formatCurrency(projection.totalARS, "ARS")}</p>
            </Card>

            <div className="space-y-3">
              <h4 className="font-medium">Suscripciones Activas</h4>
              {projection.subscriptions
                .filter((s) => s.currency === "ARS")
                .map((subscription) => (
                  <div key={subscription.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm">{subscription.description}</span>
                    <span className="font-medium">{formatCurrency(subscription.amount, "ARS")}</span>
                  </div>
                ))}

              <h4 className="font-medium mt-4">Cuotas Pendientes</h4>
              {projection.pendingInstallments
                .filter((i) => i.currency === "ARS")
                .map((installment) => (
                  <div key={installment.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <div>
                      <span className="text-sm">{installment.description}</span>
                      <p className="text-xs text-muted-foreground">
                        Cuota {(installment.installment_data?.current_installment || 0) + 1}/
                        {installment.installment_data?.total_installments}
                      </p>
                    </div>
                    <span className="font-medium">{formatCurrency(installment.amount, "ARS")}</span>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="dolares" className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Total Proyectado en USD</h3>
              <p className="text-2xl font-bold text-primary">{formatCurrency(projection.totalUSD, "USD")}</p>
            </Card>

            <div className="space-y-3">
              <h4 className="font-medium">Suscripciones Activas</h4>
              {projection.subscriptions
                .filter((s) => s.currency === "USD")
                .map((subscription) => (
                  <div key={subscription.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm">{subscription.description}</span>
                    <span className="font-medium">{formatCurrency(subscription.amount, "USD")}</span>
                  </div>
                ))}

              <h4 className="font-medium mt-4">Cuotas Pendientes</h4>
              {projection.pendingInstallments
                .filter((i) => i.currency === "USD")
                .map((installment) => (
                  <div key={installment.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <div>
                      <span className="text-sm">{installment.description}</span>
                      <p className="text-xs text-muted-foreground">
                        Cuota {(installment.installment_data?.current_installment || 0) + 1}/
                        {installment.installment_data?.total_installments}
                      </p>
                    </div>
                    <span className="font-medium">{formatCurrency(installment.amount, "USD")}</span>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
