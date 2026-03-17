import errorHandler from "@/error/errorHandler"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import { UpdateAlbumSchema } from "@/lib/schemas/album/album.edit.schema"
import { validateRequest } from "@/lib/validateRequest"
import { albumService } from "@/services/album.service"
import { NextResponse } from "next/server"

export const PATCH = async(req:Request, context:{params:{id:string}}) => {
    try {
        const userId = await requireSessionUserId()

        let albumId = Number(context.params.id)

        const validation = await validateRequest(req, UpdateAlbumSchema)
        if(!validation.success) return validation.response

        const res = await albumService.updateAlbum(validation.data, albumId, userId, validation.file)

        return NextResponse.json(res,{status:200})
    } catch (error) {
        return errorHandler(error)
    }
}