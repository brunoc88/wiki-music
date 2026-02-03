import { AuthorizeInput } from "@/types/user.types";
import { signIn } from "next-auth/react";

export const loginUser = async (data: AuthorizeInput) => {
    let { user, password } = data
    const res = await signIn("credentials", {
        user,
        password,
        redirect: false,
        callbackUrl: "/home"
    })

    if (!res?.ok) return { error: 'credenciales invalidas' }
    return { ok: true }
}