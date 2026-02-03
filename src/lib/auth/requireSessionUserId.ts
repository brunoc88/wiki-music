import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { BadRequestError, UnAuthorizedError } from "@/error/appError"
import { getServerSession } from "next-auth"


const requireSessionUserId = async () => {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) throw new UnAuthorizedError()

    const id = Number(session.user.id)
    if (isNaN(id)) throw new BadRequestError()

    return id
}

export default requireSessionUserId