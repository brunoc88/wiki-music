import errorHandler from "@/error/errorHandler"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import ArtistRegisterSchema from "@/lib/schemas/artist/artist.create.shcema"
import { validateRequest } from "@/lib/validateRequest"
import { artistService } from "@/services/artist.service"
import { NextResponse } from "next/server"

export const PUT = async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const userId = await requireSessionUserId()
        
        const {id} = await params
        const artistId = Number(id)

        const validation = await validateRequest(req, ArtistRegisterSchema)
        if(!validation.success) return validation.response

        const res = await artistService.updateArtist(validation.data, validation.file, artistId, userId)
        return NextResponse.json(res, {status:200})
    } catch (error) {
        return errorHandler(error)
    }
}