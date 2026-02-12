"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import handleForm from "./handleform"

export default function RecoverPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<boolean>(false)

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

    console.log('res',res)

    if (!res?.ok) {
      if(res.status === 403)setError("Token inválido o credenciales inválidas")
      else setError(res.error.newPassword)
      return
    }

    setOk(true)

  }

  if (ok) return (
    <div>
      <p>Recuperacion de password Exitoso</p>
      <button onClick={()=>router.push('/auth/login')}>Salir</button>
    </div>
  )
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Vencimiento del token: en 15 minutos.</h3>
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
