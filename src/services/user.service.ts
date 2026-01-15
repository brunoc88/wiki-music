import { userRepo } from "@/repositories/user.repository"
import { User } from "@/types/user.types"

export const userService = {
    create: async (data:User) => {
        return userRepo.create(data)
    }
}