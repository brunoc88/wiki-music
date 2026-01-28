import { userRepo } from "@/repositories/user.repository"
import { RegisterUser, RecoverPassword } from "@/types/user.types"
import bcrypt from "bcryptjs"
import { uploadImage, deleteImage } from "@/lib/cloudinary"
import { ForbiddenError, UnAuthorizedError } from "@/error/appError"
import { PublicUserDTO } from "@/dtos/user.dto"
import { requireActiveUserById, requireActiveUserByEmail } from "@/domain/user/userAccess"
import crypto from 'crypto'
import { mailService } from "./mail.service"

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

    let user = await requireActiveUserById(userId)


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

    let user = await requireActiveUserById(id)

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) throw new UnAuthorizedError('Credenciales inválidas')

    await userRepo.deleteAccount(id)

    return { ok: true }

  },

  securityQuestionUpdate: async (data: { securityQuestion?: string, securityAnswer: string }, userId: number): Promise<{ ok: true }> => {
    let { securityQuestion, securityAnswer } = data

    let user = await requireActiveUserById(userId)


    if (securityQuestion && securityQuestion === user.securityQuestion) {
      throw new ForbiddenError('La pregunta no puede ser la misma')
    }

    const isSameAnswer: boolean = await bcrypt.compare(securityAnswer, user.securityAnswer)

    if (isSameAnswer) throw new ForbiddenError('La respuesta no puede ser la misma')
    let hashedSecurityAnswer: string = await bcrypt.hash(securityAnswer, 10)


    const userToUpdate = {
      securityAnswer: hashedSecurityAnswer,
      ...(securityQuestion && { securityQuestion })
    }

    await userRepo.securityQuestionUpdate(userToUpdate, userId)

    return { ok: true }
  },

  changeUsername: async (data: { username: string }, userId: number): Promise<{ username: string, ok: true }> => {
    await requireActiveUserById(userId)

    const res = await userRepo.changeUsername(data, userId)
    return { username: res.username, ok: true }
  },

  startPasswordRecovery: async (data: RecoverPassword): Promise<{ ok: true }> => {
    let { email, securityQuestion, securityAnswer } = data

    let user = await requireActiveUserByEmail(email)

    if (securityQuestion && securityQuestion !== user.securityQuestion) {
      throw new ForbiddenError('Credenciales invalidas')
    }

    const isValid = await bcrypt.compare(securityAnswer, user.securityAnswer)
    if (!isValid) throw new ForbiddenError('Credenciales invalidas')

    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 15 * 60 * 1000)


    await userRepo.setRecoveryToken({ id: user.id, token, expires })
    await mailService.sendPasswordRecovery(user.email, token)

    return { ok: true }

  },

  confirmPasswordRecovery: async (data: {
    token: string
    newPassword: string
  }): Promise<{ ok: true }> => {
    const { token, newPassword } = data
    console.log('token', token)
    const user = await userRepo.getUserByRecoveryToken(token)

    if (!user || !user.state) {
      throw new ForbiddenError('Token inválido o usuario inactivo')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await userRepo.resetPasswordByRecovery({
      userId: user.id,
      hashedPassword
    })

    return { ok: true }
  }

}
