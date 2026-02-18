import errorHandler from "@/error/errorHandler"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import ArtistRegisterSchema from "@/lib/schemas/artist/artist.create.shcema"
import { validateRequest } from "@/lib/validateRequest"

export const POST = async(req:Request) => {
    try {
        const userId = await requireSessionUserId()

        const isValid = await validateRequest(req, ArtistRegisterSchema)
        if(!isValid.success) return isValid.response

    } catch (error) {
        return errorHandler(error)
    }
}