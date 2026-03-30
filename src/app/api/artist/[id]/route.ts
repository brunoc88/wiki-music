import { BadRequestError } from "@/error/appError"
import errorHandler from "@/error/errorHandler"
import { artistService } from "@/services/artist.service"
import { NextResponse } from "next/server"


export const GET = async (req: Request,
    { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params

        const artistId = Number(id)

        if (isNaN(artistId)) {
            throw new BadRequestError("Invalid ID")
        }

        const res = await artistService.getArtistById(artistId)
        return NextResponse.json(res, { status: 200 })
    } catch (error) {
        return errorHandler(error)
    }
}