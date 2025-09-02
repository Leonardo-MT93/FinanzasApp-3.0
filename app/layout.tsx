import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Personal expense tracking application",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
