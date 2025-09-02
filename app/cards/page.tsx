"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, Edit, Trash2, Gift } from "lucide-react"
import { CreditCardVisual } from "@/components/credit-card-visual"
import { AddCardForm } from "@/components/add-card-form"
import { AddBenefitForm } from "@/components/add-benefit-form"
import { TodaysBenefits } from "@/components/todays-benefits"
import { DueDateCalendar } from "@/components/due-date-calendar"
import { useExpenseStore } from "@/lib/store"
import { formatCurrency, getCardClosingDaysLeft, getCardPaymentDaysLeft } from "@/lib/utils"
import type { CreditCard } from "@/lib/types"

export default function CardsPage() {
  const { creditCards, deleteCreditCard } = useExpenseStore()
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(creditCards[0] || null)
  const [showAddCard, setShowAddCard] = useState(false)
  const [showAddBenefit, setShowAddBenefit] = useState(false)
  const [benefitCardId, setBenefitCardId] = useState<string>("")

  const getTotalDebt = () => {
    return creditCards.reduce((total, card) => {
      // Calculate debt based on expenses for this card
      return total + 0 // Simplified for now
    }, 0)
  }

  const handleAddBenefit = (cardId: string) => {
    setBenefitCardId(cardId)
    setShowAddBenefit(true)
  }

  return (
    <div className="p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Tarjetas</h1>
        <Button onClick={() => setShowAddCard(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
      </header>

      <TodaysBenefits cards={creditCards} />

      {creditCards.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground mb-4">No tienes tarjetas agregadas</p>
          <Button onClick={() => setShowAddCard(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primera Tarjeta
          </Button>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            <h2 className="font-semibold text-foreground">Mis Tarjetas</h2>
            <div className="space-y-3">
              {creditCards.map((card) => (
                <Card
                  key={card.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedCard?.id === card.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedCard(card)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">
                        {card.bank} – {card.brand.toUpperCase()}
                      </h3>
                      {/* <p className="text-sm text-muted-foreground">**** {card.last_four_digits}</p> */}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddBenefit(card.id)
                        }}
                      >
                        <Gift className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Edit functionality would go here
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteCreditCard(card.id)
                          if (selectedCard?.id === card.id) {
                            setSelectedCard(creditCards.filter((c) => c.id !== card.id)[0] || null)
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Fecha de Cierre</p>
                      <p className="font-semibold text-sm">Día {card.closing_day}</p>
                      <p className="text-xs text-muted-foreground">({getCardClosingDaysLeft(card)} días restantes)</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fecha de Vencimiento</p>
                      <p className="font-semibold text-sm">Día {card.payment_day}</p>
                      <p className="text-xs text-muted-foreground">({getCardPaymentDaysLeft(card)} días restantes)</p>
                    </div>
                  </div> */}
                </Card>
              ))}
            </div>
          </div>

          {/* Selected Card Details */}
          {selectedCard && (
            <div className="space-y-4">
              <h2 className="font-semibold text-foreground">
                Detalles de {selectedCard.bank} {selectedCard.brand.toUpperCase()}
              </h2>

              {/* Card Visual */}
              <CreditCardVisual card={selectedCard} isSelected={true} />

              {/* Benefits Section */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">Beneficios</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddBenefit(selectedCard.id)}
                    className="bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                </div>

                {selectedCard.benefits.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No hay beneficios configurados</p>
                ) : (
                  <div className="space-y-2">
                    {selectedCard.benefits.map((benefit) => (
                      <div key={benefit.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{benefit.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {benefit.day_of_week !== undefined && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][benefit.day_of_week]}
                              </span>
                            )}
                            {benefit.merchant && (
                              <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                                {benefit.merchant}
                              </span>
                            )}
                          </div>
                        </div>
                        {benefit.discount_percentage && (
                          <span className="font-bold text-green-600">{benefit.discount_percentage}%</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* <DueDateCalendar cards={creditCards} /> */}

          {/* Total Debt Summary */}
          {/* <Card className="p-4">
            <h3 className="font-semibold text-foreground mb-4">Resumen de Deuda</h3>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Deuda Total del Mes</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(getTotalDebt())}</p>
            </div>
          </Card> */}
        </>
      )}

      <AddCardForm isOpen={showAddCard} onClose={() => setShowAddCard(false)} />
      <AddBenefitForm isOpen={showAddBenefit} onClose={() => setShowAddBenefit(false)} cardId={benefitCardId} />
    </div>
  )
}
