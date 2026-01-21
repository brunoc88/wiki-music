import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import ChangePasswordSchema from "@/lib/schemas/user/user.editpassword.schema"
import errorHandler from "@/middlewares/errorHandler"
import { userService } from "@/services/user.service"
import { NextResponse } from "next/server"

export const PATCH = async (req: Request) => {
    try {
        const userId = await requireSessionUserId()

        const data = await req.json()

        const parsed = await ChangePasswordSchema.safeParseAsync(data)
        if (!parsed.success) return NextResponse.json({
            error: parsed.error.flatten().fieldErrors
        }, { status: 400 })


        await userService.changePassword(parsed.data, userId)

        return NextResponse.json({ ok: true }, { status: 200 })

    } catch (error) {
        return errorHandler(error)
    }
}