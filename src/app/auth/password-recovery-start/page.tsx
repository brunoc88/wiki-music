"use client"

import UserInputs from "@/components/UserInputs"
import { useError } from "@/context/ErrorContext"
import React, { useState } from "react"
import handleForm from "./handleForm"
import { useRouter } from "next/navigation"
import styles from "./style.module.css"

const PasswordRecovery = () => {
  const [user, setUser] = useState({
    email: "",
    securityQuestion: "",
    securityAnswer: "",
  })

  const { errors, setErrors } = useError()
  const router = useRouter()

  const mode = "recover"

  const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const res = await handleForm(user, mode)

    if (!res.ok) {
      if (res.status === 404) {
        setErrors({ securityAnswer: ["usuario no encontrado"] })
      } else if (res.status === 403) {
        setErrors({ securityAnswer: ["credenciales inválidas"] })
      } else {
        setErrors(res.error ?? { service: ["error de servidor"] })
      }
    } else {
      router.push("/auth/login")
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <h1>Recuperar acceso</h1>
        <p>
          Completá la información y recibirás un e-mail para restablecer tu contraseña.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <UserInputs handleUser={handleUser} mode="recover" />

        {errors.service && (
          <p className={styles.error}>{errors.service[0]}</p>
        )}
      </form>
    </div>
  )
}

export default PasswordRecovery