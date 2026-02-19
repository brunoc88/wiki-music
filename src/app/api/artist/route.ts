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

        const formData = await req.formData()
        const file: File | null = formData.get('file') as File

        const res = await artistService.createArtist(validation.data, userId, file)

        return NextResponse.json(res, {status:201})
    } catch (error) {
        return errorHandler(error)
    }
}