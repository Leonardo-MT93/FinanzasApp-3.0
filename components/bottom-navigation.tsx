"use client"

import { Home, Plus, CreditCard, Receipt, BarChart3 } from "lucide-react"
import { useExpenseStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { id: "/", icon: Home, label: "Inicio" },
  { id: "/expenses", icon: Receipt, label: "Gastos" },
  { id: "/add", icon: Plus, label: "Agregar", isCenter: true },
  { id: "/analytics", icon: BarChart3, label: "Análisis" },
  { id: "/cards", icon: CreditCard, label: "Tarjetas" },
]

export function BottomNavigation() {
  const { activeTab, setActiveTab } = useExpenseStore()
  const router = useRouter()

  const handleNavigation = (path: string) => {
    setActiveTab(path)
    router.push(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border safe-area-bottom z-50">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 touch-manipulation",
                item.isCenter
                  ? "bg-primary text-primary-foreground shadow-lg scale-110 -mt-2"
                  : isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                size={item.isCenter ? 28 : 24}
                className={cn("transition-transform duration-200", isActive && !item.isCenter && "scale-110")}
              />
              <span
                className={cn(
                  "text-xs mt-1 transition-opacity duration-200",
                  item.isCenter ? "font-medium" : "font-normal",
                  isActive || item.isCenter ? "opacity-100" : "opacity-70",
                )}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
