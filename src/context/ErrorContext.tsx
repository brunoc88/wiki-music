import { createContext, ReactNode, useContext, useState } from "react"

type ErrorContextType = {
  errors: Record<string, string[]>
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string[]>>>
}

const ErrorContext = createContext<ErrorContextType | null>(null)

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  return (
    <ErrorContext.Provider value={{ errors, setErrors }}>
      {children}
    </ErrorContext.Provider>
  )
}

export const useError = () => {
  const context = useContext(ErrorContext)

  if (!context) {
    throw new Error("useError must be used within an ErrorProvider")
  }

  return context
}
