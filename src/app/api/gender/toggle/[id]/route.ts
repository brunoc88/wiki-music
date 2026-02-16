import errorHandler from "@/error/errorHandler"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import { genreService } from "@/services/genre.service"
import { NextResponse } from "next/server"

export const PATCH = async (req: Request, context: { params: Promise<{ id: string }> }) => {
    try {
        const userId = await requireSessionUserId()

        const { id } = await context.params

        let genderId = Number(id)

        const res = await genreService.toggleActive(userId, genderId)

        return NextResponse.json(res,{status:200})
        

    } catch (error) {
        return errorHandler(error)
    }
}