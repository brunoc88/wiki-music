"use client"

import { ErrorProvider } from "@/context/ErrorContext"
import './style.css'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorProvider>
      {children}
    </ErrorProvider>
  )
}
