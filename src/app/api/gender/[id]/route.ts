import errorHandler from "@/error/errorHandler"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import genderCreateSchema from "@/lib/schemas/gender/gender.create.schema"
import { validateRequest } from "@/lib/validateRequest"
import { genreService } from "@/services/genre.service"
import { NextResponse } from "next/server"

export const PATCH = async (request: Request, context: { params: { id: string } }) => {
    try {
        const userId = await requireSessionUserId()

        const parsed = await validateRequest(request, genderCreateSchema)
        if(!parsed.success) return parsed.response

        const { id } = context.params

        let genderId = Number(id)

        const res = await genreService.editGenre(userId, genderId, parsed.data)

        return NextResponse.json(res,{status:200})
        

    } catch (error) {
        return errorHandler(error)
    }
}