import errorHandler from "@/error/errorHandler"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import { userService } from "@/services/user.service"
import { NextResponse } from "next/server"

export const PATCH = async (req: Request) => {
    try {

        const userId = await requireSessionUserId()

        const formData = await req.formData()

        const file: File | null = formData.get('file') as File

        const res = await userService.changeProfilePic(file, userId)

        return NextResponse.json(res, { status: 200 })
    } catch (error) {
        return errorHandler(error)
    }
}

export const DELETE = async (req:Request) => {
    try {
        const userId = await requireSessionUserId()

        const res = await userService.deleteProfilePic(userId)
        return NextResponse.json(res, {status:200})
    } catch (error) {
        return errorHandler(error)
    }
}