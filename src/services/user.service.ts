import { userRepo } from "@/repositories/user.repository"
import { RegisterUser } from "@/types/user.types"
import bcrypt from "bcryptjs"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { NotFoundError, ForbiddenError } from "@/error/appError"

export const userService = {
  create: async (data: RegisterUser, imageFile?: File | null) => {
    const hashpassword = await bcrypt.hash(data.password, 10)
    const hashSecurityAnswer = await bcrypt.hash(data.securityAnswer, 10)

    let imageUrl = process.env.DEFAULT_USER_IMAGE_URL!
    let imagePublicId: string | null = null

    try {
      //  si viene imagen, se sube
      if (imageFile) {
        const uploadResult = await uploadImage(imageFile, "users")
        imageUrl = uploadResult.url
        imagePublicId = uploadResult.publicId
      }

      const userToCreate = {
        email: data.email,
        username: data.username,
        password: hashpassword,
        securityQuestion: data.securityQuestion,
        securityAnswer: hashSecurityAnswer,
        pic: imageUrl,
        picPublicId: imagePublicId
      }

      return userRepo.create({
        ...userToCreate,
        rol: "comun"
      })
    } catch (error) {
      // rollback si falla DB
      if (imagePublicId) {
        await deleteImage(imagePublicId)
      }
      throw error
    }
  },

  changePassword: async (data: { password: string, password2: string }, userId: number) => {
    let password = await bcrypt.hash(data.password, 10)

    let user = await userRepo.findUser(userId)
    if (!user) {
      throw new NotFoundError()
    }

    if (!user.state) {
      throw new ForbiddenError('Usuario inactivo')
    }


    return await userRepo.changePassword(password, userId)
  }
}
