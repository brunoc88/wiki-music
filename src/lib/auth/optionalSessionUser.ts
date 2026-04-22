import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

const getOptionalSessionUser = async () => {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) return null

    const id = Number(session.user.id)

    if (Number.isNaN(id)) return null

    return {
        id,
        rol: session.user.rol
    }
}

export default getOptionalSessionUser