import errorHandler from "@/error/errorHandler"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import { validateRequest } from "@/lib/validateRequest"
import { AlbumSchema } from "@/lib/schemas/album/album.create.schema"
import { albumService } from "@/services/album.service"
import { NextResponse } from "next/server"

export const POST = async(request: Request) => {
    try {
        const userId = await requireSessionUserId()

        const validation = await validateRequest(request, AlbumSchema)
        if(!validation.success) return validation.response

        const res = await albumService.createAlbum(userId, validation.data, validation.file)
        return NextResponse.json(res, {status:201})
    } catch (error) {
        return errorHandler(error)
    }
}