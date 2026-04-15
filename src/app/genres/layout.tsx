"use client"

import { ErrorProvider } from "@/context/ErrorContext"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorProvider>
      {children}
    </ErrorProvider>
  )
}
