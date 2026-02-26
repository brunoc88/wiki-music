import errorHandler from "@/error/errorHandler"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import ArtistRegisterSchema from "@/lib/schemas/artist/artist.create.shcema"
import { validateRequest } from "@/lib/validateRequest"
import { artistService } from "@/services/artist.service"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    try {
        const userId = await requireSessionUserId()

        const validation = await validateRequest(req, ArtistRegisterSchema)
        if (!validation.success) return validation.response

        const res = await artistService.createArtist(
            validation.data,
            userId,
            validation.file
        )

        return NextResponse.json(res, { status: 201 })
    } catch (error) {
        return errorHandler(error)
    }
}

export const PUT = async (req: Request, context:{params:{id:number}}) => {
    try {
        const userId = await requireSessionUserId()
        
        const {id} = context.params
        const artistId = Number(id)

        const validation = await validateRequest(req, ArtistRegisterSchema)
        if(!validation.success) return validation.response

        const res = await artistService.updateArtist(validation.data, validation.file, artistId, userId)
        return NextResponse.json(res, {status:200})
    } catch (error) {
        return errorHandler(error)
    }
}