import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

const getOptionalSessionUser = async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user) return null

    return {
        id: Number(session.user.id),
        rol: session.user.rol
    }
}

export default getOptionalSessionUser