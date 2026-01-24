import { userRepo } from "@/repositories/user.repository"
import { RegisterUser } from "@/types/user.types"
import bcrypt from "bcryptjs"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { NotFoundError, ForbiddenError, UnAuthorizedError } from "@/error/appError"
import { PublicUserDTO } from "@/dtos/user.dto"

export const userService = {
  create: async (data: RegisterUser, imageFile?: File | null): Promise<PublicUserDTO> => {
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

      const res = await userRepo.create({
        ...userToCreate,
        rol: "comun"
      })

      return {
        id: res.id,
        email: res.email,
        username: res.username,
        rol: res.rol,
        pic: res.pic
      }
    } catch (error) {
      // rollback si falla DB
      if (imagePublicId) {
        await deleteImage(imagePublicId)
      }
      throw error
    }
  },

  changePassword: async (data: { oldpassword: string, password: string, password2: string }, userId: number): Promise<{ ok: true }> => {

    let user = await userRepo.findUser(userId)
    if (!user) {
      throw new NotFoundError()
    }

    if (!user.state) {
      throw new ForbiddenError('Usuario inactivo')
    }

    
    const isValidOldPassword = await bcrypt.compare(
      data.oldpassword,
      user.password
    )
    if (!isValidOldPassword) {
      throw new ForbiddenError('Credenciales inválidas')
    }


    const isSamePassword = await bcrypt.compare(
      data.password,
      user.password
    )
    if (isSamePassword) {
      throw new ForbiddenError(
        'El nuevo password no puede ser igual al anterior'
      )
    }


    let password = await bcrypt.hash(data.password, 10)
    await userRepo.changePassword(password, userId)
    return { ok: true }
  },

  deleteAccount: async (password: string, id: number): Promise<{ ok: true }> => {

    let user = await userRepo.findUser(id)

    if (!user) throw new NotFoundError()
    if (!user.state) throw new ForbiddenError('Usuario inactivo')

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new UnAuthorizedError('Credenciales inválidas')

    await userRepo.deleteAccount(id)

    return { ok: true }

  }
}
