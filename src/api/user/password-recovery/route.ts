import errorHandler from "@/error/errorHandler";
import { NextResponse } from "next/server";
import userPasswordRecoverySchema from "@/lib/schemas/user/user.password-recovery";
import { userService } from "@/services/user.service";

export const PATCH = async (req:Request) => {
    try {
        const data = await req.json()

        const parsed = await userPasswordRecoverySchema.safeParseAsync(data)
        if(!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })

        const res = await userService.passwordRecovery(parsed.data)

        return NextResponse.json(res, {status:200})
    } catch (error) {
        return errorHandler(error)
    }
}