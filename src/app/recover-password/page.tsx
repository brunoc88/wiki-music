"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import handleForm from "./handleform"

export default function RecoverPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setError("Token inválido o ausente")
      return
    }

    const res = await handleForm(
      { newPassword: password, token },
      "recovery-confirm"
    )

    if (!res?.ok) {
      setError("Token inválido o credenciales inválidas")
      return
    }

    router.push("/auth/login")
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>Ingrese su nuevo password:</p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Enviar</button>
      </form>

      {error && <p>{error}</p>}

      <button onClick={() => router.push("/auth/login")}>
        Volver
      </button>
    </div>
  )
}
