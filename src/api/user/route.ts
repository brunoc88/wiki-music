import UserRegisterSchema from "@/lib/schemas/user/user.schema"
import errorHandler from "@/middlewares/errorHandler"
import { userService } from "@/services/user.service"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    try {
        const data = await req.json()

        const parsed = await UserRegisterSchema.safeParseAsync(data)
        if (!parsed.success) {
            return NextResponse.json({
                error: parsed.error.flatten().fieldErrors
            }, { status: 400 })
        }

        const res = await userService.create(parsed.data)

        let user = {
            id: res.id,
            email: res.email,
            username: res.username,
            pic: res.pic
        }
        return NextResponse.json({ msj: 'usuario creado', user }, { status: 201 })
    } catch (error) {
        return errorHandler(error)
    }
}