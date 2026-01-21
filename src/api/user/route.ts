import UserRegisterSchema from "@/lib/schemas/user/user.schema"
import errorHandler from "@/error/errorHandler"
import { userService } from "@/services/user.service"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
  try {

    const formData = await req.formData()

    let data = {
      email: formData.get("email")?.toString() || "",
      username: formData.get("username")?.toString() || "",
      password: formData.get("password")?.toString() || "",
      password2: formData.get("password2")?.toString() || "",
      securityQuestion: formData.get("securityQuestion")?.toString() || "",
      securityAnswer: formData.get("securityAnswer")?.toString() || ""
    }
    const file: File | null = formData.get('file') as File

    
    const parsed = await UserRegisterSchema.safeParseAsync(data)
    if (!parsed.success) {
      return NextResponse.json({
        error: parsed.error.flatten().fieldErrors
      }, { status: 400 })
    }

    
    const res = await userService.create(parsed.data, file)

    
    const user = {
      id: res.id,
      email: res.email,
      username: res.username,
      pic: res.pic,
      picPublicId: res.picPublicId
    }

    return NextResponse.json({ msj: "usuario creado", user }, { status: 201 })
  } catch (error) {
    return errorHandler(error)
  }
}