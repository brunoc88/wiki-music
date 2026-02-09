"use client"

import UserInputs from "@/components/UserInputs"
import React, { useState, useEffect } from "react"
import { EditUserFront } from "@/types/user.types"
import { useError } from "@/context/ErrorContext"
import handleForm from "./handleForm"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const SettingPage = () => {

    const INITIAL_USER: EditUserFront = {
        username: '',
        securityQuestion: '',
        securityAnswer: '',
        password: '',
        password2: '',
        oldpassword: ''
    }

    const [user, setUser] = useState<EditUserFront>(INITIAL_USER)
    const [mode, setMode] = useState<string>("")
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

        setUser(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        if (!mode) return // nada seleccionado

        const res = await handleForm(user, mode)

        if (res.ok && mode === 'username') {
            setUser(prev => ({
                ...INITIAL_USER,
                username: res?.username
            }))
            await update({
                user: {
                    ...session?.user,
                    name: res?.username
                }
            })

            setMode('')
        }


        if (res?.ok && mode === 'delete') {
            signOut({ callbackUrl: "/auth/login" })
            return
        }

        if (res?.ok && mode === 'password') {
            signOut({ callbackUrl: "/auth/login" })
            return
        }

        if (!res?.ok && res?.error) {
            setErrors(res.error)
            return
        }

        
        if (!res?.ok && res.status === 401) {
            setErrors({
                credentials: ["Tu sesión expiró"]
            })
            signOut({ callbackUrl: "/auth/login" })
            return
        }

        
        if (!res?.ok && res.status === 403) {
            setErrors({
                credentials: ["Tu cuenta fue suspendida"]
            })
            signOut({ callbackUrl: "/auth/login" })
            return
        }

        // IMPORTANTE: HACER UN HANDLEGUARDEDERROR(RES)
        // & UN handleSuccessResponse(mode, res)

       
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
                    <button onClick={() => {
                        setMode('delete')

                        let msj = 'Esta seguro que quiere eliminar su cuenta?'
                        if (!confirm(msj)) {
                            setMode('')
                            return
                        }

                    }}>Eliminar</button>
                </li>
            </ul>

            <form onSubmit={handleSubmit}>
                <UserInputs handleUser={handleUser} mode={mode} />
            </form>
        </div>
    )
}

export default SettingPage