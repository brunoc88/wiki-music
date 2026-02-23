import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import { artistService } from "@/services/artist.service"
import errorHandler from "@/error/errorHandler"
import { NextResponse } from "next/server"

export const DELETE = async (context: { params: { id: string } }) => {
    try {
        const userId = await requireSessionUserId()

        let { id } = await context.params
        let artistId = Number(id)

        const res = await artistService.deleteArtist(artistId, userId)
        
        return NextResponse.json(res,{status:200})
    } catch (error) {
        return errorHandler(error)
    }
}