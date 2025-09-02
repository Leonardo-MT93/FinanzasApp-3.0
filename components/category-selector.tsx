"use client"

import { useExpenseStore } from "@/lib/store"
import { cn } from "@/lib/utils"

interface CategorySelectorProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategorySelector({ selectedCategory, onCategoryChange }: CategorySelectorProps) {
  const { categories } = useExpenseStore()

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Categoría</label>
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onCategoryChange(category.name)}
            className={cn(
              "flex flex-col items-center p-3 rounded-lg border-2 transition-all touch-manipulation",
              selectedCategory === category.name
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-card hover:border-primary/50",
            )}
          >
            <span className="text-2xl mb-1">{category.icon}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
