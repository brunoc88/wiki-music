"use client"

import UserInputs from "@/components/UserInputs"
import { AuthorizeInput } from "@/types/user.types"
import React, { useState } from "react"
import { handleLogin } from "./handleLogin"
import { useError } from "@/context/ErrorContext"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

const LoginPage = () => {
    const [user, setUser] = useState<AuthorizeInput>({ user: "", password: "" })
    const { setErrors } = useError()
    const router = useRouter()

    const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target

        setUser(prev => ({ ...prev, [name]: value }))
    }

    const handleGoogleLogin = () => {
        signIn("google", { callbackUrl: "/welcome" })
    }

    const handleForm = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        const res = await handleLogin(user)
        
        if (res?.error) setErrors(res.error)
        else router.push("/welcome")

    }



    return (
        <div className="login-container">
            <div className="message">
                <h1>WikiMusic</h1>
                <p>Encuentra toda la informacion sobre tus artistas favoritos</p>
            </div>
            <form onSubmit={handleForm} className="login-form">
                <UserInputs handleUser={handleUser} mode={'login'} />
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="auth-google-btn"
                >
                    Continuar con Google
                </button>

            </form>
        </div>

    )
}

export default LoginPage