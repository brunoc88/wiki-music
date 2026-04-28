"use client"

import UserInputs from "@/components/UserInputs"
import React, { useState, useEffect } from "react"
import { EditUserFront } from "@/types/user.types"
import { useError } from "@/context/ErrorContext"
import handleForm from "./handleForm"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import "./style.css"

const SettingPage = () => {
  const INITIAL_USER: EditUserFront = {
    username: "",
    securityQuestion: "",
    securityAnswer: "",
    password: "",
    password2: "",
    oldpassword: "",
  }

  const [user, setUser] = useState<EditUserFront>(INITIAL_USER)
  const [mode, setMode] = useState("")
  const { setErrors } = useError()
  const { data: session, status, update } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, router])

  const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    if (!mode) return

    const res = await handleForm(user, mode)

    if (res.ok && mode === "username") {
      setUser({
        ...INITIAL_USER,
        username: res.username,
      })

      await update({
        user: {
          ...session?.user,
          name: res.username,
        },
      })

      setMode("")
    }

    if (res?.ok && ["delete", "password", "security"].includes(mode)) {
      signOut({ callbackUrl: "/auth/login" })
      return
    }

    if (!res?.ok && res?.error) {
      setErrors(res.error)
      return
    }

    if (!res?.ok && [401, 403].includes(res.status)) {
      signOut({ callbackUrl: "/auth/login" })
      return
    }
  }

  if (status === "loading") return <p>loading...</p>

  return (
    <div className="settings-page">
      <div className="settings-card">
        <div className="settings-head">
          <h1>Configuración de cuenta</h1>
          <p>Gestioná tu perfil y seguridad.</p>
        </div>

        <div className="settings-grid">
          <button onClick={() => setMode("username")} className="setting-item">
            Cambiar nombre de usuario
          </button>

          <button onClick={() => setMode("security")} className="setting-item">
            Pregunta de seguridad
          </button>

          <button onClick={() => setMode("password")} className="setting-item">
            Cambiar contraseña
          </button>

          <button
            onClick={() => {
              setMode("delete")

              const ok = confirm(
                "¿Seguro que deseas eliminar tu cuenta?"
              )

              if (!ok) {
                setMode("")
              }
            }}
            className="setting-item danger"
          >
            Eliminar cuenta
          </button>
        </div>

        {mode && (
          <form onSubmit={handleSubmit} className="settings-form">
            <UserInputs handleUser={handleUser} mode={mode} />
          </form>
        )}
      </div>
    </div>
  )
}

export default SettingPage