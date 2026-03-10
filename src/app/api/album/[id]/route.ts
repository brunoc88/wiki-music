import errorHandler from "@/error/errorHandler"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import { albumService } from "@/services/album.service"
import { NextResponse } from "next/server"

export const PATCH = async (req:Request, context:{params:{id:string}}) => {
    try {
        const userId = await requireSessionUserId()

        const {id} = context.params
        const albumId = Number(id)

        await albumService.toggleAlbum(userId, albumId)

        return NextResponse.json({ok:true},{status:200})

    } catch (error) {
        return errorHandler(error)
    }
}