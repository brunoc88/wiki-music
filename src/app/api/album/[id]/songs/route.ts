import errorHandler from "@/error/errorHandler"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import { EditSongsSchema } from "@/lib/schemas/songs/songs.edit.schema"
import { validateRequest } from "@/lib/validateRequest"
import { albumService } from "@/services/album.service"
import { NextResponse } from "next/server"

export const PATCH = async (req:Request, context:{params:{id:string}}) => {
    try {
        const userId = await requireSessionUserId()

        const albumId = Number(context.params.id)

        const validation = await validateRequest(req, EditSongsSchema)
        if(!validation.success) return validation.response

        const res = await albumService.updateSongs(validation.data, albumId, userId)
        return NextResponse.json(res, {status:200})
        
    } catch (error) {
        return errorHandler(error)
    }
}