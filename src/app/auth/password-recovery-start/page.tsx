"use client"

import UserInputs from "@/components/UserInputs"
import { useError } from "@/context/ErrorContext"
import React, { useState } from "react"
import handleForm from "./handleForm"
import { useRouter } from "next/navigation"


const PasswordRecovery = () => {
    const [user, setUser] = useState<{ email: string, securityQuestion: string, securityAnswer: string }>({ email: "", securityQuestion: "", securityAnswer: "" })
    const { errors, setErrors } = useError()
    const router = useRouter()


    let mode = 'recover'

    const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setUser(prev => ({ ...prev, [name]: value }))

    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        const res = await handleForm(user, mode)

        if (!res.ok) {

            if (res.status === 404) setErrors({ 'securityAnswer': ['usuario no encontrado'] })
            else if (res.status === 403) setErrors({ 'securityAnswer': ['credenciales invalidas'] })
            else setErrors(res.error ?? "error de servidor")
        }

        else router.push('/auth/login')

    }

    return (
        <div>
            <p>Al completar la solicitud reciviras un e-mail.</p>
            <form onSubmit={handleSubmit}>
                <UserInputs handleUser={handleUser} mode={'recover'} />
                {errors.service && <p>{errors.service[0]}</p>}
            </form>
        </div>
    )
}

export default PasswordRecovery