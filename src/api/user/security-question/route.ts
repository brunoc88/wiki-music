import errorHandler from "@/error/errorHandler"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import userSecurtiyQuestionSchema from "@/lib/schemas/user/user.questionSecurity.schema"
import { userService } from "@/services/user.service"
import { NextResponse } from "next/server"

export const PATCH = async (req: Request) => {
    try {
        const userId = await requireSessionUserId()

        const data = await req.json()

        const parsed = await userSecurtiyQuestionSchema.safeParseAsync(data)
        if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })

        const res = await userService.securityQuestionUpdate(parsed.data, userId)

        return NextResponse.json(res, { status: 200 })
    } catch (error) {
        return errorHandler(error)
    }
}