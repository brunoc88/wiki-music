import errorHandler from "@/error/errorHandler"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import { genreService } from "@/services/genre.service"
import { NextResponse } from "next/server"

export const GET = async(request: Request) => {
    try {
        const userId = await requireSessionUserId()

        const res = await genreService.getActiveGenres(userId)
        return NextResponse.json(res, {status:200})
    } catch (error) {
        return errorHandler(error)
    }
}