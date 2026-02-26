import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import { artistService } from "@/services/artist.service"
import errorHandler from "@/error/errorHandler"
import { NextResponse } from "next/server"

export const PATCH = async (request: Request, context: {params:{id:string}}) => {
    try {
        const userId = await requireSessionUserId()

        const {id} = context.params
        const artistId = Number(id)

        const res = await artistService.reactiveArtist(artistId, userId)
        return NextResponse.json(res, {status:200})

    } catch (error) {
        return errorHandler(error)
    }
}