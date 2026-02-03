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
        console.log('res', res)
        if (res?.error) setErrors(res.error)
        else router.push("/welcome")

    }



    return (
        <div>
            <form onSubmit={handleForm}>
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