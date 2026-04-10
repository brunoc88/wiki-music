import errorHandler from "@/error/errorHandler"
import getOptionalSessionUser from "@/lib/auth/optionalSessionUser"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import { albumService } from "@/services/album.service"
import { NextResponse } from "next/server"

export const PATCH = async (req:Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const userId = await requireSessionUserId()

        const {id} = await params
        const albumId = Number(id)

        await albumService.toggleAlbum(userId, albumId)

        return NextResponse.json({ok:true},{status:200})

    } catch (error) {
        return errorHandler(error)
    }
}

export const GET = async (req: Request, { params }: { params: Promise<{ id: string }> }) =>{
    try {
        const user = await getOptionalSessionUser()
        const {id} = await params
        const albumId = Number(id)

        const res = await albumService.getAlbumById(albumId, user?.id)
        return NextResponse.json(res, {status:200})
    } catch (error) {
        return errorHandler(error)
    }
}