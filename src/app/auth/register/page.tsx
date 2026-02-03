"use client"

import UserInputs from '@/components/UserInputs'
import { useState } from 'react'
import { RegisterUserFront } from '@/types/user.types'
import { handleForm } from './handleForm'
import './style.css'

const UserRegisterForm = () => {
    let [user, setUser] = useState<RegisterUserFront>({ email: '', username: "", securityQuestion: "", securityAnswer: "", password: "", password2: "" })

    const [errors, setErrors] = useState<Record<string, string[]>>({})

    const handleUser = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setUser(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("email", user.email)
        formData.append("username", user.username)
        formData.append("password", user.password)
        formData.append("password2", user.password2)
        formData.append("securityQuestion", user.securityQuestion)
        formData.append("securityAnswer", user.securityAnswer)

        const fileInput = e.currentTarget.elements.namedItem("file") as HTMLInputElement
        if (fileInput.files?.[0]) {
            formData.append("file", fileInput.files[0])
        }

        const result = await handleForm(formData)

        if (result?.error) {
            setErrors(result.error)
            return
        }
    }

    return (
        <div className='container'>
            <form onSubmit={handleSubmit}>
                <UserInputs handleUser={handleUser} errors={errors} mode={'register'} />
            </form>
        </div>
    )
}

export default UserRegisterForm