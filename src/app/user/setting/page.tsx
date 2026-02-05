"use client"

import UserInputs from "@/components/UserInputs"
import React, { useState, useEffect } from "react"
import { EditUserFront } from "@/types/user.types"
import { useError } from "@/context/ErrorContext"
import handleForm from "./handleForm"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const SettingPage = () => {
    const [user, setUser] = useState<EditUserFront>({
        username:'', securityQuestion:'',securityAnswer:'', password:'',password2:''
    })
    const [mode, setMode] = useState<string>("")
    const { setErrors } = useError()
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login")
        }
    }, [status, router])



    const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        setUser(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        const res = await handleForm(user, mode)
        if (res?.ok) setUser(user.username = res?.username)
        else setErrors(res?.error)
    }

    
    if (status === "loading") {
        return <p>loading...</p>
    }
    return (
        <div>
            <h1>Configuracion de la cuenta</h1>
            <p>Podras editar datos de tu cuenta.</p>
            <ul>
                <li>
                    Cambiar nombre de usuario.
                    <button onClick={() => setMode('username')}>Cambiar nombre</button>
                </li>
                <li>
                    Pregunta & respuesta de seguridad.
                    <button onClick={() => setMode('security')}>Editar</button>
                </li>
                <li>
                    Cambiar password.
                    <button onClick={() => setMode('password')}>Cambiar</button>
                </li>
                <li>
                    Eliminar cuenta.
                    <button onClick={() => setMode('delete')}>Eliminar</button>
                </li>
            </ul>

            <form onSubmit={handleSubmit}>
                <UserInputs handleUser={handleUser} mode={mode} />
            </form>
        </div>
    )
}

export default SettingPage