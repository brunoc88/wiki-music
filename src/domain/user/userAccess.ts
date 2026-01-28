import { userRepo } from "@/repositories/user.repository"
import { NotFoundError, ForbiddenError } from "@/error/appError"
import { User } from "@prisma/client"

export const requireActiveUserById = async (id: number): Promise<User> => {
  const user = await userRepo.findUser(id)

  if (!user) throw new NotFoundError()
  if (!user.state) throw new ForbiddenError("Usuario inactivo")

  return user
}

export const requireActiveUserByEmail = async (email: string): Promise<User> => {
  const user = await userRepo.findByEmail(email)

  if (!user) throw new NotFoundError()
  if (!user.state) throw new ForbiddenError("Usuario inactivo")

  return user
}
