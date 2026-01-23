import UserRegisterSchema from "@/lib/schemas/user/user.schema"
import errorHandler from "@/error/errorHandler"
import { userService } from "@/services/user.service"
import { NextResponse } from "next/server"
import requireSessionUserId from "@/lib/auth/requireSessionUserId"
import userDeleteAccountSchema from "@/lib/schemas/user/user.deleteAccount.schema"

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

    return NextResponse.json({ user: res }, { status: 201 })
  } catch (error) {
    return errorHandler(error)
  }
}

export const DELETE = async (req: Request) => {
  try {
    let userId = await requireSessionUserId()

    const data = await req.json()

    const parsed = await userDeleteAccountSchema.safeParseAsync(data)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })

    let { password } = parsed.data

    const res = await userService.deleteAccount(password, userId)
    return NextResponse.json(res, { status: 200 })

  } catch (error) {
    return errorHandler(error)
  }
}