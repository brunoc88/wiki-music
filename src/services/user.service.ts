import { userRepo } from "@/repositories/user.repository"
import { RegisterUser } from "@/types/user.types"

export const userService = {
    create: async (data: RegisterUser) => {
        return userRepo.create({ ...data, rol:"comun"})
    }
}