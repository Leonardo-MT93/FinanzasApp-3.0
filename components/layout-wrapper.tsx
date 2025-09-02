"use client"

import type React from "react"
import { useEffect } from "react"

import { BottomNavigation } from "./bottom-navigation"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <main className="pb-20 safe-area-top">{children}</main>
      <BottomNavigation />
    </div>
  )
}
