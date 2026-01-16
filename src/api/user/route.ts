import UserRegisterSchema from "@/lib/schemas/user/user.schema"
import { userService } from "@/services/user.service"
import { NextResponse } from "next/server"

export const POST = async (req: Request, res: Response) => {
    try {
        const data = await req.json()

        const parsed = await UserRegisterSchema.safeParseAsync(data)
        if (!parsed.success) {
            return NextResponse.json({
                error: parsed.error.flatten().fieldErrors
            }, { status: 400 })
        }

        const user = await userService.create(parsed.data)

        return NextResponse.json({ msj: 'usuario creado', user }, { status: 201 })
    } catch (error) {
        console.log(error)
    }
}