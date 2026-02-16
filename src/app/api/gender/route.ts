import errorHandler from "@/error/errorHandler"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import { validateRequest } from "@/lib/validateRequest"
import genderCreateSchema from "@/lib/schemas/gender/gender.create.schema"
import { genreService } from "@/services/genre.service"
import { NextResponse } from "next/server"


export const POST = async (req: Request) => {
    try {
        
        let userId = await requireSessionUserId()

        const validation = await validateRequest(req, genderCreateSchema)

        if (!validation.success) return validation.response

        
        const res = await genreService.createGenre(validation.data, userId)
        return NextResponse.json(res, {status:201})

    } catch (error) {
        return errorHandler(error)
    }
}